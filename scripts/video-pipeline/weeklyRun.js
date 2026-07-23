/**
 * Weekly quiz-video pipeline runner. Picks the next 'ready' item from
 * content-pipeline/video-queue.json, generates the video, uploads it to
 * YouTube as private, and marks the queue item published.
 *
 * Run by a local launchd job (see scripts/video-pipeline/run-weekly.sh) —
 * this needs the local ElevenLabs key and YouTube OAuth token, which a
 * cloud routine can't access, so it must run on this machine.
 *
 * Usage: node scripts/video-pipeline/weeklyRun.js
 * (expects VIDEO_RENDER_BASE_URL to point at an already-running dev server;
 * run-weekly.sh starts and stops one around this call.)
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..', '..');
const QUEUE_PATH = path.join(REPO_ROOT, 'content-pipeline', 'video-queue.json');
const DEFAULT_VOICE = process.env.ELEVENLABS_DEFAULT_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

function loadQueue() {
  return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');
}

function escapeForAppleScript(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function notify(title, message) {
  try {
    const script = `display notification "${escapeForAppleScript(message)}" with title "${escapeForAppleScript(title)}"`;
    execFileSync('osascript', ['-e', script]);
  } catch (e) {
    // Notification is a nice-to-have; never fail the run over it.
  }
}

function main() {
  const queue = loadQueue();
  const next = queue.items.find((item) => item.status === 'ready');

  if (!next) {
    console.log('No ready items in video-queue.json. Nothing to do this week.');
    notify('Video pipeline', 'Queue is empty — add more quizzes to content-pipeline/video-queue.json.');
    return;
  }

  const voice = next.voice || DEFAULT_VOICE;
  console.log(`[weeklyRun] Next up: ${next.quizId} (voice ${voice})`);

  const outDir = path.join(REPO_ROOT, 'output', 'video-pipeline', next.quizId);

  console.log('[weeklyRun] Generating video...');
  execFileSync('node', ['scripts/video-pipeline/generateVideo.js', next.quizId, '--voice', voice], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });

  console.log('[weeklyRun] Uploading to YouTube as private...');
  execFileSync('node', ['scripts/video-pipeline/youtubeUpload.js', outDir, '--privacy', 'private'], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });

  const metadata = JSON.parse(fs.readFileSync(path.join(outDir, 'youtube-metadata.json'), 'utf8'));
  const uploadResult = JSON.parse(fs.readFileSync(path.join(outDir, 'upload-result.json'), 'utf8'));

  next.status = 'published';
  next.videoId = uploadResult.videoId;
  next.publishedAt = uploadResult.uploadedAt;
  saveQueue(queue);

  console.log(`[weeklyRun] Done. Marked ${next.quizId} as published.`);
  notify('Video pipeline', `"${metadata.title}" uploaded as private — review it on YouTube.`);
}

main();
