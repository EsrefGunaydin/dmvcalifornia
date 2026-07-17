import Link from 'next/link';
import { Globe, Shuffle } from 'lucide-react';

export interface RelatedQuiz {
  slug: string;
  title: string;
  category: string;
  questionCount: number;
  language?: string;
}

interface RelatedQuizzesProps {
  quizzes: RelatedQuiz[];
  /** When set, shows a CTA to that language's Practice Test Simulator. */
  simulatorLang?: string;
}

/**
 * "Keep practicing" cross-links shown at the end of a quiz. Encourages another
 * test in the same session, which lifts pageviews-per-session.
 */
export default function RelatedQuizzes({ quizzes, simulatorLang }: RelatedQuizzesProps) {
  if (!quizzes.length) return null;

  return (
    <section className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Keep practicing
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Finished this one? Try another free DMV practice test.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quizzes.map((q) => (
              <Link
                key={q.slug}
                href={`/practice-test/${q.slug}`}
                className="bg-gray-50 hover:bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-primary/40 hover:shadow-md transition-all group"
                dir={q.language === 'ar' || q.language === 'fa' ? 'rtl' : 'auto'}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {q.category}
                  </span>
                  {q.language && q.language !== 'en' && (
                    <Globe className="w-4 h-4 text-gray-500" aria-label={`Language: ${q.language}`} />
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {q.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{q.questionCount} Questions</span>
                  <span className="text-primary font-semibold group-hover:underline">Start →</span>
                </div>
              </Link>
            ))}
          </div>

          {simulatorLang && (
            <Link
              href={`/practice-test/simulator/${simulatorLang}`}
              className="mt-5 flex items-center justify-between gap-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Shuffle className="w-6 h-6 text-gray-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">Want a different set of questions?</p>
                  <p className="text-sm text-gray-600">
                    Try the Practice Test Simulator, a fresh random draw every attempt.
                  </p>
                </div>
              </div>
              <span className="text-primary font-semibold whitespace-nowrap group-hover:underline">
                Try it →
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
