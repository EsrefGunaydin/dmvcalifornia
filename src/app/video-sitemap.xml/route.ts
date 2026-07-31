import videosData from '@/data/videos.json';

const BASE_URL = 'https://dmvcalifornia.us';

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  durationSeconds?: number;
  publishedAt?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// One <url> for /videos with every video nested as its own <video:video> —
// the page that "hosts" all of them (thumbnail + title + description card
// linking to YouTube), per Google's video sitemap spec for multi-video pages.
export async function GET() {
  const videos = videosData.ourVideos as VideoEntry[];

  const videoBlocks = videos
    .map((v) => {
      const duration = v.durationSeconds ? `\n      <video:duration>${v.durationSeconds}</video:duration>` : '';
      const pubDate = v.publishedAt ? `\n      <video:publication_date>${v.publishedAt}</video:publication_date>` : '';
      return `    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/${v.id}/hqdefault.jpg</video:thumbnail_loc>
      <video:title>${escapeXml(v.title)}</video:title>
      <video:description>${escapeXml(v.description)}</video:description>
      <video:player_loc>https://www.youtube.com/embed/${v.id}</video:player_loc>${duration}${pubDate}
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${BASE_URL}/videos</loc>
${videoBlocks}
  </url>
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
