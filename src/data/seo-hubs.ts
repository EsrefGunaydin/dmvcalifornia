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
          'Standard renewal fee applies ($36 for Class C)',
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
          { href: '/practice-test/examen-dmv-espanol-1', label: 'Examen DMV Español 1', questions: 20 },
          { href: '/practice-test/examen-dmv-espanol-2', label: 'Examen DMV Español 2', questions: 20 },
          { href: '/practice-test/dmv-spanish-practice-test-1', label: 'Examen de Práctica Completo', questions: 40 },
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
};

export const HUB_SLUGS = Object.keys(HUBS);
export function getHub(slug: string): KeywordHub | undefined {
  return HUBS[slug];
}
