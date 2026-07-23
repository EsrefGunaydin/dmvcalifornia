/**
 * Uploads a generated quiz video (from generateVideo.js's output dir) to
 * YouTube, using the title/description/tags this pipeline already produced
 * and setting the generated thumbnail.
 *
 * Usage: node scripts/video-pipeline/youtubeUpload.js <outputDir> [--privacy private|unlisted|public]
 *
 * Defaults to --privacy private: the upload lands on the real channel, so a
 * safe-by-default run never makes something public without you explicitly
 * asking for that. Review in YouTube Studio, then flip visibility there (or
 * re-run with --privacy public).
 *
 * Requires youtubeAuth.js to have been run once already.
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_DIR = path.join(__dirname, '..', '..', 'credentials');
const CLIENT_SECRET_PATH = path.join(CREDENTIALS_DIR, 'youtube-client-secret.json');
const TOKEN_PATH = path.join(CREDENTIALS_DIR, 'youtube-token.json');
const REDIRECT_URI = 'http://127.0.0.1:53682/oauth2callback';

function parseArgs(argv) {
  const [outputDir, ...rest] = argv;
  const opts = { privacy: 'private' };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--privacy') opts.privacy = rest[++i];
  }
  return { outputDir, opts };
}

function findVideoFile(outputDir) {
  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.mp4'));
  if (files.length === 0) throw new Error(`No .mp4 found in ${outputDir}`);
  return path.join(outputDir, files[0]);
}

function getAuthedClient() {
  if (!fs.existsSync(CLIENT_SECRET_PATH) || !fs.existsSync(TOKEN_PATH)) {
    throw new Error(
      `Missing YouTube credentials. Run youtubeAuth.js once first:\n` +
      `  node scripts/video-pipeline/youtubeAuth.js /path/to/client_secret.json`
    );
  }
  const raw = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, 'utf8'));
  const creds = raw.installed || raw.web;
  const oauth2Client = new google.auth.OAuth2(creds.client_id, creds.client_secret, REDIRECT_URI);
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

async function main() {
  const { outputDir, opts } = parseArgs(process.argv.slice(2));
  if (!outputDir) {
    console.error('Usage: node scripts/video-pipeline/youtubeUpload.js <outputDir> [--privacy private|unlisted|public]');
    process.exit(1);
  }
  if (!['private', 'unlisted', 'public'].includes(opts.privacy)) {
    console.error('--privacy must be one of: private, unlisted, public');
    process.exit(1);
  }

  const videoPath = findVideoFile(outputDir);
  const metadataPath = path.join(outputDir, 'youtube-metadata.json');
  const thumbnailPath = path.join(outputDir, 'thumbnail.png');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  const auth = getAuthedClient();
  const youtube = google.youtube({ version: 'v3', auth });

  console.log(`Uploading ${videoPath} as "${metadata.title}" (privacy: ${opts.privacy})...`);
  const insertRes = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        categoryId: '27', // Education
      },
      status: {
        privacyStatus: opts.privacy,
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  const videoId = insertRes.data.id;
  console.log(`Uploaded. Video ID: ${videoId}`);
  console.log(`https://youtube.com/watch?v=${videoId}`);

  if (fs.existsSync(thumbnailPath)) {
    console.log('Setting thumbnail...');
    await youtube.thumbnails.set({
      videoId,
      media: { body: fs.createReadStream(thumbnailPath) },
    });
    console.log('Thumbnail set.');
  }

  fs.writeFileSync(
    path.join(outputDir, 'upload-result.json'),
    JSON.stringify({ videoId, privacy: opts.privacy, uploadedAt: new Date().toISOString() }, null, 2) + '\n'
  );

  console.log(`\nDone. Add this to src/data/seo-hubs.ts as youtubeId: "${videoId}" once you've reviewed it.`);
}

main().catch((err) => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
