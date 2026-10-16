'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';

// Presentation-style animated slides for the info-video pipeline. Everything
// on screen is a pure function of `t` (seconds into the beat), so the
// generator can ask for any frame and get the same pixels every time:
// window.__seek(t) resolves once the DOM and the three.js canvas show that
// instant. No CSS animations or timers anywhere in this file.

export interface MotionBeat {
  key: string;
  layout: 'title' | 'bullets' | 'steps' | 'stat' | 'cta' | 'image' | 'thumbnail';
  onScreen: {
    kicker?: string;
    title: string;
    subtitle?: string;
    bullets?: string[];
    steps?: string[];
    value?: string;
    label?: string;
  };
  narration: string;
  // image layout: a DMV page screenshot (`screen`, a key in the video's
  // `screens` map, captured by captureScreens.js) or a Pexels photo
  // (`imageQuery`, resolved into `image` by the generator). `frame: 'browser'`
  // draws a browser window around a screenshot; `fit: 'full'` makes a photo
  // fill the whole slide behind the text.
  screen?: string;
  imageQuery?: string;
  image?: { url: string; alt?: string; photographer?: string; photographerUrl?: string; pexelsUrl?: string; query?: string };
  frame?: 'browser' | 'none';
  // card: picture fills the right-hand card (cropped). full: picture behind
  // the whole slide. contain: the card takes the picture's own shape, for
  // screenshots that are wider than the card (a calendar, a table).
  fit?: 'card' | 'full' | 'contain';
  caption?: string;
}

export interface MotionVideo {
  videoId: string;
  title: string;
  chip?: string;
  kicker?: string;
  beats: MotionBeat[];
}

const BG = '#080d1f';
const GOLD = '#F4B942';
const WHITE = '#F5F7FA';
const MUTED = '#9aa4bd';
const DMV_700 = '#345488';
const FONT = '"Arial Black", "Helvetica Neue", Arial, sans-serif';

const W = 1920;
const H = 1080;
const BAR = 100;

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
// Progress 0..1 of a reveal that starts at `start` and lasts `dur`, eased.
function reveal(t: number, start: number, dur: number) {
  const x = clamp01((t - start) / dur);
  return 1 - Math.pow(1 - x, 3);
}
// Small overshoot for "pop" entrances.
function pop(t: number, start: number, dur: number) {
  const x = clamp01((t - start) / dur);
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

// Spread n reveals across the beat so the last one lands before the
// narration ends: first at `first`, then evenly, never faster than 0.55 s.
function stagger(n: number, duration: number, first = 0.9) {
  const usable = Math.max(1.5, duration * 0.72 - first);
  const gap = n > 1 ? Math.min(1.4, Math.max(0.55, usable / (n - 1))) : 0;
  return Array.from({ length: n }, (_, i) => first + i * gap);
}

// ---------- three.js ambient background ----------

interface SceneRefs {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  shapes: { mesh: THREE.Mesh; base: THREE.Vector3; speed: number; phase: number; spin: THREE.Vector3 }[];
}

function buildScene(canvas: HTMLCanvasElement): SceneRefs {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 30, 60);
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.set(0, 0, 20);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xfff1d0, 2.2);
  key.position.set(6, 8, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6f8fd8, 1.4);
  rim.position.set(-8, -4, 6);
  scene.add(rim);

  // Deterministic layout: a ring of floating tiles and cubes around the
  // frame edges, never in the middle where the text sits.
  const shapes: SceneRefs['shapes'] = [];
  const gold = new THREE.MeshStandardMaterial({ color: 0xf4b942, metalness: 0.35, roughness: 0.4, transparent: true, opacity: 0.85 });
  const blue = new THREE.MeshStandardMaterial({ color: 0x4e80c4, metalness: 0.3, roughness: 0.5, transparent: true, opacity: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x33446f, metalness: 0.2, roughness: 0.6, transparent: true, opacity: 0.95 });
  const mats = [gold, blue, dark, dark, blue];
  const seeds = [0.13, 0.52, 0.87, 0.31, 0.74, 0.05, 0.61, 0.44, 0.96, 0.22, 0.68, 0.39, 0.83, 0.17];
  for (let i = 0; i < seeds.length; i++) {
    const s = seeds[i];
    const angle = s * Math.PI * 2;
    const radius = 11 + (i % 3) * 2.2;
    const x = Math.cos(angle) * radius * 1.15;
    const y = Math.sin(angle) * radius * 0.62;
    const z = -6 - (i % 4) * 3;
    const size = 0.9 + ((i * 7) % 5) * 0.35;
    const geo = i % 3 === 0 ? new THREE.BoxGeometry(size, size, size) : new THREE.BoxGeometry(size * 1.6, size * 1.0, 0.18);
    const mesh = new THREE.Mesh(geo, mats[i % mats.length]);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    shapes.push({
      mesh,
      base: new THREE.Vector3(x, y, z),
      speed: 0.35 + s * 0.4,
      phase: s * 6.28,
      spin: new THREE.Vector3(0.15 + s * 0.2, 0.25 + ((i * 3) % 5) * 0.06, 0.05),
    });
  }
  return { renderer, scene, camera, shapes };
}

