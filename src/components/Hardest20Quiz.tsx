'use client';

import { useMemo, useRef, useState } from 'react';
import { Check, X, Lightbulb } from 'lucide-react';
import Link from 'next/link';

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

const TOPIC_MAP: Record<number, { topic: string; slug: string }> = {
  1:  { topic: 'Road Signs & Markings',               slug: 'practice-test-road-signs-and-markings' },
  2:  { topic: 'Right-of-Way & Intersections',        slug: 'practice-test-right-of-way-and-intersections' },
  3:  { topic: 'Turning & Lane Changes',              slug: 'practice-test-turning-and-lane-changes' },
  4:  { topic: 'Speed Limits & Traffic Laws',         slug: 'practice-test-speed-limits-and-traffic-laws' },
  5:  { topic: 'Traffic Signs & Signals',             slug: 'practice-test-traffic-signs-and-signals' },
  6:  { topic: 'Turning & Lane Changes',              slug: 'practice-test-turning-and-lane-changes' },
  7:  { topic: 'Parking & Vehicle Control',           slug: 'practice-test-parking-and-vehicle-control' },
  8:  { topic: 'Weather & Night Driving',             slug: 'practice-test-weather-and-night-driving' },
  9:  { topic: 'DUI Laws & Safety Requirements',      slug: 'practice-test-dui-laws-and-safety-requirements' },
  10: { topic: 'Freeway Driving & Merging',           slug: 'practice-test-freeway-driving-and-merging' },
  11: { topic: 'Speed Limits & Traffic Laws',         slug: 'practice-test-speed-limits-and-traffic-laws' },
  12: { topic: 'Sharing the Road',                    slug: 'practice-test-sharing-the-road' },
  13: { topic: 'Pedestrians & Bicycles',              slug: 'practice-test-pedestrians-and-bicycles' },
  14: { topic: 'Emergency Procedures & Accidents',    slug: 'practice-test-emergency-procedures-and-accidents' },
  15: { topic: 'Turning & Lane Changes',              slug: 'practice-test-turning-and-lane-changes' },
  16: { topic: 'Parking & Vehicle Control',           slug: 'practice-test-parking-and-vehicle-control' },
  17: { topic: 'Freeway Driving & Merging',           slug: 'practice-test-freeway-driving-and-merging' },
  18: { topic: 'Right-of-Way & Intersections',        slug: 'practice-test-right-of-way-and-intersections' },
  19: { topic: 'Safe Driving & Defensive Techniques', slug: 'practice-test-safe-driving-and-defensive-techniques' },
  20: { topic: 'Speed Limits & Traffic Laws',         slug: 'practice-test-speed-limits-and-traffic-laws' },
};

/** Small ranking flavor: the lower the rank number, the harder/more-missed. */
function rankTag(rank: number): { label: string; cls: string } {
  if (rank <= 5) return { label: 'Most missed', cls: 'bg-red-100 text-red-700' };
  if (rank <= 12) return { label: 'Tricky', cls: 'bg-amber-100 text-amber-700' };
  return { label: 'Commonly missed', cls: 'bg-blue-100 text-blue-700' };
}

function grade(correct: number, total: number): { label: string; scoreColor: string; msg: string } {
  const pct = correct / total;
  if (pct === 1)   return { label: 'Perfect',     scoreColor: 'text-green-300',  msg: "Flawless — you know the tricky ones cold. You're ready for the real test." };
  if (pct >= 0.9)  return { label: 'Expert',      scoreColor: 'text-green-300',  msg: 'Almost perfect — barely anything to brush up on.' };
  if (pct >= 0.75) return { label: 'Good',        scoreColor: 'text-yellow-300', msg: 'Solid score, but a few topics tripped you up. Review them below.' };
  if (pct >= 0.5)  return { label: 'Fair',        scoreColor: 'text-orange-300', msg: 'Getting there — work through the suggested practice tests before the real exam.' };
  return                   { label: 'Needs work', scoreColor: 'text-red-300',    msg: 'The hardest questions catch most people. Hit the practice tests below and come back.' };
}

