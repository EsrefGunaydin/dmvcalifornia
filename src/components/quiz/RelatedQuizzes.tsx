import Link from 'next/link';

export interface RelatedQuiz {
  slug: string;
  title: string;
  category: string;
  questionCount: number;
  language?: string;
}

const FLAG: Record<string, string> = {
  es: '🇪🇸', tr: '🇹🇷', zh: '🇨🇳', ar: '🇸🇦', hy: '🇦🇲',
  fa: '🇮🇷', pa: '🇮🇳', ru: '🇷🇺', tl: '🇵🇭', vi: '🇻🇳',
};

/**
 * "Keep practicing" cross-links shown at the end of a quiz. Encourages another
 * test in the same session, which lifts pageviews-per-session.
 */
export default function RelatedQuizzes({ quizzes }: { quizzes: RelatedQuiz[] }) {
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
                    <span className="text-base">{FLAG[q.language] || '🌐'}</span>
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
        </div>
      </div>
    </section>
  );
}
