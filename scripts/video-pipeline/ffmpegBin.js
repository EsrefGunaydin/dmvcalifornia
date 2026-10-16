// Resolves the ffmpeg binary the pipeline runs. The ffmpeg-static package
// ships a native build for this machine (arm64), so the pipeline no longer
// depends on whatever /usr/local/bin/ffmpeg is. Falls back to PATH if the
// package is missing.
let ffmpegPath = 'ffmpeg';
try {
  ffmpegPath = require('ffmpeg-static') || ffmpegPath;
} catch (e) {
  // ffmpeg-static not installed: use whatever `ffmpeg` is on PATH.
}

module.exports = { ffmpegPath };
