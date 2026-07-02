'use client';

import { useEffect, useRef, useState } from 'react';
import { Trophy, Check, X } from 'lucide-react';
import QuizAd from '@/components/QuizAd';
import { useStreak } from '@/hooks/useStreak';

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

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface MarathonQuizProps {
  questions: MarathonQuestion[];
  /** Used to key localStorage — pass the quiz slug or id. */
  marathonId?: string;
}

export default function MarathonQuiz({ questions, marathonId }: MarathonQuizProps) {
  const total = questions.length;
  const queueKey   = marathonId ? `marathon-queue-${marathonId}`   : null;
  const stateKey   = marathonId ? `marathon-state-${marathonId}`   : null;
  const { recordStudy } = useStreak();

  // Build an id→question lookup for restoring saved queue order
  const byId = Object.fromEntries(questions.map(q => [String(q.id), q]));

  function loadSaved(): { queue: MarathonQuestion[]; mastered: number; elapsed: number } | null {
    if (!queueKey || !stateKey) return null;
    try {
      const ids   = JSON.parse(localStorage.getItem(queueKey) ?? 'null') as string[] | null;
      const state = JSON.parse(localStorage.getItem(stateKey) ?? 'null') as { mastered: number; elapsed: number } | null;
      if (!ids || !state) return null;
      const restored = ids.map(id => byId[id]).filter(Boolean);
      if (restored.length === 0) return null;
      return { queue: restored, mastered: state.mastered, elapsed: state.elapsed };
    } catch { return null; }
  }

  const saved = loadSaved();

  const [queue, setQueue]     = useState<MarathonQuestion[]>(saved?.queue   ?? shuffle(questions));
  const [mastered, setMastered] = useState(saved?.mastered ?? 0);
  const [picked, setPicked]   = useState<number | null>(null);
  const [step, setStep]       = useState(0);
  const [elapsed, setElapsed] = useState(saved?.elapsed ?? 0);
  const startRef    = useRef<number>(Date.now() - (saved?.elapsed ?? 0) * 1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current  = queue[0];
  const revealed = picked !== null;
  const done     = queue.length === 0;

  // Persist queue + state on every advance
  useEffect(() => {
    if (!queueKey || !stateKey) return;
    if (done) {
      localStorage.removeItem(queueKey);
      localStorage.removeItem(stateKey);
      return;
    }
    localStorage.setItem(queueKey, JSON.stringify(queue.map(q => String(q.id))));
    localStorage.setItem(stateKey, JSON.stringify({ mastered, elapsed }));
  }, [queue, mastered, done]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (done) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      recordStudy();
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const fresh = shuffle(questions);
    setQueue(fresh);
    setMastered(0);
    setPicked(null);
    setStep(0);
    setElapsed(0);
    startRef.current = Date.now();
    if (queueKey) localStorage.removeItem(queueKey);
    if (stateKey) localStorage.removeItem(stateKey);
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 1000);
    }
  };

  const progress = total ? Math.round((mastered / total) * 100) : 0;

  if (done) {
    return (
      <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl border-2 border-green-200 shadow-sm p-10">
        <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4"><Trophy className="w-8 h-8 text-yellow-600" /></div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Marathon complete!</h2>
        <p className="text-gray-600 mb-2">
          You answered all {total} questions correctly. If you can clear the marathon, you&apos;re
          ready for the real California DMV test.
        </p>
        <p className="text-lg font-semibold text-violet-600 mb-6">
          Total time: {formatTime(elapsed)}
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
          <span className="font-mono text-violet-600 font-semibold">{formatTime(elapsed)}</span>
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
                {revealed && isCorrect && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                {revealed && isPicked && !isCorrect && <X className="w-4 h-4 text-red-500 flex-shrink-0" />}
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
