/**
 * Generates a presentation-style (animated) informational video end to end:
 * beat script -> ElevenLabs TTS (one clip per beat, cached by narration
 * text) -> animated slides rendered frame by frame at 30 fps through
 * /internal/video-render-motion/[videoId] -> ffmpeg -> MP4 + thumbnail +
 * YouTube metadata.
 *
 * Usage:
 *   node scripts/video-pipeline/generateMotionVideo.js <videoId> [--voice <id>] [--out <dir>] [--beats a,b,c] [--fps 30]
 *
 * Reads content-pipeline/info-videos/<videoId>.json (layouts: title,
 * bullets, steps, stat, cta). Requires the dev server (npm run dev) so the
 * render route is reachable. --beats renders only the named beats, for a
 * quick preview.
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, execFile } = require('child_process');
const { promisify } = require('util');
const { chromium } = require('playwright');

const { synthesize } = require('./tts');
const { getAudioDuration } = require('./ffprobeDuration');
const { ffmpegPath } = require('./ffmpegBin');
const { buildInfoVideoMetadata } = require('./metadata-info');
const { findPexelsPhoto } = require('./pexels');
const { captureScreens } = require('./captureScreens');

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.join(__dirname, '..', '..');
const BASE_URL = process.env.VIDEO_RENDER_BASE_URL || 'http://localhost:3000';
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID;
const W = 1920;
const H = 1080;

function parseArgs(argv) {
  const [videoId, ...rest] = argv;
  const opts = { voice: DEFAULT_VOICE_ID, out: null, beats: null, fps: 30 };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--voice') opts.voice = rest[++i];
    if (rest[i] === '--out') opts.out = rest[++i];
    if (rest[i] === '--beats') opts.beats = rest[++i].split(',');
    if (rest[i] === '--fps') opts.fps = parseInt(rest[++i], 10);
  }
  return { videoId, opts };
}

function loadVideo(videoId) {
  const filePath = path.join(REPO_ROOT, 'content-pipeline', 'info-videos', `${videoId}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function narrate(beat, voice, workDir) {
  const audioPath = path.join(workDir, `${beat.key}.mp3`);
  const hashPath = path.join(workDir, `${beat.key}.hash`);
  const hash = crypto.createHash('sha1').update(`${voice}|v3|${beat.narration}`).digest('hex');
  const cached = fs.existsSync(audioPath) && fs.existsSync(hashPath) && fs.readFileSync(hashPath, 'utf8') === hash;
  if (!cached) {
    await synthesize(beat.narration, voice, audioPath);
    fs.writeFileSync(hashPath, hash);
  }
  return { audioPath, cached, duration: await getAudioDuration(audioPath) };
}

// Streams JPEG frames into ffmpeg's stdin; resolves when the encoder exits.
function startEncoder(fps, outPath) {
  const proc = spawn(ffmpegPath, [
    '-y', '-v', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-r', String(fps),
    outPath,
  ]);
  let stderr = '';
  proc.stderr.on('data', (c) => { stderr += c; });
  const done = new Promise((resolve, reject) => {
    proc.on('error', reject);
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg encoder exited ${code}: ${stderr}`))));
  });
  const write = (buf) => new Promise((resolve) => (proc.stdin.write(buf) ? resolve() : proc.stdin.once('drain', resolve)));
  return { write, end: () => { proc.stdin.end(); return done; } };
}

async function main() {
  const { videoId, opts } = parseArgs(process.argv.slice(2));
  if (!videoId) {
    console.error('Usage: node scripts/video-pipeline/generateMotionVideo.js <videoId> [--voice <id>] [--out <dir>] [--beats a,b] [--fps 30]');
    process.exit(1);
  }
  const video = loadVideo(videoId);
  if (!video) {
    console.error(`No video script at content-pipeline/info-videos/${videoId}.json`);
    process.exit(1);
  }
  const voice = opts.voice || video.voice;
  if (!voice) {
    console.error('No voice: pass --voice, set ELEVENLABS_DEFAULT_VOICE_ID, or add "voice" to the video JSON.');
    process.exit(1);
  }
  const beats = opts.beats ? video.beats.filter((b) => opts.beats.includes(b.key)) : video.beats;
  if (!beats.length) throw new Error('No beats selected.');

  const outDir = opts.out || path.join(REPO_ROOT, 'output', 'video-pipeline', videoId);
  const workDir = path.join(outDir, 'work');
  fs.mkdirSync(workDir, { recursive: true });
  console.log(`Video: ${video.title} (${beats.length} beats, voice ${voice})`);
  console.log(`Output dir: ${outDir}`);

  // 0. Pictures: capture any DMV screenshots the script names, and pick a
  // Pexels photo for image beats that ask for one (written back into the
  // JSON so later renders reuse the same photo).
  if (video.screens && Object.keys(video.screens).length) {
    console.log('Capturing website screenshots...');
    await captureScreens(videoId);
  }
  const videoPath = path.join(REPO_ROOT, 'content-pipeline', 'info-videos', `${videoId}.json`);
  let pickedAny = false;
  for (const beat of video.beats) {
    if (beat.layout !== 'image' || beat.image || beat.screen || !beat.imageQuery) continue;
    const photo = await findPexelsPhoto(beat.imageQuery);
    if (!photo) {
      console.warn(`  No Pexels photo for "${beat.imageQuery}" (${beat.key}).`);
      continue;
    }
    beat.image = photo;
    pickedAny = true;
    console.log(`  ${beat.key}: photo by ${photo.photographer} for "${beat.imageQuery}"`);
  }
  if (pickedAny) fs.writeFileSync(videoPath, JSON.stringify(video, null, 2) + '\n');

  try {
    const res = await fetch(BASE_URL);
    if (!res.ok && res.status !== 404) throw new Error(`status ${res.status}`);
  } catch (err) {
    throw new Error(`Can't reach ${BASE_URL}: start the dev server first (npm run dev). ${err.message}`);
  }

  // 1. Narration first: every slide's length is its own clip's length.
  const frames = [];
  let acc = 0;
  for (const beat of beats) {
    process.stdout.write(`  narrate ${beat.key} ... `);
    const { audioPath, cached, duration } = await narrate(beat, voice, workDir);
    frames.push({ beat, audioPath, duration, startSec: acc, endSec: acc + duration });
    acc += duration;
    console.log(`${duration.toFixed(2)}s${cached ? ' (cached)' : ''}`);
  }
  console.log(`Total ${(acc / 60).toFixed(1)} min, ${Math.round(acc * opts.fps)} frames at ${opts.fps} fps.`);

  // 2. Frames: for each beat open the slide once, then step t and screenshot.
  const videoOnlyPath = path.join(workDir, 'video-only.mp4');
  const encoder = startEncoder(opts.fps, videoOnlyPath);
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const started = Date.now();
  let frameIndex = 0;
  try {
    for (const f of frames) {
      const url = `${BASE_URL}/internal/video-render-motion/${videoId}?beat=${encodeURIComponent(f.beat.key)}&d=${f.duration.toFixed(3)}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
      await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
      // Frame k covers absolute time k / fps; stop before the next beat's first frame.
      const lastFrame = Math.round(f.endSec * opts.fps);
      process.stdout.write(`  render ${f.beat.key} (${lastFrame - frameIndex} frames) ... `);
      for (; frameIndex < lastFrame; frameIndex++) {
        const abs = frameIndex / opts.fps;
        const t = abs - f.startSec;
        await page.evaluate(([tt, aa]) => window.__seek(tt, aa), [t, abs]);
        const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
        await encoder.write(buf);
      }
      console.log('done');
    }
    // Thumbnail from the same renderer.
    await page.goto(`${BASE_URL}/internal/video-render-motion/${videoId}?beat=thumbnail&t=4`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
    await page.evaluate(() => window.__seek(4, 4));
    await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
    await page.screenshot({ path: path.join(outDir, 'thumbnail.png') });
  } finally {
    await browser.close();
  }
  await encoder.end();
  console.log(`Rendered ${frameIndex} frames in ${((Date.now() - started) / 60000).toFixed(1)} min.`);

  // 3. Audio: concat the clips, then mux.
  const audioListPath = path.join(workDir, 'audio.txt');
  fs.writeFileSync(audioListPath, frames.map((f) => `file '${path.resolve(f.audioPath)}'`).join('\n'));
  const narrationPath = path.join(workDir, 'narration.m4a');
  await execFileAsync(ffmpegPath, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', audioListPath, '-c:a', 'aac', '-b:a', '192k', narrationPath]);
  const outPath = path.join(outDir, `${videoId}.mp4`);
  await execFileAsync(ffmpegPath, ['-y', '-v', 'error', '-i', videoOnlyPath, '-i', narrationPath, '-c:v', 'copy', '-c:a', 'aac', '-movflags', '+faststart', '-shortest', outPath]);
  console.log(`Video written to ${outPath}`);

  const metadata = buildInfoVideoMetadata(video, frames);
  fs.writeFileSync(path.join(outDir, 'youtube-metadata.json'), JSON.stringify(metadata, null, 2));
  console.log('YouTube metadata and thumbnail written.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
