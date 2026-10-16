/**
 * Generates an informational (non-quiz) DMV video end to end: beat script ->
 * ElevenLabs TTS -> rendered slide frames -> assembled MP4 -> placeholder
 * map for hand-edited b-roll in post-production.
 *
 * Usage:
 *   node scripts/video-pipeline/generateInfoVideo.js <videoId> [--voice <voiceId>] [--out <dir>]
 *
 * Reads content-pipeline/info-videos/<videoId>.json (see that file's
 * _readme). Requires the dev server running (npm run dev) so
 * /internal/video-render-info/[videoId] is reachable for screenshotting.
 *
 * "split"-layout beats reserve a fixed placeholder box (see PLACEHOLDER_RECT
 * below, must match src/app/internal/video-render-info/[videoId]/page.tsx)
 * left empty for the user to drop their own b-roll into during local
 * post-production. placeholder-map.json in the output dir gives the exact
 * start/end timecode and pixel rect for each one.
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { synthesize } = require('./tts');
const { getAudioDuration } = require('./ffprobeDuration');
const { SlideRenderer } = require('./renderSlide');
const { assembleVideo } = require('./assemble');
const { buildInfoVideoMetadata } = require('./metadata-info');

const REPO_ROOT = path.join(__dirname, '..', '..');
const BASE_URL = process.env.VIDEO_RENDER_BASE_URL || 'http://localhost:3000';
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID;

// Must match the placeholder <div> in
// src/app/internal/video-render-info/[videoId]/page.tsx's SplitSlide.
const CANVAS = { width: 1920, height: 1080 };
const PLACEHOLDER_RECT = { x: 760, y: 60, w: 1120, h: 850 };

function parseArgs(argv) {
  const [videoId, ...rest] = argv;
  const opts = { voice: DEFAULT_VOICE_ID, out: null };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--voice') opts.voice = rest[++i];
    if (rest[i] === '--out') opts.out = rest[++i];
  }
  return { videoId, opts };
}

function loadVideo(videoId) {
  const filePath = path.join(REPO_ROOT, 'content-pipeline', 'info-videos', `${videoId}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function main() {
  const { videoId, opts } = parseArgs(process.argv.slice(2));
  if (!videoId) {
    console.error('Usage: node scripts/video-pipeline/generateInfoVideo.js <videoId> [--voice <voiceId>] [--out <dir>]');
    process.exit(1);
  }
  const video = loadVideo(videoId);
  if (!video) {
    console.error(`No info video found at content-pipeline/info-videos/${videoId}.json`);
    process.exit(1);
  }
  if (!opts.voice) opts.voice = video.voice;
  if (!opts.voice) {
    console.error('No voice ID given. Pass --voice <id>, set ELEVENLABS_DEFAULT_VOICE_ID in .env.local, or add a "voice" field to the video JSON.');
    process.exit(1);
  }

  const outDir = opts.out || path.join(REPO_ROOT, 'output', 'video-pipeline', videoId);
  const workDir = path.join(outDir, 'work');
  fs.mkdirSync(workDir, { recursive: true });

  console.log(`Video: ${video.title} (${video.beats.length} beats)`);
  console.log(`Output dir: ${outDir}`);


  const renderer = new SlideRenderer();
  await renderer.assertServerUp();
  await renderer.start();

  const frames = [];
  try {
    for (let i = 0; i < video.beats.length; i++) {
      const beat = video.beats[i];
      process.stdout.write(`  [${i + 1}/${video.beats.length}] ${beat.key} (${beat.layout}) ... `);

      const audioPath = path.join(workDir, `${beat.key}.mp3`);
      const hashPath = path.join(workDir, `${beat.key}.hash`);
      const narrationHash = crypto.createHash('sha1').update(beat.narration).digest('hex');
      const cached = fs.existsSync(audioPath) && fs.existsSync(hashPath) && fs.readFileSync(hashPath, 'utf8') === narrationHash;

      if (cached) {
        process.stdout.write('(cached audio) ');
      } else {
        await synthesize(beat.narration, opts.voice, audioPath);
        fs.writeFileSync(hashPath, narrationHash);
      }
      const duration = await getAudioDuration(audioPath);

      const imagePath = path.join(workDir, `${beat.key}.png`);
      const url = `${BASE_URL}/internal/video-render-info/${videoId}?beat=${beat.key}`;
      await renderer.shootUrl(url, imagePath);

      frames.push({ beat, audioPath, imagePath, duration });
      console.log(`${duration.toFixed(2)}s`);
    }
  } finally {
    await renderer.stop();
  }

  const framesWithTimes = [];
  let acc = 0;
  for (const frame of frames) {
    framesWithTimes.push({ ...frame, startSec: acc, endSec: acc + frame.duration });
    acc += frame.duration;
  }

  console.log('Assembling final video with ffmpeg...');
  const outPath = path.join(outDir, `${videoId}.mp4`);
  await assembleVideo({ frames, workDir, outPath });
  console.log(`Video written to ${outPath}`);

  const metadata = buildInfoVideoMetadata(video, framesWithTimes);
  fs.writeFileSync(path.join(outDir, 'youtube-metadata.json'), JSON.stringify(metadata, null, 2));
  console.log(`YouTube metadata written to ${path.join(outDir, 'youtube-metadata.json')}`);

  const placeholderMap = {
    videoId,
    canvas: CANVAS,
    placeholderRect: PLACEHOLDER_RECT,
    beats: framesWithTimes.map(({ beat, startSec, endSec }) => ({
      key: beat.key,
      layout: beat.layout,
      startSec: Number(startSec.toFixed(3)),
      endSec: Number(endSec.toFixed(3)),
      hasPlaceholder: beat.layout === 'split',
    })),
  };
  fs.writeFileSync(path.join(outDir, 'placeholder-map.json'), JSON.stringify(placeholderMap, null, 2));
  console.log(`Placeholder map written to ${path.join(outDir, 'placeholder-map.json')}`);

  const thumbRenderer = new SlideRenderer();
  await thumbRenderer.start();
  const thumbPath = path.join(outDir, 'thumbnail.png');
  await thumbRenderer.shootUrl(`${BASE_URL}/internal/video-render-info/${videoId}?beat=thumbnail`, thumbPath);
  await thumbRenderer.stop();
  console.log(`Thumbnail written to ${thumbPath}`);

  console.log('\nDone. Total runtime (video length): ' + (acc / 60).toFixed(1) + ' min.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