export default function Hardest20Quiz({ questions }: { questions: HardestQuestion[] }) {
  // Easiest first (#20) counting down to the hardest (#1) at the bottom.
  const ordered = [...questions].sort((a, b) => b.rank - a.rank);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  const answered = Object.keys(picks).length;
  const correct = ordered.filter((q) => picks[q.rank] === q.correct).length;
  const done = answered === ordered.length;

  const missedTopics = useMemo(() => {
    if (!done) return [];
    const map = new Map<string, { topic: string; slug: string; count: number }>();
    for (const q of ordered) {
      if (picks[q.rank] !== q.correct) {
        const info = TOPIC_MAP[q.rank];
        if (!info) continue;
        const existing = map.get(info.slug);
        if (existing) existing.count++;
        else map.set(info.slug, { topic: info.topic, slug: info.slug, count: 1 });
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [done, picks, ordered]);

  const result = done ? grade(correct, ordered.length) : null;

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
        {done && (
          <button
            onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="ml-2 text-xs font-semibold text-primary underline underline-offset-2 whitespace-nowrap"
          >
            See results ↓
          </button>
        )}
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
                    'border-gray-200 bg-white [@media(hover:hover)]:hover:border-primary/50 [@media(hover:hover)]:hover:bg-primary/5';
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
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" aria-label="Correct" />
                      )}
                      {revealed && isPicked && !isCorrect && (
                        <X className="w-4 h-4 text-red-500 flex-shrink-0" aria-label="Your pick (incorrect)" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pre-reveal hint */}
              {!revealed && (
                <p className="px-6 pb-6 -mt-2 text-sm text-gray-400">
                  Tap an answer to see if you're right.
                </p>
              )}

              {/* Explanation — always rendered in the DOM (so search engines
                  index the answers), visually hidden until the user reveals it. */}
              <div
                className={`mx-6 mb-6 rounded-xl bg-gray-50 border border-gray-200 p-5 ${
                  revealed ? '' : 'hidden'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="font-bold text-gray-900">
                    {revealed && picked === q.correct ? (
                      'Correct!'
                    ) : (
                      <>
                        Why the answer is{' '}
                        <span className="text-green-700">{q.correct}</span>
                      </>
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
            </div>
          );
        })}
      </div>

      {/* Results panel — appears after all questions are answered */}
      {done && result && (
        <div ref={resultsRef} className="mt-14 scroll-mt-8 rounded-2xl border-2 border-indigo-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-8 text-center">
            <div className="text-6xl font-extrabold mb-1">
              {correct}
              <span className="text-white/50 text-3xl font-semibold">/{ordered.length}</span>
            </div>
            <div className={`text-2xl font-bold mt-1 ${result.scoreColor}`}>{result.label}</div>
            <p className="text-white/85 mt-3 text-base max-w-md mx-auto">{result.msg}</p>
          </div>

          <div className="p-8">
            {missedTopics.length === 0 ? (
              <p className="text-center text-gray-600 font-medium text-lg">
                You got every question right. You&apos;re ready for the California DMV written test!
              </p>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Topics to review</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Based on your missed questions — sorted by most missed first.
                </p>
                <div className="space-y-3">
                  {missedTopics.map(({ topic, slug, count }) => (
                    <Link
                      key={slug}
                      href={`/practice-test/${slug}`}
                      className="flex items-center justify-between rounded-xl border-2 border-gray-200 px-5 py-4 hover:border-primary/60 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600 text-xs font-bold shrink-0">
                          {count}
                        </span>
                        <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {topic}
                        </span>
                      </div>
                      <span className="text-primary font-semibold text-sm shrink-0">Practice →</span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 mb-4 text-sm">
                {missedTopics.length > 0 ? 'Or take a full timed practice test:' : 'Keep the momentum going:'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/practice-test/california-dmv-practice-test-2026"
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  2026 Practice Test →
                </Link>
                <Link
                  href="/california-dmv-marathon-test"
                  className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Marathon Test
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
