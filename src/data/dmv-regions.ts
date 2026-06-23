import officesData from './dmv_offices.json';

export type RegionKey =
  | 'los-angeles'
  | 'orange-county'
  | 'san-diego'
  | 'inland-empire'
  | 'central-coast'
  | 'central-valley'
  | 'bay-area'
  | 'sacramento';

export interface DmvOffice {
  id: number;
  name: string;
  slug: string;
  phone: string;
  hours: string;
  address: string;
  services: string[];
  hours_detailed?: Record<string, string>;
  has_kiosk?: boolean;
}

export interface RegionConfig {
  key: RegionKey;
  /** URL segment: /dmv-offices/<slug> */
  slug: RegionKey;
  /** Display name, e.g. "Los Angeles County" */
  name: string;
  /** Short label for nav chips */
  shortName: string;
  /** Major cities/keywords for the intro + meta */
  intro: string;
}

// ZIP3 prefix → region. Clean for most of California; metro-border ZIP3s are
// corrected by CITY_OVERRIDE below.
const ZIP3_REGION: Record<string, RegionKey> = {
  '900': 'los-angeles', '902': 'los-angeles', '903': 'los-angeles', '904': 'los-angeles',
  '905': 'los-angeles', '906': 'los-angeles', '907': 'los-angeles', '908': 'los-angeles',
  '911': 'los-angeles', '912': 'los-angeles', '913': 'los-angeles', '914': 'los-angeles',
  '917': 'los-angeles',
  '926': 'orange-county', '927': 'orange-county', '928': 'orange-county',
  '919': 'san-diego', '920': 'san-diego', '921': 'san-diego',
  '922': 'inland-empire', '923': 'inland-empire', '924': 'inland-empire', '925': 'inland-empire',
  '930': 'central-coast', '931': 'central-coast', '934': 'central-coast', '939': 'central-coast',
  '932': 'central-valley', '933': 'central-valley', '935': 'central-valley', '936': 'central-valley',
  '937': 'central-valley', '952': 'central-valley', '953': 'central-valley',
  '940': 'bay-area', '941': 'bay-area', '944': 'bay-area', '945': 'bay-area', '946': 'bay-area',
  '949': 'bay-area', '950': 'bay-area', '951': 'bay-area',
  '954': 'sacramento', '955': 'sacramento', '956': 'sacramento', '957': 'sacramento',
  '958': 'sacramento', '959': 'sacramento', '960': 'sacramento', '961': 'sacramento',
};

// City (lowercase) → region, overriding ZIP3 where a prefix straddles a boundary.
const CITY_OVERRIDE: Record<string, RegionKey> = {
  'rancho cucamonga': 'inland-empire',
  'norco': 'inland-empire',
  'thousand oaks': 'central-coast',
  'lancaster': 'los-angeles',
  'bishop': 'central-valley',
  'ridgecrest': 'central-valley',
  'capitola': 'central-coast',
  'watsonville': 'central-coast',
  'hollister': 'central-coast',
  'santa rosa': 'bay-area',
};

// Office name → region for the few records with empty/non-standard addresses.
const NAME_OVERRIDE: Record<string, RegionKey> = {
  'Granada Hills Driver License Processing Center': 'los-angeles',
  'Laguna Hills': 'orange-county',
  'Stanton Driver License Processing Center': 'orange-county',
  'San Marcos Rancheros': 'san-diego',
  'San Jose Driver License Processing Center': 'bay-area',
  'Walnut Creek': 'bay-area',
  'Paradise': 'sacramento',
  'Tulelake': 'sacramento',
};

