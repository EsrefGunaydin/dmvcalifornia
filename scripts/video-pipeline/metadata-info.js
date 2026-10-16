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

function buildInfoVideoMetadata(video, frames) {
  const timestampLines = frames.map(
    ({ beat, startSec }) => `${formatTimestamp(startSec)}  ${beat.onScreen.title || titleCaseFromKey(beat.key)}`
  );

  const links = (video.links || []).map((l) => `🔗 ${l.label} → ${SITE}${l.path}`);

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

  const description = [
    video.description || video.title,
    '',
    ...links,
    `📱 iOS APP → ${APP_URL}`,
    '',
    DIVIDER,
    '📌 JUMP TO ANY SECTION',
    DIVIDER,
    ...timestampLines,
    '',
    DIVIDER,
    '📚 MORE FROM DMV CALIFORNIA',
    DIVIDER,
    `🚗 Free Practice Tests → ${SITE}`,
    `📋 California Driver Handbook → ${SITE}/california-driver-handbook`,
    ...(credits.length ? ['', DIVIDER, '📷 PHOTOS', DIVIDER, `Stock photos and clips from Pexels by ${credits.join(', ')}.`] : []),
    '',
    DIVIDER,
    '',
    video.closing || `Based on the official California DMV requirements, updated for ${new Date().getFullYear()}.`,
  ].join('\n');

  const tags = [...new Set([...(video.tags || ['California DMV']), video.title])];

  return { title: video.title, description, tags };
}

module.exports = { buildInfoVideoMetadata, formatTimestamp };
