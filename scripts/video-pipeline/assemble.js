const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const { ffmpegPath } = require('./ffmpegBin');

const execFileAsync = promisify(execFile);

// ffmpeg's concat demuxer ignores the `duration` on the final entry, so the
// standard workaround is to repeat the last image once more with no duration
// line after it.
function writeImagesList(listPath, frames) {
  const lines = [];
  frames.forEach((frame) => {
    lines.push(`file '${path.resolve(frame.imagePath)}'`);
    lines.push(`duration ${frame.duration.toFixed(3)}`);
  });
  const last = frames[frames.length - 1];
  lines.push(`file '${path.resolve(last.imagePath)}'`);
  fs.writeFileSync(listPath, lines.join('\n'));
}

function writeAudioList(listPath, frames) {
  const lines = frames.map((frame) => `file '${path.resolve(frame.audioPath)}'`);
  fs.writeFileSync(listPath, lines.join('\n'));
}

async function assembleVideo({ frames, workDir, outPath }) {
  const imagesListPath = path.join(workDir, 'images.txt');
  const audioListPath = path.join(workDir, 'audio.txt');
  const videoOnlyPath = path.join(workDir, 'video-only.mp4');
  const narrationPath = path.join(workDir, 'narration.m4a');

  writeImagesList(imagesListPath, frames);
  writeAudioList(audioListPath, frames);

  // Constant frame rate output: the concat demuxer's per-frame `duration`
  // only sets timestamps, not real repeated frames (a single 12s-held slide
  // is still just 1 frame internally under -fps_mode vfr). That declared-vs-
  // actual frame rate mismatch is fine for QuickTime/VLC but Final Cut Pro
  // (and Premiere/Resolve) reject it on import with a "header error" — so
  // re-sample to a real 30fps CFR stream instead, which duplicates each
  // slide into real frames for its held duration.
  await execFileAsync(ffmpegPath, [
    '-y',
    '-f', 'concat', '-safe', '0', '-i', imagesListPath,
    '-r', '30',
    '-fps_mode', 'cfr',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    videoOnlyPath,
  ]);

  await execFileAsync(ffmpegPath, [
    '-y',
    '-f', 'concat', '-safe', '0', '-i', audioListPath,
    '-c:a', 'aac', '-b:a', '192k',
    narrationPath,
  ]);

  await execFileAsync(ffmpegPath, [
    '-y',
    '-i', videoOnlyPath,
    '-i', narrationPath,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-movflags', '+faststart',
    '-shortest',
    outPath,
  ]);

  return outPath;
}

module.exports = { assembleVideo };
