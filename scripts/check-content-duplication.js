#!/usr/bin/env node
/**
 * Near-duplicate detector for blog_posts.json.
 *
 * Usage:
 *   node scripts/check-content-duplication.js                  # report clusters, exit 1 if any fail
 *   node scripts/check-content-duplication.js --threshold=0.55 # custom fail threshold (default 0.50)
 *   node scripts/check-content-duplication.js --warn-only      # always exit 0
 *   node scripts/check-content-duplication.js --slug=<slug>    # only compare this post against the rest
 *   node scripts/check-content-duplication.js --json           # machine-readable output
 *
 * Why this exists:
 * Programmatic-SEO clusters (one template applied across 50 states, 177 offices,
 * and so on) are the failure mode that pushed a large share of this site's pages
 * into Google's "Crawled - currently not indexed" bucket. A naive text diff does
 * not catch them, because swapping "Virginia" for "Colorado" throughout makes two
 * identical templates look superficially different.
 *
 * So before comparing, this normalizes the things a template varies: state names,
 * money amounts, durations, years, and agency acronyms all collapse to
 * placeholders. What is left is the sentence skeleton. Two posts that share a
 * skeleton score high no matter which state they are about.
 *
 * Similarity is Jaccard overlap over 5-word shingles, which is standard for
 * near-duplicate detection and stays fast at a few hundred posts.
 */

const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'blog_posts.json');
const SHINGLE_SIZE = 5;
const DEFAULT_THRESHOLD = 0.5;

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];
// Longest first so "West Virginia" is consumed before "Virginia".
const STATES_BY_LENGTH = [...STATES].sort((a, b) => b.length - a.length);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Reduce a post to its sentence skeleton so template clones collide.
 */
function normalize(raw) {
  let t = String(raw || '');

  t = t.replace(/<[^>]+>/g, ' '); // strip HTML
  t = t.replace(/&[a-z]+;|&#\d+;/gi, ' '); // strip entities

  for (const state of STATES_BY_LENGTH) {
    t = t.replace(new RegExp(escapeRegex(state), 'gi'), ' STATE ');
  }

  t = t
    .replace(/\b(?:DMV|BMV|MVC|MVA|MVD|DOL|DOR|DPS|DFA|DLD|SOS|ODOT|SCDMV|NCDMV|WisDOT|ITD|OMV)\b/g, ' AGENCY ')
    .replace(/\$\s?[\d,]+(?:\.\d{2})?/g, ' MONEY ')
    .replace(/\b\d+\s*(?:year|month|day|week|mile|minute|hour)s?\b/gi, ' DURATION ')
    .replace(/\b(?:19|20)\d{2}\b/g, ' YEAR ')
    .replace(/\b\d+(?:\.\d+)?\b/g, ' NUM ')
    .replace(/[^a-z\s]/gi, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  return t;
}

function shingles(text, size = SHINGLE_SIZE) {
  const words = text.split(' ').filter(Boolean);
  const set = new Set();
  if (words.length < size) {
    if (words.length) set.add(words.join(' '));
    return set;
  }
  for (let i = 0; i <= words.length - size; i++) {
    set.add(words.slice(i, i + size).join(' '));
  }
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  let shared = 0;
  for (const s of small) if (large.has(s)) shared++;
  return shared / (a.size + b.size - shared);
}

function main() {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const hit = args.find((a) => a.startsWith(`--${name}=`));
    return hit ? hit.split('=')[1] : null;
  };
  const threshold = parseFloat(getArg('threshold') || DEFAULT_THRESHOLD);
  const warnOnly = args.includes('--warn-only');
  const asJson = args.includes('--json');
  const onlySlug = getArg('slug');

  const data = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  const posts = data.posts
    .filter((p) => p && p.slug && p.content)
    .map((p) => ({ slug: p.slug, shingles: shingles(normalize(p.content)) }));

  const pairs = [];
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      if (onlySlug && posts[i].slug !== onlySlug && posts[j].slug !== onlySlug) continue;
      const score = jaccard(posts[i].shingles, posts[j].shingles);
      if (score >= threshold) pairs.push({ a: posts[i].slug, b: posts[j].slug, score });
    }
  }
  pairs.sort((x, y) => y.score - x.score);

  // Group the flagged pairs into connected clusters.
  const parent = new Map();
  const find = (x) => {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
    return parent.get(x);
  };
  for (const { a, b } of pairs) {
    if (!parent.has(a)) parent.set(a, a);
    if (!parent.has(b)) parent.set(b, b);
    const [ra, rb] = [find(a), find(b)];
    if (ra !== rb) parent.set(ra, rb);
  }
  const clusters = new Map();
  for (const slug of parent.keys()) {
    const root = find(slug);
    if (!clusters.has(root)) clusters.set(root, []);
    clusters.get(root).push(slug);
  }
  const clusterList = [...clusters.values()]
    .map((members) => {
      const inside = pairs.filter((p) => members.includes(p.a) && members.includes(p.b));
      const avg = inside.reduce((s, p) => s + p.score, 0) / (inside.length || 1);
      return { size: members.length, avgSimilarity: avg, members: members.sort() };
    })
    .sort((a, b) => b.size - a.size);

  if (asJson) {
    console.log(JSON.stringify({ threshold, postsScanned: posts.length, clusters: clusterList }, null, 2));
  } else {
    console.log(`Scanned ${posts.length} posts. Flag threshold: ${(threshold * 100).toFixed(0)}% similarity.\n`);
    if (!clusterList.length) {
      console.log('No near-duplicate clusters found.');
    } else {
      for (const c of clusterList) {
        console.log(`Cluster of ${c.size} posts, average similarity ${(c.avgSimilarity * 100).toFixed(1)}%:`);
        for (const m of c.members.slice(0, 12)) console.log(`   ${m}`);
        if (c.members.length > 12) console.log(`   ...and ${c.members.length - 12} more`);
        console.log('');
      }
      console.log(
        'These posts share a sentence skeleton after state names, fees, and dates are\n' +
        'factored out. Rewrite them with genuinely per-page content, or reduce the\n' +
        'number of pages in the cluster.'
      );
    }
  }

  const failed = clusterList.length > 0;
  process.exit(failed && !warnOnly ? 1 : 0);
}

main();