export function regionForOffice(office: DmvOffice): RegionKey {
  if (NAME_OVERRIDE[office.name]) return NAME_OVERRIDE[office.name];
  const m = office.address.match(/,\s*([^,]+),\s*CA\s*(\d{5})/);
  const city = m ? m[1].trim().toLowerCase() : '';
  if (CITY_OVERRIDE[city]) return CITY_OVERRIDE[city];
  const zip3 = m ? m[2].slice(0, 3) : '';
  // Default to Sacramento/Northern only as a last resort; every current office
  // resolves above, so this fallback is effectively unreachable.
  return ZIP3_REGION[zip3] || 'sacramento';
}

export const REGIONS: RegionConfig[] = [
  {
    key: 'los-angeles', slug: 'los-angeles', name: 'Los Angeles County', shortName: 'Los Angeles',
    intro:
      'Find every DMV office across Los Angeles County — including Downtown LA, Hollywood, the San Fernando Valley, the South Bay, Long Beach, Pasadena, and the Antelope Valley. Phone numbers, hours, services, and how to book an appointment for each location.',
  },
  {
    key: 'orange-county', slug: 'orange-county', name: 'Orange County', shortName: 'Orange County',
    intro:
      'Every DMV office in Orange County — Santa Ana, Costa Mesa, Fullerton, Westminster, San Clemente and more. Get hours, phone numbers, services, and appointment links for each OC location.',
  },
  {
    key: 'san-diego', slug: 'san-diego', name: 'San Diego County', shortName: 'San Diego',
    intro:
      'DMV offices throughout San Diego County — San Diego, Chula Vista, El Cajon, Oceanside, Poway, San Ysidro and more. Hours, phone numbers, services, and appointment information for each location.',
  },
  {
    key: 'inland-empire', slug: 'inland-empire', name: 'Inland Empire & Desert', shortName: 'Inland Empire',
    intro:
      'DMV offices across Riverside, San Bernardino, and Imperial counties — Riverside, San Bernardino, Fontana, Victorville, Temecula, Palm Springs, El Centro and more. Hours, phone numbers, and appointments for each location.',
  },
  {
    key: 'central-coast', slug: 'central-coast', name: 'Central Coast & Ventura', shortName: 'Central Coast',
    intro:
      'DMV offices along California’s Central Coast and Ventura County — Ventura, Oxnard, Santa Barbara, San Luis Obispo, Santa Maria, Salinas, Santa Cruz and more. Hours, phone numbers, and appointment links for each location.',
  },
  {
    key: 'central-valley', slug: 'central-valley', name: 'Central Valley', shortName: 'Central Valley',
    intro:
      'DMV offices throughout California’s Central Valley — Fresno, Bakersfield, Stockton, Modesto, Visalia, Merced, Clovis and more. Get hours, phone numbers, services, and appointment information for each location.',
  },
  {
    key: 'bay-area', slug: 'bay-area', name: 'San Francisco Bay Area', shortName: 'Bay Area',
    intro:
      'Every DMV office in the San Francisco Bay Area — San Francisco, Oakland, San Jose, Fremont, Concord, San Mateo, Santa Rosa and more. Hours, phone numbers, services, and how to book an appointment.',
  },
  {
    key: 'sacramento', slug: 'sacramento', name: 'Sacramento & Northern California', shortName: 'Sacramento & North',
    intro:
      'DMV offices across Sacramento and Northern California — Sacramento, Roseville, Folsom, Davis, Chico, Redding, Eureka, Santa Rosa’s northern neighbors and the Sierra. Hours, phone numbers, and appointment links for each location.',
  },
];

const OFFICES = officesData.offices as DmvOffice[];

export function getRegion(slug: string): RegionConfig | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

/** Offices in a region, alphabetised by name. */
export function officesInRegion(key: RegionKey): DmvOffice[] {
  return OFFICES.filter((o) => regionForOffice(o) === key).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** The region a given office slug belongs to (for the office-page backlink). */
export function regionOfOfficeSlug(officeSlug: string): RegionConfig | undefined {
  const office = OFFICES.find((o) => o.slug === officeSlug);
  if (!office) return undefined;
  return getRegion(regionForOffice(office));
}
