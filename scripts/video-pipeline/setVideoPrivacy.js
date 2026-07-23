/**
 * Flips an already-uploaded video's privacy status, e.g. after you've
 * reviewed a private upload from the weekly pipeline and want it public.
 *
 * Usage: node scripts/video-pipeline/setVideoPrivacy.js <videoId> <private|unlisted|public>
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

function getAuthedClient() {
  const raw = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, 'utf8'));
  const creds = raw.installed || raw.web;
  const oauth2Client = new google.auth.OAuth2(creds.client_id, creds.client_secret, REDIRECT_URI);
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

async function main() {
  const [videoId, privacy] = process.argv.slice(2);
  if (!videoId || !['private', 'unlisted', 'public'].includes(privacy)) {
    console.error('Usage: node scripts/video-pipeline/setVideoPrivacy.js <videoId> <private|unlisted|public>');
    process.exit(1);
  }

  const auth = getAuthedClient();
  const youtube = google.youtube({ version: 'v3', auth });

  await youtube.videos.update({
    part: ['status'],
    requestBody: {
      id: videoId,
      status: { privacyStatus: privacy, selfDeclaredMadeForKids: false },
    },
  });

  console.log(`${videoId} is now ${privacy}.`);
}

main().catch((err) => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
