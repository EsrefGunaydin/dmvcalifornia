const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

async function getAudioDuration(filePath) {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_format',
    filePath,
  ]);
  const parsed = JSON.parse(stdout);
  return parseFloat(parsed.format.duration);
}

module.exports = { getAudioDuration };
