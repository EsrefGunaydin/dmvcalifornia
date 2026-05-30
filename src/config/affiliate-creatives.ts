/**
 * AWIN display-creative registry for <AffiliateBanner>.
 *
 * Each entry holds the AWIN "Copy Code" HTML snippet for one banner. Using the
 * official creative code keeps us compliant (Company-provided creative, used
 * unmodified) and carries AWIN's tracking + the correct landing page per banner.
 *
 * TO ACTIVATE A BANNER: paste the AWIN Copy Code into the `code` field below.
 * While `code` is empty, <AffiliateBanner> renders nothing — so it's safe to
 * place the component in pages before the codes are filled in.
 */
export type AffiliateCreative = {
  width: number;
  height: number;
  /** 'traffic-school' → ticket/DUI/traffic-law pages; 'mature-driver' → senior/insurance pages. */
  theme: 'traffic-school' | 'mature-driver';
  /** Paste the AWIN "Copy Code" HTML snippet here. */
  code: string;
};

export const AFFILIATE_CREATIVES: Record<string, AffiliateCreative> = {
  // General "State-Approved Traffic School & Defensive Driving" creatives —
  // for ticket / DUI / traffic-law pages.
  'ts-300x250': { width: 300, height: 250, theme: 'traffic-school', code: '' },
  'ts-728x90': { width: 728, height: 90, theme: 'traffic-school', code: '' },
  'ts-320x50': { width: 320, height: 50, theme: 'traffic-school', code: '' },

  // CA Mature Driver / auto-insurance creative — for senior-renewal & insurance pages.
  'mature-300x250': { width: 300, height: 250, theme: 'mature-driver', code: '' },
};
