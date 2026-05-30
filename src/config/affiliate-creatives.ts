/**
 * AWIN display-creative registry for <AffiliateBanner>.
 *
 * Each entry holds the AWIN "Copy Code" HTML snippet for one banner. Using the
 * official creative code keeps us compliant (Company-provided creative, used
 * unmodified) and carries AWIN's tracking + the correct landing page per banner.
 *
 * TO ADD A BANNER: paste the AWIN Copy Code into the `code` field below.
 * While `code` is empty, <AffiliateBanner> renders nothing.
 */
export type AffiliateCreative = {
  width: number;
  height: number;
  /** 'traffic-school' → ticket/DUI/traffic-law pages; 'mature-driver' → senior/insurance pages. */
  theme: 'traffic-school' | 'mature-driver';
  /** AWIN "Copy Code" HTML snippet. */
  code: string;
};

export const AFFILIATE_CREATIVES: Record<string, AffiliateCreative> = {
  // General "State-Approved Traffic School & Defensive Driving" creatives —
  // for ticket / DUI / traffic-law pages.
  'ts-300x250': {
    width: 300,
    height: 250,
    theme: 'traffic-school',
    code: '<a rel="sponsored" href="https://www.awin1.com/cread.php?s=4724316&v=125116&q=600121&r=2914013"><img src="https://www.awin1.com/cshow.php?s=4724316&v=125116&q=600121&r=2914013" border="0" alt="IMPROV state-approved traffic school"></a>',
  },
  'ts-728x90': {
    width: 728,
    height: 90,
    theme: 'traffic-school',
    code: '<a rel="sponsored" href="https://www.awin1.com/cread.php?s=4725394&v=125116&q=600121&r=2914013"><img src="https://www.awin1.com/cshow.php?s=4725394&v=125116&q=600121&r=2914013" border="0" alt="IMPROV state-approved traffic school"></a>',
  },
  'ts-320x50': {
    width: 320,
    height: 50,
    theme: 'traffic-school',
    code: '<a rel="sponsored" href="https://www.awin1.com/cread.php?s=4725396&v=125116&q=600121&r=2914013"><img src="https://www.awin1.com/cshow.php?s=4725396&v=125116&q=600121&r=2914013" border="0" alt="IMPROV state-approved traffic school"></a>',
  },

  // CA Mature Driver / auto-insurance creative — for senior-renewal & insurance pages.
  'mature-300x250': {
    width: 300,
    height: 250,
    theme: 'mature-driver',
    code: '<a rel="sponsored" href="https://www.awin1.com/cread.php?s=4742121&v=125116&q=601600&r=2914013"><img src="https://www.awin1.com/cshow.php?s=4742121&v=125116&q=601600&r=2914013" border="0" alt="IMPROV CA mature driver course"></a>',
  },
};
