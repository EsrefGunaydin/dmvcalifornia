/**
 * One-off/idempotent utility: fills in durationSeconds + publishedAt for
 * every entry in src/data/videos.json that's missing them (used by
 * video-sitemap.xml). Safe to re-run any time — already-populated entries
 * are re-fetched too, so it also self-heals if a video's duration ever
 * needed correcting.
 *
 * Usage: node scripts/video-pipeline/backfillVideoMeta.js
 */

const fs = require('fs');
const path = require('path');
const { fetchVideoMeta } = require('./fetchVideoMeta');

const VIDEOS_JSON_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'videos.json');

async function main() {
  const data = JSON.parse(fs.readFileSync(VIDEOS_JSON_PATH, 'utf8'));
  const ids = data.ourVideos.map((v) => v.id);
  const meta = await fetchVideoMeta(ids);

  let updated = 0;
  for (const video of data.ourVideos) {
    const m = meta[video.id];
    if (!m) {
      console.warn(`[backfillVideoMeta] No metadata returned for ${video.id} (deleted/private?), skipping.`);
      continue;
    }
    video.durationSeconds = m.durationSeconds;
    video.publishedAt = m.publishedAt;
    updated++;
  }

  fs.writeFileSync(VIDEOS_JSON_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log(`[backfillVideoMeta] Updated ${updated}/${data.ourVideos.length} videos with duration + publish date.`);
}

main().catch((err) => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
