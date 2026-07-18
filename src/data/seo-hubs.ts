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
  /** YouTube video ID to embed on this hub page */
  youtubeId?: string;
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

const STATE_REQUIREMENTS: HubSidebarList[] = [
  {
    title: 'What to bring to the DMV',
    items: [
      'Proof of identity (passport, birth certificate, or similar)',
      'Social Security card or number',
      'Two proofs of state residency (utility bill, bank statement)',
      'Completed state application form',
      'Application fee (check your state DMV website for current amount)',
    ],
  },
  {
    title: 'Knowledge test basics',
    items: [
      'Study your state driver handbook',
      'Road signs are federally standardized — same in all 50 states',
      'Bring valid ID on test day',
      'Most states allow 2 to 3 attempts per application before you must reapply',
      'Test is taken on a computer terminal at most DMV offices',
    ],
  },
];

const STATE_HELPFUL_RESOURCES: HubLink[] = [
  { href: '/practice-test', label: 'Free practice tests' },
  { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
  { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
];

export const HUBS: Record<string, KeywordHub> = {
  'california-dmv-practice-test': {
    slug: 'california-dmv-practice-test',
    youtubeId: 'AAYjx6l9X5g',
    metaTitle: 'Free California DMV Practice Test 2026 — Class C Knowledge Test | DMV California',
    metaDescription:
      'Free California DMV practice test (Class C knowledge test), updated for 2026. Real exam-style questions with instant answers — full tests, permit test, topic tests, road signs, and a marathon. No signup.',
    keywords: [
      'california dmv practice test',
      'free california dmv practice test',
      'california dmv knowledge test',
      'california dmv test 2026',
      'ca dmv permit practice test',
      'dmv class c practice test california',
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

  'california-permit-test': {
    slug: 'california-permit-test',
    metaTitle: 'California DMV Permit Test 2026 — Free Practice (Real Knowledge Test Questions)',
    metaDescription:
      'Free California DMV permit practice test for 2026. Real knowledge test questions for your learner\'s permit — 46 questions, instant answers, no signup required.',
    keywords: [
      'california permit test',
      'dmv permit test california',
      'california dmv permit practice test',
      'permit practice test california',
      'dmv permit test practice',
      'california dmv permit test 2026',
    ],
    breadcrumbLabel: 'Permit Test',
    h1: 'Free California DMV Permit Test 2026',
    heroSubtitle:
      'Practice for your California learner\'s permit knowledge test — real exam-style questions, same format as the official DMV test, instant answers. 100% free, no signup.',
    trustLine: 'Free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'Car', icon: '🚗', href: '/california-permit-test', active: true },
      { label: 'Motorcycle', icon: '🏍️', href: '/practice-test/motorcycle-class-m-test-1' },
      { label: 'CDL', icon: '🚛', href: '/practice-test/commercial-class-a-b-test-1' },
    ],
    sections: [
      {
        title: 'Full Permit Practice Tests',
        subtitle: 'Each test mirrors the real 46-question California knowledge test format.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/california-dmv-practice-test-2026', label: 'CA Permit Test 2026', questions: 48, badge: '2026 NEW' },
          { href: '/practice-test/dmv-simulation-test-1', label: 'Permit Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Permit Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Permit Practice Test 3', questions: 46 },
          { href: '/practice-test/california-dmv-sample-questions', label: 'Sample Permit Questions', questions: 40 },
          { href: '/practice-test/practice-test-mixed-review', label: 'Mixed Review Test', questions: 63 },
        ],
      },
      {
        title: 'Study by Topic',
        subtitle: 'Target the subjects that appear most on the permit knowledge test.',
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
          { href: '/20-hardest-dmv-written-test-questions', label: '20 Hardest Questions', description: 'The trickiest, most-missed permit questions.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Every key number and rule on one page.' },
          { href: '/california-dmv-test-study-guide', label: 'Study Guide', description: 'A simple 7-step plan to permit test day.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: [
      { href: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/', label: 'Official CA Driver Handbook', external: true },
      { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet' },
      { href: '/dmv-appointment', label: 'Book a DMV Appointment' },
      { href: '/california-dmv-fees', label: 'DMV Fees' },
      { href: '/dmv-offices', label: 'Find a DMV Office' },
    ],
    faq: [
      {
        q: 'How many questions are on the California DMV permit test?',
        a: 'The California permit knowledge test has 46 multiple-choice questions. Applicants 18 and older take a 36-question version. You need 38 correct on the 46-question test (83%) or 30 correct on the 36-question test to pass.',
      },
      {
        q: 'What is covered on the California DMV permit test?',
        a: 'The knowledge test covers road signs, traffic laws, right-of-way rules, speed limits, parking regulations, DUI laws, safe driving techniques, and sharing the road with pedestrians and cyclists — all based on the California Driver Handbook.',
      },
      {
        q: 'How old do you have to be to get a California learner\'s permit?',
        a: 'You must be at least 15½ years old to apply for a California learner\'s permit. At 16 you can get a provisional license after holding the permit for 6 months.',
      },
      {
        q: 'How many times can I take the California permit test if I fail?',
        a: 'You can take the knowledge test up to 3 times per application. If you fail all 3 attempts, you must submit a new application and pay the fee again.',
      },
      {
        q: 'Is this California permit practice test free?',
        a: 'Yes — every test on this page is 100% free, unlimited, and needs no signup. Retake as many times as you like. Questions and answer choices reshuffle each time.',
      },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'CA DMV Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet' },
      { href: '/dmv-appointment', label: 'Book a DMV Appointment' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-for-seniors': {
    slug: 'california-dmv-practice-test-for-seniors',
    metaTitle: 'California DMV Practice Test for Seniors 2026 — Free Knowledge Test',
    metaDescription:
      'Free California DMV practice test for seniors — same real questions as the knowledge test required for senior license renewal. No signup, instant results.',
    keywords: [
      'dmv practice test for seniors',
      'california dmv senior practice test',
      'california dmv senior driver test',
      'dmv test seniors california',
      'senior knowledge test california dmv',
    ],
    breadcrumbLabel: 'Senior Practice Test',
    h1: 'Free California DMV Practice Test for Seniors (2026)',
    heroSubtitle:
      'Practice for the California DMV knowledge test — the same real questions seniors may be asked during in-person license renewal. Free, no signup, instant answers.',
    trustLine: 'Free · No signup · Updated 2026 · Same questions as the official knowledge test',
    vehicleTabs: [
      { label: 'Car', icon: '🚗', href: '/california-dmv-practice-test-for-seniors', active: true },
      { label: 'Motorcycle', icon: '🏍️', href: '/practice-test/motorcycle-class-m-test-1' },
      { label: 'CDL', icon: '🚛', href: '/practice-test/commercial-class-a-b-test-1' },
    ],
    sections: [
      {
        title: 'Full Practice Tests',
        subtitle: 'Each test mirrors the real 36-question California DMV knowledge test (18+ version).',
        variant: 'cards',
        cards: [
          { href: '/practice-test/california-dmv-practice-test-2026', label: 'CA DMV Practice Test 2026', questions: 48, badge: '2026 NEW' },
          { href: '/practice-test/dmv-simulation-test-1', label: 'DMV Knowledge Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'DMV Knowledge Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'DMV Knowledge Test 3', questions: 46 },
          { href: '/practice-test/california-dmv-sample-questions', label: 'Sample DMV Questions', questions: 40 },
          { href: '/practice-test/practice-test-mixed-review', label: 'Mixed Review Test', questions: 63 },
        ],
      },
      {
        title: 'Practice by Topic',
        subtitle: 'Focus on the areas most commonly reviewed for senior renewal.',
        variant: 'compact',
        cards: [
          { href: '/practice-test/practice-test-road-signs-and-markings', label: 'Road Signs & Markings', questions: 20 },
          { href: '/practice-test/practice-test-traffic-signs-and-signals', label: 'Traffic Signs & Signals', questions: 20 },
          { href: '/practice-test/practice-test-right-of-way-and-intersections', label: 'Right-of-Way & Intersections', questions: 20 },
          { href: '/practice-test/practice-test-speed-limits-and-traffic-laws', label: 'Speed Limits & Traffic Laws', questions: 15 },
          { href: '/practice-test/practice-test-safe-driving-and-defensive-techniques', label: 'Safe & Defensive Driving', questions: 19 },
          { href: '/practice-test/practice-test-sharing-the-road', label: 'Sharing the Road', questions: 15 },
          { href: '/practice-test/practice-test-parking-and-vehicle-control', label: 'Parking & Vehicle Control', questions: 18 },
          { href: '/practice-test/practice-test-weather-and-night-driving', label: 'Weather & Night Driving', questions: 14 },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California signs with real images.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Every key number and rule on one page.' },
          { href: '/20-hardest-dmv-written-test-questions', label: '20 Hardest Questions', description: 'The trickiest, most-missed questions.' },
        ],
      },
    ],
    sidebarRequirements: [
      {
        title: 'Senior Renewal Requirements',
        items: [
          'Drivers 70+ must renew in person — online/mail renewal not available',
          'A vision test is required at every in-person renewal',
          'The DMV may require a knowledge test based on driving record or health',
          'Drivers with certain medical conditions may need physician clearance',
          'Standard renewal fee applies ($46 for Class C)',
        ],
      },
      {
        title: 'What to Bring',
        items: [
          'Current driver license',
          'Proof of California residency (if address changed)',
          'Glasses or contacts if you need them to drive',
          'Payment for renewal fee',
        ],
      },
    ],
    helpfulResources: [
      { href: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/', label: 'Official CA Driver Handbook', external: true },
      { href: '/california-senior-driver-license-guide-2026', label: 'Senior Driver License Guide' },
      { href: '/dmv-appointment', label: 'Book a DMV Appointment' },
      { href: '/california-dmv-fees', label: 'DMV Fees' },
      { href: '/dmv-offices', label: 'Find a DMV Office' },
    ],
    faq: [
      {
        q: 'Do seniors have to take a knowledge test in California?',
        a: 'Not automatically — but California DMV can require a knowledge test for senior drivers who have violations on their record, fail the vision test, or show signs of unsafe driving. The DMV can also require a test after a medical report. Practicing now removes any uncertainty.',
      },
      {
        q: 'At what age does California require in-person DMV renewal?',
        a: 'Starting at age 70, California requires all renewals to be done in person at a DMV office. Online, mail, and kiosk renewals are not available for drivers 70 and older.',
      },
      {
        q: 'What score do seniors need to pass the California DMV knowledge test?',
        a: 'Applicants 18 and older take a 36-question version of the knowledge test and need 30 correct (83%) to pass. The questions cover road signs, traffic laws, right-of-way, and safe driving.',
      },
      {
        q: 'How long is a California driver license valid for seniors?',
        a: 'For drivers under 70, the license is valid for 5 years. For drivers 70 and older, the renewal cycle is still 5 years but requires an in-person visit each time.',
      },
      {
        q: 'Is this senior DMV practice test free?',
        a: 'Yes — every test on this page is 100% free, unlimited, and needs no signup. Take it as many times as you like.',
      },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'CA DMV Practice Test' },
      { href: '/california-senior-driver-license-guide-2026', label: 'Senior Driver Guide' },
      { href: '/dmv-appointment', label: 'Book a DMV Appointment' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'Find a DMV Office' },
    ],
  },

  'california-dmv-practice-test-chinese': {
    slug: 'california-dmv-practice-test-chinese',
    metaTitle: 'California DMV Practice Test in Chinese 2026 — 免費中文駕照考試',
    metaDescription: 'Free California DMV practice test in Chinese. Real exam-style questions in 中文 — no signup, instant answers. Updated for 2026.',
    keywords: ['california dmv practice test chinese', 'dmv test chinese california', 'california dmv chinese', '加州驾照考试', 'dmv 中文 california 2026'],
    breadcrumbLabel: 'Chinese / 中文',
    h1: 'California DMV Practice Test in Chinese / 加州 DMV 中文考試 2026',
    heroSubtitle: 'Practice for the California DMV written test with real questions in Chinese. 使用真實考題練習加州駕照筆試。Free, no signup, instant answers.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: '中文', icon: '🇨🇳', href: '/california-dmv-practice-test-chinese', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Chinese DMV Practice Tests / 中文 DMV 練習考試',
        subtitle: 'Full-length tests in Chinese matching the real California DMV exam format.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/chinese-simulator-test', label: 'Chinese DMV Simulator / 中文模擬考試', questions: 46 },
          { href: '/practice-test/chinese-practice-test-1', label: 'Chinese Practice Test 1 / 中文練習 1', questions: 40 },
          { href: '/practice-test/chinese-practice-test-2', label: 'Chinese Practice Test 2 / 中文練習 2', questions: 40 },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/dmv-chinese-test', label: 'All Chinese DMV Tests', description: 'Full hub for Chinese DMV practice.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Chinese?', a: 'Yes. The California DMV knowledge test is available in Chinese (Traditional and Simplified) and over 30 other languages. Request your preferred language when you arrive at the DMV office or when scheduling your appointment.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version, requiring 30 correct.' },
      { q: 'Is this Chinese DMV practice test free?', a: 'Yes — all tests on this page are 100% free, unlimited, and require no signup. You can retake them as many times as you like.' },
      { q: 'What topics are covered on the California DMV knowledge test?', a: 'The test covers road signs, traffic laws, right-of-way rules, speed limits, parking regulations, DUI laws, and safe driving techniques — all based on the California Driver Handbook.' },
      { q: 'How do I switch the DMV test language to Chinese?', a: 'At the DMV office, tell the staff you want to take the test in Chinese before you are seated at a computer terminal. You can also note your language preference when booking an appointment online.' },
    ],
    related: [
      { href: '/dmv-chinese-test', label: 'Chinese DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-arabic': {
    slug: 'california-dmv-practice-test-arabic',
    metaTitle: 'California DMV Practice Test in Arabic 2026 — اختبار DMV بالعربية',
    metaDescription: 'Free California DMV practice test in Arabic / اختبار DMV مجاني بالعربية. Real exam questions, instant answers, no signup. Updated 2026.',
    keywords: ['california dmv practice test arabic', 'dmv test arabic california', 'california dmv arabic', 'اختبار dmv بالعربية', 'dmv عربي california 2026'],
    breadcrumbLabel: 'Arabic / عربي',
    h1: 'California DMV Practice Test in Arabic / اختبار DMV كاليفورنيا بالعربية 2026',
    heroSubtitle: 'Practice for the California DMV written test with real questions in Arabic. تدرب على اختبار DMV بأسئلة حقيقية بالعربية. Free, no signup, instant answers.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'عربي', icon: '🇸🇦', href: '/california-dmv-practice-test-arabic', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Arabic DMV Practice Tests / اختبارات DMV بالعربية',
        subtitle: 'Full-length tests in Arabic matching the real California DMV exam format.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/arabic-simulator-test', label: 'Arabic DMV Simulator / محاكي اختبار DMV', questions: 46 },
          { href: '/practice-test/arabic-practice-test-1', label: 'Arabic Practice Test 1 / اختبار تدريبي 1', questions: 40 },
          { href: '/practice-test/arabic-practice-test-2', label: 'Arabic Practice Test 2 / اختبار تدريبي 2', questions: 40 },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/dmv-arabic-test', label: 'All Arabic DMV Tests', description: 'Full hub for Arabic DMV practice.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Arabic?', a: 'Yes. The California DMV knowledge test is available in Arabic and over 30 other languages. Tell the DMV staff you want the test in Arabic before you sit at a computer terminal.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Arabic DMV practice test free?', a: 'Yes — all tests on this page are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'Where can I find a California DMV office near me?', a: 'Use our DMV Offices page to find the nearest California DMV office by city or ZIP code. You can also book an appointment online through the California DMV website.' },
    ],
    related: [
      { href: '/dmv-arabic-test', label: 'Arabic DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-vietnamese': {
    slug: 'california-dmv-practice-test-vietnamese',
    metaTitle: 'California DMV Practice Test in Vietnamese 2026 — Bài Thi DMV Tiếng Việt',
    metaDescription: 'Free California DMV practice test in Vietnamese / Bài thi DMV miễn phí bằng tiếng Việt. Real exam questions, no signup. Updated 2026.',
    keywords: ['california dmv practice test vietnamese', 'dmv test vietnamese california', 'bài thi dmv tiếng việt', 'california dmv tiếng việt 2026'],
    breadcrumbLabel: 'Vietnamese / Tiếng Việt',
    h1: 'California DMV Practice Test in Vietnamese / Bài Thi DMV California Tiếng Việt 2026',
    heroSubtitle: 'Practice for the California DMV written test in Vietnamese. Luyện thi DMV California bằng tiếng Việt với câu hỏi thực tế. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'Tiếng Việt', icon: '🇻🇳', href: '/california-dmv-practice-test-vietnamese', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Vietnamese DMV Practice Tests / Bài Thi DMV Tiếng Việt',
        variant: 'cards',
        cards: [
          { href: '/practice-test/vietnamese-simulator-test', label: 'Vietnamese DMV Simulator / Bài Thi Mô Phỏng', questions: 46 },
          { href: '/dmv-vietnamese-test', label: 'All Vietnamese Tests', description: 'Full Vietnamese DMV test hub.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'English Simulation Test 1', questions: 46 },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Vietnamese?', a: 'Yes. The California DMV knowledge test is available in Vietnamese and over 30 other languages. Request Vietnamese when you arrive at the DMV office or when booking your appointment.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Vietnamese DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-vietnamese-test', label: 'Vietnamese DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-korean': {
    slug: 'california-dmv-practice-test-korean',
    metaTitle: 'California DMV Practice Test in Korean 2026 — 한국어 DMV 시험',
    metaDescription: 'Free California DMV practice test in Korean / 한국어 DMV 연습 시험. Real exam questions, no signup, instant answers. Updated 2026.',
    keywords: ['california dmv practice test korean', 'dmv test korean california', 'california dmv 한국어', '한국어 dmv 시험 california 2026'],
    breadcrumbLabel: 'Korean / 한국어',
    h1: 'California DMV Practice Test in Korean / 캘리포니아 DMV 한국어 연습 시험 2026',
    heroSubtitle: 'Practice for the California DMV written test in Korean. 한국어로 캘리포니아 DMV 필기시험을 연습하세요. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: '한국어', icon: '🇰🇷', href: '/california-dmv-practice-test-korean', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Korean DMV Practice Tests / 한국어 DMV 연습 시험',
        variant: 'cards',
        cards: [
          { href: '/practice-test/korean-simulator-test', label: 'Korean DMV Simulator / 한국어 모의 시험', questions: 46 },
          { href: '/dmv-korean-test', label: 'All Korean Tests', description: 'Full Korean DMV test hub.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'English Simulation Test 1', questions: 46 },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Korean?', a: 'Yes. The California DMV knowledge test is available in Korean and over 30 other languages. Request Korean when you arrive at the DMV office.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Korean DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What score do I need to pass the California DMV test?', a: 'You need to answer 83% of questions correctly — 38 out of 46, or 30 out of 36 for the shorter version given to applicants 18 and older.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-korean-test', label: 'Korean DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-russian': {
    slug: 'california-dmv-practice-test-russian',
    metaTitle: 'California DMV Practice Test in Russian 2026 — Тест DMV на русском',
    metaDescription: 'Free California DMV practice test in Russian / Бесплатный тест ДМВ на русском. Real exam questions, no signup, instant answers. Updated 2026.',
    keywords: ['california dmv practice test russian', 'dmv test russian california', 'тест dmv на русском california', 'california dmv русский 2026'],
    breadcrumbLabel: 'Russian / Русский',
    h1: 'California DMV Practice Test in Russian / Тест DMV Калифорния на Русском 2026',
    heroSubtitle: 'Practice for the California DMV written test in Russian. Подготовьтесь к тесту DMV Калифорния на русском языке. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'Русский', icon: '🇷🇺', href: '/california-dmv-practice-test-russian', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Russian DMV Practice Tests / Тесты DMV на русском',
        variant: 'cards',
        cards: [
          { href: '/practice-test/russian-simulator-test', label: 'Russian DMV Simulator / Симулятор DMV', questions: 46 },
          { href: '/dmv-russian-test', label: 'All Russian Tests', description: 'Full Russian DMV test hub.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'English Simulation Test 1', questions: 46 },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Russian?', a: 'Yes. The California DMV knowledge test is available in Russian and over 30 other languages. Request Russian when you arrive at the DMV office or when scheduling your appointment.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Russian DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-russian-test', label: 'Russian DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-armenian': {
    slug: 'california-dmv-practice-test-armenian',
    metaTitle: 'California DMV Practice Test in Armenian 2026 — Հայերեն DMV Թեստ',
    metaDescription: 'Free California DMV practice test in Armenian / Անվճար DMV թեստ հայերեն. Real exam questions, no signup, instant answers. Updated 2026.',
    keywords: ['california dmv practice test armenian', 'dmv test armenian california', 'california dmv հայերեն', 'dmv թեստ հայերեն california 2026'],
    breadcrumbLabel: 'Armenian / Հայերեն',
    h1: 'California DMV Practice Test in Armenian / Կալիֆոռնիայի DMV Հայերեն Թեստ 2026',
    heroSubtitle: 'Practice for the California DMV written test in Armenian. Պատրաստվեք Կալիֆոռնիայի DMV թեստին հայերեն. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'Հայերեն', icon: '🇦🇲', href: '/california-dmv-practice-test-armenian', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Armenian DMV Practice Tests / Հայերեն DMV Թեստեր',
        variant: 'cards',
        cards: [
          { href: '/practice-test/armenian-simulator-test', label: 'Armenian DMV Simulator / Հայերեն Մոդելավոր', questions: 46 },
          { href: '/dmv-armenian-test', label: 'All Armenian Tests', description: 'Full Armenian DMV test hub.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'English Simulation Test 1', questions: 46 },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Armenian?', a: 'Yes. The California DMV knowledge test is available in Armenian and over 30 other languages. Request Armenian when you arrive at the DMV office.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Armenian DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-armenian-test', label: 'Armenian DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-hindi': {
    slug: 'california-dmv-practice-test-hindi',
    metaTitle: 'California DMV Practice Test in Hindi 2026 — हिंदी DMV टेस्ट',
    metaDescription: 'Free California DMV practice test in Hindi / हिंदी में मुफ़्त DMV अभ्यास परीक्षा. Real exam questions, no signup. Updated 2026.',
    keywords: ['california dmv practice test hindi', 'dmv test hindi california', 'california dmv हिंदी', 'हिंदी dmv test california 2026'],
    breadcrumbLabel: 'Hindi / हिंदी',
    h1: 'California DMV Practice Test in Hindi / कैलिफोर्निया DMV हिंदी टेस्ट 2026',
    heroSubtitle: 'Practice for the California DMV written test in Hindi. हिंदी में कैलिफोर्निया DMV परीक्षा की तैयारी करें। Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'हिंदी', icon: '🇮🇳', href: '/california-dmv-practice-test-hindi', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Hindi DMV Practice Tests / हिंदी DMV अभ्यास परीक्षाएं',
        variant: 'cards',
        cards: [
          { href: '/practice-test/hindi-simulator-test', label: 'Hindi DMV Simulator / हिंदी मॉक टेस्ट', questions: 46 },
          { href: '/dmv-hindi-test', label: 'All Hindi Tests', description: 'Full Hindi DMV test hub.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'English Simulation Test 1', questions: 46 },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Hindi?', a: 'Yes. The California DMV knowledge test is available in Hindi and over 30 other languages. Request Hindi when you arrive at the DMV office or when scheduling your appointment.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Hindi DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-hindi-test', label: 'Hindi DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-tagalog': {
    slug: 'california-dmv-practice-test-tagalog',
    metaTitle: 'California DMV Practice Test in Tagalog 2026 — Libreng Pagsasanay sa Filipino',
    metaDescription: 'Free California DMV practice test in Tagalog / Filipino. Libreng pagsasanay para sa California DMV exam. Real questions, no signup. Updated 2026.',
    keywords: ['california dmv practice test tagalog', 'dmv test tagalog california', 'california dmv filipino', 'libreng pagsasanay dmv california 2026'],
    breadcrumbLabel: 'Tagalog / Filipino',
    h1: 'California DMV Practice Test in Tagalog / Libreng Pagsasanay sa DMV ng California 2026',
    heroSubtitle: 'Practice for the California DMV written test in Tagalog. Magsanay para sa DMV exam ng California sa Filipino. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'Tagalog', icon: '🇵🇭', href: '/california-dmv-practice-test-tagalog', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Tagalog DMV Practice Tests / Pagsasanay sa DMV sa Tagalog',
        variant: 'cards',
        cards: [
          { href: '/practice-test/tagalog-simulator-test', label: 'Tagalog DMV Simulator / Simulation Test', questions: 46 },
          { href: '/practice-test/tagalog-practice-test-1', label: 'Tagalog Practice Test 1', questions: 40 },
          { href: '/dmv-tagalog-test', label: 'All Tagalog Tests', description: 'Full Tagalog/Filipino DMV test hub.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Tagalog?', a: 'Yes. The California DMV knowledge test is available in Tagalog (Filipino) and over 30 other languages. Request Tagalog when you arrive at the DMV office.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Tagalog DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-tagalog-test', label: 'Tagalog DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-punjabi': {
    slug: 'california-dmv-practice-test-punjabi',
    metaTitle: 'California DMV Practice Test in Punjabi 2026 — ਪੰਜਾਬੀ DMV ਟੈਸਟ',
    metaDescription: 'Free California DMV practice test in Punjabi / ਪੰਜਾਬੀ ਵਿੱਚ ਮੁਫ਼ਤ DMV ਅਭਿਆਸ ਪ੍ਰੀਖਿਆ. Real exam questions, no signup. Updated 2026.',
    keywords: ['california dmv practice test punjabi', 'dmv test punjabi california', 'california dmv ਪੰਜਾਬੀ', 'punjabi dmv test california 2026'],
    breadcrumbLabel: 'Punjabi / ਪੰਜਾਬੀ',
    h1: 'California DMV Practice Test in Punjabi / ਕੈਲੀਫੋਰਨੀਆ DMV ਪੰਜਾਬੀ ਟੈਸਟ 2026',
    heroSubtitle: 'Practice for the California DMV written test in Punjabi. ਪੰਜਾਬੀ ਵਿੱਚ ਕੈਲੀਫੋਰਨੀਆ DMV ਪ੍ਰੀਖਿਆ ਦੀ ਤਿਆਰੀ ਕਰੋ। Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'ਪੰਜਾਬੀ', icon: '🇮🇳', href: '/california-dmv-practice-test-punjabi', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Punjabi DMV Practice Tests / ਪੰਜਾਬੀ DMV ਅਭਿਆਸ ਟੈਸਟ',
        variant: 'cards',
        cards: [
          { href: '/practice-test/punjabi-simulator-test', label: 'Punjabi DMV Simulator / ਸਿਮੂਲੇਟਰ ਟੈਸਟ', questions: 46 },
          { href: '/dmv-punjabi-test', label: 'All Punjabi Tests', description: 'Full Punjabi DMV test hub.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'English Simulation Test 1', questions: 46 },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Punjabi?', a: 'Yes. The California DMV knowledge test is available in Punjabi and over 30 other languages. Request Punjabi when you arrive at the DMV office or when booking your appointment.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Punjabi DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-punjabi-test', label: 'Punjabi DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-farsi': {
    slug: 'california-dmv-practice-test-farsi',
    metaTitle: 'California DMV Practice Test in Farsi 2026 — آزمون DMV به فارسی',
    metaDescription: 'Free California DMV practice test in Farsi / آزمون تمرینی رایگان DMV کالیفرنیا به فارسی. Real exam questions, no signup. Updated 2026.',
    keywords: ['california dmv practice test farsi', 'dmv test farsi california', 'california dmv فارسی', 'آزمون dmv به فارسی california 2026', 'california dmv persian'],
    breadcrumbLabel: 'Farsi / فارسی',
    h1: 'California DMV Practice Test in Farsi / آزمون تمرینی DMV کالیفرنیا به فارسی 2026',
    heroSubtitle: 'Practice for the California DMV written test in Farsi. برای آزمون DMV کالیفرنیا به فارسی تمرین کنید. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'فارسی', icon: '🇮🇷', href: '/california-dmv-practice-test-farsi', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Farsi DMV Practice Tests / آزمون‌های تمرینی DMV به فارسی',
        variant: 'cards',
        cards: [
          { href: '/practice-test/farsi-simulator-test', label: 'Farsi DMV Simulator / شبیه‌ساز آزمون', questions: 46 },
          { href: '/dmv-farsi-test', label: 'All Farsi Tests', description: 'Full Farsi/Persian DMV test hub.' },
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'English Simulation Test 1', questions: 46 },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Farsi?', a: 'Yes. The California DMV knowledge test is available in Farsi (Persian) and over 30 other languages. Request Farsi when you arrive at the DMV office or when scheduling your appointment.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Farsi DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-farsi-test', label: 'Farsi DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-turkish': {
    slug: 'california-dmv-practice-test-turkish',
    metaTitle: 'California DMV Practice Test in Turkish 2026 — Türkçe DMV Sınavı',
    metaDescription: 'Free California DMV practice test in Turkish / Türkçe ücretsiz California DMV sınav soruları. Real exam questions, no signup. Updated 2026.',
    keywords: ['california dmv practice test turkish', 'dmv test turkish california', 'california dmv türkçe', 'türkçe dmv sınavı california 2026'],
    breadcrumbLabel: 'Turkish / Türkçe',
    h1: 'California DMV Practice Test in Turkish / California DMV Türkçe Sınav Soruları 2026',
    heroSubtitle: 'Practice for the California DMV written test in Turkish. California DMV sınavına Türkçe sorularla hazırlanın. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Based on the official California Driver Handbook',
    vehicleTabs: [
      { label: 'Türkçe', icon: '🇹🇷', href: '/california-dmv-practice-test-turkish', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Turkish DMV Practice Tests / Türkçe DMV Sınav Soruları',
        variant: 'cards',
        cards: [
          { href: '/dmv-turkish-test/test-1', label: 'Turkish DMV Test 1 / Türkçe Test 1', questions: 46 },
          { href: '/dmv-turkish-test/test-2', label: 'Turkish DMV Test 2 / Türkçe Test 2', questions: 46 },
          { href: '/dmv-turkish-test', label: 'All Turkish Tests', description: 'Full Turkish DMV test hub.' },
        ],
      },
      {
        title: 'More Study Tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road Signs Test', description: 'All 38 California road signs.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Key numbers and rules on one page.' },
          { href: '/dmv-offices', label: 'Find a DMV Office', description: 'Locate the nearest DMV to you.' },
        ],
      },
    ],
    sidebarRequirements: CA_REQUIREMENTS,
    helpfulResources: CA_HELPFUL_RESOURCES,
    faq: [
      { q: 'Can I take the California DMV test in Turkish?', a: 'Yes. The California DMV knowledge test is available in Turkish and over 30 other languages. Request Turkish when you arrive at the DMV office or when booking your appointment.' },
      { q: 'How many questions are on the California DMV test?', a: 'The test has 46 multiple-choice questions. You need 38 correct (83%) to pass. Applicants 18 and older take a 36-question version requiring 30 correct.' },
      { q: 'Is this Turkish DMV practice test free?', a: 'Yes — all tests are 100% free, unlimited, and require no signup.' },
      { q: 'What topics does the California DMV test cover?', a: 'Road signs, traffic laws, right-of-way rules, speed limits, parking, DUI laws, and safe driving — all based on the California Driver Handbook.' },
      { q: 'How many times can I retake the California DMV test if I fail?', a: 'You get 3 attempts per application. If you fail all 3, you must submit a new application and pay the fee again.' },
    ],
    related: [
      { href: '/dmv-turkish-test', label: 'Turkish DMV Tests' },
      { href: '/california-dmv-practice-test', label: 'English Practice Test' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-offices', label: 'DMV Offices' },
    ],
  },

  'california-dmv-practice-test-espanol': {
    slug: 'california-dmv-practice-test-espanol',
    metaTitle: 'Examen de Práctica DMV California 2026 — Gratis en Español',
    metaDescription:
      'Practica gratis para el examen de manejo del DMV de California en español. Preguntas reales del examen de conocimientos con respuestas instantáneas. Sin registro.',
    keywords: [
      'dmv practice test español',
      'examen dmv california español',
      'examen de manejo california español',
      'examen escrito dmv california',
      'dmv en español california 2026',
    ],
    breadcrumbLabel: 'Examen en Español',
    h1: 'Examen de Práctica DMV California 2026 — Gratis en Español',
    heroSubtitle:
      'Practica para el examen de conocimientos del DMV de California con preguntas reales en español. Gratis, sin registro, respuestas al instante.',
    trustLine: 'Gratis · Sin registro · Actualizado 2026 · Basado en el manual oficial de California',
    vehicleTabs: [
      { label: 'Español', icon: '🇲🇽', href: '/california-dmv-practice-test-espanol', active: true },
      { label: 'English', icon: '🇺🇸', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Exámenes de Práctica en Español',
        subtitle: 'Cada examen tiene preguntas del estilo del examen oficial del DMV de California.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/examen-dmv-espanol-3', label: 'Examen DMV Español 3', questions: 20 },
          { href: '/practice-test/examen-dmv-espanol-4', label: 'Examen DMV Español 4', questions: 20 },
          { href: '/practice-test/dmv-spanish-practice-test-1', label: 'Examen de Práctica Completo 1', questions: 40 },
          { href: '/practice-test/dmv-spanish-practice-test-2', label: 'Simulador Completo 2', questions: 36 },
          { href: '/examen-maraton-dmv-espanol', label: 'Examen Maratón', badge: 'TODAS' },
        ],
      },
      {
        title: 'Señales de Tráfico y Más Herramientas',
        subtitle: 'Practica las señales y estudia el examen completo en español.',
        variant: 'cards',
        cards: [
          { href: '/muestra-del-examen-escrito-para-licencia-de-manejar/examen-de-senales', label: 'Examen de Señales', description: 'Señales de tráfico con imágenes reales.' },
          { href: '/muestra-del-examen-escrito-para-licencia-de-manejar', label: 'Examen Completo en Español', description: 'Examen de manejo del DMV en español.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet', description: 'Números clave y reglas en una sola página.' },
          { href: '/cita-dmv-california', label: 'Cómo Hacer su Cita en el DMV', description: 'Guía completa para programar, cancelar o reprogramar.' },
        ],
      },
    ],
    sidebarRequirements: [
      {
        title: 'Requisitos de Edad',
        items: [
          '15 años y medio para el permiso de aprendiz',
          '16 años para la licencia provisional',
          '18 años para la licencia completa',
        ],
      },
      {
        title: 'Documentos Requeridos',
        items: [
          'Prueba de identidad (acta de nacimiento, pasaporte, etc.)',
          'Prueba del número de Seguro Social',
          'Prueba de residencia en California (1–2 documentos)',
          'Formulario DL 44 completado',
          'Seguro de auto para el examen de manejo',
        ],
      },
    ],
    helpfulResources: [
      { href: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/', label: 'Manual del Conductor de California', external: true },
      { href: '/dmv-appointment', label: 'Cita en el DMV' },
      { href: '/california-dmv-fees', label: 'Tarifas del DMV' },
      { href: '/dmv-offices', label: 'Oficinas del DMV' },
    ],
    faq: [
      {
        q: '¿Se puede tomar el examen del DMV de California en español?',
        a: 'Sí. El examen de conocimientos del DMV de California está disponible en 30 idiomas, incluyendo español. Puedes indicar tu preferencia de idioma al llegar a la oficina del DMV.',
      },
      {
        q: '¿Cuántas preguntas tiene el examen del DMV de California?',
        a: 'El examen tiene 46 preguntas de opción múltiple. Necesitas responder correctamente 38 preguntas (83%) para aprobar. Si tienes 18 años o más, el examen puede tener solo 36 preguntas y necesitas 30 correctas.',
      },
      {
        q: '¿Cuántas veces puedo tomar el examen del DMV si repruebo?',
        a: 'Puedes tomar el examen de conocimientos hasta 3 veces por solicitud. Si repruebas las 3 veces, debes presentar una nueva solicitud y pagar la tarifa nuevamente.',
      },
      {
        q: '¿Este examen de práctica es gratis?',
        a: 'Sí. Todos los exámenes de práctica aquí son 100% gratis, ilimitados y no requieren registro. Puedes repetirlos tantas veces como quieras.',
      },
    ],
    related: [
      { href: '/muestra-del-examen-escrito-para-licencia-de-manejar', label: 'Examen Completo en Español' },
      { href: '/california-dmv-practice-test', label: 'Practice Test in English' },
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/dmv-appointment', label: 'Cita en el DMV' },
    ],
  },

  'texas-dmv-practice-test': {
    slug: 'texas-dmv-practice-test',
    metaTitle: 'Texas DMV Practice Test 2026 — Free TX Written Test Questions',
    metaDescription: 'Free Texas DMV practice test 2026. 30 questions, 70% to pass — road signs and traffic rules tested in Texas. No signup, instant answers.',
    keywords: ['texas dmv practice test', 'dmv practice test texas', 'texas dmv test 2026', 'tx dmv practice test', 'free texas dmv test', 'texas permit test'],
    breadcrumbLabel: 'Texas',
    h1: 'Texas DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Road signs and traffic rules are the same in every U.S. state. These questions prepare you for the Texas DPS knowledge test. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Texas',
    vehicleTabs: [
      { label: 'TX', icon: 'TX', href: '/texas-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Texas DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the Texas DPS knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Texas DMV test?', a: 'The Texas knowledge test has 30 questions. You need to answer 21 correctly (70%) to pass.' },
      { q: 'How old do you need to be to get a Texas driver license?', a: 'You can apply for a Texas learner permit at age 15. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Texas road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Texas roads.' },
      { q: 'Is this Texas DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Texas DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'florida-dmv-practice-test': {
    slug: 'florida-dmv-practice-test',
    metaTitle: 'Florida DMV Practice Test 2026 — Free FL Written Test Questions',
    metaDescription: 'Free Florida DMV practice test 2026. 50 questions, 80% to pass — road signs and traffic rules tested in Florida. No signup, instant answers.',
    keywords: ['florida dmv practice test', 'dmv practice test florida', 'florida dmv test 2026', 'fl dmv practice test', 'free florida dmv test', 'florida permit test'],
    breadcrumbLabel: 'Florida',
    h1: 'Florida DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'The core of every state DMV test is the same: road signs, right-of-way, and traffic laws. Practice here, pass in Florida. Free, no signup.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Florida',
    vehicleTabs: [
      { label: 'FL', icon: 'FL', href: '/florida-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Florida DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the FL DHSMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Florida DMV test?', a: 'The Florida knowledge test has 50 questions. You need to answer 40 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Florida driver license?', a: 'You can apply for a Florida learner permit at age 15. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Florida road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Florida roads.' },
      { q: 'Is this Florida DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Florida DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'new-york-dmv-practice-test': {
    slug: 'new-york-dmv-practice-test',
    metaTitle: 'New York DMV Practice Test 2026 — Free NY Written Test Questions',
    metaDescription: 'Free New York DMV practice test 2026. 20 questions, 70% to pass — road signs and traffic rules tested in New York. No signup, instant answers.',
    keywords: ['new york dmv practice test', 'dmv practice test new york', 'new york dmv test 2026', 'ny dmv practice test', 'free new york dmv test', 'new york permit test'],
    breadcrumbLabel: 'New York',
    h1: 'New York DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'New York road signs follow the same federal standard as every other state. Use these tests to get ready for the NY DMV written exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in New York',
    vehicleTabs: [
      { label: 'NY', icon: 'NY', href: '/new-york-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'New York DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the NY DMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the New York DMV test?', a: 'The New York knowledge test has 20 questions. You need to answer 14 correctly (70%) to pass.' },
      { q: 'How old do you need to be to get a New York driver license?', a: 'You can apply for a New York learner permit at age 16. A full unrestricted license is available at 17 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as New York road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on New York roads.' },
      { q: 'Is this New York DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the New York DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'georgia-dmv-practice-test': {
    slug: 'georgia-dmv-practice-test',
    metaTitle: 'Georgia DMV Practice Test 2026 — Free GA Written Test Questions',
    metaDescription: 'Free Georgia DMV practice test 2026. 40 questions, 75% to pass — road signs and traffic rules tested in Georgia. No signup, instant answers.',
    keywords: ['georgia dmv practice test', 'dmv practice test georgia', 'georgia dmv test 2026', 'ga dmv practice test', 'free georgia dmv test', 'georgia permit test'],
    breadcrumbLabel: 'Georgia',
    h1: 'Georgia DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Georgia uses the same road signs and fundamental traffic laws as California. These questions map directly to the GA DDS knowledge test.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Georgia',
    vehicleTabs: [
      { label: 'GA', icon: 'GA', href: '/georgia-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Georgia DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the GA DDS knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Georgia DMV test?', a: 'The Georgia knowledge test has 40 questions. You need to answer 30 correctly (75%) to pass.' },
      { q: 'How old do you need to be to get a Georgia driver license?', a: 'You can apply for a Georgia learner permit at age 15. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Georgia road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Georgia roads.' },
      { q: 'Is this Georgia DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Georgia DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'north-carolina-dmv-practice-test': {
    slug: 'north-carolina-dmv-practice-test',
    metaTitle: 'North Carolina DMV Practice Test 2026 — Free NC Written Test Questions',
    metaDescription: 'Free North Carolina DMV practice test 2026. 37 questions, 80% to pass — road signs and traffic rules tested in North Carolina. No signup, instant answers.',
    keywords: ['north carolina dmv practice test', 'dmv practice test north carolina', 'north carolina dmv test 2026', 'nc dmv practice test', 'free north carolina dmv test', 'north carolina permit test'],
    breadcrumbLabel: 'North Carolina',
    h1: 'North Carolina DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'North Carolina road signs are federally standardized. Practice here for free — no signup, instant answers on every question.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in North Carolina',
    vehicleTabs: [
      { label: 'NC', icon: 'NC', href: '/north-carolina-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'North Carolina DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the NC DMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the North Carolina DMV test?', a: 'The North Carolina knowledge test has 37 questions. You need to answer 30 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a North Carolina driver license?', a: 'You can apply for a North Carolina learner permit at age 15. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as North Carolina road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on North Carolina roads.' },
      { q: 'Is this North Carolina DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the North Carolina DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'new-jersey-dmv-practice-test': {
    slug: 'new-jersey-dmv-practice-test',
    metaTitle: 'New Jersey DMV Practice Test 2026 — Free NJ Written Test Questions',
    metaDescription: 'Free New Jersey DMV practice test 2026. 50 questions, 80% to pass — road signs and traffic rules tested in New Jersey. No signup, instant answers.',
    keywords: ['new jersey dmv practice test', 'dmv practice test new jersey', 'new jersey dmv test 2026', 'nj dmv practice test', 'free new jersey dmv test', 'new jersey permit test'],
    breadcrumbLabel: 'New Jersey',
    h1: 'New Jersey DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'New Jersey uses the same road sign standards as every U.S. state. These tests cover the rules that make up the bulk of the NJ MVC knowledge exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in New Jersey',
    vehicleTabs: [
      { label: 'NJ', icon: 'NJ', href: '/new-jersey-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'New Jersey DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the NJ MVC knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the New Jersey DMV test?', a: 'The New Jersey knowledge test has 50 questions. You need to answer 40 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a New Jersey driver license?', a: 'You can apply for a New Jersey learner permit at age 16. A full unrestricted license is available at 17 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as New Jersey road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on New Jersey roads.' },
      { q: 'Is this New Jersey DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the New Jersey DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'virginia-dmv-practice-test': {
    slug: 'virginia-dmv-practice-test',
    metaTitle: 'Virginia DMV Practice Test 2026 — Free VA Written Test Questions',
    metaDescription: 'Free Virginia DMV practice test 2026. 35 questions, 80% to pass — road signs and traffic rules tested in Virginia. No signup, instant answers.',
    keywords: ['virginia dmv practice test', 'dmv practice test virginia', 'virginia dmv test 2026', 'va dmv practice test', 'free virginia dmv test', 'virginia permit test'],
    breadcrumbLabel: 'Virginia',
    h1: 'Virginia DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Virginia traffic laws and road signs follow the same federal standards as other states. Practice here and you are ready for the Virginia DMV written test.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Virginia',
    vehicleTabs: [
      { label: 'VA', icon: 'VA', href: '/virginia-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Virginia DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the Virginia DMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Virginia DMV test?', a: 'The Virginia knowledge test has 35 questions. You need to answer 28 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Virginia driver license?', a: 'You can apply for a Virginia learner permit at age 15 and a half. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Virginia road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Virginia roads.' },
      { q: 'Is this Virginia DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Virginia DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'washington-dmv-practice-test': {
    slug: 'washington-dmv-practice-test',
    metaTitle: 'Washington DMV Practice Test 2026 — Free WA Written Test Questions',
    metaDescription: 'Free Washington DMV practice test 2026. 40 questions, 80% to pass — road signs and traffic rules tested in Washington. No signup, instant answers.',
    keywords: ['washington dmv practice test', 'dmv practice test washington', 'washington dmv test 2026', 'wa dmv practice test', 'free washington dmv test', 'washington permit test'],
    breadcrumbLabel: 'Washington',
    h1: 'Washington DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Washington state uses the same road signs and right-of-way rules as the rest of the country. These tests prepare you for the WA DOL knowledge exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Washington',
    vehicleTabs: [
      { label: 'WA', icon: 'WA', href: '/washington-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Washington DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the WA DOL knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Washington DMV test?', a: 'The Washington knowledge test has 40 questions. You need to answer 32 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Washington driver license?', a: 'You can apply for a Washington learner permit at age 15 and a half. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Washington road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Washington roads.' },
      { q: 'Is this Washington DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Washington DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'arizona-dmv-practice-test': {
    slug: 'arizona-dmv-practice-test',
    metaTitle: 'Arizona DMV Practice Test 2026 — Free AZ Written Test Questions',
    metaDescription: 'Free Arizona DMV practice test 2026. 30 questions, 80% to pass — road signs and traffic rules tested in Arizona. No signup, instant answers.',
    keywords: ['arizona dmv practice test', 'dmv practice test arizona', 'arizona dmv test 2026', 'az dmv practice test', 'free arizona dmv test', 'arizona permit test'],
    breadcrumbLabel: 'Arizona',
    h1: 'Arizona DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Arizona road signs are identical to every other state — they follow the federal MUTCD standard. Use these tests to prepare for the AZ MVD written exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Arizona',
    vehicleTabs: [
      { label: 'AZ', icon: 'AZ', href: '/arizona-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Arizona DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the AZ MVD knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Arizona DMV test?', a: 'The Arizona knowledge test has 30 questions. You need to answer 24 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Arizona driver license?', a: 'You can apply for a Arizona learner permit at age 15 and a half. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Arizona road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Arizona roads.' },
      { q: 'Is this Arizona DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Arizona DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'tennessee-dmv-practice-test': {
    slug: 'tennessee-dmv-practice-test',
    metaTitle: 'Tennessee DMV Practice Test 2026 — Free TN Written Test Questions',
    metaDescription: 'Free Tennessee DMV practice test 2026. 30 questions, 80% to pass — road signs and traffic rules tested in Tennessee. No signup, instant answers.',
    keywords: ['tennessee dmv practice test', 'dmv practice test tennessee', 'tennessee dmv test 2026', 'tn dmv practice test', 'free tennessee dmv test', 'tennessee permit test'],
    breadcrumbLabel: 'Tennessee',
    h1: 'Tennessee DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Tennessee traffic rules are rooted in the same federal standards as all 50 states. Practice here, free, and be ready for the TN DOS knowledge test.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Tennessee',
    vehicleTabs: [
      { label: 'TN', icon: 'TN', href: '/tennessee-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Tennessee DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the TN DOS knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Tennessee DMV test?', a: 'The Tennessee knowledge test has 30 questions. You need to answer 24 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Tennessee driver license?', a: 'You can apply for a Tennessee learner permit at age 15. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Tennessee road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Tennessee roads.' },
      { q: 'Is this Tennessee DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Tennessee DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'colorado-dmv-practice-test': {
    slug: 'colorado-dmv-practice-test',
    metaTitle: 'Colorado DMV Practice Test 2026 — Free CO Written Test Questions',
    metaDescription: 'Free Colorado DMV practice test 2026. 25 questions, 80% to pass — road signs and traffic rules tested in Colorado. No signup, instant answers.',
    keywords: ['colorado dmv practice test', 'dmv practice test colorado', 'colorado dmv test 2026', 'co dmv practice test', 'free colorado dmv test', 'colorado permit test'],
    breadcrumbLabel: 'Colorado',
    h1: 'Colorado DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Colorado road signs and traffic rules align with the federal standard. These tests target exactly what the Colorado DMV knowledge exam covers.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Colorado',
    vehicleTabs: [
      { label: 'CO', icon: 'CO', href: '/colorado-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Colorado DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the Colorado DMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Colorado DMV test?', a: 'The Colorado knowledge test has 25 questions. You need to answer 20 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Colorado driver license?', a: 'You can apply for a Colorado learner permit at age 15 and a half. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Colorado road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Colorado roads.' },
      { q: 'Is this Colorado DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Colorado DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'michigan-dmv-practice-test': {
    slug: 'michigan-dmv-practice-test',
    metaTitle: 'Michigan DMV Practice Test 2026 — Free MI Written Test Questions',
    metaDescription: 'Free Michigan DMV practice test 2026. 50 questions, 70% to pass — road signs and traffic rules tested in Michigan. No signup, instant answers.',
    keywords: ['michigan dmv practice test', 'dmv practice test michigan', 'michigan dmv test 2026', 'mi dmv practice test', 'free michigan dmv test', 'michigan permit test'],
    breadcrumbLabel: 'Michigan',
    h1: 'Michigan DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Michigan uses the same federal road sign standards as every other state. Practice here to prepare for the MI SOS written knowledge exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Michigan',
    vehicleTabs: [
      { label: 'MI', icon: 'MI', href: '/michigan-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Michigan DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the MI SOS knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Michigan DMV test?', a: 'The Michigan knowledge test has 50 questions. You need to answer 35 correctly (70%) to pass.' },
      { q: 'How old do you need to be to get a Michigan driver license?', a: 'You can apply for a Michigan learner permit at age 14 years and 9 months. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Michigan road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Michigan roads.' },
      { q: 'Is this Michigan DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Michigan DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'ohio-dmv-practice-test': {
    slug: 'ohio-dmv-practice-test',
    metaTitle: 'Ohio DMV Practice Test 2026 — Free OH Written Test Questions',
    metaDescription: 'Free Ohio DMV practice test 2026. 40 questions, 75% to pass — road signs and traffic rules tested in Ohio. No signup, instant answers.',
    keywords: ['ohio dmv practice test', 'dmv practice test ohio', 'ohio dmv test 2026', 'oh dmv practice test', 'free ohio dmv test', 'ohio permit test'],
    breadcrumbLabel: 'Ohio',
    h1: 'Ohio DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Ohio traffic laws are grounded in the same federal rules as California. Use these questions to get ready for the Ohio BMV knowledge test.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Ohio',
    vehicleTabs: [
      { label: 'OH', icon: 'OH', href: '/ohio-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Ohio DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the Ohio BMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Ohio DMV test?', a: 'The Ohio knowledge test has 40 questions. You need to answer 30 correctly (75%) to pass.' },
      { q: 'How old do you need to be to get a Ohio driver license?', a: 'You can apply for a Ohio learner permit at age 15 and a half. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Ohio road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Ohio roads.' },
      { q: 'Is this Ohio DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Ohio DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'illinois-dmv-practice-test': {
    slug: 'illinois-dmv-practice-test',
    metaTitle: 'Illinois DMV Practice Test 2026 — Free IL Written Test Questions',
    metaDescription: 'Free Illinois DMV practice test 2026. 35 questions, 80% to pass — road signs and traffic rules tested in Illinois. No signup, instant answers.',
    keywords: ['illinois dmv practice test', 'dmv practice test illinois', 'illinois dmv test 2026', 'il dmv practice test', 'free illinois dmv test', 'illinois permit test'],
    breadcrumbLabel: 'Illinois',
    h1: 'Illinois DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Illinois road signs follow the federal MUTCD standard — the same signs you will see on every U.S. road. Practice here for the IL SOS written exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Illinois',
    vehicleTabs: [
      { label: 'IL', icon: 'IL', href: '/illinois-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Illinois DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the IL SOS knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Illinois DMV test?', a: 'The Illinois knowledge test has 35 questions. You need to answer 28 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Illinois driver license?', a: 'You can apply for a Illinois learner permit at age 15. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Illinois road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Illinois roads.' },
      { q: 'Is this Illinois DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Illinois DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'pennsylvania-dmv-practice-test': {
    slug: 'pennsylvania-dmv-practice-test',
    metaTitle: 'Pennsylvania DMV Practice Test 2026 — Free PA Written Test Questions',
    metaDescription: 'Free Pennsylvania DMV practice test 2026. 18 questions, 79% to pass — road signs and traffic rules tested in Pennsylvania. No signup, instant answers.',
    keywords: ['pennsylvania dmv practice test', 'dmv practice test pennsylvania', 'pennsylvania dmv test 2026', 'pa dmv practice test', 'free pennsylvania dmv test', 'pennsylvania permit test'],
    breadcrumbLabel: 'Pennsylvania',
    h1: 'Pennsylvania DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Pennsylvania road signs and right-of-way rules match the federal standard. These questions prepare you for the PennDOT written knowledge test.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Pennsylvania',
    vehicleTabs: [
      { label: 'PA', icon: 'PA', href: '/pennsylvania-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Pennsylvania DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the PennDOT knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Pennsylvania DMV test?', a: 'Pennsylvania splits its test into 18 road sign questions and 25 traffic law questions (43 total). You must pass both sections. The Pennsylvania knowledge test has 18 questions. You need to answer 15 correctly (79%) to pass.' },
      { q: 'How old do you need to be to get a Pennsylvania driver license?', a: 'You can apply for a Pennsylvania learner permit at age 16. A full unrestricted license is available at 17 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Pennsylvania road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Pennsylvania roads.' },
      { q: 'Is this Pennsylvania DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Pennsylvania DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'maryland-dmv-practice-test': {
    slug: 'maryland-dmv-practice-test',
    metaTitle: 'Maryland DMV Practice Test 2026 — Free MD Written Test Questions',
    metaDescription: 'Free Maryland DMV practice test 2026. 25 questions, 70% to pass — road signs and traffic rules tested in Maryland. No signup, instant answers.',
    keywords: ['maryland dmv practice test', 'dmv practice test maryland', 'maryland dmv test 2026', 'md dmv practice test', 'free maryland dmv test', 'maryland permit test'],
    breadcrumbLabel: 'Maryland',
    h1: 'Maryland DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Maryland traffic laws are built on the same federal base as every U.S. state. Use these tests to prepare for the Maryland MVA written exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Maryland',
    vehicleTabs: [
      { label: 'MD', icon: 'MD', href: '/maryland-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Maryland DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the Maryland MVA knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Maryland DMV test?', a: 'The Maryland knowledge test has 25 questions. You need to answer 18 correctly (70%) to pass.' },
      { q: 'How old do you need to be to get a Maryland driver license?', a: 'You can apply for a Maryland learner permit at age 15 and a half. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Maryland road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Maryland roads.' },
      { q: 'Is this Maryland DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Maryland DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'massachusetts-dmv-practice-test': {
    slug: 'massachusetts-dmv-practice-test',
    metaTitle: 'Massachusetts DMV Practice Test 2026 — Free MA Written Test Questions',
    metaDescription: 'Free Massachusetts DMV practice test 2026. 25 questions, 72% to pass — road signs and traffic rules tested in Massachusetts. No signup, instant answers.',
    keywords: ['massachusetts dmv practice test', 'dmv practice test massachusetts', 'massachusetts dmv test 2026', 'ma dmv practice test', 'free massachusetts dmv test', 'massachusetts permit test'],
    breadcrumbLabel: 'Massachusetts',
    h1: 'Massachusetts DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Massachusetts road signs are federally standardized — identical to California. Practice here, free, to prepare for the MA RMV knowledge test.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Massachusetts',
    vehicleTabs: [
      { label: 'MA', icon: 'MA', href: '/massachusetts-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Massachusetts DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the MA RMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Massachusetts DMV test?', a: 'The Massachusetts knowledge test has 25 questions. You need to answer 18 correctly (72%) to pass.' },
      { q: 'How old do you need to be to get a Massachusetts driver license?', a: 'You can apply for a Massachusetts learner permit at age 16. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Massachusetts road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Massachusetts roads.' },
      { q: 'Is this Massachusetts DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Massachusetts DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'missouri-dmv-practice-test': {
    slug: 'missouri-dmv-practice-test',
    metaTitle: 'Missouri DMV Practice Test 2026 — Free MO Written Test Questions',
    metaDescription: 'Free Missouri DMV practice test 2026. 25 questions, 80% to pass — road signs and traffic rules tested in Missouri. No signup, instant answers.',
    keywords: ['missouri dmv practice test', 'dmv practice test missouri', 'missouri dmv test 2026', 'mo dmv practice test', 'free missouri dmv test', 'missouri permit test'],
    breadcrumbLabel: 'Missouri',
    h1: 'Missouri DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Missouri traffic rules follow the same federal framework as every other state. Practice here to be ready for the Missouri DOR written knowledge exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Missouri',
    vehicleTabs: [
      { label: 'MO', icon: 'MO', href: '/missouri-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Missouri DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the Missouri DOR knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Missouri DMV test?', a: 'The Missouri knowledge test has 25 questions. You need to answer 20 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Missouri driver license?', a: 'You can apply for a Missouri learner permit at age 15. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Missouri road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Missouri roads.' },
      { q: 'Is this Missouri DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Missouri DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'nevada-dmv-practice-test': {
    slug: 'nevada-dmv-practice-test',
    metaTitle: 'Nevada DMV Practice Test 2026 — Free NV Written Test Questions',
    metaDescription: 'Free Nevada DMV practice test 2026. 50 questions, 80% to pass — road signs and traffic rules tested in Nevada. No signup, instant answers.',
    keywords: ['nevada dmv practice test', 'dmv practice test nevada', 'nevada dmv test 2026', 'nv dmv practice test', 'free nevada dmv test', 'nevada permit test'],
    breadcrumbLabel: 'Nevada',
    h1: 'Nevada DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Nevada road signs follow the same federal standard as California. These questions cover exactly what the Nevada DMV knowledge test examines.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Nevada',
    vehicleTabs: [
      { label: 'NV', icon: 'NV', href: '/nevada-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Nevada DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the Nevada DMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Nevada DMV test?', a: 'The Nevada knowledge test has 50 questions. You need to answer 40 correctly (80%) to pass.' },
      { q: 'How old do you need to be to get a Nevada driver license?', a: 'You can apply for a Nevada learner permit at age 15 and a half. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Nevada road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Nevada roads.' },
      { q: 'Is this Nevada DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Nevada DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },

  'indiana-dmv-practice-test': {
    slug: 'indiana-dmv-practice-test',
    metaTitle: 'Indiana DMV Practice Test 2026 — Free IN Written Test Questions',
    metaDescription: 'Free Indiana DMV practice test 2026. 34 questions, 84% to pass — road signs and traffic rules tested in Indiana. No signup, instant answers.',
    keywords: ['indiana dmv practice test', 'dmv practice test indiana', 'indiana dmv test 2026', 'in dmv practice test', 'free indiana dmv test', 'indiana permit test'],
    breadcrumbLabel: 'Indiana',
    h1: 'Indiana DMV Practice Test 2026 — Free Written Test Questions',
    heroSubtitle: 'Indiana road signs and traffic rules are grounded in the same federal standards as every U.S. state. Practice here for the Indiana BMV knowledge exam.',
    trustLine: '100% free · No signup · Updated 2026 · Covers road signs and rules tested in Indiana',
    vehicleTabs: [
      { label: 'IN', icon: 'IN', href: '/indiana-dmv-practice-test', active: true },
      { label: 'CA', icon: 'CA', href: '/california-dmv-practice-test' },
    ],
    sections: [
      {
        title: 'Indiana DMV practice tests',
        subtitle: 'Road signs and traffic rules are federally standardized. These questions prepare you for the Indiana BMV knowledge test.',
        variant: 'cards',
        cards: [
          { href: '/practice-test/dmv-simulation-test-1', label: 'Practice Test 1', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-2', label: 'Practice Test 2', questions: 46 },
          { href: '/practice-test/dmv-simulation-test-3', label: 'Practice Test 3', questions: 46 },
        ],
      },
      {
        title: 'More study tools',
        variant: 'cards',
        cards: [
          { href: '/california-dmv-road-signs-test', label: 'Road signs test', description: 'All 38 road signs — same in every state.' },
          { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet', description: 'Key numbers and rules on one page.' },
          { href: '/practice-test/dmv-marathon-test', label: 'Marathon test', description: '100-question endurance test.' },
        ],
      },
    ],
    sidebarRequirements: STATE_REQUIREMENTS,
    helpfulResources: STATE_HELPFUL_RESOURCES,
    faq: [
      { q: 'How many questions are on the Indiana DMV test?', a: 'The Indiana knowledge test has 34 questions. You need to answer 29 correctly (84%) to pass.' },
      { q: 'How old do you need to be to get a Indiana driver license?', a: 'You can apply for a Indiana learner permit at age 15. A full unrestricted license is available at 16 after completing the required supervised driving hours and passing the behind-the-wheel test.' },
      { q: 'Are the road signs on this practice test the same as Indiana road signs?', a: 'Yes. Road signs in the United States are governed by the Manual on Uniform Traffic Control Devices (MUTCD), a federal standard. Every sign on this site is identical to what you will see on Indiana roads.' },
      { q: 'Is this Indiana DMV practice test free?', a: 'Yes. All tests are 100% free, unlimited, and require no account or signup. You can retake them as many times as you like.' },
      { q: 'What topics does the Indiana DMV knowledge test cover?', a: 'The test covers road signs, right-of-way rules, speed limits, traffic signals, safe following distance, parking rules, and DUI laws. These topics are largely the same across all U.S. states because they follow federal traffic standards and the Uniform Vehicle Code.' },
    ],
    related: [
      { href: '/california-dmv-practice-test', label: 'California practice test' },
      { href: '/california-dmv-road-signs-test', label: 'Road signs test' },
      { href: '/practice-test', label: 'All practice tests' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV cheat sheet' },
    ],
  },
};

export const HUB_SLUGS = Object.keys(HUBS);
export function getHub(slug: string): KeywordHub | undefined {
  return HUBS[slug];
}
