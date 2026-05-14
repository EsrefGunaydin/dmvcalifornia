#!/usr/bin/env node
/**
 * Backfill (or regenerate) blog hero images from Pexels.
 *
 * Usage:
 *   PEXELS_API_KEY=xxx node scripts/backfill-blog-images.js          # only posts missing or with broken hero_image
 *   PEXELS_API_KEY=xxx node scripts/backfill-blog-images.js --force  # regenerate every post
 *   PEXELS_API_KEY=xxx node scripts/backfill-blog-images.js --slug=<slug>  # just one post
 *
 * Reads PEXELS_API_KEY from .env.local (via dotenv) or the environment.
 *
 * What it does, per post:
 *   1. Build a Pexels search query from the post's title + primary tag
 *   2. Call Pexels search API (landscape, large size)
 *   3. Download top result
 *   4. Crop + resize to 1200x630 (OpenGraph spec) and convert to WebP
 *   5. Save to public/images/blog/blog-<slug>.webp
 *   6. Update the post's hero_image field in src/data/blog_posts.json
 *
 * Idempotent: re-running without --force only touches posts that don't
 * yet have a blog-<slug>.webp file.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Load .env.local if present (Next.js style)
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
} catch (_) {
  // dotenv is optional; env can be supplied via shell
}

const PEXELS_KEY = process.env.PEXELS_API_KEY;
if (!PEXELS_KEY) {
  console.error('❌ PEXELS_API_KEY not set. Add it to .env.local or pass it inline.');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const POSTS_FILE = path.join(ROOT, 'src', 'data', 'blog_posts.json');
const IMG_DIR = path.join(ROOT, 'public', 'images', 'blog');

const FORCE = process.argv.includes('--force');
const slugArg = process.argv.find((a) => a.startsWith('--slug='));
const ONLY_SLUG = slugArg ? slugArg.split('=')[1] : null;

// Strip common SEO suffixes & noise so the Pexels query is cleaner
function buildQuery(post) {
  const tag = (post.tags && post.tags[0]) || 'California DMV';
  // Title → search query — strip "California", ":", "2026", numbers, parenthetical content
  let title = post.title
    .replace(/\([^)]*\)/g, '')           // parenthetical native-language hints
    .replace(/[#:\-—]/g, ' ')
    .replace(/\b20\d{2}\b/g, '')         // years
    .replace(/\s+/g, ' ')
    .trim();

  // Per-tag query overrides for higher-quality matches
  const tagOverrides = {
    'Real ID': 'driver license card identification',
    'Driver License': 'driver license california road',
    'Driving Test': 'driving test student car',
    'Written Test': 'student studying notebook test',
    'Traffic Laws': 'highway traffic signs california',
    'Traffic Signs': 'highway road signs traffic',
    'Vehicle Registration': 'car registration paperwork',
    'Insurance': 'car insurance documents',
    'Tips': 'driving safety road tips',
    'Road Safety': 'highway safety driver',
    'DMV Services': 'office paperwork service desk',
    'DMV Appointments': 'office desk meeting paperwork',
    'DMV Kiosk': 'self service kiosk machine',
    'DMV Guide': 'paperwork desk guide',
    'DMV Information': 'paperwork document desk',
    'License Renewal': 'driver license renewal id card',
    'Fees': 'paperwork money receipt',
    'Wait Times': 'office waiting room people',
    'Car Accidents': 'car accident damaged vehicle',
    'International Students': 'international student driving studying',
    'Government Services': 'government office building',
    'California DMV': 'california highway dmv driving',
  };

  const tagQuery = tagOverrides[tag] || tag.toLowerCase();
  // Use the tag-derived phrase + a short title fragment to keep relevance
  const titleWords = title.split(' ').slice(0, 4).join(' ');
  return `${tagQuery} ${titleWords}`.replace(/\s+/g, ' ').trim();
}

async function fetchPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=large&per_page=5`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) {
    throw new Error(`Pexels API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  if (!data.photos || data.photos.length === 0) {
    return null;
  }
  // Prefer the top result; could randomize if you want variety on repeated runs
  return data.photos[0];
}

async function downloadAndConvert(photo, outPath) {
  // photo.src.large2x = ~1880x1257 — plenty for a 1200x630 crop
  const sourceUrl = photo.src.large2x || photo.src.large || photo.src.original;
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Download ${res.status} from ${sourceUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82 })
    .toFile(outPath);
}

async function processPost(post, isLast) {
  const slug = post.slug;
  if (ONLY_SLUG && slug !== ONLY_SLUG) return null;

  const outPath = path.join(IMG_DIR, `blog-${slug}.webp`);
  const relPath = `/images/blog/blog-${slug}.webp`;
  const alreadyHasGenerated = fs.existsSync(outPath);

  if (alreadyHasGenerated && !FORCE) {
    // Already generated — just update hero_image if it isn't set
    if (post.hero_image !== relPath) {
      post.hero_image = relPath;
      return { slug, action: 'updated-field-only' };
    }
    return { slug, action: 'skipped' };
  }

  const query = buildQuery(post);
  try {
    const photo = await fetchPexels(query);
    if (!photo) {
      console.warn(`⚠️  No Pexels match for "${slug}" (query: ${query})`);
      return { slug, action: 'no-match', query };
    }

    await downloadAndConvert(photo, outPath);
    post.hero_image = relPath;
    // Persist source credit in a sidecar field (not required by license but courteous + future-proof)
    post.hero_image_credit = {
      source: 'Pexels',
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      photo_url: photo.url,
    };

    return { slug, action: 'generated', query, by: photo.photographer };
  } catch (err) {
    console.error(`❌  ${slug}: ${err.message}`);
    return { slug, action: 'error', error: err.message };
  } finally {
    // Pexels free tier: 200 req/hr = ~3.3/min. Throttle to ~1.5/sec to be safe and polite.
    if (!isLast) await new Promise((r) => setTimeout(r, 700));
  }
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
  const json = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const posts = json.posts;

  console.log(`Processing ${posts.length} posts. Force=${FORCE}, OnlySlug=${ONLY_SLUG || '<none>'}`);

  const results = [];
  for (let i = 0; i < posts.length; i++) {
    const result = await processPost(posts[i], i === posts.length - 1);
    if (result) results.push(result);
  }

  // Write the JSON back with same formatting (2-space indent matches existing file)
  fs.writeFileSync(POSTS_FILE, JSON.stringify(json, null, 2) + '\n', 'utf-8');

  const byAction = results.reduce((acc, r) => {
    acc[r.action] = (acc[r.action] || 0) + 1;
    return acc;
  }, {});
  console.log('\n--- Summary ---');
  for (const [k, v] of Object.entries(byAction)) {
    console.log(`  ${k}: ${v}`);
  }
  const errors = results.filter((r) => r.action === 'error' || r.action === 'no-match');
  if (errors.length) {
    console.log('\n--- Needs attention ---');
    errors.forEach((e) => console.log(`  ${e.slug}: ${e.action} (${e.query || e.error || ''})`));
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
