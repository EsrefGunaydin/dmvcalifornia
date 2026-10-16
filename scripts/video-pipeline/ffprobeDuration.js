const { spawn } = require('child_process');
const { ffmpegPath } = require('./ffmpegBin');

// Exact audio duration, measured by decoding the file to raw PCM and
// counting samples. This replaces the earlier ffprobe call: ffprobe only
// reports an estimate for MP3, and the ffprobe-static package's "arm64"
// binary is actually an Intel build that no longer runs on this Mac.
const SAMPLE_RATE = 48000;

function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, [
      '-v', 'error',
      '-i', filePath,
      '-f', 's16le', '-ac', '1', '-ar', String(SAMPLE_RATE),
      '-',
    ]);
    let bytes = 0;
    let stderr = '';
    proc.stdout.on('data', (chunk) => { bytes += chunk.length; });
    proc.stderr.on('data', (chunk) => { stderr += chunk; });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg failed decoding ${filePath}: ${stderr.trim()}`));
      resolve(bytes / 2 / SAMPLE_RATE);
    });
  });
}

module.exports = { getAudioDuration };
