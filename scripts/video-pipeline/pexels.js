// Pexels lookups for info videos: one landscape photo for a picture beat or
// grid tile (`findPexelsPhoto`), and one HD clip for a beat's moving
// background (`findPexelsVideo`). Pexels media is free to use; the creator
// is recorded so the YouTube description can credit them.

const fs = require('fs');

function headers() {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error('PEXELS_API_KEY not set (check .env.local)');
  return { Authorization: apiKey };
}

async function findPexelsPhoto(query) {
  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('size', 'large');
  url.searchParams.set('per_page', '5');
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Pexels photo search failed (${res.status}) for "${query}"`);
  const data = await res.json();
  const photo = (data.photos || [])[0];
  if (!photo) return null;
  return {
    url: photo.src.large2x,
    alt: photo.alt || query,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
    query,
  };
}

// Picks the first result at least `minSeconds` long that has an HD file
// (1280 wide or more), preferring the largest file up to 1920 wide.
async function findPexelsVideo(query, { minSeconds = 6, skip = 0 } = {}) {
  const url = new URL('https://api.pexels.com/videos/search');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('size', 'medium');
  url.searchParams.set('per_page', '10');
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Pexels video search failed (${res.status}) for "${query}"`);
  const data = await res.json();
  const candidates = (data.videos || []).filter((v) => v.duration >= minSeconds).slice(skip);
  for (const v of candidates) {
    const files = v.video_files
      .filter((f) => f.width >= 1280 && f.width <= 1920 && /mp4/.test(f.file_type))
      .sort((a, b) => b.width - a.width);
    if (!files.length) continue;
    const f = files[0];
    return {
      id: v.id,
      url: f.link,
      width: f.width,
      height: f.height,
      seconds: v.duration,
      photographer: v.user && v.user.name,
      photographerUrl: v.user && v.user.url,
      pexelsUrl: v.url,
      query,
    };
  }
  return null;
}

async function downloadFile(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
  return outPath;
}

module.exports = { findPexelsPhoto, findPexelsVideo, downloadFile };
