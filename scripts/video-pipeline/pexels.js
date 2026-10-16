// Picks a landscape stock photo from Pexels for an image beat whose
// `imageQuery` is set and `image` is not. Used sparingly: most slides are
// animated text; photos only where they add something (a document pile, a
// DMV queue). Pexels photos are free to use; the photographer is recorded so
// the YouTube description can credit them.

async function findPexelsPhoto(query) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error('PEXELS_API_KEY not set (check .env.local)');

  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('size', 'large');
  url.searchParams.set('per_page', '5');

  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) throw new Error(`Pexels search failed (${res.status}) for "${query}"`);
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

module.exports = { findPexelsPhoto };
