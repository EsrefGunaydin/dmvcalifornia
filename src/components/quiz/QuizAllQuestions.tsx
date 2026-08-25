import type { Question } from '@/types/quiz';

// Plain server-rendered content, deliberately separate from QuizEngine's
// client-side shuffle/localStorage flow. The interactive quiz only ever
// shows one question's text in the DOM at a time (the rest live behind
// client-side pagination), so this gives crawlers and reviewing users the
// full, real question set regardless of JS execution timing.
export default function QuizAllQuestions({ questions }: { questions: Question[] }) {
  return (
    <details className="bg-white rounded-lg shadow-sm p-6 mt-6 group">
      <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-lg text-gray-900">
        <span>Review all {questions.length} questions and answers</span>
        <span className="text-primary group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="mt-6 space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
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
        ))}
      </div>
    </details>
  );
}
