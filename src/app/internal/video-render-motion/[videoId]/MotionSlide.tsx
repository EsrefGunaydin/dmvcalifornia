'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import {
  AlarmClock, BadgeCheck, Ban, Building2, Calendar, CalendarCheck, CalendarX, Car, CheckCircle, ClipboardList, Clock,
  CreditCard, FileText, Glasses, IdCard, KeyRound, Laptop, ListChecks, Mail, MapPin, Monitor, Navigation, Phone,
  QrCode, RefreshCw, Smartphone, Store, Ticket, Timer, Upload, UserCheck, Users, XCircle,
  type LucideIcon,
} from 'lucide-react';

// Presentation-style animated slides for the info-video pipeline. Everything
// on screen is a pure function of `t` (seconds into the beat), so the
// generator can ask for any frame and get the same pixels every time:
// window.__seek(t) resolves once the DOM, the images and the three.js canvas
// show that instant. No CSS animations or timers anywhere in this file.

export interface GridTile {
  query?: string;
  label: string;
  image?: { url: string; alt?: string; photographer?: string; photographerUrl?: string; pexelsUrl?: string };
}

export interface CompareItem {
  label: string;
  value: number;
  unit?: string;
  color?: string;
}

export interface MotionBeat {
  key: string;
  layout: 'title' | 'bullets' | 'steps' | 'stat' | 'cta' | 'image' | 'grid' | 'compare' | 'flow' | 'map' | 'thumbnail';
  onScreen: {
    kicker?: string;
    title: string;
    subtitle?: string;
    bullets?: string[];
    icons?: string[]; // lucide icon names, parallel to bullets, steps, tiles or compare items
    steps?: string[];
    value?: string;
    label?: string;
    items?: CompareItem[]; // compare layout
    max?: number; // compare layout bar scale
    count?: number; // map layout: dots to light up
  };
  narration: string;
  // One phrase per item, matched in the narration so the item appears when
  // it is spoken (resolved by the generator into reveal times).
  cues?: string[];
  // image layout: a screenshot (`screen`, captured by captureScreens.js) or a
  // Pexels photo (`imageQuery` resolved into `image`).
  screen?: string;
  imageQuery?: string;
  image?: { url: string; alt?: string; photographer?: string; photographerUrl?: string; pexelsUrl?: string; query?: string };
  frame?: 'browser' | 'none';
  fit?: 'card' | 'full' | 'contain';
  caption?: string;
  // grid layout
  tiles?: GridTile[];
  // Moving background: a Pexels clip (`videoQuery` resolved into `clip`),
  // sampled to frames by the generator and shown behind the slide's content.
  videoQuery?: string;
  videoSkip?: number;
  clip?: { id: number; url: string; width: number; height: number; seconds: number; photographer?: string; photographerUrl?: string; pexelsUrl?: string; query?: string };
}

export interface MotionVideo {
  videoId: string;
  title: string;
  chip?: string;
  kicker?: string;
  beats: MotionBeat[];
}

export interface ClipFrames {
  base: string;
  frames: number;
  fps: number;
}

const BG = '#080d1f';
const GOLD = '#F4B942';
const WHITE = '#F5F7FA';
const MUTED = '#9aa4bd';
const BLUE = '#4e80c4';
const GREEN = '#22c55e';
const DMV_700 = '#345488';
const FONT = '"Arial Black", "Helvetica Neue", Arial, sans-serif';

const W = 1920;
const H = 1080;
const BAR = 100;

