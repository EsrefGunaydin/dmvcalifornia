'use client';

import { useState } from 'react';

export interface SignQuestion {
  id: number;
  image: string;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation?: string;
}

export interface SignQuizLabels {
  answered: string;
  correct: string;
  pickPrompt: string;
  correctWord: string;
  answerWord: string;
}

const DEFAULT_LABELS: SignQuizLabels = {
  answered: 'Answered',
  correct: 'correct',
  pickPrompt: 'Pick an answer to reveal the meaning.',
  correctWord: 'Correct!',
  answerWord: 'Answer:',
};

const LETTERS = ['A', 'B', 'C', 'D'];

export default function SignQuiz({
  questions,
  labels,
  dir = 'ltr',
}: {
  questions: SignQuestion[];
  labels?: Partial<SignQuizLabels>;
  dir?: 'ltr' | 'rtl';
}) {
  const t: SignQuizLabels = { ...DEFAULT_LABELS, ...labels };
  const [picks, setPicks] = useState<Record<number, number>>({});
  const answered = Object.keys(picks).length;
  const correct = questions.filter((q) => picks[q.id] === q.correctAnswer).length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Scoreboard */}
      <div className="sticky top-2 z-20 mb-8 flex items-center justify-between gap-4 rounded-xl bg-white/95 backdrop-blur border-2 border-gray-200 shadow-sm px-5 py-3">
        <span className="text-sm font-medium text-gray-600">
          {t.answered} <span className="font-bold text-gray-900">{answered}</span>/{questions.length}
        </span>
        <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(answered / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600">
          <span className="font-bold text-green-600">{correct}</span> {t.correct}
        </span>
      </div>

      <div className="space-y-10">
        {questions.map((q, idx) => {
          const picked = picks[q.id];
          const revealed = picked !== undefined;

          return (
            <div
              key={q.id}
              id={`sign-${q.id}`}
              className="scroll-mt-24 bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 pt-6">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-extrabold">
                  {idx + 1}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {q.question || 'What does this sign mean?'}
                </h3>
              </div>

              {/* Sign image */}
              <div className="flex justify-center py-6">
                <img
                  src={q.image}
                  alt={`California DMV road sign — question ${idx + 1}`}
                  className="max-h-48 w-auto object-contain"
                  loading="lazy"
                />
              </div>

              {/* Options */}
              <div className="px-6 pb-4 space-y-3">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctAnswer;
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
                      onClick={() => setPicks((p) => ({ ...p, [q.id]: oi }))}
                      className={`w-full text-left flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all ${cls}`}
                    >
                      <span className="font-bold text-gray-500 mt-0.5">{LETTERS[oi]}.</span>
                      <span className="flex-1 text-gray-900" dir={dir}>{opt}</span>
                      {revealed && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                      {revealed && isPicked && !isCorrect && <span className="text-red-500 font-bold">✗</span>}
                    </button>
                  );
                })}
              </div>

              {!revealed ? (
                <p className="px-6 pb-6 -mt-1 text-sm text-gray-400">{t.pickPrompt}</p>
              ) : (
                <div className="mx-6 mb-6 rounded-xl bg-gray-50 border border-gray-200 p-4" dir={dir}>
                  <span className="font-bold text-gray-900">
                    {picked === q.correctAnswer ? `${t.correctWord} ` : `${t.answerWord} `}
                    <span className="text-green-700">{q.options[q.correctAnswer]}</span>
                  </span>
                  {q.explanation && <p className="text-gray-700 mt-1 leading-relaxed">{q.explanation}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
