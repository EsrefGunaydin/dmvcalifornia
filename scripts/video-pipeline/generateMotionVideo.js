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

const { synthesizeWithTimestamps } = require('./tts');
const { getAudioDuration } = require('./ffprobeDuration');
const { ffmpegPath } = require('./ffmpegBin');
const { buildInfoVideoMetadata } = require('./metadata-info');
const { findPexelsPhoto, findPexelsVideo, downloadFile } = require('./pexels');
const { captureScreens } = require('./captureScreens');

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.join(__dirname, '..', '..');
const BASE_URL = process.env.VIDEO_RENDER_BASE_URL || 'http://localhost:3000';
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID;
const W = 1920;
const H = 1080;
const CLIP_FPS = 15; // background clips are sampled at 15 fps; each frame is shown for two video frames

function parseArgs(argv) {
  const [videoId, ...rest] = argv;
  const opts = { voice: DEFAULT_VOICE_ID, out: null, beats: null, fps: 30, audioOnly: false };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--voice') opts.voice = rest[++i];
    if (rest[i] === '--out') opts.out = rest[++i];
    if (rest[i] === '--beats') opts.beats = rest[++i].split(',');
    if (rest[i] === '--fps') opts.fps = parseInt(rest[++i], 10);
    if (rest[i] === '--audio-only') opts.audioOnly = true;
  }
  return { videoId, opts };
}

