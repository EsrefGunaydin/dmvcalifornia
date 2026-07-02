import { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Wine, Palette, Timer, Ruler, TriangleAlert, TrendingDown,
  Navigation, ClipboardList, Shield,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'California DMV Cheat Sheet 2026 (Free Quick-Reference) | DMV California',
  description:
    'The free 2026 California DMV cheat sheet: BAC limits, curb colors, speed limits, signal distances, right-of-way, parking on hills, points & fines — every fact the written test loves to ask.',
  keywords: [
    'california dmv cheat sheet',
    'dmv permit test cheat sheet',
    'california dmv test cheat sheet 2026',
    'dmv written test answers',
    'dmv study guide california',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-cheat-sheet' },
  openGraph: {
    title: 'California DMV Cheat Sheet 2026 (Free Quick-Reference)',
    description: 'Every fact the California DMV written test loves to ask, on one page.',
    type: 'article',
  },
};

type Item = { term: string; detail: string };
type Section = { title: string; Icon: ComponentType<{ className?: string }>; items: Item[] };

const SECTIONS: Section[] = [
  {
    title: 'Alcohol & DUI limits',
    Icon: Wine,
    items: [
      { term: 'Legal BAC, age 21+', detail: '0.08%' },
      { term: 'Commercial drivers', detail: '0.04%' },
      { term: 'Under 21 (zero tolerance)', detail: '0.01%' },
      { term: 'Refusing a chemical test', detail: 'Automatic license suspension (implied consent)' },
      { term: 'Open container', detail: 'Illegal anywhere in the passenger area' },
    ],
  },
  {
    title: 'Curb colors',
    Icon: Palette,
    items: [
      { term: 'White', detail: 'Quick stop to pick up / drop off passengers or mail' },
      { term: 'Green', detail: 'Limited-time parking (time is posted)' },
      { term: 'Yellow', detail: 'Loading zone — stop only long enough to load/unload' },
      { term: 'Red', detail: 'No stopping, standing, or parking' },
      { term: 'Blue', detail: 'Disabled parking — placard or plate required' },
    ],
  },
  {
    title: 'Speed limits (unless posted)',
    Icon: Timer,
    items: [
      { term: 'Residential / business district', detail: '25 mph' },
      { term: 'Near a school (children present)', detail: '25 mph or less' },
      { term: 'Blind / uncontrolled intersection', detail: '15 mph' },
      { term: 'Alley', detail: '15 mph' },
      { term: 'Within 100 ft of a railroad crossing (no clear view)', detail: '15 mph' },
      { term: 'Most freeways (maximum)', detail: '65 mph (70 where posted)' },
    ],
  },
  {
    title: 'Signaling & distances',
    Icon: Ruler,
    items: [
      { term: 'Signal before a turn', detail: 'Continuously for the last 100 ft' },
      { term: 'Signal before a freeway lane change', detail: 'At least 5 seconds' },
      { term: 'Dim high beams — oncoming car', detail: 'Within 500 ft' },
      { term: 'Dim high beams — following a car', detail: 'Within 300 ft' },
      { term: 'Following distance', detail: '3-second rule (more in rain/fog/night)' },
      { term: 'Gap needed to merge / change lanes', detail: 'At least 4 seconds' },
    ],
  },
  {
    title: 'Right-of-way',
    Icon: TriangleAlert,
    items: [
      { term: 'Pedestrian in a crosswalk (marked or not)', detail: 'Always yield' },
      { term: '4-way stop / tie', detail: 'First to arrive goes; if tied, yield to the driver on your right' },
      { term: 'Roundabout', detail: 'Yield to traffic already in the circle' },
      { term: 'Emergency vehicle (lights/siren)', detail: 'Pull to the right and stop' },
      { term: 'T-intersection', detail: 'The through road has the right-of-way' },
    ],
  },
  {
    title: 'Parking on hills (turn your wheels…)',
    Icon: TrendingDown,
    items: [
      { term: 'Downhill (curb or no curb)', detail: 'Wheels toward the curb / edge' },
      { term: 'Uphill WITH a curb', detail: 'Wheels away from the curb' },
      { term: 'Uphill or downhill, NO curb', detail: 'Wheels toward the edge of the road' },
      { term: 'Always', detail: 'Set the parking brake' },
    ],
  },
  {
    title: 'Lights, stops & crossings',
    Icon: Navigation,
    items: [
      { term: 'Solid red arrow', detail: 'No turn — even after stopping' },
      { term: 'Flashing red light', detail: 'Treat as a stop sign' },
      { term: 'Flashing yellow light', detail: 'Slow down, proceed with caution' },
      { term: 'School bus red flashing lights', detail: 'Stop (both directions, unless divided by a barrier)' },
      { term: 'Railroad gates / flashing lights', detail: 'Stop at least 15 ft back' },
    ],
  },
  {
    title: 'Reports, points & fines',
    Icon: ClipboardList,
    items: [
      { term: 'Report a crash to DMV (SR-1)', detail: 'Within 10 days if injury, death, or over $1,000 damage' },
      { term: 'Sold or transferred your vehicle', detail: 'Notify DMV within 5 days' },
      { term: 'License suspension (negligent operator)', detail: '4 points in 12 mo, 6 in 24, or 8 in 36' },
      { term: 'How long convictions stay on record', detail: '~3 years (DUI ~10 years)' },
    ],
  },
  {
    title: 'Seat belts, kids & phones',
    Icon: Shield,
    items: [
      { term: 'Car seat / booster', detail: 'Under 8 years OR under 4 ft 9 in — ride in the back' },
      { term: 'Rear-facing seat', detail: 'Under 2 (unless 40+ lb or 40+ in)' },
      { term: 'Cell phone while driving', detail: 'Hands-free only; no holding or texting' },
      { term: 'Drivers under 18', detail: 'No phone use at all — except a true emergency' },
    ],
  },
];

const FAQ = [
  {
    q: 'How many questions are on the California DMV written test?',
    a: 'The California DMV knowledge test has 46 multiple-choice questions, and you need 38 correct (about 83%) to pass. If you are 18 or older, some versions have 36 questions with 30 to pass.',
  },
  {
    q: 'Can I bring this cheat sheet into the DMV?',
    a: 'No — notes are not allowed in the exam room. Use this cheat sheet to study beforehand, then take a few full practice tests so the facts are second nature.',
  },
  {
    q: 'Is this cheat sheet up to date for 2026?',
    a: 'Yes. It reflects current California rules of the road for 2026. Always confirm anything safety-critical against the official California Driver Handbook.',
  },
];

export default function CheatSheetPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Free · 2026 · one-page quick reference
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                California DMV Cheat Sheet
              </h1>
              <p className="text-xl text-white/90">
                Every number, color, and rule the written test loves to ask — on one page. Skim it,
                then take a practice test to lock it in.
              </p>
            </div>
          </div>
        </section>

        {/* Cheat sheet grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {SECTIONS.map((section) => (
                <div key={section.title} className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <section.Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    {section.title}
                  </h2>
                  <dl className="space-y-2.5">
                    {section.items.map((item) => (
                      <div key={item.term} className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <dt className="text-gray-700">{item.term}</dt>
                        <dd className="font-semibold text-gray-900 sm:text-right">{item.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <p className="max-w-5xl mx-auto text-sm text-gray-500 mt-6 text-center">
              Tip: press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl/Cmd&nbsp;+&nbsp;P</kbd> to print or save this cheat sheet as a PDF.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Now test yourself</h2>
              <p className="text-gray-600 mb-8">Reading is step one. Take a few free practice tests so these facts stick.</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/practice-test/california-dmv-practice-test-2026" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  Take the 2026 Practice Test →
                </Link>
                <Link href="/california-dmv-road-signs-test" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Road Signs Test
                </Link>
                <Link href="/20-hardest-dmv-written-test-questions" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  20 Hardest Questions
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Cheat Sheet — FAQ
              </h2>
              <div className="space-y-3">
                {FAQ.map((f, i) => (
                  <details key={i} className="group bg-white rounded-lg border border-gray-200 p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                      {f.q}
                      <span className="text-primary group-open:rotate-180 transition-transform ml-2">▾</span>
                    </summary>
                    <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
