/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['dmvcalifornia.us'],
  },
  // Ensure trailing slashes match WordPress URLs if needed
  trailingSlash: false,
  // Increase page data size limit for large quiz JSON files
  experimental: {
    largePageDataBytes: 512 * 1000, // 512KB limit (default is 128KB)
  },
  // Consolidate duplicate-title URLs into their pillar pages so the search-
  // engine authority lands in one place instead of being split.
  async redirects() {
    return [
      // Canonical domain: redirect www to non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.dmvcalifornia.us' }],
        destination: 'https://dmvcalifornia.us/:path*',
        permanent: true,
      },
      {
        source: '/drivers-licenses-design-by-state',
        destination: '/drivers-license-by-state',
        permanent: true,
      },
      {
        source: '/california-dmv-sample-questions',
        destination: '/practice-test/california-dmv-sample-questions',
        permanent: true,
      },
      // Spanish practice test consolidation: exam 1 and exam 2 are literal
      // subsets (questions 1-20 and 21-40) of the merged 40-question test,
      // which already holds the strongest ranking signal.
      {
        source: '/practice-test/examen-dmv-espanol-1',
        destination: '/practice-test/dmv-spanish-practice-test-1',
        permanent: true,
      },
      {
        source: '/practice-test/examen-dmv-espanol-2',
        destination: '/practice-test/dmv-spanish-practice-test-1',
        permanent: true,
      },
      {
        source: '/nuevas-leyes-de-transito-california-2025',
        destination: '/nuevas-leyes-de-transito-california-2026',
        permanent: true,
      },
      {
        source: '/drivers-licenses-design-by-state/',
        destination: '/drivers-license-by-state',
        permanent: true,
      },
      // Recover dead legacy WordPress handbook PDF URLs (now 403/404 but still
      // ranking) into the revived, ad-supported HTML handbook pages.
      {
        source: '/wp-content/uploads/2018/02/california-driver-handbook-arabic.pdf',
        destination: '/california-driver-handbook/california-driver-handbook-arabic',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2018/02/california-driver-handbook-chinese.pdf',
        destination: '/california-driver-handbook/california-driver-handbook-chinese',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2018/02/california-driver-handbook-korean.pdf',
        destination: '/california-driver-handbook/california-driver-handbook-korean',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2018/02/california-driver-handbook-farsi.pdf',
        destination: '/california-driver-handbook/california-driver-handbook-farsi',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2018/02/california-driver-handbook-english.pdf',
        destination: '/california-driver-handbook/california-driver-handbook-english',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2020/02/driver-handbook-2020-en.pdf',
        destination: '/california-driver-handbook/california-driver-handbook-english',
        permanent: true,
      },
      // DL-44 application form: recover the dead legacy URL to the working PDF.
      {
        source: '/wp-content/uploads/2018/08/DRIVER-LICENSE-OR-IDENTIFICATION-CARD-APPLICATION-DL-44.pdf',
        destination: '/pdfs/DRIVER-LICENSE-OR-IDENTIFICATION-CARD-APPLICATION-DL-44.pdf',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2018/08/SOLICITUD-DE-LICENCIA-DE-MANEJAR-O-TARJETA-DE-IDENTIDAD.pdf',
        destination: '/pdfs/SOLICITUD-DE-LICENCIA-DE-MANEJAR-O-TARJETA-DE-IDENTIDAD.pdf',
        permanent: true,
      },
      // Recover 7 DMV location pages that have third-party backlinks but no
      // matching blog post or app route. Send them to the office finder so
      // visitors and link equity land somewhere useful instead of a 404.
      { source: '/dmv-sacramento', destination: '/dmv-offices', permanent: true },
      { source: '/santa-ana-dmv', destination: '/dmv-offices', permanent: true },
      { source: '/los-gatos-dmv', destination: '/dmv-offices', permanent: true },
      { source: '/petaluma-dmv', destination: '/dmv-offices', permanent: true },
      { source: '/san-mateo-dmv', destination: '/dmv-offices', permanent: true },
      { source: '/santa-teresa-dmv', destination: '/dmv-offices', permanent: true },
      { source: '/dmv-bell-gardens', destination: '/dmv-offices', permanent: true },
      // Consolidate duplicate-intent driving tips pages: oboe.com's 17 backlinks
      // all point to the longer slug, so that becomes the canonical.
      { source: '/driving-test-tips', destination: '/california-driving-test-tips', permanent: true },
      // Fix content mismatch: backlinks searching santa-ana driving test route
      // should land on laguna hills (the closest match we have).
      { source: '/santa-ana-dmv-driving-test', destination: '/laguna-hills-dmv-driving-test', permanent: true },
    ];
  },
};

export default nextConfig;