const ICONS: Record<string, LucideIcon> = {
  AlarmClock, BadgeCheck, Ban, Building2, Calendar, CalendarCheck, CalendarX, Car, CheckCircle, ClipboardList, Clock,
  CreditCard, FileText, Glasses, IdCard, KeyRound, Laptop, ListChecks, Mail, MapPin, Monitor, Navigation, Phone,
  QrCode, RefreshCw, Smartphone, Store, Ticket, Timer, Upload, UserCheck, Users, XCircle,
};
function iconFor(name?: string): LucideIcon {
  return (name && ICONS[name]) || CheckCircle;
}

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function reveal(t: number, start: number, dur: number) {
  const x = clamp01((t - start) / dur);
  return 1 - Math.pow(1 - x, 3);
}
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
// Reveal times from the narration's word timestamps when the generator
// supplied them for every item, otherwise spread evenly.
function revealTimes(n: number, duration: number, first: number, reveals?: number[]) {
  return reveals && reveals.length >= n ? reveals.slice(0, n) : stagger(n, duration, first);
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
    shapes.push({ mesh, base: new THREE.Vector3(x, y, z), speed: 0.35 + s * 0.4, phase: s * 6.28, spin: new THREE.Vector3(0.15 + s * 0.2, 0.25 + ((i * 3) % 5) * 0.06, 0.05) });
  }
  return { renderer, scene, camera, shapes };
}

function renderScene(refs: SceneRefs, time: number) {
  for (const s of refs.shapes) {
    s.mesh.position.set(s.base.x + Math.sin(time * s.speed + s.phase) * 0.6, s.base.y + Math.cos(time * s.speed * 0.8 + s.phase) * 0.45, s.base.z);
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
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR, background: DMV_700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 60px', transform: `translateY(${(1 - barIn) * BAR}px)` }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.05 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>DMV CALIFORNIA</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: WHITE }}>dmvcalifornia.us</div>
        </div>
        <div style={{ background: GOLD, color: '#1a1f2e', borderRadius: 8, padding: '10px 24px', fontSize: 25, fontWeight: 900 }}>{chip}</div>
      </div>
    </div>
  );
}

