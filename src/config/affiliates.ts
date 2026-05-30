/**
 * Central affiliate-link registry.
 *
 * Content links to internal cloaked paths like `/go/aceable`; the route at
 * src/app/go/[slug]/route.ts looks the slug up here and 302-redirects to `url`.
 *
 * TO ADD YOUR REAL AFFILIATE LINK: just replace the `url` for that slug below
 * and set `isPlaceholder: false`. Nothing else needs to change — every link in
 * every article updates automatically.
 *
 * Until then, each `url` points to the school's normal homepage, so the buttons
 * already work for visitors (they just don't earn commission yet).
 */
export type Affiliate = {
  /** Display name shown on buttons/cards. */
  name: string;
  /** Destination URL. Replace with your tracking/affiliate link once approved. */
  url: string;
  /** True while `url` is still the plain homepage (no commission tracking yet). */
  isPlaceholder: boolean;
};

export const AFFILIATES: Record<string, Affiliate> = {
  aceable: {
    name: 'Aceable',
    url: 'https://www.aceable.com/traffic-school/california/',
    isPlaceholder: true,
  },
  idrivesafely: {
    name: 'I Drive Safely',
    url: 'https://www.idrivesafely.com/traffic-school/california',
    isPlaceholder: true,
  },
  improv: {
    name: 'Improv Traffic School',
    // Live AWIN affiliate link (earns commission).
    url: 'https://www.awin1.com/cread.php?awinmid=125116&awinaffid=2914013&campaign=CA+Mature+Driver+Deal',
    isPlaceholder: false,
  },
  besttrafficschool: {
    name: 'Best Traffic School',
    // Applied directly — replace with your affiliate tracking link once approved.
    url: 'https://www.besttrafficschool.com/',
    isPlaceholder: true,
  },
  // Not a traffic school — a traffic-ticket legal-defense subscription. Promoted
  // separately (the "fight the ticket" angle), never in the school comparison.
  autoallies: {
    name: 'Auto Allies',
    url: 'https://autoallies.com',
    isPlaceholder: true,
  },
};

export const AFFILIATE_FALLBACK_URL = 'https://www.dmvcalifornia.us/';
