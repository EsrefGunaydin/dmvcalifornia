/**
 * Takes an already-uploaded (private) quiz video live on the site: flips its
 * YouTube privacy, adds it to the /videos page, and embeds it on whichever
 * hub/blog post the queue item designates.
 *
 * This is a deliberate second step, separate from weeklyRun.js's upload —
 * videos upload private so you can review them first. Nothing gets embedded
 * on the live site until you run this.
 *
 * Usage: node scripts/video-pipeline/publishToSite.js <quizId> [--privacy public|unlisted]
 *
 * Reads the queue item for <quizId> from content-pipeline/video-queue.json.
 * The item must already have a `videoId` (set by weeklyRun.js after upload)
 * and should carry the editorial fields below, added by hand when curating
 * the queue:
 *   - cardTitle / cardDescription : short copy for the /videos page card
 *   - embedHubSlug   (optional)   : key into src/data/seo-hubs.ts to receive youtubeId
 *   - embedBlogSlug  (optional)   : slug into src/data/blog_posts.json to receive youtubeId
 * If cardTitle/cardDescription are missing, the script stops and asks for
 * them rather than inventing generic copy.
 *
 * Idempotent: safe to re-run. Already-applied embeds are skipped, and the
 * queue item is stamped with sitePublishedAt once done.
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { fetchVideoMeta } = require('./fetchVideoMeta');

const REPO_ROOT = path.join(__dirname, '..', '..');
const QUEUE_PATH = path.join(REPO_ROOT, 'content-pipeline', 'video-queue.json');
const VIDEOS_JSON_PATH = path.join(REPO_ROOT, 'src', 'data', 'videos.json');
const SEO_HUBS_PATH = path.join(REPO_ROOT, 'src', 'data', 'seo-hubs.ts');
const BLOG_POSTS_PATH = path.join(REPO_ROOT, 'src', 'data', 'blog_posts.json');
const CREDENTIALS_DIR = path.join(REPO_ROOT, 'credentials');
const REDIRECT_URI = 'http://127.0.0.1:53682/oauth2callback';

function parseArgs(argv) {
  const [quizId, ...rest] = argv;
  const opts = { privacy: 'public' };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--privacy') opts.privacy = rest[++i];
  }
  return { quizId, opts };
}

function getAuthedYoutube() {
  const raw = JSON.parse(fs.readFileSync(path.join(CREDENTIALS_DIR, 'youtube-client-secret.json'), 'utf8'));
  const creds = raw.installed || raw.web;
  const oauth2Client = new google.auth.OAuth2(creds.client_id, creds.client_secret, REDIRECT_URI);
  const tokens = JSON.parse(fs.readFileSync(path.join(CREDENTIALS_DIR, 'youtube-token.json'), 'utf8'));
  oauth2Client.setCredentials(tokens);
  return google.youtube({ version: 'v3', auth: oauth2Client });
}

async function addToVideosPage(videoId, cardTitle, cardDescription) {
  const data = JSON.parse(fs.readFileSync(VIDEOS_JSON_PATH, 'utf8'));
  if (data.ourVideos.some((v) => v.id === videoId)) {
    console.log(`[publishToSite] ${videoId} already in videos.json, skipping.`);
    return;
  }
  const entry = { id: videoId, title: cardTitle, description: cardDescription };
  try {
    const meta = (await fetchVideoMeta([videoId]))[videoId];
    if (meta) {
      entry.durationSeconds = meta.durationSeconds;
      entry.publishedAt = meta.publishedAt;
    }
  } catch (err) {
    console.warn(`[publishToSite] Could not fetch duration/publish date for ${videoId} (video-sitemap.xml will skip it until backfilled): ${err.message}`);
  }
  data.ourVideos.push(entry);
  fs.writeFileSync(VIDEOS_JSON_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log(`[publishToSite] Added ${videoId} to src/data/videos.json.`);
}

function embedOnHub(hubSlug, videoId, item) {
  const src = fs.readFileSync(SEO_HUBS_PATH, 'utf8');
  const slugLine = `slug: '${hubSlug}',`;
  const slugIdx = src.indexOf(slugLine);
  if (slugIdx === -1) {
    console.warn(`[publishToSite] Hub slug '${hubSlug}' not found in seo-hubs.ts, skipping hub embed.`);
    return;
  }
  const afterSlug = src.slice(slugIdx + slugLine.length, slugIdx + slugLine.length + 200);
  if (afterSlug.trimStart().startsWith('youtubeId:')) {
    console.log(`[publishToSite] Hub '${hubSlug}' already has a youtubeId, skipping.`);
    return;
  }
  if (!item.embedHubHeading) {
    console.warn(
      `[publishToSite] No embedHubHeading/embedHubSubtitle set for '${hubSlug}' — the video section will fall back ` +
      `to the English "Watch: California DMV Practice Test 2026" copy. Add embedHubHeading/embedHubSubtitle/embedHubTitle ` +
      `to the queue item if this hub isn't English, then rerun.`
    );
  }
  const indent = src.slice(0, slugIdx).split('\n').pop();
  const lines = [`youtubeId: '${videoId}',`];
  if (item.embedHubHeading) lines.push(`youtubeHeading: ${JSON.stringify(item.embedHubHeading)},`);
  if (item.embedHubSubtitle) lines.push(`youtubeSubtitle: ${JSON.stringify(item.embedHubSubtitle)},`);
  if (item.embedHubTitle) lines.push(`youtubeTitle: ${JSON.stringify(item.embedHubTitle)},`);
  const insertion = lines.map((l) => `\n${indent}${l}`).join('');
  const updated = src.slice(0, slugIdx + slugLine.length) + insertion + src.slice(slugIdx + slugLine.length);
  fs.writeFileSync(SEO_HUBS_PATH, updated);
  console.log(`[publishToSite] Embedded ${videoId} on hub '${hubSlug}'.`);
}

function embedOnBlogPost(blogSlug, videoId, item) {
  const data = JSON.parse(fs.readFileSync(BLOG_POSTS_PATH, 'utf8'));
  const arr = Array.isArray(data) ? data : data.posts || Object.values(data);
  const post = arr.find((p) => p.slug === blogSlug);
  if (!post) {
    console.warn(`[publishToSite] Blog slug '${blogSlug}' not found, skipping blog embed.`);
    return;
  }
  if (post.youtubeId) {
    console.log(`[publishToSite] Blog post '${blogSlug}' already has a youtubeId, skipping.`);
    return;
  }
  if (!item.embedBlogHeading) {
    console.warn(
      `[publishToSite] No embedBlogHeading/embedBlogSubtitle set for '${blogSlug}' — the video section will fall back ` +
      `to the English "Watch: California DMV Practice Test 2026" copy. Add embedBlogHeading/embedBlogSubtitle/embedBlogTitle ` +
      `to the queue item if this post isn't English, then rerun.`
    );
  }
  post.youtubeId = videoId;
  if (item.embedBlogHeading) post.youtubeHeading = item.embedBlogHeading;
  if (item.embedBlogSubtitle) post.youtubeSubtitle = item.embedBlogSubtitle;
  if (item.embedBlogTitle) post.youtubeTitle = item.embedBlogTitle;
  fs.writeFileSync(BLOG_POSTS_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log(`[publishToSite] Embedded ${videoId} on blog post '${blogSlug}'.`);
}

async function main() {
  const { quizId, opts } = parseArgs(process.argv.slice(2));
  if (!quizId) {
    console.error('Usage: node scripts/video-pipeline/publishToSite.js <quizId> [--privacy public|unlisted]');
    process.exit(1);
  }
  if (!['public', 'unlisted'].includes(opts.privacy)) {
    console.error('--privacy must be public or unlisted (this script is for taking reviewed videos live).');
    process.exit(1);
  }

  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const item = queue.items.find((i) => i.quizId === quizId);
  if (!item) {
    console.error(`No queue item with quizId "${quizId}" in video-queue.json.`);
    process.exit(1);
  }
  if (!item.videoId) {
    console.error(`Queue item "${quizId}" has no videoId yet — it hasn't been uploaded.`);
    process.exit(1);
  }
  if (!item.cardTitle || !item.cardDescription) {
    console.error(
      `Queue item "${quizId}" is missing cardTitle/cardDescription — add short, human-written site copy ` +
      `to content-pipeline/video-queue.json for this item before publishing (no auto-generated copy).`
    );
    process.exit(1);
  }

  console.log(`[publishToSite] Setting ${item.videoId} to ${opts.privacy}...`);
  const youtube = getAuthedYoutube();
  await youtube.videos.update({
    part: ['status'],
    requestBody: { id: item.videoId, status: { privacyStatus: opts.privacy, selfDeclaredMadeForKids: false } },
  });

  await addToVideosPage(item.videoId, item.cardTitle, item.cardDescription);
  if (item.embedHubSlug) embedOnHub(item.embedHubSlug, item.videoId, item);
  if (item.embedBlogSlug) embedOnBlogPost(item.embedBlogSlug, item.videoId, item);

  item.status = 'live';
  item.sitePublishedAt = new Date().toISOString();
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');

  console.log(`[publishToSite] Done. Review the diff, then commit and push to deploy.`);
}

main().catch((err) => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
