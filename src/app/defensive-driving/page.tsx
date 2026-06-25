import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import MultiplexAd from '@/components/MultiplexAd';
import { AFFILIATE_CREATIVES } from '@/config/affiliate-creatives';

const SITE_URL = 'https://www.dmvcalifornia.us';

export const metadata: Metadata = {
  title: 'Defensive Driving: 5 Rules Every Driver Should Know (2026)',
  description:
    'The 5 rules of defensive driving — scan ahead, know your surroundings, keep your eyes moving, plan for the worst, and stay visible. Free practice test to prepare for the California DMV exam.',
  keywords: [
    'defensive driving',
    'defensive driving techniques',
    '5 rules of defensive driving',
    'california defensive driving',
    'defensive driving test',
    'what is defensive driving',
  ],
  alternates: { canonical: `${SITE_URL}/defensive-driving` },
  openGraph: {
    title: 'Defensive Driving: 5 Rules Every Driver Should Know (2026)',
    description:
      'The 5 rules of defensive driving with a free California DMV practice test. Based on official DMV guidelines.',
    type: 'article',
    url: `${SITE_URL}/defensive-driving`,
  },
};

const RULES = [
  {
    n: 1,
    title: 'Scan High Ahead',
    key: '15-second eye lead time',
    body: 'Look ahead a minimum of 15 seconds. Most drivers only have a 2–3 second eye lead time. Good eye lead time helps you plan for danger before it reaches you.',
    svg: (
      <svg viewBox="0 0 64 48" fill="none" className="w-16 h-12 mx-auto mb-3" aria-hidden="true">
        {/* Road */}
        <path d="M4 44 L32 20 L60 44" stroke="#94a3b8" strokeWidth="2" fill="none" />
        <path d="M20 44 L32 28 L44 44" stroke="#e2e8f0" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
        {/* Eye */}
        <ellipse cx="32" cy="14" rx="10" ry="6" stroke="#4e80c4" strokeWidth="2" fill="#eef3fa" />
        <circle cx="32" cy="14" r="3" fill="#4e80c4" />
        {/* Arrow */}
        <path d="M32 8 L32 4 M30 6 L32 4 L34 6" stroke="#4e80c4" strokeWidth="1.5" strokeLinecap="round" />
        {/* 15s label */}
        <text x="44" y="10" fontSize="7" fill="#4e80c4" fontWeight="bold">15s</text>
      </svg>
    ),
  },
  {
    n: 2,
    title: 'Know What\'s Around You',
    key: '4-second following distance + scan mirrors every 5–8 seconds',
    body: 'Keep a 4-second minimum following distance at speeds up to 40 MPH, then add 1 second for every 10 MPH over 40 (5 sec at 50, 6 sec at 60). Scan your mirrors every 5–8 seconds. In hazardous conditions, extend following distance as needed.',
    svg: (
      <svg viewBox="0 0 64 48" fill="none" className="w-16 h-12 mx-auto mb-3" aria-hidden="true">
        {/* Lead car */}
        <rect x="6" y="20" width="18" height="10" rx="2" fill="#94a3b8" />
        <rect x="8" y="17" width="14" height="5" rx="1" fill="#cbd5e1" />
        <circle cx="10" cy="31" r="2.5" fill="#475569" />
        <circle cx="20" cy="31" r="2.5" fill="#475569" />
        {/* Distance arrow */}
        <path d="M26 25 L38 25" stroke="#4e80c4" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arr)" />
        <text x="28" y="22" fontSize="6" fill="#4e80c4" fontWeight="bold">4s</text>
        {/* Following car */}
        <rect x="38" y="20" width="18" height="10" rx="2" fill="#4e80c4" />
        <rect x="40" y="17" width="14" height="5" rx="1" fill="#6a94cd" />
        <circle cx="42" cy="31" r="2.5" fill="#2f4870" />
        <circle cx="52" cy="31" r="2.5" fill="#2f4870" />
        {/* Mirror */}
        <ellipse cx="58" cy="14" rx="5" ry="4" stroke="#4e80c4" strokeWidth="1.5" fill="#eef3fa" />
        <path d="M54 18 L56 16" stroke="#4e80c4" strokeWidth="1" />
      </svg>
    ),
  },
  {
    n: 3,
    title: 'Maintain Eye Movement',
    key: 'Never focus on one object for more than 2 seconds',
    body: 'Staring at something for more than a few seconds causes a blank or fixed stare, which reduces peripheral vision. Keep your eyes moving constantly — check mirrors, scan intersections, and monitor your gauges in short glances.',
    svg: (
      <svg viewBox="0 0 64 48" fill="none" className="w-16 h-12 mx-auto mb-3" aria-hidden="true">
        {/* Eye */}
        <ellipse cx="32" cy="24" rx="14" ry="8" stroke="#4e80c4" strokeWidth="2" fill="#eef3fa" />
        <circle cx="32" cy="24" r="4" fill="#4e80c4" />
        <circle cx="33" cy="23" r="1.5" fill="white" />
        {/* Sweep arrows left and right */}
        <path d="M12 24 Q18 16 26 20" stroke="#6a94cd" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M10 22 L12 24 L14 21" stroke="#6a94cd" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M52 24 Q46 16 38 20" stroke="#6a94cd" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M54 22 L52 24 L50 21" stroke="#6a94cd" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* max 2s */}
        <text x="22" y="38" fontSize="7" fill="#4e80c4" fontWeight="bold">max 2s</text>
      </svg>
    ),
  },
  {
    n: 4,
    title: 'Plan for the Worst',
    key: 'Surround yourself with space — always have an escape route',
    body: 'Always have an exit planned in the event of danger. Protect the space around your vehicle at all times by positioning yourself where you have the most options. Never trap yourself with no escape route.',
    svg: (
      <svg viewBox="0 0 64 48" fill="none" className="w-16 h-12 mx-auto mb-3" aria-hidden="true">
        {/* Space bubble */}
        <ellipse cx="32" cy="24" rx="26" ry="18" stroke="#b9cfe9" strokeWidth="1.5" strokeDasharray="3 2" fill="#eef3fa" />
        <ellipse cx="32" cy="24" rx="18" ry="12" stroke="#4e80c4" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        {/* Car */}
        <rect x="22" y="20" width="20" height="10" rx="2" fill="#4e80c4" />
        <rect x="24" y="17" width="16" height="5" rx="1" fill="#6a94cd" />
        <circle cx="26" cy="31" r="2.5" fill="#2f4870" />
        <circle cx="38" cy="31" r="2.5" fill="#2f4870" />
        {/* Exit arrows */}
        <path d="M50 24 L58 24 M55 21 L58 24 L55 27" stroke="#4e80c4" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: 5,
    title: 'Make Sure Others See You',
    key: 'Use lights, eye contact, and warning devices',
    body: 'Make sure other drivers see you. Use headlights, signal early, and make eye contact at intersections. Only reverse when absolutely necessary. Be tolerant of other drivers — patience keeps you aware of hazards and gives you time to react.',
    svg: (
      <svg viewBox="0 0 64 48" fill="none" className="w-16 h-12 mx-auto mb-3" aria-hidden="true">
        {/* Car body */}
        <rect x="18" y="20" width="20" height="10" rx="2" fill="#4e80c4" />
        <rect x="20" y="17" width="16" height="5" rx="1" fill="#6a94cd" />
        <circle cx="22" cy="31" r="2.5" fill="#2f4870" />
        <circle cx="34" cy="31" r="2.5" fill="#2f4870" />
        {/* Headlight beams */}
        <path d="M18 22 L6 18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <path d="M18 25 L4 24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M18 28 L6 32" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {/* Visibility rays right */}
        <path d="M38 22 L50 18" stroke="#4e80c4" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
        <path d="M38 25 L52 25" stroke="#4e80c4" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
        <path d="M38 28 L50 32" stroke="#4e80c4" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const TESTS = [
  { href: '/practice-test/practice-test-safe-driving-and-defensive-techniques', label: 'Safe Driving & Defensive Techniques', q: 22 },
  { href: '/practice-test/practice-test-weather-and-night-driving', label: 'Weather & Night Driving', q: 14 },
  { href: '/practice-test/practice-test-special-driving-situations', label: 'Special Driving Situations', q: 15 },
  { href: '/practice-test/practice-test-dui-laws-and-safety-requirements', label: 'DUI Laws & Safety', q: 13 },
  { href: '/practice-test/practice-test-sharing-the-road', label: 'Sharing the Road', q: 15 },
  { href: '/california-dmv-practice-test', label: 'Full California DMV Practice Test', q: undefined },
];

const FAQ = [
  {
    q: 'What is defensive driving?',
    a: 'Defensive driving is a set of driving skills that lets you defend yourself against possible collisions caused by bad drivers, drunk drivers, and poor weather conditions. Unlike ordinary driving, defensive driving means actively anticipating and reacting to hazards before they become accidents.',
  },
  {
    q: 'What are the 5 rules of defensive driving?',
    a: '(1) Scan High Ahead — maintain at least 15 seconds of eye lead time. (2) Know What\'s Around You — 4-second following distance and scan mirrors every 5–8 seconds. (3) Maintain Eye Movement — never focus on one object for more than 2 seconds. (4) Plan for the Worst — always have an escape route and protect the space around your vehicle. (5) Make Sure Others See You — use lights, signal early, and make eye contact at intersections.',
  },
  {
    q: 'Does defensive driving lower insurance in California?',
    a: 'Completing a state-approved defensive driving course can qualify you for a California insurance discount. Many insurers offer 5–10% discounts for completing an approved course. Check with your insurer for their specific requirements.',
  },
  {
    q: 'Is there a defensive driving test on the California DMV written exam?',
    a: 'Yes. The California DMV knowledge test includes questions on safe driving techniques, following distance, and hazard awareness — all core elements of defensive driving. Our free practice test covers these topics to help you prepare.',
  },
  {
    q: 'Where can I take a defensive driving course in California?',
    a: 'California offers DMV-approved defensive driving courses online and in person. Online options (such as IMPROV) let you complete the course at your own pace. These courses are also used for traffic ticket dismissal and insurance discounts.',
  },
];

const affiliateCreative = AFFILIATE_CREATIVES['ts-300x250'];

export default function DefensiveDrivingPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Defensive Driving', item: `${SITE_URL}/defensive-driving` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-dmv-600 via-dmv-500 to-dmv-700 text-white py-14">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="text-sm text-white/80 mb-5">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5">›</span>
              <span className="text-white">Defensive Driving</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Defensive Driving:<br />The 5 Rules Every Driver Needs
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mb-2">
              Defensive driving saves lives. These five rules — used by professional drivers and taught in every
              state-approved course — are also tested on the California DMV written exam.
            </p>
            <p className="text-sm text-white/70 mb-6">
              Based on California DMV guidelines · free · no signup required
            </p>
            <Link
              href="/practice-test/practice-test-safe-driving-and-defensive-techniques"
              className="inline-block bg-white text-dmv-700 font-bold px-6 py-3 rounded-lg shadow hover:bg-dmv-50 transition-colors"
            >
              Take the free defensive driving test →
            </Link>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* 5 Rules */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              The 5 Rules of Defensive Driving
            </h2>
            <p className="text-gray-600 mb-8">
              Master these five rules and you&apos;ll be ahead of most drivers on the road — and well-prepared for the California DMV written test.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {RULES.map((rule) => (
                <div
                  key={rule.n}
                  className="bg-white rounded-2xl border-2 border-gray-100 hover:border-dmv-300 transition-colors p-6 flex flex-col"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dmv-600 text-white font-extrabold flex items-center justify-center text-lg">
                      {rule.n}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-0.5">Rule {rule.n}: {rule.title}</h3>
                      <p className="text-xs font-semibold text-dmv-600 uppercase tracking-wide mb-3">{rule.key}</p>
                    </div>
                  </div>
                  <div className="mt-2">{rule.svg}</div>
                  <p className="text-gray-700 text-sm leading-relaxed">{rule.body}</p>
                </div>
              ))}
            </div>
          </section>

          <MultiplexAd />

          {/* Practice tests */}
          <section className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Test your defensive driving knowledge</h2>
            <p className="text-gray-600 mb-6">
              These free practice tests cover defensive driving, weather conditions, hazard awareness, and more — all topics on the California DMV written exam.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TESTS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group bg-white rounded-xl border-2 border-gray-100 hover:border-dmv-400 hover:shadow-md transition-all p-4 flex items-center justify-between gap-2"
                >
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-dmv-700 transition-colors">
                    {t.label}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {t.q ? `${t.q} Q →` : '→'}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* IMPROV affiliate CTA */}
          {affiliateCreative && affiliateCreative.code && (
            <section className="my-12 bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Sponsored</p>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Need a defensive driving course in California?
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                IMPROV is a DMV-approved, fully online traffic school — complete the course at your own pace for ticket dismissal or an insurance discount.
              </p>
              <div
                dangerouslySetInnerHTML={{ __html: affiliateCreative.code }}
                className="max-w-sm"
              />
            </section>
          )}

          {/* FAQ */}
          <section className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="group bg-white rounded-lg border border-gray-200 p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {f.q}
                    <span className="text-dmv-500 group-open:rotate-180 transition-transform ml-2 flex-shrink-0">▾</span>
                  </summary>
                  <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Cross-links */}
          <section className="my-10 bg-dmv-50 border border-dmv-100 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold text-dmv-800 mb-3">Keep studying</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/california-dmv-practice-test" className="bg-dmv-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-dmv-700 transition-colors text-sm">
                Full Practice Test →
              </Link>
              <Link href="/california-dmv-road-signs-test" className="bg-white text-dmv-700 border border-dmv-200 px-4 py-2.5 rounded-lg font-medium hover:bg-dmv-600 hover:text-white transition-colors text-sm">
                Road Signs Test
              </Link>
              <Link href="/california-dmv-cheat-sheet" className="bg-white text-dmv-700 border border-dmv-200 px-4 py-2.5 rounded-lg font-medium hover:bg-dmv-600 hover:text-white transition-colors text-sm">
                DMV Cheat Sheet
              </Link>
              <Link href="/california-dmv-test-study-guide" className="bg-white text-dmv-700 border border-dmv-200 px-4 py-2.5 rounded-lg font-medium hover:bg-dmv-600 hover:text-white transition-colors text-sm">
                Study Guide
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
