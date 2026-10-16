import fs from 'fs';
import path from 'path';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

// Internal tool only, screenshotted by the video pipeline's Playwright script
// (scripts/video-pipeline/generateInfoVideo.js). Never linked from site
// nav/sitemap; disabled outside local dev so it never becomes a reachable
// production URL. Renders informational (non-quiz) video beats defined in
// content-pipeline/info-videos/*.json — see that file's _readme.

const BG = '#080d1f';
const GOLD = '#F4B942';
const WHITE = '#F5F7FA';
const DMV_700 = '#345488';
const PLACEHOLDER = '#20263a';

interface Beat {
  key: string;
  layout: 'split' | 'full' | 'compare';
  onScreen: { title: string; caption?: string; bullets?: string[] };
  narration: string;
}

interface InfoVideo {
  videoId: string;
  title: string;
  beats: Beat[];
}

function loadVideo(videoId: string): InfoVideo | undefined {
  const filePath = path.join(process.cwd(), 'content-pipeline', 'info-videos', `${videoId}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data as InfoVideo;
}

function Canvas({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: BG,
        color: WHITE,
        fontFamily: '"Arial Black", Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function TopAccent() {
  return <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: GOLD }} />;
}

function BrandBar({ chip }: { chip: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 110,
        background: DMV_700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 60px',
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 1, color: WHITE }}>DMV CALIFORNIA</div>
      <div
        style={{
          background: GOLD,
          color: '#1a1f2e',
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: 0.5,
        }}
      >
        {chip}
      </div>
    </div>
  );
}

// Small circular checkmark badge, echoing the icon-led checklist style of the
// DMV's own REAL ID flyer (DL 1010 E) without reusing any of their artwork.
function BulletBadge({ size }: { size: number }) {
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
        fontSize: size * 0.55,
        fontWeight: 900,
        lineHeight: 1,
      }}
    >
      ✓
    </div>
  );
}

function Bullets({ items, fontSize = 34 }: { items: string[]; fontSize?: number }) {
  const badgeSize = Math.round(fontSize * 0.85);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 40 }}>
      {items.map((item) => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <BulletBadge size={badgeSize} />
          <div style={{ fontSize, fontWeight: 700, lineHeight: 1.3, color: WHITE }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

// Stylized ID card mock for the intro comparison beat. Deliberately abstract
// (geometric silhouette, no real photo/likeness, no DMV bear+star artwork) —
// same "spot the difference" idea as the DMV's own REAL ID vs standard card
// graphic, redrawn as our own asset so nothing here is DMV-owned art.
function IDCardMock({ variant, label }: { variant: 'realid' | 'standard'; label: string }) {
  const accent = variant === 'realid' ? GOLD : '#5b6478';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div
        style={{
          position: 'relative',
          width: 440,
          height: 270,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #131a30, #0c1122)',
          border: `3px solid ${accent}`,
          padding: 26,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 15, letterSpacing: 3, color: '#9aa4bd', fontWeight: 700 }}>CALIFORNIA</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: WHITE, marginTop: 2 }}>DRIVER LICENSE</div>
        <div style={{ display: 'flex', gap: 20, marginTop: 28 }}>
          <div
            style={{
              width: 70,
              height: 84,
              borderRadius: 10,
              background: '#2a3352',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#4a5478' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginTop: 8 }}>
            {[70, 55, 85, 45].map((w, i) => (
              <div key={i} style={{ width: `${w}%`, height: 10, borderRadius: 4, background: '#2a3352' }} />
            ))}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: -26,
            right: -26,
            width: 92,
            height: 92,
            borderRadius: '50%',
            background: '#0c1122',
            border: `4px solid ${accent}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: variant === 'realid' ? 34 : 26, color: accent, lineHeight: 1 }}>
            {variant === 'realid' ? '★' : '⚠'}
          </div>
          <div style={{ fontSize: 10, fontWeight: 900, color: accent, marginTop: 2, letterSpacing: 0.5 }}>
            {variant === 'realid' ? 'GOLD STAR' : 'LIMITS'}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: accent, letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

function CompareSlide({ beat }: { beat: Beat }) {
  return (
    <Canvas>
      <TopAccent />
      <div style={{ position: 'absolute', top: 60, left: 80, width: 640 }}>
        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.15, color: WHITE }}>{beat.onScreen.title}</div>
        {beat.onScreen.caption ? (
          <div style={{ fontSize: 28, fontWeight: 700, color: '#9aa4bd', marginTop: 24, lineHeight: 1.4 }}>
            {beat.onScreen.caption}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 760,
          top: 100,
          width: 1120,
          display: 'flex',
          justifyContent: 'center',
          gap: 70,
        }}
      >
        <IDCardMock variant="realid" label="REAL ID" />
        <IDCardMock variant="standard" label="STANDARD" />
      </div>
      <BrandBar chip="REAL ID GUIDE" />
    </Canvas>
  );
}

function SplitSlide({ beat }: { beat: Beat }) {
  return (
    <Canvas>
      <TopAccent />
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          width: 640,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.15, color: WHITE }}>{beat.onScreen.title}</div>
        {beat.onScreen.bullets ? <Bullets items={beat.onScreen.bullets} fontSize={32} /> : null}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 760,
          top: 60,
          width: 1120,
          height: 850,
          background: PLACEHOLDER,
          borderRadius: 12,
        }}
      />
      <BrandBar chip="REAL ID GUIDE" />
    </Canvas>
  );
}

function FullSlide({ beat }: { beat: Beat }) {
  return (
    <Canvas>
      <TopAccent />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 110,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 200px',
        }}
      >
        <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.15, color: WHITE }}>{beat.onScreen.title}</div>
        {beat.onScreen.bullets ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 50, alignItems: 'flex-start' }}>
            {beat.onScreen.bullets.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <BulletBadge size={34} />
                <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.3, color: WHITE, textAlign: 'left' }}>
                  {item}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <BrandBar chip="REAL ID GUIDE" />
    </Canvas>
  );
}

function ThumbnailSlide({ title }: { title: string }) {
  return (
    <Canvas>
      <TopAccent />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 160px',
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 900, color: GOLD, letterSpacing: 2, marginBottom: 24 }}>
          CALIFORNIA REAL ID · 2026
        </div>
        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.1, color: WHITE }}>{title}</div>
      </div>
    </Canvas>
  );
}

export default async function InfoVideoRenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ videoId: string }>;
  searchParams: Promise<{ beat?: string }>;
}) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { videoId } = await params;
  const sp = await searchParams;
  const video = loadVideo(videoId);
  if (!video) notFound();

  if (sp.beat === 'thumbnail') {
    return <ThumbnailSlide title={video.title} />;
  }

  const beat = video.beats.find((b) => b.key === sp.beat);
  if (!beat) notFound();

  if (beat.layout === 'compare') return <CompareSlide beat={beat} />;
  return beat.layout === 'split' ? <SplitSlide beat={beat} /> : <FullSlide beat={beat} />;
}
