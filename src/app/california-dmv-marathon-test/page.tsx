import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import MarathonQuiz, { type MarathonQuestion } from '@/components/MarathonQuiz';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';
import quizzesData from '@/data/quizzes.json';

export const metadata: Metadata = {
  title: 'California DMV Marathon Test 2026: Every Question Until You Pass',
  description:
    'The California DMV marathon test — answer every practice question in one run, and any you miss come back until you get them all right. Free, unlimited, no signup.',
  keywords: [
    'california dmv marathon test',
    'all dmv test questions california',
    'dmv marathon practice test',
    'california dmv test questions and answers',
    'unlimited dmv practice test',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-marathon-test' },
  openGraph: { title: 'California DMV Marathon Test 2026', type: 'website' },
};

// Build the marathon pool: every unique English question (excluding image-based
// sign questions, which live in the road-signs test).
function buildPool(): MarathonQuestion[] {
  const seen = new Set<string>();
  const pool: MarathonQuestion[] = [];
  for (const quiz of quizzesData.quizzes as any[]) {
    if (quiz.language && quiz.language !== 'en') continue;
    for (const q of quiz.questions || []) {
      if (q.image) continue;
      if (!Array.isArray(q.options) || q.options.length < 2) continue;
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer >= q.options.length) continue;
      const key = q.question.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push({
        id: `${quiz.slug}-${q.id}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
      });
    }
  }
  return pool;
}

const pool = buildPool();

const FAQ = [
  {
    q: 'What is a DMV marathon test?',
    a: 'A marathon runs you through every practice question in one continuous session. Instead of stopping at a score, any question you miss is shoved to the back of the line and comes back until you answer it correctly — so you finish only when you have mastered all of them.',
  },
  {
    q: 'How many questions are in the marathon?',
    a: `This marathon covers ${pool.length} unique California DMV questions drawn from our full practice-test bank, covering road rules, right-of-way, signs, signals, parking, speed limits, DUI laws, and safe driving.`,
  },
  {
    q: 'Is the marathon test free?',
    a: 'Yes — it is completely free, unlimited, and needs no signup. It is the most thorough way to make sure there is no question type that can surprise you on the real California DMV written test.',
  },
];

export default function MarathonPage() {
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
        <section className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {pool.length} questions · free · unlimited
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                California DMV Marathon Test
              </h1>
              <p className="text-xl text-white/90 mb-5">
                Answer every question in one run. Miss one? It comes back until you get it right —
                you finish only when you&apos;ve mastered them all.
              </p>
              <QuizViewTracker
                quizId="en-marathon"
                baseViews={getBaseViews('en-marathon')}
                variant="prominent"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <MarathonQuiz questions={pool} marathonId="en-marathon" />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Marathon Test — FAQ</h2>
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
              <h2 className="text-xl font-bold text-gray-900 mb-5">More ways to study</h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/practice-test/california-dmv-practice-test-2026" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">2026 Practice Test</Link>
                <Link href="/california-dmv-road-signs-test" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Road Signs Test</Link>
                <Link href="/california-dmv-cheat-sheet" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cheat Sheet</Link>
                <Link href="/20-hardest-dmv-written-test-questions" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">20 Hardest</Link>
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
