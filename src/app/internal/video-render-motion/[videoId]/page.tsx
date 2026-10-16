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
  searchParams: Promise<{ beat?: string; d?: string; t?: string; clipFrames?: string; clipFps?: string }>;
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
    const shot = path.join(process.cwd(), 'content-pipeline', 'info-videos', 'assets', videoId, `${beat.screen}.png`);
    if (fs.existsSync(shot)) {
      const buf = fs.readFileSync(shot);
      imageSrc = `data:image/png;base64,${buf.toString('base64')}`;
      // PNG IHDR: width and height are big-endian 32-bit ints at bytes 16 and 20.
      if (buf.length > 24) imageAspect = buf.readUInt32BE(16) / buf.readUInt32BE(20);
    }
  } else if (beat.image?.url) {
    imageSrc = beat.image.url;
  }

  // Background clip frames, sampled by the generator into public/video-frames.
  const clip = sp.clipFrames
    ? { base: `/video-frames/${videoId}/${beat.key}/`, frames: parseInt(sp.clipFrames, 10), fps: parseFloat(sp.clipFps || '15') }
    : undefined;

  return <MotionSlide video={video} beat={beat} duration={duration} initialT={initialT} imageSrc={imageSrc} imageAspect={imageAspect} clip={clip} />;
}