function Kicker({ text, t, start = 0.1 }: { text?: string; t: number; start?: number }) {
  if (!text) return null;
  const p = reveal(t, start, 0.5);
  return <div style={{ fontSize: 28, fontWeight: 900, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>{text}</div>;
}

function Title({ text, t, start = 0.3, size = 76, align = 'left' as 'left' | 'center', maxWidth = 1100 }: { text: string; t: number; start?: number; size?: number; align?: 'left' | 'center'; maxWidth?: number }) {
  const words = text.split(' ');
  return (
    <div style={{ fontSize: size, fontWeight: 900, lineHeight: 1.12, color: WHITE, maxWidth, textAlign: align, marginTop: 18, textShadow: '0 6px 30px rgba(0,0,0,0.45)' }}>
      {words.map((w, i) => {
        const p = reveal(t, start + i * 0.07, 0.45);
        return <span key={i} style={{ display: 'inline-block', marginRight: '0.26em', opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
      })}
    </div>
  );
}

function Badge({ p, size = 40, children, color = GOLD }: { p: number; size?: number; children: React.ReactNode; color?: string }) {
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: '50%', background: color, color: '#1a1f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, fontWeight: 900, transform: `scale(${p})` }}>
      {children}
    </div>
  );
}

// A bullet list whose rows slide in one by one, each with a lucide icon.
function BulletList({ items, icons, t, times, size = 44, gap = 26, badge = 46, width }: { items: string[]; icons?: string[]; t: number; times: number[]; size?: number; gap?: number; badge?: number; width?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, width }}>
      {items.map((b, i) => {
        const p = reveal(t, times[i], 0.5);
        const Icon = iconFor(icons?.[i]);
        return (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
            <Badge p={pop(t, times[i], 0.5)} size={badge}>
              <Icon size={badge * 0.56} strokeWidth={2.6} color="#1a1f2e" />
            </Badge>
            <div style={{ fontSize: size, fontWeight: 700, color: WHITE, lineHeight: 1.25, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{b}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- layouts ----------

function TitleLayout({ beat, t, duration, reveals }: { beat: MotionBeat; t: number; duration: number; reveals?: number[] }) {
  const s = beat.onScreen;
  const times = revealTimes(s.bullets?.length ?? 0, duration, 1.6, reveals);
  return (
    <div style={{ position: 'absolute', top: 150, left: 120, right: 120, bottom: BAR + 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Kicker text={s.kicker} t={t} />
      <Title text={s.title} t={t} size={96} maxWidth={1500} />
      {s.subtitle ? <div style={{ fontSize: 40, fontWeight: 700, color: MUTED, marginTop: 30, opacity: reveal(t, 1.0, 0.6), transform: `translateY(${(1 - reveal(t, 1.0, 0.6)) * 20}px)` }}>{s.subtitle}</div> : null}
      {s.bullets ? (
        <div style={{ display: 'flex', gap: 28, marginTop: 56, flexWrap: 'wrap' }}>
          {s.bullets.map((b, i) => {
            const p = pop(t, times[i], 0.5);
            const Icon = iconFor(s.icons?.[i]);
            return (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 30px', borderRadius: 14, border: `3px solid ${GOLD}`, background: 'rgba(8,13,31,0.55)', color: WHITE, fontSize: 32, fontWeight: 700, opacity: clamp01(p * 1.5), transform: `scale(${0.85 + 0.15 * p})` }}>
                <Icon size={34} color={GOLD} strokeWidth={2.4} />
                {b}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function BulletsLayout({ beat, t, duration, reveals }: { beat: MotionBeat; t: number; duration: number; reveals?: number[] }) {
  const s = beat.onScreen;
  const items = s.bullets ?? [];
  const times = revealTimes(items.length, duration, 0.9, reveals);
  const dense = items.length > 5;
  return (
    <div style={{ position: 'absolute', top: 110, left: 120, right: 120, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Kicker text={s.kicker} t={t} />
      <Title text={s.title} t={t} size={dense ? 66 : 76} maxWidth={1600} />
      <div style={{ marginTop: dense ? 40 : 52 }}>
        <BulletList items={items} icons={s.icons} t={t} times={times} size={dense ? 38 : 44} gap={dense ? 18 : 26} badge={dense ? 44 : 52} />
      </div>
    </div>
  );
}

function StepsLayout({ beat, t, duration, reveals }: { beat: MotionBeat; t: number; duration: number; reveals?: number[] }) {
  const s = beat.onScreen;
  const steps = s.steps ?? [];
  const times = revealTimes(steps.length, duration, 1.1, reveals);
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
        const Icon = s.icons?.[i] ? iconFor(s.icons[i]) : null;
        return (
          <div key={label} style={{ position: 'absolute', top: 544 - 46, left: x, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: Math.min(360, span / Math.max(1, n - 1) - 24) }}>
            <div style={{ transform: `scale(${Math.max(0, p)})` }}>
              <Badge p={1} size={92}>{Icon ? <Icon size={48} color="#1a1f2e" strokeWidth={2.4} /> : i + 1}</Badge>
            </div>
            <div style={{ marginTop: 26, fontSize: n > 4 ? 30 : 32, fontWeight: 700, color: WHITE, textAlign: 'center', lineHeight: 1.25, opacity: tp, transform: `translateY(${(1 - tp) * 18}px)` }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

function StatLayout({ beat, t, duration, reveals }: { beat: MotionBeat; t: number; duration: number; reveals?: number[] }) {
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
  const times = revealTimes(s.bullets?.length ?? 0, duration, 2.2, reveals);
  const Icon = s.icons?.[0] ? iconFor(s.icons[0]) : null;
  return (
    <div style={{ position: 'absolute', top: 120, left: 120, right: 120, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      {Icon ? <div style={{ marginBottom: 18, transform: `scale(${Math.max(0, pop(t, 0.2, 0.6))})` }}><Badge p={1} size={110}><Icon size={60} color="#1a1f2e" strokeWidth={2.4} /></Badge></div> : null}
      <Kicker text={s.kicker} t={t} />
      <Title text={s.title} t={t} size={60} align="center" maxWidth={1500} />
      <div style={{ fontSize: 150, fontWeight: 900, color: GOLD, marginTop: 30, lineHeight: 1, opacity: reveal(t, 0.5, 0.4), minHeight: 160, textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>{shown}</div>
      {s.label ? <div style={{ fontSize: 40, fontWeight: 700, color: WHITE, marginTop: 20, opacity: reveal(t, 1.6, 0.5), textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{s.label}</div> : null}
      {s.bullets ? (
        <div style={{ display: 'flex', gap: 24, marginTop: 50, justifyContent: 'center', flexWrap: 'wrap' }}>
          {s.bullets.map((b, i) => {
            const p = reveal(t, times[i], 0.5);
            return <div key={b} style={{ padding: '16px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.1)', color: WHITE, fontSize: 32, fontWeight: 700, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>{b}</div>;
          })}
        </div>
      ) : null}
    </div>
  );
}

// Text on the left, a picture on the right (or behind everything with
// fit: 'full'). The picture drifts and zooms slowly so a still never looks
// frozen. Screenshots get a browser window drawn around them.
function ImageLayout({ beat, t, duration, src, aspect, reveals }: { beat: MotionBeat; t: number; duration: number; src?: string; aspect?: number; reveals?: number[] }) {
  const s = beat.onScreen;
  const items = s.bullets ?? [];
  const times = revealTimes(items.length, duration, 0.9, reveals);
  const contain = beat.fit === 'contain';
  const prog = clamp01(t / Math.max(1, duration));
  const zoom = 1 + (contain ? 0.025 : 0.12) * prog;
  const panX = contain ? 0 : -4 * prog;
  const panY = contain ? 0 : -3 * prog;
  const picIn = reveal(t, 0.35, 0.7);
  const full = beat.fit === 'full';
  const browser = beat.frame === 'browser';
  const picture = src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={beat.image?.alt ?? ''} style={{ width: '100%', height: '100%', objectFit: contain ? 'contain' : 'cover', objectPosition: contain ? 'center' : 'top', display: 'block', transform: `translate(${panX}%, ${panY}%) scale(${zoom})`, transformOrigin: full || contain ? '50% 50%' : '0% 0%' }} />
  ) : null;

  if (full) {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, bottom: BAR, overflow: 'hidden', opacity: picIn }}>{picture}</div>
        <div style={{ position: 'absolute', inset: 0, bottom: BAR, background: 'linear-gradient(90deg, rgba(8,13,31,0.96) 0%, rgba(8,13,31,0.85) 42%, rgba(8,13,31,0.25) 75%, rgba(8,13,31,0.1) 100%)' }} />
        <div style={{ position: 'absolute', top: 110, left: 120, width: 900, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Kicker text={s.kicker} t={t} />
          <Title text={s.title} t={t} size={70} maxWidth={900} />
          <div style={{ marginTop: 44 }}><BulletList items={items} icons={s.icons} t={t} times={times} size={38} gap={22} badge={46} /></div>
        </div>
        {beat.caption ? <div style={{ position: 'absolute', right: 40, bottom: BAR + 16, fontSize: 20, color: MUTED, opacity: reveal(t, 1, 0.5) }}>{beat.caption}</div> : null}
      </div>
    );
  }

  const maxCardH = H - BAR - 70 - 50;
  const browserBar = browser ? 54 : 0;
  const cardH = contain && aspect ? Math.min(maxCardH, Math.round(1070 / aspect) + browserBar) : maxCardH;
  const cardTop = 70 + Math.round((maxCardH - cardH) / 2);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 110, left: 110, width: 640, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Kicker text={s.kicker} t={t} />
        <Title text={s.title} t={t} size={items.length > 3 ? 54 : 60} maxWidth={640} />
        <div style={{ marginTop: 36 }}><BulletList items={items} icons={s.icons} t={t} times={times} size={30} gap={18} badge={40} /></div>
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

// A row of photo tiles, each popping in with its label, for lists of physical things.
function GridLayout({ beat, t, duration, reveals }: { beat: MotionBeat; t: number; duration: number; reveals?: number[] }) {
  const s = beat.onScreen;
  const tiles = beat.tiles ?? [];
  const n = Math.max(1, tiles.length);
  const times = revealTimes(n, duration, 1.2, reveals);
  const gap = 28;
  const tileW = Math.min(420, (W - 240 - gap * (n - 1)) / n);
  const tileH = Math.round(tileW * 0.72);
  const prog = clamp01(t / Math.max(1, duration));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 110, left: 120, right: 120, textAlign: 'center' }}>
        <Kicker text={s.kicker} t={t} />
        <Title text={s.title} t={t} size={66} align="center" maxWidth={1600} />
      </div>
      <div style={{ position: 'absolute', top: 390, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap }}>
        {tiles.map((tile, i) => {
          const p = pop(t, times[i], 0.55);
          const Icon = iconFor(s.icons?.[i]);
          return (
            <div key={tile.label} style={{ width: tileW, opacity: clamp01(p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 50}px) scale(${0.9 + 0.1 * Math.min(1, p)})` }}>
              <div style={{ width: tileW, height: tileH, borderRadius: 18, overflow: 'hidden', background: '#111a33', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.12)', position: 'relative' }}>
                {tile.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tile.image.url} alt={tile.image.alt ?? tile.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `scale(${1 + 0.1 * prog})` }} />
                ) : null}
                <div style={{ position: 'absolute', left: 14, top: 14 }}><Badge p={1} size={54}><Icon size={30} color="#1a1f2e" strokeWidth={2.4} /></Badge></div>
              </div>
              <div style={{ marginTop: 18, fontSize: 32, fontWeight: 700, color: WHITE, textAlign: 'center', lineHeight: 1.2 }}>{tile.label}</div>
            </div>
          );
        })}
      </div>
      {s.subtitle ? (
        <div style={{ position: 'absolute', left: 120, right: 120, bottom: BAR + 50, textAlign: 'center', fontSize: 34, fontWeight: 700, color: GOLD, opacity: reveal(t, times[n - 1] + 0.8, 0.6) }}>{s.subtitle}</div>
      ) : null}
    </div>
  );
}

// Horizontal bars that grow to their values, with the numbers counting up.
function CompareLayout({ beat, t, duration, reveals }: { beat: MotionBeat; t: number; duration: number; reveals?: number[] }) {
  const s = beat.onScreen;
  const items = s.items ?? [];
  const max = s.max ?? Math.max(1, ...items.map((i) => i.value));
  const times = revealTimes(items.length, duration, 1.0, reveals);
  const trackW = 1100;
  return (
    <div style={{ position: 'absolute', top: 110, left: 120, right: 120, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Kicker text={s.kicker} t={t} />
      <Title text={s.title} t={t} size={70} maxWidth={1600} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 44, marginTop: 64 }}>
        {items.map((item, i) => {
          const p = reveal(t, times[i], 1.4);
          const shown = Math.round(item.value * p);
          const color = item.color ?? (i === 0 ? GREEN : GOLD);
          const Icon = iconFor(s.icons?.[i]);
          return (
            <div key={item.label} style={{ opacity: reveal(t, times[i] - 0.2, 0.4) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 36, fontWeight: 700, color: WHITE, marginBottom: 14 }}>
                <Icon size={38} color={color} strokeWidth={2.4} />{item.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <div style={{ width: trackW, height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                  <div style={{ width: `${(item.value / max) * 100 * p}%`, height: '100%', borderRadius: 32, background: color, boxShadow: `0 0 40px ${color}66` }} />
                </div>
                <div style={{ fontSize: 72, fontWeight: 900, color, minWidth: 260, lineHeight: 1 }}>{shown}{item.unit ? <span style={{ fontSize: 36, color: MUTED, marginLeft: 12 }}>{item.unit}</span> : null}</div>
              </div>
            </div>
          );
        })}
      </div>
      {s.subtitle ? <div style={{ marginTop: 50, fontSize: 32, fontWeight: 700, color: MUTED, opacity: reveal(t, times[items.length - 1] + 1.6, 0.6) }}>{s.subtitle}</div> : null}
    </div>
  );
}

// A root node branching into options, drawn in sequence.
function FlowLayout({ beat, t, duration, reveals }: { beat: MotionBeat; t: number; duration: number; reveals?: number[] }) {
  const s = beat.onScreen;
  const branches = s.steps ?? [];
  const notes = s.bullets ?? [];
  const n = Math.max(1, branches.length);
  const times = revealTimes(n, duration, 1.5, reveals);
  const rootP = pop(t, 0.5, 0.6);
  const trunk = reveal(t, 0.9, 0.4);
  const rail = reveal(t, 1.1, 0.6);
  const colW = 470;
  const gap = 60;
  const totalW = n * colW + (n - 1) * gap;
  const left = (W - totalW) / 2;
  const rootY = 250;
  const railY = 410;
  const boxY = 470;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 105, left: 120, right: 120, textAlign: 'center' }}>
        <Kicker text={s.kicker} t={t} />
      </div>
      <div style={{ position: 'absolute', top: rootY - 44, left: '50%', transform: `translateX(-50%) scale(${Math.max(0, rootP)})`, padding: '22px 44px', borderRadius: 16, background: BLUE, color: WHITE, fontSize: 38, fontWeight: 900, whiteSpace: 'nowrap', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>{s.title}</div>
      <div style={{ position: 'absolute', left: W / 2 - 4, top: rootY + 44, width: 8, height: (railY - rootY - 44) * trunk, background: 'rgba(255,255,255,0.35)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', left: left + colW / 2, top: railY - 4, width: (totalW - colW) * rail, height: 8, background: 'rgba(255,255,255,0.35)', borderRadius: 4 }} />
      {branches.map((label, i) => {
        const x = left + i * (colW + gap);
        const p = pop(t, times[i], 0.6);
        const np = reveal(t, times[i] + 0.3, 0.5);
        const drop = reveal(t, times[i] - 0.25, 0.3);
        const last = i === n - 1;
        const color = last ? GREEN : BLUE;
        const Icon = iconFor(s.icons?.[i]);
        return (
          <div key={label}>
            <div style={{ position: 'absolute', left: x + colW / 2 - 4, top: railY, width: 8, height: (boxY - railY) * drop, background: 'rgba(255,255,255,0.35)', borderRadius: 4 }} />
            <div style={{ position: 'absolute', left: x, top: boxY, width: colW, borderRadius: 20, background: 'rgba(15,23,42,0.92)', border: `4px solid ${color}`, padding: '28px 30px', boxSizing: 'border-box', transform: `scale(${Math.max(0, p)})`, transformOrigin: '50% 0%', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <Badge p={1} size={72} color={color}><Icon size={38} color="#0b1226" strokeWidth={2.5} /></Badge>
                <div style={{ fontSize: 36, fontWeight: 900, color: WHITE, lineHeight: 1.15 }}>{label}</div>
              </div>
              {notes[i] ? <div style={{ marginTop: 22, fontSize: 28, fontWeight: 700, color: MUTED, lineHeight: 1.35, opacity: np }}>{notes[i]}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// California outline (longitude, latitude), coarse but recognizable.
const CA_OUTLINE: [number, number][] = [
  [-124.21, 42.0], [-120.0, 42.0], [-120.0, 39.0], [-114.63, 35.0], [-114.72, 32.72], [-117.12, 32.53],
  [-117.6, 33.4], [-118.4, 33.75], [-119.2, 34.1], [-119.9, 34.42], [-120.65, 34.6], [-120.9, 35.3],
  [-121.3, 35.7], [-121.95, 36.6], [-122.2, 37.2], [-122.52, 37.8], [-123.0, 38.3], [-123.7, 38.95],
  [-124.1, 40.0], [-124.4, 40.44], [-124.1, 41.0], [-124.21, 41.7],
];
const MAP_W = 760;
const MAP_H = 920;
function projectCA(lon: number, lat: number) {
  const x = ((lon + 124.5) / 10.0) * MAP_W;
  const y = ((42.1 - lat) / 9.7) * MAP_H;
  return [x, y];
}
function insideCA(lon: number, lat: number) {
  let inside = false;
  for (let i = 0, j = CA_OUTLINE.length - 1; i < CA_OUTLINE.length; j = i++) {
    const [xi, yi] = CA_OUTLINE[i];
    const [xj, yj] = CA_OUTLINE[j];
    const cross = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (cross) inside = !inside;
  }
  return inside;
}
// Deterministic pseudo-random dots inside the outline.
function caDots(count: number) {
  const dots: [number, number][] = [];
  let seed = 12345;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let guard = 0;
  while (dots.length < count && guard++ < count * 40) {
    const lon = -124.4 + rnd() * 10.0;
    const lat = 32.5 + rnd() * 9.6;
    if (insideCA(lon, lat)) dots.push([lon, lat]);
  }
  return dots;
}

// A big number on the left and a California map on the right that fills with dots.
function MapLayout({ beat, t, duration, reveals }: { beat: MotionBeat; t: number; duration: number; reveals?: number[] }) {
  const s = beat.onScreen;
  const items = s.bullets ?? [];
  const times = revealTimes(items.length, duration, 2.4, reveals);
  const path = CA_OUTLINE.map(([lon, lat], i) => { const [x, y] = projectCA(lon, lat); return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ') + ' Z';
  const count = s.count ?? 100;
  const dots = caDots(count);
  const fill = reveal(t, 0.9, 2.6);
  const lit = Math.round(dots.length * fill);
  const outline = reveal(t, 0.3, 0.9);
  const value = s.value ?? String(count);
  const numeric = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const shown = numeric ? `${numeric[1]}${Math.round(parseInt(numeric[2].replace(/,/g, ''), 10) * fill).toLocaleString('en-US')}${numeric[3]}` : value;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 110, left: 120, width: 860, bottom: BAR + 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Kicker text={s.kicker} t={t} />
        <Title text={s.title} t={t} size={62} maxWidth={860} />
        <div style={{ fontSize: 150, fontWeight: 900, color: GOLD, marginTop: 20, lineHeight: 1 }}>{shown}</div>
        {s.label ? <div style={{ fontSize: 36, fontWeight: 700, color: MUTED, marginTop: 10 }}>{s.label}</div> : null}
        <div style={{ marginTop: 40 }}><BulletList items={items} icons={s.icons} t={t} times={times} size={30} gap={16} badge={40} /></div>
      </div>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: 'absolute', left: 1080, top: 60, width: 720, height: (720 * MAP_H) / MAP_W }}>
        <path d={path} fill="rgba(78,128,196,0.18)" stroke={BLUE} strokeWidth={6} strokeLinejoin="round" strokeDasharray={4000} strokeDashoffset={4000 * (1 - outline)} />
        {dots.slice(0, lit).map(([lon, lat], i) => { const [x, y] = projectCA(lon, lat); const age = clamp01((lit - i) / 12); return <circle key={i} cx={x} cy={y} r={5 + 4 * (1 - age)} fill={GOLD} opacity={0.5 + 0.5 * age} />; })}
      </svg>
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
      <div style={{ marginTop: 56, padding: '26px 60px', borderRadius: 20, background: GOLD, color: '#1a1f2e', fontSize: 72, fontWeight: 900, transform: `scale(${Math.max(0, p)})`, opacity: clamp01(p * 2), boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>{s.subtitle ?? 'dmvcalifornia.us'}</div>
      {s.bullets ? <div style={{ marginTop: 40, fontSize: 34, fontWeight: 700, color: WHITE, opacity: reveal(t, 1.8, 0.6), textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{s.bullets.join('   ·   ')}</div> : null}
    </div>
  );
}

function ThumbnailLayout({ video }: { video: MotionVideo }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 160px' }}>
      <div style={{ fontSize: 32, fontWeight: 900, color: GOLD, letterSpacing: 3, marginBottom: 28 }}>{video.kicker ?? 'CALIFORNIA DMV'}</div>
      <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1.08, color: WHITE, textShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>{video.title}</div>
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

function waitForImages(root: HTMLElement | null, timeoutMs = 2500): Promise<void> {
  const imgs = root ? Array.from(root.querySelectorAll('img')).filter((i) => !i.complete) : [];
  if (!imgs.length) return Promise.resolve();
  return new Promise((resolve) => {
    let left = imgs.length;
    const done = () => { if (--left <= 0) resolve(); };
    setTimeout(resolve, timeoutMs);
    for (const img of imgs) {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });
}

export default function MotionSlide({ video, beat, duration, initialT, imageSrc, imageAspect, clip, reveals }: { video: MotionVideo; beat: MotionBeat; duration: number; initialT: number; imageSrc?: string; imageAspect?: number; clip?: ClipFrames; reveals?: number[] }) {
  const [frame, setFrame] = useState({ t: initialT, abs: initialT });
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRefs | null>(null);
  const resolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (canvasRef.current && !sceneRef.current && !clip) sceneRef.current = buildScene(canvasRef.current);
    window.__seek = (t: number, absolute?: number) =>
      new Promise<void>((resolve) => {
        resolveRef.current = resolve;
        setFrame({ t, abs: absolute ?? t });
      });
    window.__ready = true;
  }, [clip]);

  // After React commits the frame: draw the 3D background for the same
  // instant, wait for any new image (a clip frame) to load, wait one paint,
  // then release __seek.
  useEffect(() => {
    if (sceneRef.current) renderScene(sceneRef.current, frame.abs);
    const r = resolveRef.current;
    resolveRef.current = null;
    if (!r) return;
    waitForImages(rootRef.current).then(() => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  }, [frame]);

  const t = frame.t;
  const chip = video.chip ?? 'DMV CALIFORNIA';
  const fade = beat.layout === 'thumbnail' ? 1 : Math.min(reveal(t, 0, 0.3), 1 - reveal(t, duration - 0.3, 0.3));

  // Background clip frame for this instant.
  let clipSrc: string | undefined;
  if (clip && clip.frames > 0) {
    const idx = Math.min(clip.frames, Math.max(1, Math.floor(t * clip.fps) + 1));
    clipSrc = `${clip.base}${String(idx).padStart(4, '0')}.jpg`;
  }
  const clipZoom = 1 + 0.05 * clamp01(t / Math.max(1, duration));

  const canvasStyle: CSSProperties = { position: 'absolute', inset: 0, width: W, height: H };
  let body: React.ReactNode;
  switch (beat.layout) {
    case 'title': body = <TitleLayout beat={beat} t={t} duration={duration} reveals={reveals} />; break;
    case 'steps': body = <StepsLayout beat={beat} t={t} duration={duration} reveals={reveals} />; break;
    case 'stat': body = <StatLayout beat={beat} t={t} duration={duration} reveals={reveals} />; break;
    case 'cta': body = <CtaLayout beat={beat} t={t} />; break;
    case 'image': body = <ImageLayout beat={beat} t={t} duration={duration} src={imageSrc} aspect={imageAspect} reveals={reveals} />; break;
    case 'grid': body = <GridLayout beat={beat} t={t} duration={duration} reveals={reveals} />; break;
    case 'compare': body = <CompareLayout beat={beat} t={t} duration={duration} reveals={reveals} />; break;
    case 'flow': body = <FlowLayout beat={beat} t={t} duration={duration} reveals={reveals} />; break;
    case 'map': body = <MapLayout beat={beat} t={t} duration={duration} reveals={reveals} />; break;
    case 'thumbnail': body = <ThumbnailLayout video={video} />; break;
    default: body = <BulletsLayout beat={beat} t={t} duration={duration} reveals={reveals} />;
  }

  return (
    <div ref={rootRef} style={{ width: W, height: H, background: BG, color: WHITE, fontFamily: FONT, position: 'relative', overflow: 'hidden' }}>
      {clipSrc ? (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={clipSrc} alt="" style={{ width: W, height: H, objectFit: 'cover', display: 'block', transform: `scale(${clipZoom})` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,13,31,0.94) 0%, rgba(8,13,31,0.8) 45%, rgba(8,13,31,0.45) 100%)' }} />
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} width={W} height={H} style={canvasStyle} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 62% 58% at 46% 50%, rgba(8,13,31,0.82) 0%, rgba(8,13,31,0.5) 55%, rgba(8,13,31,0.05) 100%)' }} />
        </>
      )}
      <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
        {beat.layout === 'thumbnail' ? body : <Chrome chip={chip} t={t}>{body}</Chrome>}
      </div>
    </div>
  );
}
