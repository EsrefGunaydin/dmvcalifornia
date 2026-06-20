'use client';

import { useState } from 'react';

interface Option {
  label: string;
  text: string;
}

export interface HardestQuestion {
  rank: number;
  question: string;
  options: Option[];
  correct: string;
  explanation?: string;
  /** Optional supporting image shown inside the explanation panel. */
  image?: string;
}

/** Small ranking flavor: the lower the rank number, the harder/more-missed. */
function rankTag(rank: number): { label: string; cls: string } {
  if (rank <= 5) return { label: 'Most missed', cls: 'bg-red-100 text-red-700' };
  if (rank <= 12) return { label: 'Tricky', cls: 'bg-amber-100 text-amber-700' };
  return { label: 'Commonly missed', cls: 'bg-blue-100 text-blue-700' };
}

export default function Hardest20Quiz({ questions }: { questions: HardestQuestion[] }) {
  const ordered = [...questions].sort((a, b) => a.rank - b.rank);
  const [picks, setPicks] = useState<Record<number, string>>({});

  const answered = Object.keys(picks).length;
  const correct = ordered.filter((q) => picks[q.rank] === q.correct).length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Scoreboard */}
      <div className="sticky top-2 z-20 mb-8 flex items-center justify-between gap-4 rounded-xl bg-white/95 backdrop-blur border-2 border-gray-200 shadow-sm px-5 py-3">
        <span className="text-sm font-medium text-gray-600">
          Answered <span className="font-bold text-gray-900">{answered}</span>/{ordered.length}
        </span>
        <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(answered / ordered.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600">
          <span className="font-bold text-green-600">{correct}</span> correct
        </span>
      </div>

      <div className="space-y-10">
        {ordered.map((q) => {
          const picked = picks[q.rank];
          const revealed = picked !== undefined;
          const tag = rankTag(q.rank);

          return (
            <div
              key={q.rank}
              id={`q-${q.rank}`}
              className="scroll-mt-24 bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-6 pt-6">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-extrabold text-lg">
                  #{q.rank}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tag.cls}`}>
                  {tag.label}
                </span>
              </div>

              {/* Question */}
              <h3 className="px-6 pt-4 text-xl md:text-2xl font-bold text-gray-900">
                {q.question}
              </h3>

              {/* Options */}
              <div className="p-6 pt-4 space-y-3">
                {q.options.map((o) => {
                  const isCorrect = o.label === q.correct;
                  const isPicked = picked === o.label;

                  let cls =
                    'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5';
                  if (revealed) {
                    if (isCorrect) cls = 'border-green-500 bg-green-50';
                    else if (isPicked) cls = 'border-red-400 bg-red-50';
                    else cls = 'border-gray-200 bg-white opacity-60';
                  }

                  return (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => setPicks((p) => ({ ...p, [q.rank]: o.label }))}
                      className={`w-full text-left flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 transition-all ${cls}`}
                    >
                      <span className="font-bold text-gray-500 mt-0.5">{o.label}.</span>
                      <span className="flex-1 text-gray-900">{o.text}</span>
                      {revealed && isCorrect && (
                        <span className="text-green-600 font-bold" aria-label="Correct">✓</span>
                      )}
                      {revealed && isPicked && !isCorrect && (
                        <span className="text-red-500 font-bold" aria-label="Your pick (incorrect)">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reveal area */}
              {!revealed ? (
                <p className="px-6 pb-6 -mt-2 text-sm text-gray-400">
                  Tap an answer to see if you're right.
                </p>
              ) : (
                <div className="mx-6 mb-6 rounded-xl bg-gray-50 border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💡</span>
                    <span className="font-bold text-gray-900">
                      {picked === q.correct ? 'Correct!' : 'Why the answer is '}
                      {picked !== q.correct && (
                        <span className="text-green-700">{q.correct}</span>
                      )}
                    </span>
                  </div>
                  {q.explanation ? (
                    <p className="text-gray-700 leading-relaxed">{q.explanation}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Explanation coming soon — correct answer is{' '}
                      <span className="font-semibold text-gray-700">{q.correct}</span>.
                    </p>
                  )}
                  {q.image && (
                    <img
                      src={q.image}
                      alt={`Illustration for question ${q.rank}`}
                      className="mt-4 rounded-lg shadow-sm w-full h-auto"
                      loading="lazy"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
