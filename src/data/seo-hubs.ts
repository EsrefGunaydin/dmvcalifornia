/**
 * Keyword-targeted SEO hub pages (DMV-blue themed). Each hub is one high-volume
 * keyword's "front door": a California-specific landing page that funnels into
 * our existing tests/tools, mirroring how driving-tests.org / bestdmvtests.com
 * rank for these terms. Add a new keyword = add a config here + a thin page that
 * renders <KeywordHub config={...} />.
 */

export interface HubCard {
  href: string;
  label: string;
  questions?: number;
  /** extra pill beyond the green FREE badge, e.g. "2026 NEW" */
  badge?: string;
  description?: string;
}

export interface HubSection {
  title: string;
  subtitle?: string;
  cards: HubCard[];
  /** render as the big "full test" cards (default) or compact topic chips */
  variant?: 'cards' | 'compact';
}

export interface HubLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface HubFaq {
  q: string;
  a: string;
}

export interface HubSidebarList {
  title: string;
  items: string[];
}

export interface VehicleTab {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

export interface KeywordHub {
  /** URL: /<slug> */
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  breadcrumbLabel: string;
  h1: string;
  heroSubtitle: string;
  /** short, honest trust line — NO fabricated ratings */
  trustLine: string;
  vehicleTabs: VehicleTab[];
  sections: HubSection[];
  sidebarRequirements: HubSidebarList[];
  helpfulResources: HubLink[];
  faq: HubFaq[];
  related: HubLink[];
}

const CA_REQUIREMENTS: HubSidebarList[] = [
  {
    title: 'Age Requirements',
    items: [
      '15½ years old for a learner’s permit',
      '16 years old for a provisional license',
      '18 years old for a full license',
    ],
  },
  {
    title: 'Required Documents',
    items: [
      'Proof of identity (birth certificate, passport, etc.)',
      'Proof of your Social Security number',
      'Proof of California residency (1–2 documents)',
      'Certificate of Completion of Driver Education (if under 17½)',
      'Completed Form DL 44 (application form)',
      'Proof of auto insurance for the driving test',
    ],
  },
];

const CA_HELPFUL_RESOURCES: HubLink[] = [
  { href: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/', label: 'Official CA Driver Handbook', external: true },
  { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet' },
  { href: '/california-dmv-fees', label: 'DMV Fees' },
  { href: '/california-drivers-license-renewal-2026', label: 'License Renewal Guide' },
  { href: '/dmv-offices', label: 'Find a DMV Office' },
];

const CA_VEHICLE_TABS: VehicleTab[] = [
  { label: 'Car', icon: '🚗', href: '/california-dmv-practice-test', active: true },
  { label: 'Motorcycle', icon: '🏍️', href: '/practice-test/motorcycle-class-m-test-1' },
  { label: 'CDL', icon: '🚛', href: '/practice-test/commercial-class-a-b-test-1' },
];

export const HUBS: Record<string, KeywordHub> = {
  'california-dmv-practice-test': {
    slug: 'california-dmv-practice-test',
    metaTitle: 'Free California DMV Practice Test 2026 (Real Questions) | DMV California',
    metaDescription:
      'Free California DMV practice test, updated for 2026. Real exam-style questions with instant answers and explanations — full tests, topic tests, road signs, and a marathon. No signup.',
    keywords: [
      'california dmv practice test',
      'free california dmv practice test',
      'california dmv test 2026',
      'ca dmv permit practice test',
      'california driving test practice',
    ],
    breadcrumbLabel: 'California',
    h1: 'Start Your Free 2026 California (CA) DMV Practice Test',
    heroSubtitle:
      'Practice with real exam-style questions that mirror the California DMV written test — same format, same difficulty, same tricky answer choices. Free, unlimited, no signup.',
    trustLine: '100% free · No signup · Updated for 2026 · Based on the official California Driver Handbook',
    vehicleTabs: CA_VEHICLE_TABS,
    sections: [
      {
        title: 'Full Practice Tests',
        subtitle: 'Start here — each test mirrors the real 46-question California DMV written exam.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/california-dmv-practice-test-2026', label: 'CA DMV Practice Test 2026', questions: 48, badge: '2026 NEW' },
          { href: '/practice-test/dmv-simulation-test-1', label: 'CA DMV Simulation Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'CA DMV Simulation Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'CA DMV Simulation Test 3', questions: 46 },
          { href: '/practice-test/california-dmv-sample-questions', label: 'CA DMV Sample Questions', questions: 40 },
          { href: '/practice-test/practice-test-mixed-review', label: 'Mixed Review Test', questions: 63 },
        ],
      },
      {
        title: 'Practice by Topic',
        subtitle: 'Target the subjects people miss most.',
        variant: 'compact',
        cards: [
          { href: '/practice-test/practice-test-road-signs-and-markings', label: 'Road Signs & Markings', questions: 20 },
          { href: '/practice-test/practice-test-traffic-signs-and-signals', label: 'Traffic Signs & Signals', questions: 20 },
          { href: '/practice-test/practice-test-right-of-way-and-intersections', label: 'Right-of-Way & Intersections', questions: 20 },
          { href: '/practice-test/practice-test-parking-and-vehicle-control', label: 'Parking & Vehicle Control', questions: 18 },
          { href: '/practice-test/practice-test-speed-limits-and-traffic-laws', label: 'Speed Limits & Traffic Laws', questions: 15 },
          { href: '/practice-test/practice-test-dui-laws-and-safety-requirements', label: 'DUI Laws & Safety', questions: 13 },
          { href: '/practice-test/practice-test-safe-driving-and-defensive-techniques', label: 'Safe & Defensive Driving', questions: 19 },
          { href: '/practice-test/practice-test-sharing-the-road', label: 'Sharing the Road', questions: 15 },
          { href: '/practice-test/practice-test-freeway-driving-and-merging', label: 'Freeway Driving & Merging', questions: 14 },
          { href: '/practice-test/practice-test-pedestrians-and-bicycles', label: 'Pedestrians & Bicycles', questions: 14 },
          { href: '/practice-test/practice-test-railroad-crossings-and-school-zones', label: 'Railroad Crossings & School Zones', questions: 15 },
          { href: '/practice-test/practice-test-weather-and-night-driving', label: 'Weather & Night Driving', questions: 14 },
        ],
      },
      {
        title: 'More Free Study Tools',
        subtitle: 'Drill signs, beat the hardest questions, and run the marathon.',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California signs with real images.' },
          { href: '/california-dmv-marathon-test', label: 'Marathon Test', description: 'Every question until you master them all.' },
          { href: '/20-hardest-dmv-written-test-questions', label: '20 Hardest Questions', description: 'The trickiest, most-missed questions.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Every key number and rule on one page.' },
          { href: '/california-dmv-test-study-guide', label: 'Study Guide', description: 'A simple 7-step plan to test day.' },
          { href: '/california-dmv-fees', label: 'DMV Fees', description: 'License, renewal, REAL ID & registration costs.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      {
        q: 'How many questions are on the California DMV written test?',
        a: 'The California DMV written test has 46 multiple-choice questions, and you need 38 correct (about 83%) to pass. Applicants 18 and older may receive a 36-question version, requiring 30 correct to pass.',
      },
      {
        q: 'Is this California DMV practice test free?',
        a: 'Yes — every practice test here is 100% free, unlimited, and needs no signup. You can retake them as many times as you like, and the questions and answers reshuffle each time.',
      },
      {
        q: 'Are these practice questions like the real DMV test?',
        a: 'Yes. Our questions are written to mirror the real California DMV exam and are based on the 2026 California Driver Handbook — covering road signs, right-of-way, parking, speed limits, DUI laws, and safe driving.',
      },
      {
        q: 'What score do I need to pass the California DMV test?',
        a: 'You need to answer about 83% of questions correctly — 38 out of 46 (or 30 out of 36 on the shorter version for applicants 18+).',
      },
      {
        q: 'What is the best way to study for the California DMV test?',
        a: 'Take full practice tests, drill the road signs, and read the explanation for every question — even the ones you get right. Finish with the 20 hardest questions and the marathon test so no question type can surprise you.',
      },
    ],
    related: [
      { href: '/practice-test', label: 'All Practice Tests' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/california-dmv-test-study-guide', label: 'Study Guide' },
      { href: '/muestra-del-examen-escrito-para-licencia-de-manejar', label: 'Examen en Español' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },
};

export const HUB_SLUGS = Object.keys(HUBS);
export function getHub(slug: string): KeywordHub | undefined {
  return HUBS[slug];
}
