'use client';

import { useMemo, useState } from 'react';
import QuizAd from '@/components/QuizAd';

export interface MarathonQuestion {
  id: number | string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const LETTERS = ['A', 'B', 'C', 'D'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MarathonQuiz({ questions }: { questions: MarathonQuestion[] }) {
  const total = questions.length;
  // The whole point of marathon mode: keep going until every question is
  // answered correctly once. Wrong answers go to the back of the queue.
  const [queue, setQueue] = useState<MarathonQuestion[]>(() => shuffle(questions));
  const [mastered, setMastered] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [step, setStep] = useState(0); // drives the per-question ad refresh

  const current = queue[0];
  const revealed = picked !== null;
  const done = queue.length === 0;

  const next = () => {
    if (picked === null) return;
    const correct = picked === current.correctAnswer;
    setQueue((q) => {
      const [head, ...rest] = q;
      return correct ? rest : [...rest, head];
    });
    if (correct) setMastered((m) => m + 1);
    setPicked(null);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setQueue(shuffle(questions));
    setMastered(0);
    setPicked(null);
    setStep(0);
  };

  const progress = total ? Math.round((mastered / total) * 100) : 0;

  if (done) {
    return (
      <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl border-2 border-green-200 shadow-sm p-10">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Marathon complete!</h2>
        <p className="text-gray-600 mb-6">
          You answered all {total} questions correctly. If you can clear the marathon, you&apos;re
          ready for the real California DMV test.
        </p>
        <button onClick={restart} className="bg-primary text-white px-7 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="sticky top-2 z-20 mb-8 rounded-xl bg-white/95 backdrop-blur border-2 border-gray-200 shadow-sm px-5 py-3">
        <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-2">
          <span>
            Mastered <span className="font-bold text-green-600">{mastered}</span>/{total}
          </span>
          <span>{queue.length} left</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6">
        {current.explanation !== undefined && (
          <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            Marathon question
          </div>
        )}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">{current.question}</h3>

        <div className="space-y-3">
          {current.options.map((opt, oi) => {
            const isCorrect = oi === current.correctAnswer;
            const isPicked = picked === oi;
            let cls = 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5';
            if (revealed) {
              if (isCorrect) cls = 'border-green-500 bg-green-50';
              else if (isPicked) cls = 'border-red-400 bg-red-50';
              else cls = 'border-gray-200 bg-white opacity-60';
            }
            return (
              <button
                key={oi}
                type="button"
                disabled={revealed}
                onClick={() => setPicked(oi)}
                className={`w-full text-left flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all ${cls}`}
              >
                <span className="font-bold text-gray-500 mt-0.5">{LETTERS[oi]}.</span>
                <span className="flex-1 text-gray-900">{opt}</span>
                {revealed && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                {revealed && isPicked && !isCorrect && <span className="text-red-500 font-bold">✗</span>}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-5 rounded-xl bg-gray-50 border border-gray-200 p-4">
            <span className="font-bold text-gray-900">
              {picked === current.correctAnswer ? 'Correct!' : 'Not quite — this one comes back later.'}
            </span>
            {current.explanation && <p className="text-gray-700 mt-1 leading-relaxed">{current.explanation}</p>}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={next}
            disabled={!revealed}
            className="bg-primary text-white px-7 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Ad refreshes on each question advance */}
      <QuizAd currentQuestionIndex={step} />
    </div>
  );
}
