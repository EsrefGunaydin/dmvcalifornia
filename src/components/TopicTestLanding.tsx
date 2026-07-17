import Link from 'next/link';
import type { ReactNode } from 'react';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';

export interface TopicFact {
  term: string;
  detail: string;
}
export interface TopicFaq {
  q: string;
  a: string;
}

export interface TopicTestLandingProps {
  icon: ReactNode;
  h1: string;
  /** Lead paragraph (HTML-free). */
  intro: string;
  /** Existing quiz slug to funnel into, e.g. practice-test-dui-laws-and-safety-requirements */
  quizSlug: string;
  quizLabel: string;
  factsTitle: string;
  facts: TopicFact[];
  faq: TopicFaq[];
  gradient?: string;
}

/**
 * Reusable SEO landing page for a single DMV topic. Holds unique study content
 * (facts + FAQ) and funnels to the matching practice quiz — no quiz duplication,
 * so no duplicate-content risk.
 */
export default function TopicTestLanding({
  icon,
  h1,
  intro,
  quizSlug,
  quizLabel,
  factsTitle,
  facts,
  faq,
  gradient = 'from-blue-600 via-indigo-600 to-purple-600',
}: TopicTestLandingProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className={`bg-gradient-to-r ${gradient} text-white py-14`}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                {icon}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{h1}</h1>
              <p className="text-xl text-white/90 mb-5">{intro}</p>
              <div className="flex justify-center">
                <QuizViewTracker
                  quizId={`topic-landing-${quizSlug}`}
                  baseViews={getBaseViews(`topic-landing-${quizSlug}`)}
                  variant="prominent"
                />
              </div>
              <Link
                href={`/practice-test/${quizSlug}`}
                className="inline-block mt-6 bg-white text-gray-900 font-semibold px-7 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {quizLabel} →
              </Link>
            </div>
          </div>
        </section>

        {/* Key facts */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{factsTitle}</h2>
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6">
                <dl className="space-y-3">
                  {facts.map((f) => (
                    <div key={f.term} className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <dt className="text-gray-700">{f.term}</dt>
                      <dd className="font-semibold text-gray-900 sm:text-right">{f.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* CTA to the quiz */}
        <section className="pb-4">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl border-2 border-primary/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to practice?</h2>
              <p className="text-gray-600 mb-6">Test yourself on these exact rules with instant feedback.</p>
              <Link href={`/practice-test/${quizSlug}`} className="inline-block bg-primary text-white px-7 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                {quizLabel} →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faq.map((f, i) => (
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

        {/* Internal links */}
        <section className="pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Keep studying</h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/california-dmv-cheat-sheet" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">DMV Cheat Sheet</Link>
                <Link href="/california-dmv-road-signs-test" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Road Signs Test</Link>
                <Link href="/practice-test/california-dmv-practice-test-2026" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Full 2026 Test</Link>
                <Link href="/practice-test" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">All Practice Tests</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