// Absolute time of the beat inside the whole video, so the background keeps
// drifting across beat boundaries instead of resetting on every slide.
function renderScene(refs: SceneRefs, time: number) {
  for (const s of refs.shapes) {
    s.mesh.position.set(
      s.base.x + Math.sin(time * s.speed + s.phase) * 0.6,
      s.base.y + Math.cos(time * s.speed * 0.8 + s.phase) * 0.45,
      s.base.z
    );
    s.mesh.rotation.set(time * s.spin.x + s.phase, time * s.spin.y + s.phase, time * s.spin.z);
  }
  refs.camera.position.x = Math.sin(time * 0.05) * 0.6;
  refs.camera.position.y = Math.cos(time * 0.04) * 0.35;
  refs.camera.lookAt(0, 0, 0);
  refs.renderer.render(refs.scene, refs.camera);
}

// ---------- shared chrome ----------

function Chrome({ chip, t, children }: { chip: string; t: number; children: React.ReactNode }) {
  const barIn = reveal(t, 0, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: GOLD, transform: `scaleX(${reveal(t, 0, 0.6)})`, transformOrigin: 'left' }} />
      {children}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: BAR,
          background: DMV_700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 60px',
          transform: `translateY(${(1 - barIn) * BAR}px)`,
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 1, color: WHITE }}>DMV CALIFORNIA</div>
        <div style={{ background: GOLD, color: '#1a1f2e', borderRadius: 8, padding: '10px 24px', fontSize: 25, fontWeight: 900 }}>{chip}</div>
      </div>
    </div>
  );
}

