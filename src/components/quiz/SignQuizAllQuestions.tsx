import type { SignQuestion } from '@/components/SignQuiz';

// Same rationale as QuizAllQuestions: SignQuiz only ever renders the current
// sign's image and text into the DOM, so the other N-1 signs per test never
// appear anywhere a crawler can read them. This is a plain server-rendered
// section, independent of SignQuiz's own client-side state.
export default function SignQuizAllQuestions({
  questions,
  label,
  dir,
}: {
  questions: SignQuestion[];
  label: string;
  dir: 'ltr' | 'rtl';
}) {
  return (
    <details className="bg-white rounded-lg shadow-sm p-6 mt-6 group" dir={dir}>
      <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-lg text-gray-900">
        <span>{label}</span>
        <span className="text-primary group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="mt-6 space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={q.image}
                alt={`Road sign ${i + 1}`}
                className="w-24 h-24 object-contain flex-shrink-0"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-2">
                  {i + 1}. {q.question}
                </p>
                <ul className="space-y-1 mb-2">
                  {q.options.map((opt, oi) => (
                    <li
                      key={oi}
                      className={oi === q.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-600'}
                    >
                      {oi === q.correctAnswer ? '✓ ' : ''}
                      {opt}
                    </li>
                  ))}
                </ul>
                {q.explanation && <p className="text-sm text-gray-500">{q.explanation}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
