/**
 * Fetches duration + publish date for a batch of YouTube video IDs, for the
 * video sitemap (video-sitemap.xml). Thumbnails aren't fetched here — they
 * use the predictable https://img.youtube.com/vi/{id}/hqdefault.jpg pattern,
 * same as the /videos page already does, so no API call is needed for that.
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

function getAuthedYoutube() {
  const raw = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, 'utf8'));
  const creds = raw.installed || raw.web;
  const oauth2Client = new google.auth.OAuth2(creds.client_id, creds.client_secret, REDIRECT_URI);
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  oauth2Client.setCredentials(tokens);
  return google.youtube({ version: 'v3', auth: oauth2Client });
}

// ISO 8601 duration (e.g. "PT11M56S") -> whole seconds
function parseISODuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const [, h, mnt, s] = m;
  return parseInt(h || 0, 10) * 3600 + parseInt(mnt || 0, 10) * 60 + parseInt(s || 0, 10);
}

/** @returns {Promise<Record<string, {durationSeconds: number, publishedAt: string}>>} */
async function fetchVideoMeta(videoIds) {
  const youtube = getAuthedYoutube();
  const results = {};
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res = await youtube.videos.list({ part: ['snippet', 'contentDetails'], id: batch });
    for (const item of res.data.items || []) {
      results[item.id] = {
        durationSeconds: parseISODuration(item.contentDetails.duration),
        publishedAt: item.snippet.publishedAt,
      };
    }
  }
  return results;
}

module.exports = { fetchVideoMeta, parseISODuration };
