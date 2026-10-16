import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import MotionSlide, { type MotionBeat, type MotionVideo } from './MotionSlide';

// Internal tool only, driven by scripts/video-pipeline/generateMotionVideo.js.
// Unlike video-render (static slide screenshots), every slide here is an
// animation: the page renders the beat frozen at time `t` seconds, and the
// generator steps `t` through the beat's narration length at 30 frames a
// second (window.__seek) and pipes the frames to ffmpeg. Disabled outside
// local dev so it never becomes a reachable production URL.
//
// Query: ?beat=<key>&d=<beat duration in seconds>&t=<seconds, default 0>
//        ?beat=thumbnail renders the thumbnail card.

// Width / height of a PNG (IHDR) or baseline/progressive JPEG (first SOF marker).
function imageAspectOf(buf: Buffer, mime: string): number | undefined {
  if (mime === 'image/png') return buf.length > 24 ? buf.readUInt32BE(16) / buf.readUInt32BE(20) : undefined;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const h = buf.readUInt16BE(i + 5);
      const w = buf.readUInt16BE(i + 7);
      return h ? w / h : undefined;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return undefined;
}

function loadVideo(videoId: string): MotionVideo | undefined {
  const filePath = path.join(process.cwd(), 'content-pipeline', 'info-videos', `${videoId}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as MotionVideo;
}

export default async function MotionRenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ videoId: string }>;
  searchParams: Promise<{ beat?: string; d?: string; t?: string; clipFrames?: string; clipFps?: string; reveals?: string }>;
}) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { videoId } = await params;
  const sp = await searchParams;
  const video = loadVideo(videoId);
  if (!video) notFound();

  const duration = sp.d ? parseFloat(sp.d) : 8;
  const initialT = sp.t ? parseFloat(sp.t) : 0;

  let beat: MotionBeat;
  if (sp.beat === 'thumbnail') {
    beat = { key: 'thumbnail', layout: 'thumbnail', onScreen: { title: video.title }, narration: '' };
  } else {
    const found = video.beats.find((b) => b.key === sp.beat);
    if (!found) notFound();
    beat = found;
  }

  // Screenshots live outside /public, so they are inlined as data URLs;
  // Pexels photos are remote URLs.
  let imageSrc: string | undefined;
  let imageAspect: number | undefined;
  if (beat.screen) {
    const dir = path.join(process.cwd(), 'content-pipeline', 'info-videos', 'assets', videoId);
    const shot = ['.png', '.jpg', '.jpeg'].map((ext) => path.join(dir, `${beat.screen}${ext}`)).find((f) => fs.existsSync(f));
    if (shot) {
      const buf = fs.readFileSync(shot);
      const mime = shot.endsWith('.png') ? 'image/png' : 'image/jpeg';
      imageSrc = `data:${mime};base64,${buf.toString('base64')}`;
      imageAspect = imageAspectOf(buf, mime);
    }
  } else if (beat.image?.url) {
    imageSrc = beat.image.url;
  }

  // Grid tiles that name a local asset instead of a Pexels photo.
  if (beat.tiles) {
    const dir = path.join(process.cwd(), 'content-pipeline', 'info-videos', 'assets', videoId);
    for (const tile of beat.tiles) {
      if (!tile.screen) continue;
      const f = ['.png', '.jpg', '.jpeg'].map((ext) => path.join(dir, `${tile.screen}${ext}`)).find((x) => fs.existsSync(x));
      if (f) tile.src = `data:${f.endsWith('.png') ? 'image/png' : 'image/jpeg'};base64,${fs.readFileSync(f).toString('base64')}`;
    }
  }

  // Background clip frames, sampled by the generator into public/video-frames.
  const clip = sp.clipFrames
    ? { base: `/video-frames/${videoId}/${beat.key}/`, frames: parseInt(sp.clipFrames, 10), fps: parseFloat(sp.clipFps || '15') }
    : undefined;

  // Reveal times (seconds into the beat) for the slide's items, from the
  // narration's word timestamps; without them the slide spreads reveals evenly.
  const reveals = sp.reveals ? sp.reveals.split(',').map(Number).filter((n) => !Number.isNaN(n)) : undefined;

  return <MotionSlide video={video} beat={beat} duration={duration} initialT={initialT} imageSrc={imageSrc} imageAspect={imageAspect} clip={clip} reveals={reveals} />;
}
