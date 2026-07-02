import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import SignQuiz, { type SignQuestion } from '@/components/SignQuiz';
import LanguagePills from '@/components/LanguagePills';
import signData from '@/data/road-signs-test.json';
import { ROAD_SIGN_LANG_CODES } from '@/data/road-signs-i18n';

const questions = signData.questions as SignQuestion[];

const SITE = 'https://dmvcalifornia.us';
const BASE_PATH = '/california-dmv-road-signs-test';
const hreflang: Record<string, string> = {
  en: `${SITE}${BASE_PATH}`,
  'x-default': `${SITE}${BASE_PATH}`,
};
for (const code of ROAD_SIGN_LANG_CODES) hreflang[code] = `${SITE}${BASE_PATH}/${code}`;

export const metadata: Metadata = {
  title: 'California DMV Road Signs Test 2026 — Regulatory, Warning & Guide Signs (Free)',
  description:
    'Free California DMV road signs practice test with real sign images. Practice all regulatory signs, warning signs, and guide signs — instant answers and explanations.',
  keywords: [
    'california road signs test',
    'california regulatory signs test',
    'dmv sign test california',
    'california dmv road signs practice test',
    'regulatory signs california',
    'traffic signs test',
    'road signs and meanings',
  ],
  alternates: {
    canonical: 'https://dmvcalifornia.us/california-dmv-road-signs-test',
    languages: hreflang,
  },
  openGraph: {
    title: 'California DMV Road Signs Test 2026 (Free, With Images)',
    description: 'Identify real California traffic signs and learn what each one means.',
    type: 'website',
  },
};

const FAQ = [
  {
    q: 'How many road signs questions are on the California DMV test?',
    a: 'Road signs and signals make up roughly a quarter of the 46-question California DMV written test. Knowing the regulatory, warning, and guide signs by sight is one of the fastest ways to raise your score.',
  },
  {
    q: 'What are the three main types of road signs?',
    a: 'Regulatory signs (what you must or must not do, like stop and speed limits), warning signs (yellow diamonds alerting you to hazards ahead), and guide signs (directions, distances, and services).',
  },
  {
    q: 'Is this California road signs practice test free?',
    a: 'Yes. This test is 100% free, uses real sign images, and gives you the correct answer and a short explanation for every sign — retake it as many times as you like.',
  },
  {
    q: 'Do I have to memorize the wording on signs?',
    a: 'No. Focus on what each sign means and what action it requires. The DMV cares that you respond correctly to the sign, not that you recite its exact text.',
  },
];

export default function RoadSignsTestPage() {
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
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <LanguagePills active="en" />
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {questions.length} real sign images · free
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                California DMV Road Signs Test
              </h1>
              <p className="text-xl text-white/90">
                Look at each real California traffic sign, pick what it means, and get the answer
                plus a quick explanation instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <p className="text-gray-700 leading-relaxed">
                Road signs and signals are about <strong>a quarter of the California DMV written
                test</strong> — and they&apos;re the easiest points to lock in, because you either
                recognize the sign or you don&apos;t. This test shows you the <strong>actual signs</strong>{' '}
                (regulatory, warning, and guide) so you learn them by sight.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive sign quiz */}
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <SignQuiz questions={questions} />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Road Signs Test — FAQ
              </h2>
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

        {/* Internal links */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Keep studying</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/california-dmv-cheat-sheet" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  DMV Cheat Sheet →
                </Link>
                <Link href="/practice-test/california-dmv-practice-test-2026" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Full 2026 Practice Test
                </Link>
                <Link href="/20-hardest-dmv-written-test-questions" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  20 Hardest Questions
                </Link>
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
