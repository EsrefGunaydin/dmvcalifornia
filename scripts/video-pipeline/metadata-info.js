// YouTube title/description builder for informational (non-quiz) videos.
// Mirrors metadata.js's timestamp-list idea but without the quiz-specific
// per-question jump list or multi-language MORE_TESTS block. Everything
// video-specific (hook paragraph, links, tags, closing line) comes from the
// video JSON, so one builder serves every info video.

function formatTimestamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const DIVIDER = '─'.repeat(38);
const SITE = 'https://dmvcalifornia.us';
const APP_URL = 'https://apps.apple.com/app/dmv-california/id6754900213';

function titleCaseFromKey(key) {
  return key
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

// No emojis: plain section headers, so the description reads cleanly in
// search results and in YouTube's collapsed view.
function buildInfoVideoMetadata(video, frames) {
  const timestampLines = frames.map(
    ({ beat, startSec }) => `${formatTimestamp(startSec)} ${beat.chapter || beat.onScreen.title || titleCaseFromKey(beat.key)}`
  );

  const siteLinks = (video.links || []).map((l) => `${l.label}: ${SITE}${l.path}`);
  const officialLinks = (video.officialLinks || []).map((l) => `${l.label}: ${l.url}`);

  const credits = [];
  const seen = new Set();
  for (const beat of video.beats) {
    const media = [beat.image, beat.clip, ...(beat.tiles || []).map((t) => t.image)];
    for (const m of media) {
      if (m && m.photographer && !seen.has(m.photographer)) {
        seen.add(m.photographer);
        credits.push(`${m.photographer} (${m.pexelsUrl || m.photographerUrl || 'Pexels'})`);
      }
    }
  }

  const section = (title, lines) => (lines.length ? ['', title.toUpperCase(), ...lines] : []);
  const description = [
    video.description || video.title,
    '',
    `Full guide and free practice tests: ${SITE}`,
    ...section('Chapters', timestampLines),
    ...section('Official California DMV pages', officialLinks),
    ...section('Guides on dmvcalifornia.us', [
      ...siteLinks,
      `California Driver Handbook: ${SITE}/california-driver-handbook`,
      `Free DMV practice tests: ${SITE}`,
    ]),
    ...section('Free iOS app', [`DMV California for iPhone: ${APP_URL}`]),
    ...section('Credits', credits.length ? [`Stock photos and clips from Pexels by ${credits.join(', ')}.`] : []),
    '',
    video.closing || `Based on the official California DMV requirements, updated for ${new Date().getFullYear()}.`,
    'dmvcalifornia.us is an independent study site and is not affiliated with the California DMV.',
  ].join('\n');

  const tags = [...new Set([...(video.tags || ['California DMV']), video.title])];

  return { title: video.title, description, tags };
}

module.exports = { buildInfoVideoMetadata, formatTimestamp };
