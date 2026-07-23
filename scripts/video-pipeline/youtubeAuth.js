/**
 * One-time YouTube OAuth authorization.
 *
 * Usage: node scripts/video-pipeline/youtubeAuth.js /path/to/client_secret.json
 *
 * Opens a local loopback server, prints a Google consent URL to click,
 * captures the redirect, and saves a refresh token to
 * credentials/youtube-token.json. Run once; youtubeUpload.js reuses the
 * saved token after that (silently refreshing the access token as needed).
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { google } = require('googleapis');

const PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/oauth2callback`;
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube', // needed for videos.update (setVideoPrivacy.js)
];

const CREDENTIALS_DIR = path.join(__dirname, '..', '..', 'credentials');
const CLIENT_SECRET_DEST = path.join(CREDENTIALS_DIR, 'youtube-client-secret.json');
const TOKEN_DEST = path.join(CREDENTIALS_DIR, 'youtube-token.json');

async function main() {
  const srcPath = process.argv[2];
  if (!srcPath) {
    console.error('Usage: node scripts/video-pipeline/youtubeAuth.js /path/to/client_secret.json');
    process.exit(1);
  }

  fs.mkdirSync(CREDENTIALS_DIR, { recursive: true });
  if (path.resolve(srcPath) !== path.resolve(CLIENT_SECRET_DEST)) {
    fs.copyFileSync(srcPath, CLIENT_SECRET_DEST);
    console.log(`Copied client secret to ${CLIENT_SECRET_DEST} (gitignored).`);
  }

  const raw = JSON.parse(fs.readFileSync(CLIENT_SECRET_DEST, 'utf8'));
  const creds = raw.installed || raw.web;
  const oauth2Client = new google.auth.OAuth2(creds.client_id, creds.client_secret, REDIRECT_URI);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\nOpen this URL in your browser and approve access:\n');
  console.log(authUrl);
  console.log('\nWaiting for authorization...\n');

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get('code');
      const err = url.searchParams.get('error');
      if (err) {
        res.end('Authorization failed. You can close this tab.');
        server.close();
        reject(new Error(err));
        return;
      }
      if (code) {
        res.end('Authorization complete. You can close this tab and return to the terminal.');
        server.close();
        resolve(code);
      }
    });
    server.listen(PORT);
  });

  const { tokens } = await oauth2Client.getToken(code);
  fs.writeFileSync(TOKEN_DEST, JSON.stringify(tokens, null, 2));
  console.log(`Saved refresh token to ${TOKEN_DEST}.`);
  console.log('Done — youtubeUpload.js can now publish without further browser prompts.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
