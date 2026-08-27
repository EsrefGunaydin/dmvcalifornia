import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';

export const metadata: Metadata = {
  title: 'How to Study for the California DMV Test 2026: Complete Study Guide',
  description:
    'A step-by-step study plan for the California DMV written test: handbook, cheat sheet, road signs, topic tests, full simulators, and a marathon — everything free, in one place.',
  keywords: [
    'how to study for california dmv test',
    'california dmv study guide',
    'california dmv test study plan',
    'pass california dmv written test',
    'california permit test study guide',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-test-study-guide' },
  openGraph: { title: 'How to Study for the California DMV Test 2026', type: 'article' },
};

type Step = { n: number; title: string; body: string; links: { href: string; label: string }[] };

const STEPS: Step[] = [
  {
    n: 1,
    title: 'Start with the facts',
    body: 'Skim the official California Driver Handbook, then keep our one-page cheat sheet handy for the numbers and rules the test loves to ask.',
    links: [
      { href: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/', label: 'Official handbook ↗' },
      { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet' },
    ],
  },
  {
    n: 2,
    title: 'Learn the road signs by sight',
    body: 'Signs are about a quarter of the test and the easiest points to lock in. Drill them with real sign images — available in 11 languages.',
    links: [
      { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
      { href: '/california-dmv-road-signs-test/es', label: 'En español' },
    ],
  },
  {
    n: 3,
    title: 'Drill the tricky topics',
    body: 'Target the subjects people miss most — alcohol & DUI limits, parking and curb colors, and speed limits.',
    links: [
      { href: '/california-dmv-drug-and-alcohol-test', label: 'Drug & Alcohol' },
      { href: '/california-dmv-parking-test', label: 'Parking' },
      { href: '/california-dmv-speed-limit-test', label: 'Speed Limits' },
    ],
  },
  {
    n: 4,
    title: 'Take full practice tests',
    body: 'Simulate the real 46-question exam end to end. Pass with 83%, then take another — questions and answers reshuffle every time.',
    links: [
      { href: '/practice-test/california-dmv-practice-test-2026', label: '2026 Practice Test' },
      { href: '/practice-test', label: 'All practice tests' },
    ],
  },
  {
    n: 5,
    title: 'Beat the hardest questions',
    body: 'Once you are scoring well, make sure the trickiest, most-missed questions can not surprise you.',
    links: [{ href: '/20-hardest-dmv-written-test-questions', label: 'The 20 Hardest Questions' }],
  },
  {
    n: 6,
    title: 'Go the distance',
    body: 'Run the marathon: every question in one session, with any you miss coming back until you have mastered them all. Clear it and you are ready.',
    links: [{ href: '/california-dmv-marathon-test', label: 'Marathon Test' }],
  },
  {
    n: 7,
    title: 'Study in your language',
    body: 'Prefer another language? Take full practice tests and flashcards in Spanish, Chinese, Arabic, Armenian, Farsi, Punjabi, Russian, Tagalog, Turkish, or Vietnamese.',
    links: [
      { href: '/practice-test/flashcards', label: 'Flashcards' },
      { href: '/practice-test', label: 'Language tests' },
    ],
  },
];

const LOGISTICS = [
  { href: '/california-drivers-license-renewal-2026', label: 'License renewal' },
  { href: '/california-dmv-fees', label: 'DMV fees' },
  { href: '/dmv-offices', label: 'Find a DMV office' },
];

const FAQ = [
  {
    q: 'How long does it take to study for the California DMV test?',
    a: 'Most people are ready in one to two focused weeks. Read the handbook and cheat sheet, drill road signs and the tricky topics, then take full practice tests until you consistently score 85% or higher.',
  },
  {
    q: 'How many questions are on the California DMV written test, and what is the passing score?',
    a: 'The test has 46 multiple-choice questions and you need 38 correct (about 83%) to pass. Applicants 18 and older may get a 36-question version with 30 to pass.',
  },
  {
    q: 'What is the best way to study for the DMV test?',
    a: 'Active recall beats re-reading. Take practice tests, read the explanation for every question (even the ones you got right), and re-take until the rules are automatic. The marathon and the 20 hardest questions are great final checks.',
  },
];

export default function StudyGuidePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                How to Study for the California DMV Test
              </h1>
              <p className="text-xl text-white/90 mb-5">
                A simple 7-step plan using free tools — from the handbook to a full marathon. Follow
                it in order and walk into the DMV ready.
              </p>
              <QuizViewTracker
                quizId="study-guide"
                baseViews={getBaseViews('study-guide')}
                variant="prominent"
                label="people have followed this study guide"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-5">
              {STEPS.map((s) => (
                <div key={s.n} className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-extrabold">
                      {s.n}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{s.title}</h2>
                      <p className="text-gray-600 mb-3">{s.body}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.links.map((l) => {
                          const external = l.href.startsWith('http');
                          return external ? (
                            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                              {l.label}
                            </a>
                          ) : (
                            <Link key={l.href} href={l.href} className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                              {l.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Logistics */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Before & after the test</h2>
                <div className="flex flex-wrap gap-2">
                  {LOGISTICS.map((l) => (
                    <Link key={l.href} href={l.href} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Study Guide — FAQ</h2>
              <div className="space-y-3">
                {FAQ.map((f, i) => (
                  <details key={i} className="group bg-gray-50 rounded-lg border border-gray-200 p-4">
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
