const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

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

  await execFileAsync('ffmpeg', [
    '-y',
    '-f', 'concat', '-safe', '0', '-i', imagesListPath,
    '-fps_mode', 'vfr',
    '-pix_fmt', 'yuv420p',
    videoOnlyPath,
  ]);

  await execFileAsync('ffmpeg', [
    '-y',
    '-f', 'concat', '-safe', '0', '-i', audioListPath,
    '-c:a', 'aac', '-b:a', '192k',
    narrationPath,
  ]);

  await execFileAsync('ffmpeg', [
    '-y',
    '-i', videoOnlyPath,
    '-i', narrationPath,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-shortest',
    outPath,
  ]);

  return outPath;
}

module.exports = { assembleVideo };
