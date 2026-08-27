import { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { Signpost, TrafficCone, ArrowUpDown, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';

export const metadata: Metadata = {
  title: 'NY DMV Manual Chapter 4: Traffic Control (2026 Guide)',
  description:
    'New York DMV driver\'s manual Chapter 4 guide: signs, traffic signals, pavement markings, and traffic officers — summarized from the official NY DMV manual, with a free practice quiz.',
  keywords: [
    'ny dmv chapter 4',
    'new york dmv traffic control',
    'ny dmv manual signs',
    'new york traffic signals test',
    'ny dmv pavement markings',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/new-york-dmv-manual-chapter-4-traffic-control' },
  openGraph: {
    title: 'NY DMV Manual Chapter 4: Traffic Control',
    description: 'Signs, signals, pavement markings, and traffic officers — summarized from the official NY DMV manual.',
    type: 'article',
  },
};

type Item = { term: string; detail: string };
type Section = { title: string; Icon: ComponentType<{ className?: string }>; items: Item[] };

const SECTIONS: Section[] = [
  {
    title: 'Signs',
    Icon: Signpost,
    items: [
      { term: 'Regulation signs', detail: 'White rectangles with black letters or symbols (some use red)' },
      { term: 'Warning signs', detail: 'Yellow and diamond-shaped, with black letters or symbols' },
      { term: 'Work area signs', detail: 'Orange, with black letters or symbols' },
      { term: 'Destination signs', detail: 'Green, with white letters and symbols' },
      { term: 'Service signs', detail: 'Blue, with white letters or symbols' },
      { term: 'Stop sign', detail: 'Red with white letters — full stop, yield, go when safe' },
      { term: 'Yield sign', detail: 'Red and white triangle — slow down, prepare to stop if needed' },
    ],
  },
  {
    title: 'Traffic signals',
    Icon: TrafficCone,
    items: [
      { term: 'Steady red', detail: 'Stop. A green arrow with a red light lets you go only toward the arrow' },
      { term: 'Flashing red', detail: 'Same as a stop sign — stop, yield, go when safe' },
      { term: 'Steady yellow', detail: 'Light is about to turn red — be prepared to stop' },
      { term: 'Flashing yellow', detail: 'Drive with caution — no stop required' },
      { term: 'Red arrow', detail: 'No turn in that direction until it changes, even on red' },
      { term: 'Green / green arrow', detail: 'Go, but still yield the right-of-way as required' },
      { term: 'Right turn on red', detail: 'Allowed after a full stop, unless a sign says otherwise (never in NYC unless posted)' },
    ],
  },
  {
    title: 'Pavement markings',
    Icon: ArrowUpDown,
    items: [
      { term: 'One broken line', detail: 'Pass or change lanes if safe and traffic isn\'t interfered with' },
      { term: 'Solid + broken line', detail: 'You may pass only from the broken-line side' },
      { term: 'Double solid lines', detail: 'No passing or lane changes — cross only to turn left into a driveway' },
      { term: 'One solid line', detail: 'Pass only if road obstructions or conditions make it necessary' },
      { term: 'Edge line angling inward', detail: 'Warns the road is getting narrower ahead' },
      { term: 'Stop / crosswalk lines', detail: 'Stop before the line — or before the crosswalk if there\'s no line' },
      { term: 'Diamond symbol', detail: 'Marks reserved lanes for buses, carpools, or other qualifying vehicles' },
    ],
  },
  {
    title: 'Traffic officers',
    Icon: Users,
    items: [
      { term: 'Priority', detail: 'A traffic officer\'s directions override any sign, signal, or pavement marking' },
      { term: 'Who counts', detail: 'Police officers, fire police, flag persons, school crossing guards, school bus drivers' },
      { term: 'Example', detail: 'If an officer waves you through a red light or stop sign, you must go' },
    ],
  },
];

const FAQ = [
  {
    q: 'What does Chapter 4 of the NY DMV manual cover?',
    a: 'Chapter 4, Traffic Control, covers signs (by shape and color), traffic signals (steady and flashing), pavement markings (lane lines, stop lines, crosswalks), and the priority of traffic officers over signs and signals.',
  },
  {
    q: 'Is Chapter 4 tested on the real New York permit exam?',
    a: 'Yes. The New York DMV website states that chapters 4 through 11, plus the road signs section, cover the material tested on the written knowledge test for a Class D, DJ, or E learner permit.',
  },
  {
    q: 'Who has priority: a traffic officer or a traffic light?',
    a: 'A traffic officer always takes priority over signs, signals, and pavement markings. If an officer directs you to stop at a green light or go through a red light, you must follow the officer.',
  },
  {
    q: 'Is this an official New York DMV page?',
    a: 'No. This is an independent study guide summarizing the official New York State Driver\'s Manual. For the original text, see the New York DMV website.',
  },
];

export default function NYChapter4Page() {
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
        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                New York DMV Manual · Chapter 4
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Traffic Control
              </h1>
              <p className="text-xl text-white/90 mb-5">
                Signs, traffic signals, pavement markings, and traffic officers — summarized from the official
                New York State Driver&apos;s Manual, with a free practice quiz.
              </p>
              <QuizViewTracker
                quizId="ny-chapter-4-guide"
                baseViews={getBaseViews('ny-chapter-4-guide')}
                variant="prominent"
                label="people have used this guide"
              />
            </div>
          </div>
        </section>

        {/* Content grid */}
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
              Summarized from the official New York State Driver&apos;s Manual, Chapter 4: Traffic Control.
              Always confirm anything safety-critical against the{' '}
              <a
                href="https://dmv.ny.gov/new-york-state-drivers-manual-and-practice-tests/chapter-4-traffic-control"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dmv-600 hover:underline"
              >
                official NY DMV manual
              </a>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Now test yourself</h2>
              <p className="text-gray-600 mb-8">
                18 real questions from the official Chapter 4 quiz, with answers verified against the manual.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/practice-test/new-york-dmv-chapter-4-traffic-control"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Take the Chapter 4 Practice Test →
                </Link>
                <Link
                  href="/new-york-dmv-practice-test"
                  className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  New York DMV Hub
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
                Chapter 4 — FAQ
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