function loadVideo(videoId) {
  const filePath = path.join(REPO_ROOT, 'content-pipeline', 'info-videos', `${videoId}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Narrates one beat with word timestamps, then inserts `pause` seconds of
// silence after every sentence (v3 ignores <break> tags) and `tail` seconds
// at the end, so slides breathe. Returns the final audio path, its length,
// and a function mapping a character index of the narration to the second
// it is spoken in the final audio.
// Reads a 16-bit mono PCM wav and returns RMS in dB over [t0, t1).
function wavRms(buf, sr, t0, t1) {
  const data = buf.subarray(44);
  const n = data.length / 2;
  let sum = 0;
  let count = 0;
  for (let i = Math.max(0, Math.floor(t0 * sr)); i < Math.min(n, Math.floor(t1 * sr)); i++) {
    const v = data.readInt16LE(i * 2) / 32768;
    sum += v * v;
    count++;
  }
  return count ? 20 * Math.log10(Math.sqrt(sum / count) + 1e-9) : -99;
}

// Narrates one beat with word timestamps (cached by narration text), then
// inserts `pause` seconds of silence after every sentence (v3 ignores
// <break> tags) and `tail` seconds at the end. Each cut goes at the quietest
// 60 ms between the sentence's decay and the next word's onset, found from
// the waveform: ElevenLabs' timestamp for the period can sit inside the next
// word's onset, and cutting there left a sliver of the next word before the
// silence (an audible "sh"). Segments get 30 ms fades at both ends.
// Returns the final audio path, its length, and a function mapping a
// character index of the narration to the second it is spoken.
async function narrate(beat, voice, workDir, { pause = 0.5, tail = 0.4 } = {}) {
  const rawPath = path.join(workDir, `${beat.key}.raw.mp3`);
  const rawWav = path.join(workDir, `${beat.key}.raw.wav`);
  const alignPath = path.join(workDir, `${beat.key}.align.json`);
  const outPath = path.join(workDir, `${beat.key}.wav`);
  const hashPath = path.join(workDir, `${beat.key}.hash`);
  const editPath = path.join(workDir, `${beat.key}.edit.json`);
  const ttsHash = crypto.createHash('sha1').update(`${voice}|v3|ts|${beat.narration}`).digest('hex');
  const editHash = crypto.createHash('sha1').update(`${ttsHash}|energycut2|${pause}|${tail}`).digest('hex');

  let align;
  let ttsCached = fs.existsSync(rawPath) && fs.existsSync(alignPath) && fs.existsSync(hashPath) && fs.readFileSync(hashPath, 'utf8') === ttsHash;
  if (ttsCached) {
    align = JSON.parse(fs.readFileSync(alignPath, 'utf8'));
  } else {
    align = await synthesizeWithTimestamps(beat.narration, voice, rawPath);
    fs.writeFileSync(alignPath, JSON.stringify(align));
    fs.writeFileSync(hashPath, ttsHash);
  }

  let edit;
  if (fs.existsSync(editPath) && fs.existsSync(outPath)) {
    edit = JSON.parse(fs.readFileSync(editPath, 'utf8'));
    if (edit.hash !== editHash) edit = null;
  }
  if (!edit) {
    await execFileAsync(ffmpegPath, ['-y', '-v', 'error', '-i', rawPath, '-ar', '44100', '-ac', '1', rawWav]);
    const wav = fs.readFileSync(rawWav);
    const SR = 44100;
    const text = align.characters.join('');
    const cuts = [];
    for (let i = 0; i < text.length - 1; i++) {
      if (!/[.!?]/.test(text[i]) || !/\s/.test(text[i + 1]) || text.slice(i + 1).trim().length === 0) continue;
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) j++;
      const nextStart = j < text.length ? align.starts[j] : align.ends[i] + 0.3;
      const lo = Math.max(0, align.ends[i] - 0.35);
      const hi = nextStart + 0.1;
      let best = (lo + hi) / 2;
      let bestDb = Infinity;
      for (let t = lo; t + 0.06 <= hi; t += 0.01) {
        const db = wavRms(wav, SR, t, t + 0.06);
        if (db < bestDb) { bestDb = db; best = t + 0.03; }
      }
      cuts.push(best);
    }
    const rawLen = await getAudioDuration(rawWav);
    const bounds = [...cuts, rawLen];
    const parts = [];
    let from = 0;
    const FADE = 0.03;
    for (let i = 0; i < bounds.length; i++) {
      const seg = path.join(workDir, `${beat.key}.seg${i}.wav`);
      const len = bounds[i] - from;
      const fades = `afade=t=in:st=0:d=${FADE},afade=t=out:st=${Math.max(0, len - FADE).toFixed(3)}:d=${FADE}`;
      // Seek on the input side so the piece's clock starts at 0: with output
      // seeking the fades ran on the source clock and muted mid-piece.
      await execFileAsync(ffmpegPath, ['-y', '-v', 'error', '-ss', from.toFixed(3), '-t', len.toFixed(3), '-i', rawWav, '-af', fades, seg]);
      parts.push(seg);
      const gap = i < bounds.length - 1 ? pause : tail;
      const sil = path.join(workDir, `${beat.key}.sil${i}.wav`);
      await execFileAsync(ffmpegPath, ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', gap.toFixed(3), sil]);
      parts.push(sil);
      from = bounds[i];
    }
    const listPath = path.join(workDir, `${beat.key}.parts.txt`);
    fs.writeFileSync(listPath, parts.map((f) => `file '${f}'`).join('\n'));
    await execFileAsync(ffmpegPath, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outPath]);
    edit = { hash: editHash, cuts, pause };
    fs.writeFileSync(editPath, JSON.stringify(edit));
    ttsCached = ttsCached && false;
  }
  const timeOfChar = (idx) => {
    const t = align.starts[Math.min(idx, align.starts.length - 1)];
    return t + edit.pause * edit.cuts.filter((c) => c <= t).length;
  };
  return { audioPath: outPath, cached: ttsCached, duration: await getAudioDuration(outPath), timeOfChar };
}

// A beat may name `cues`, one phrase per bullet (or step, tile, item): the
// slide reveals that element when the phrase is spoken. Phrases are matched
// in the narration, case-insensitive, in order.
function cueTimes(beat, timeOfChar) {
  if (!beat.cues || !beat.cues.length) return null;
  const text = beat.narration.toLowerCase();
  let from = 0;
  const times = [];
  for (const cue of beat.cues) {
    const idx = text.indexOf(cue.toLowerCase(), from);
    if (idx < 0) { console.warn(`  cue "${cue}" not found in ${beat.key} narration`); return null; }
    times.push(Math.max(0.3, timeOfChar(idx) - 0.15));
    from = idx + cue.length;
  }
  return times;
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
    // One photo for an image beat.
    if (beat.imageQuery && !beat.image && !beat.screen) {
      const photo = await findPexelsPhoto(beat.imageQuery);
      if (photo) { beat.image = photo; pickedAny = true; console.log(`  ${beat.key}: photo by ${photo.photographer} for "${beat.imageQuery}"`); }
      else console.warn(`  No Pexels photo for "${beat.imageQuery}" (${beat.key}).`);
    }
    // One photo per grid tile.
    for (const tile of beat.tiles || []) {
      if (tile.image || !tile.query) continue;
      const photo = await findPexelsPhoto(tile.query);
      if (photo) { tile.image = photo; pickedAny = true; console.log(`  ${beat.key}/${tile.label}: photo by ${photo.photographer} for "${tile.query}"`); }
      else console.warn(`  No Pexels photo for tile "${tile.query}" (${beat.key}).`);
    }
    // One HD clip as the beat's moving background.
    if (beat.videoQuery && !beat.clip) {
      const clip = await findPexelsVideo(beat.videoQuery, { minSeconds: 6, skip: beat.videoSkip || 0 });
      if (clip) { beat.clip = clip; pickedAny = true; console.log(`  ${beat.key}: clip ${clip.id} by ${clip.photographer} for "${beat.videoQuery}" (${clip.seconds}s, ${clip.width}x${clip.height})`); }
      else console.warn(`  No Pexels video for "${beat.videoQuery}" (${beat.key}).`);
    }
  }
  if (pickedAny) fs.writeFileSync(videoPath, JSON.stringify(video, null, 2) + '\n');

  if (!opts.audioOnly) try {
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
    const { audioPath, cached, duration, timeOfChar } = await narrate(beat, voice, workDir, { pause: video.sentencePause ?? 0.5, tail: video.beatTail ?? 0.4 });
    const reveals = cueTimes(beat, timeOfChar);
    frames.push({ beat, audioPath, duration, reveals, startSec: acc, endSec: acc + duration });
    acc += duration;
    console.log(`${duration.toFixed(2)}s${cached ? ' (cached)' : ''}`);
  }
  console.log(`Total ${(acc / 60).toFixed(1)} min, ${Math.round(acc * opts.fps)} frames at ${opts.fps} fps.`);

  // --audio-only: the slides are unchanged, so keep work/video-only.mp4 and
  // only rebuild and remux the narration (fails if the durations moved).
  if (opts.audioOnly) {
    const videoOnly = path.join(workDir, 'video-only.mp4');
    if (!fs.existsSync(videoOnly)) throw new Error('--audio-only needs an earlier full render (work/video-only.mp4).');
    const audioList = path.join(workDir, 'audio.txt');
    fs.writeFileSync(audioList, frames.map((f) => `file '${path.resolve(f.audioPath)}'`).join('\n'));
    const narr = path.join(workDir, 'narration.m4a');
    await execFileAsync(ffmpegPath, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', audioList, '-c:a', 'aac', '-b:a', '192k', narr]);
    const vLen = await getAudioDuration(videoOnly).catch(() => null);
    const out = path.join(outDir, `${videoId}.mp4`);
    await execFileAsync(ffmpegPath, ['-y', '-v', 'error', '-i', videoOnly, '-i', narr, '-c:v', 'copy', '-c:a', 'aac', '-movflags', '+faststart', '-shortest', out]);
    console.log(`Audio rebuilt and remuxed onto the existing frames: ${out} (narration ${acc.toFixed(2)}s${vLen ? `, video ${vLen.toFixed(2)}s` : ''})`);
    fs.writeFileSync(path.join(outDir, 'youtube-metadata.json'), JSON.stringify(buildInfoVideoMetadata(video, frames), null, 2));
    return;
  }

  // 1b. Background clips: download each beat's clip and sample it to JPEG
  // frames under public/video-frames (gitignored), looping if the clip is
  // shorter than the narration. The slide shows frame floor(t * CLIP_FPS).
  const clipDir = path.join(outDir, 'clips');
  for (const f of frames) {
    const clip = f.beat.clip;
    if (!clip) continue;
    const framesDir = path.join(REPO_ROOT, 'public', 'video-frames', videoId, f.beat.key);
    const needed = Math.ceil(f.duration * CLIP_FPS) + 2;
    const have = fs.existsSync(framesDir) ? fs.readdirSync(framesDir).filter((n) => n.endsWith('.jpg')).length : 0;
    if (have >= needed) { f.clipFrames = have; continue; }
    fs.mkdirSync(clipDir, { recursive: true });
    fs.mkdirSync(framesDir, { recursive: true });
    const clipPath = path.join(clipDir, `${f.beat.key}-${clip.id}.mp4`);
    if (!fs.existsSync(clipPath)) {
      process.stdout.write(`  clip ${f.beat.key}: downloading ${clip.id} ... `);
      await downloadFile(clip.url, clipPath);
      console.log('ok');
    }
    process.stdout.write(`  clip ${f.beat.key}: ${needed} frames at ${CLIP_FPS} fps ... `);
    await execFileAsync(ffmpegPath, [
      '-y', '-v', 'error', '-stream_loop', '-1', '-i', clipPath,
      '-t', String(f.duration + 0.5), '-an',
      '-vf', `fps=${CLIP_FPS},scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`,
      '-q:v', '4', path.join(framesDir, '%04d.jpg'),
    ]);
    f.clipFrames = fs.readdirSync(framesDir).filter((n) => n.endsWith('.jpg')).length;
    console.log(`${f.clipFrames} written`);
  }

  // 2. Frames: for each beat open the slide once, then step t and screenshot.
  const videoOnlyPath = path.join(workDir, 'video-only.mp4');
  const encoder = startEncoder(opts.fps, videoOnlyPath);
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const started = Date.now();
  let frameIndex = 0;
  try {
    for (const f of frames) {
      const clipQuery = f.clipFrames ? `&clipFrames=${f.clipFrames}&clipFps=${CLIP_FPS}` : '';
      const revealQuery = f.reveals ? `&reveals=${f.reveals.map((t) => t.toFixed(2)).join(',')}` : '';
      const url = `${BASE_URL}/internal/video-render-motion/${videoId}?beat=${encodeURIComponent(f.beat.key)}&d=${f.duration.toFixed(3)}${clipQuery}${revealQuery}`;
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
