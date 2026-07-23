/**
 * Automates DMV quiz video production end to end: quiz JSON -> narration
 * script -> ElevenLabs TTS -> rendered slide frames -> assembled MP4.
 *
 * Usage:
 *   node scripts/video-pipeline/generateVideo.js <quizId> [--voice <voiceId>] [--out <dir>]
 *
 * Requires the dev server running (npm run dev) so the internal
 * /internal/video-render route is reachable for screenshotting.
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });

const fs = require('fs');
const path = require('path');

const quizzesData = require('../../src/data/quizzes.json');
const { buildCues } = require('./buildCues');
const { synthesize } = require('./tts');
const { getAudioDuration } = require('./ffprobeDuration');
const { SlideRenderer } = require('./renderSlide');
const { assembleVideo } = require('./assemble');
const { buildYoutubeMetadata } = require('./metadata');

const DEFAULT_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID;

function parseArgs(argv) {
  const [quizId, ...rest] = argv;
  const opts = { voice: DEFAULT_VOICE_ID, out: null, limit: null };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--voice') opts.voice = rest[++i];
    if (rest[i] === '--out') opts.out = rest[++i];
    if (rest[i] === '--limit') opts.limit = parseInt(rest[++i], 10);
  }
  return { quizId, opts };
}

function findQuiz(quizId) {
  return quizzesData.quizzes.find((q) => q.id === quizId || q.slug === quizId);
}

async function main() {
  const { quizId, opts } = parseArgs(process.argv.slice(2));
  if (!quizId) {
    console.error('Usage: node scripts/video-pipeline/generateVideo.js <quizId> [--voice <voiceId>] [--out <dir>]');
    process.exit(1);
  }
  if (!opts.voice) {
    console.error('No voice ID given. Pass --voice <id>, or set ELEVENLABS_DEFAULT_VOICE_ID in .env.local.');
    console.error('List available voices with: node scripts/video-pipeline/listVoices.js');
    process.exit(1);
  }

  const quiz = findQuiz(quizId);
  if (!quiz) {
    console.error(`No quiz found with id/slug "${quizId}" in src/data/quizzes.json`);
    process.exit(1);
  }

  const outDir = opts.out || path.join(__dirname, '..', '..', 'output', 'video-pipeline', quizId);
  const workDir = path.join(outDir, 'work');
  fs.mkdirSync(workDir, { recursive: true });

  console.log(`Quiz: ${quiz.title} (${quiz.questions.length} questions)`);
  console.log(`Output dir: ${outDir}`);

  const quizForCues = opts.limit
    ? { ...quiz, questions: quiz.questions.slice(0, opts.limit) }
    : quiz;
  const cues = buildCues(quizForCues);
  console.log(`Built ${cues.length} cues (slides).${opts.limit ? ` (limited to first ${opts.limit} questions)` : ''}`);

  const renderer = new SlideRenderer();
  await renderer.assertServerUp();
  await renderer.start();

  const frames = [];
  try {
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];
      process.stdout.write(`  [${i + 1}/${cues.length}] ${cue.key} ... `);

      const audioPath = path.join(workDir, `${cue.key}.mp3`);
      await synthesize(cue.narration, opts.voice, audioPath);
      const duration = await getAudioDuration(audioPath);

      const imagePath = path.join(workDir, `${cue.key}.png`);
      await renderer.shoot(quizId, cue, imagePath);

      frames.push({ cue, audioPath, imagePath, duration });
      console.log(`${duration.toFixed(2)}s`);
    }
  } finally {
    await renderer.stop();
  }

  const cumulativeStarts = [];
  let acc = 0;
  for (const frame of frames) {
    cumulativeStarts.push(acc);
    acc += frame.duration;
  }

  console.log('Assembling final video with ffmpeg...');
  const outPath = path.join(outDir, `${quizId}.mp4`);
  await assembleVideo({ frames, workDir, outPath });
  console.log(`Video written to ${outPath}`);

  const metadata = buildYoutubeMetadata(quizForCues, cues, cumulativeStarts);
  const metadataPath = path.join(outDir, 'youtube-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`YouTube metadata written to ${metadataPath}`);

  // Thumbnail is a separate single-frame render (no audio needed).
  const thumbRenderer = new SlideRenderer();
  await thumbRenderer.start();
  const thumbPath = path.join(outDir, 'thumbnail.png');
  await thumbRenderer.shoot(quizId, { state: 'thumbnail', q: null }, thumbPath);
  await thumbRenderer.stop();
  console.log(`Thumbnail written to ${thumbPath}`);

  console.log('\nDone. Total runtime (video length): ' + (acc / 60).toFixed(1) + ' min.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