function Kicker({ text, t, start = 0.1 }: { text?: string; t: number; start?: number }) {
  if (!text) return null;
  const p = reveal(t, start, 0.5);
  return (
    <div style={{ fontSize: 28, fontWeight: 900, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      {text}
    </div>
  );
}

// Title whose words rise in one after another.
function Title({ text, t, start = 0.3, size = 76, align = 'left' as 'left' | 'center', maxWidth = 1100 }: { text: string; t: number; start?: number; size?: number; align?: 'left' | 'center'; maxWidth?: number }) {
  const words = text.split(' ');
  return (
    <div style={{ fontSize: size, fontWeight: 900, lineHeight: 1.12, color: WHITE, maxWidth, textAlign: align, marginTop: 18 }}>
      {words.map((w, i) => {
        const p = reveal(t, start + i * 0.07, 0.45);
        return (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.26em', opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
}

function Badge({ p, size = 40, children }: { p: number; size?: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: GOLD,
        color: '#1a1f2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        fontWeight: 900,
        transform: `scale(${p})`,
      }}
    >
      {children}
    </div>
  );
}

// ---------- layouts ----------

function TitleLayout({ beat, t, duration }: { beat: MotionBeat; t: number; duration: number }) {
  const s = beat.onScreen;
  const times = stagger(s.bullets?.length ?? 0, duration, 1.6);
  return (
    <div style={{ position: 'absolute', top: 150, left: 120, right: 120, bottom: BAR + 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Kicker text={s.kicker} t={t} />
      <Title text={s.title} t={t} size={96} maxWidth={1500} />
      {s.subtitle ? (
        <div style={{ fontSize: 40, fontWeight: 700, color: MUTED, marginTop: 30, opacity: reveal(t, 1.0, 0.6), transform: `translateY(${(1 - reveal(t, 1.0, 0.6)) * 20}px)` }}>{s.subtitle}</div>
      ) : null}
      {s.bullets ? (
        <div style={{ display: 'flex', gap: 28, marginTop: 56, flexWrap: 'wrap' }}>
          {s.bullets.map((b, i) => {
            const p = pop(t, times[i], 0.5);
            return (
              <div key={b} style={{ padding: '18px 30px', borderRadius: 14, border: `3px solid ${GOLD}`, color: WHITE, fontSize: 32, fontWeight: 700, opacity: clamp01(p * 1.5), transform: `scale(${0.85 + 0.15 * p})` }}>
                {b}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function BulletsLayout({ beat, t, duration }: { beat: MotionBeat; t: number; duration: number }) {
  const s = beat.onScreen;
  const items = s.bullets ?? [];
  const times = stagger(items.length, duration);
  const dense = items.length > 5;
  const size = dense ? 38 : 44;
  return (
    <div style={{ position: 'absolute', top: 110, left: 120, right: 120, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Kicker text={s.kicker} t={t} />
      <Title text={s.title} t={t} size={dense ? 66 : 76} maxWidth={1600} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: dense ? 18 : 26, marginTop: dense ? 40 : 52 }}>
        {items.map((b, i) => {
          const p = reveal(t, times[i], 0.5);
          return (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
              <Badge p={pop(t, times[i], 0.5)} size={dense ? 40 : 46}>✓</Badge>
              <div style={{ fontSize: size, fontWeight: 700, color: WHITE, lineHeight: 1.25 }}>{b}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepsLayout({ beat, t, duration }: { beat: MotionBeat; t: number; duration: number }) {
  const s = beat.onScreen;
  const steps = s.steps ?? [];
  const times = stagger(steps.length, duration, 1.1);
  const n = steps.length;
  const left = 290;
  const right = W - 290;
  const span = right - left;
  const lineP = reveal(t, 0.9, Math.max(1.2, (times[n - 1] ?? 1) - 0.6));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 120, left: 120, right: 120 }}>
        <Kicker text={s.kicker} t={t} />
        <Title text={s.title} t={t} size={70} maxWidth={1600} />
      </div>
      <div style={{ position: 'absolute', top: 540, left, width: span, height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4 }}>
        <div style={{ width: `${lineP * 100}%`, height: '100%', background: GOLD, borderRadius: 4 }} />
      </div>
      {steps.map((label, i) => {
        const x = left + (n > 1 ? (span * i) / (n - 1) : span / 2);
        const p = pop(t, times[i], 0.55);
        const tp = reveal(t, times[i] + 0.15, 0.5);
        return (
          <div key={label} style={{ position: 'absolute', top: 544 - 46, left: x, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: Math.min(360, span / Math.max(1, n - 1) - 24) }}>
            <div style={{ transform: `scale(${Math.max(0, p)})` }}>
              <Badge p={1} size={92}>{i + 1}</Badge>
            </div>
            <div style={{ marginTop: 26, fontSize: n > 4 ? 30 : 32, fontWeight: 700, color: WHITE, textAlign: 'center', lineHeight: 1.25, opacity: tp, transform: `translateY(${(1 - tp) * 18}px)` }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

// Big value with a label. A numeric value counts up; text values type in.
function StatLayout({ beat, t, duration }: { beat: MotionBeat; t: number; duration: number }) {
  const s = beat.onScreen;
  const value = s.value ?? '';
  const numeric = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  let shown = value;
  if (numeric) {
    const target = parseInt(numeric[2].replace(/,/g, ''), 10);
    const p = reveal(t, 0.6, 1.4);
    shown = `${numeric[1]}${Math.round(target * p).toLocaleString('en-US')}${numeric[3]}`;
  } else {
    const chars = Math.round(value.length * reveal(t, 0.6, 1.2));
    shown = value.slice(0, chars);
  }
  const times = stagger(s.bullets?.length ?? 0, duration, 2.2);
  return (
    <div style={{ position: 'absolute', top: 120, left: 120, right: 120, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Kicker text={s.kicker} t={t} />
      <Title text={s.title} t={t} size={60} align="center" maxWidth={1500} />
      <div style={{ fontSize: 150, fontWeight: 900, color: GOLD, marginTop: 30, lineHeight: 1, opacity: reveal(t, 0.5, 0.4), minHeight: 160 }}>{shown}</div>
      {s.label ? <div style={{ fontSize: 40, fontWeight: 700, color: MUTED, marginTop: 20, opacity: reveal(t, 1.6, 0.5) }}>{s.label}</div> : null}
      {s.bullets ? (
        <div style={{ display: 'flex', gap: 24, marginTop: 50, justifyContent: 'center', flexWrap: 'wrap' }}>
          {s.bullets.map((b, i) => {
            const p = reveal(t, times[i], 0.5);
            return (
              <div key={b} style={{ padding: '16px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', color: WHITE, fontSize: 32, fontWeight: 700, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>{b}</div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// Text on the left, a picture on the right (or behind everything with
// fit: 'full'). The picture zooms in very slowly across the beat so a still
// never looks frozen. Screenshots get a browser window drawn around them.
function ImageLayout({ beat, t, duration, src, aspect }: { beat: MotionBeat; t: number; duration: number; src?: string; aspect?: number }) {
  const s = beat.onScreen;
  const items = s.bullets ?? [];
  const times = stagger(items.length, duration);
  const contain = beat.fit === 'contain';
  const zoom = 1 + (contain ? 0.025 : 0.06) * clamp01(t / Math.max(1, duration));
  const picIn = reveal(t, 0.35, 0.7);
  const full = beat.fit === 'full';
  const browser = beat.frame === 'browser';
  const picture = src ? (
    // Plain <img>: a dev-only render route showing a local data URL or a Pexels URL.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={beat.image?.alt ?? ''} style={{ width: '100%', height: '100%', objectFit: contain ? 'contain' : 'cover', objectPosition: contain ? 'center' : 'top', display: 'block', transform: `scale(${zoom})`, transformOrigin: full || contain ? '50% 50%' : '50% 0%' }} />
  ) : null;

  if (full) {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, bottom: BAR, overflow: 'hidden', opacity: picIn }}>{picture}</div>
        <div style={{ position: 'absolute', inset: 0, bottom: BAR, background: 'linear-gradient(90deg, rgba(8,13,31,0.96) 0%, rgba(8,13,31,0.85) 42%, rgba(8,13,31,0.25) 75%, rgba(8,13,31,0.1) 100%)' }} />
        <div style={{ position: 'absolute', top: 110, left: 120, width: 900, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Kicker text={s.kicker} t={t} />
          <Title text={s.title} t={t} size={70} maxWidth={900} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 44 }}>
            {items.map((b, i) => {
              const p = reveal(t, times[i], 0.5);
              return (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
                  <Badge p={pop(t, times[i], 0.5)} size={42}>✓</Badge>
                  <div style={{ fontSize: 38, fontWeight: 700, color: WHITE, lineHeight: 1.25 }}>{b}</div>
                </div>
              );
            })}
          </div>
        </div>
        {beat.caption ? <div style={{ position: 'absolute', right: 40, bottom: BAR + 16, fontSize: 20, color: MUTED, opacity: reveal(t, 1, 0.5) }}>{beat.caption}</div> : null}
      </div>
    );
  }

  const maxCardH = H - BAR - 70 - 50;
  const browserBar = browser ? 54 : 0;
  // contain: size the card to the picture (plus the browser bar), centred vertically.
  const cardH = beat.fit === 'contain' && aspect ? Math.min(maxCardH, Math.round(1070 / aspect) + browserBar) : maxCardH;
  const cardTop = 70 + Math.round((maxCardH - cardH) / 2);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 110, left: 110, width: 640, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Kicker text={s.kicker} t={t} />
        <Title text={s.title} t={t} size={items.length > 3 ? 54 : 60} maxWidth={640} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 36 }}>
          {items.map((b, i) => {
            const p = reveal(t, times[i], 0.5);
            return (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -50}px)` }}>
                <Badge p={pop(t, times[i], 0.5)} size={34}>✓</Badge>
                <div style={{ fontSize: 30, fontWeight: 700, color: WHITE, lineHeight: 1.25 }}>{b}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 790, top: cardTop, width: 1070, height: cardH, borderRadius: 18, overflow: 'hidden', background: '#111a33', boxShadow: '0 30px 80px rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.12)', opacity: picIn, transform: `translateY(${(1 - picIn) * 40}px)` }}>
        {browser ? (
          <div style={{ height: 54, background: '#1c2440', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
            <div style={{ marginLeft: 18, flex: 1, height: 30, borderRadius: 8, background: '#0b1226', color: MUTED, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: 'Arial, sans-serif' }}>{beat.caption ?? 'dmv.ca.gov'}</div>
          </div>
        ) : null}
        <div style={{ position: 'absolute', top: browser ? 54 : 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>{picture}</div>
      </div>
      {!browser && beat.caption ? <div style={{ position: 'absolute', left: 790, width: 1070, top: cardTop + cardH + 10, fontSize: 20, color: MUTED, textAlign: 'right', opacity: reveal(t, 1, 0.5) }}>{beat.caption}</div> : null}
    </div>
  );
}

function CtaLayout({ beat, t }: { beat: MotionBeat; t: number }) {
  const s = beat.onScreen;
  const p = pop(t, 0.9, 0.7);
  return (
    <div style={{ position: 'absolute', top: 120, left: 120, right: 120, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Kicker text={s.kicker} t={t} />
      <Title text={s.title} t={t} size={84} align="center" maxWidth={1500} />
      <div style={{ marginTop: 56, padding: '26px 60px', borderRadius: 20, background: GOLD, color: '#1a1f2e', fontSize: 72, fontWeight: 900, transform: `scale(${Math.max(0, p)})`, opacity: clamp01(p * 2) }}>{s.subtitle ?? 'dmvcalifornia.us'}</div>
      {s.bullets ? (
        <div style={{ marginTop: 40, fontSize: 34, fontWeight: 700, color: MUTED, opacity: reveal(t, 1.8, 0.6) }}>{s.bullets.join('   ·   ')}</div>
      ) : null}
    </div>
  );
}

function ThumbnailLayout({ video }: { video: MotionVideo }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 160px' }}>
      <div style={{ fontSize: 32, fontWeight: 900, color: GOLD, letterSpacing: 3, marginBottom: 28 }}>{video.kicker ?? 'CALIFORNIA DMV'}</div>
      <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1.08, color: WHITE }}>{video.title}</div>
    </div>
  );
}

// ---------- the page ----------

declare global {
  interface Window {
    __seek?: (t: number, absolute?: number) => Promise<void>;
    __ready?: boolean;
  }
}

export default function MotionSlide({ video, beat, duration, initialT, imageSrc, imageAspect }: { video: MotionVideo; beat: MotionBeat; duration: number; initialT: number; imageSrc?: string; imageAspect?: number }) {
  const [frame, setFrame] = useState({ t: initialT, abs: initialT });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRefs | null>(null);
  const resolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (canvasRef.current && !sceneRef.current) sceneRef.current = buildScene(canvasRef.current);
    window.__seek = (t: number, absolute?: number) =>
      new Promise<void>((resolve) => {
        resolveRef.current = resolve;
        setFrame({ t, abs: absolute ?? t });
      });
    window.__ready = true;
  }, []);

  // Runs after React has committed the DOM for this frame: draw the 3D
  // background for the same instant, wait one paint, then release __seek.
  useEffect(() => {
    if (sceneRef.current) renderScene(sceneRef.current, frame.abs);
    const r = resolveRef.current;
    resolveRef.current = null;
    if (r) requestAnimationFrame(() => requestAnimationFrame(() => r()));
  }, [frame]);

  const t = frame.t;
  const chip = video.chip ?? 'DMV CALIFORNIA';
  // Fade the slide's content in over the first 0.3 s and out over the last
  // 0.3 s so cuts between beats read as soft transitions.
  const fade = beat.layout === 'thumbnail' ? 1 : Math.min(reveal(t, 0, 0.3), 1 - reveal(t, duration - 0.3, 0.3));

  const canvasStyle: CSSProperties = { position: 'absolute', inset: 0, width: W, height: H };
  let body: React.ReactNode;
  switch (beat.layout) {
    case 'title': body = <TitleLayout beat={beat} t={t} duration={duration} />; break;
    case 'steps': body = <StepsLayout beat={beat} t={t} duration={duration} />; break;
    case 'stat': body = <StatLayout beat={beat} t={t} duration={duration} />; break;
    case 'cta': body = <CtaLayout beat={beat} t={t} />; break;
    case 'image': body = <ImageLayout beat={beat} t={t} duration={duration} src={imageSrc} aspect={imageAspect} />; break;
    case 'thumbnail': body = <ThumbnailLayout video={video} />; break;
    default: body = <BulletsLayout beat={beat} t={t} duration={duration} />;
  }

  return (
    <div style={{ width: W, height: H, background: BG, color: WHITE, fontFamily: FONT, position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={W} height={H} style={canvasStyle} />
      {/* Keeps text legible over the 3D shapes: a soft dark vignette, strongest in the middle band. */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 62% 58% at 46% 50%, rgba(8,13,31,0.82) 0%, rgba(8,13,31,0.5) 55%, rgba(8,13,31,0.05) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        {beat.layout === 'thumbnail' ? body : <Chrome chip={chip} t={t}>{body}</Chrome>}
      </div>
    </div>
  );
}
