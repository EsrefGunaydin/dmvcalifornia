'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, X, ChevronRight, RotateCcw, Clock, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuizAd from '@/components/QuizAd';
import Leaderboard from '@/components/quiz/Leaderboard';
import type { LeaderboardEntry } from '@/types/quiz';

export interface SignQuestion {
  id: number;
  image: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface SignQuizLabels {
  answered: string;
  correct: string;
  pickPrompt: string;
  correctWord: string;
  answerWord: string;
  nextLabel?: string;
  seeResultsLabel?: string;
  restartLabel?: string;
  yourScoreLabel?: string;
}

const DEFAULT_LABELS: SignQuizLabels = {
  answered: 'Answered',
  correct: 'correct',
  pickPrompt: 'Pick an answer to reveal the meaning.',
  correctWord: 'Correct!',
  answerWord: 'Answer:',
  nextLabel: 'Next',
  seeResultsLabel: 'See results',
  restartLabel: 'Try again',
  yourScoreLabel: 'Your score',
};

const LETTERS = ['A', 'B', 'C', 'D'];
const PASSING_PCT = 83;
const AUTO_ADVANCE_SECONDS = 10;

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SignQuiz({
  questions,
  labels,
  dir = 'ltr',
  quizId = 'road-signs-en',
  quizTitle = 'California DMV Road Signs Test',
  nextQuiz,
}: {
  questions: SignQuestion[];
  labels?: Partial<SignQuizLabels>;
  dir?: 'ltr' | 'rtl';
  quizId?: string;
  quizTitle?: string;
  nextQuiz?: { href: string; title: string };
}) {
  const t: SignQuizLabels = { ...DEFAULT_LABELS, ...labels };
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  // Live elapsed timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }, []);
  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);
  useEffect(() => {
    if (done && timerRef.current) clearInterval(timerRef.current);
  }, [done]);

  // GA virtual pageview per question
  const firstMount = useRef(true);
  useEffect(() => {
    if (firstMount.current) { firstMount.current = false; return; }
    const path = `${window.location.pathname}/q/${currentIndex + 1}`;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.origin + path,
        page_title: `Sign ${currentIndex + 1} of ${questions.length}`,
      });
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(['event', 'page_view', { page_path: path }]);
    }
  }, [currentIndex, questions.length]);

  const correctCount = questions.filter((q) => picks[q.id] === q.correctAnswer).length;
  const pct = done ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = done && pct >= PASSING_PCT;

  // Leaderboard modal state
  const [showModal, setShowModal] = useState(false);
  const [lbName, setLbName] = useState('');
  const [lbEmail, setLbEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Live leaderboard entries (fetched client-side on results screen)
  const [lbEntries, setLbEntries] = useState<LeaderboardEntry[]>([]);
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaderboard?quizId=${encodeURIComponent(quizId)}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.leaderboard)) setLbEntries(data.leaderboard);
    } catch { /* ignore */ }
  }, [quizId]);
  useEffect(() => {
    if (!done) return;
    fetchLeaderboard();
    const onUpdate = () => fetchLeaderboard();
    window.addEventListener('leaderboard:updated', onUpdate);
    return () => window.removeEventListener('leaderboard:updated', onUpdate);
  }, [done, fetchLeaderboard]);

  // Auto-advance countdown after pass + modal close
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [countdown, setCountdown] = useState(AUTO_ADVANCE_SECONDS);
  const countingDown = Boolean(nextQuiz && passed && !showModal && autoAdvance);
  useEffect(() => {
    if (!countingDown || !nextQuiz) return;
    if (countdown <= 0) {
      if (typeof window.gtag === 'function') window.gtag('event', 'sign_quiz_autoadvance', { next: nextQuiz.href });
      router.push(nextQuiz.href);
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countingDown, countdown, nextQuiz, router]);

  const handleDone = () => {
    setDone(true);
    setShowModal(true);
  };

  const handleSubmitLeaderboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lbName.trim()) { setSubmitError('Please enter your name'); return; }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          name: lbName.trim(),
          email: lbEmail.trim() || '',
          percentage: pct,
          points: correctCount * 10,
          completedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      window.dispatchEvent(new Event('leaderboard:updated'));
      setTimeout(() => setShowModal(false), 1500);
    } catch {
      setSubmitError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setPicks({});
    setCurrentIndex(0);
    setDone(false);
    setElapsed(0);
    setShowModal(false);
    setSubmitted(false);
    setLbName('');
    setLbEmail('');
    setSubmitError('');
    setAutoAdvance(true);
    setCountdown(AUTO_ADVANCE_SECONDS);
    firstMount.current = true;
    startTimer();
  };

  // ── Results screen ────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Leaderboard submission modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <div className={`text-5xl font-extrabold mb-1 ${passed ? 'text-green-600' : 'text-red-500'}`}>
                  {pct}%
                </div>
                <p className="text-gray-600 text-sm">
                  {correctCount}/{questions.length} correct · {formatTime(elapsed)}
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-4">
                  <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Score saved!</p>
                </div>
              ) : (
                <>
                  <p className="text-center text-sm font-medium text-gray-700 mb-4">
                    Add your score to the leaderboard
                  </p>
                  <form onSubmit={handleSubmitLeaderboard} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={lbName}
                      onChange={(e) => setLbName(e.target.value)}
                      maxLength={50}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={lbEmail}
                      onChange={(e) => setLbEmail(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                    />
                    {submitError && <p className="text-red-500 text-xs">{submitError}</p>}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors disabled:opacity-60"
                      >
                        {submitting ? 'Saving...' : 'Save score'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Score card */}
        <div className={`rounded-2xl p-8 text-center mb-8 ${passed ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">
            {t.yourScoreLabel}
          </p>
          <div className={`text-7xl font-extrabold mb-3 ${passed ? 'text-green-600' : 'text-red-500'}`}>
            {pct}%
          </div>
          <p className="text-lg text-gray-600 mb-2">
            {correctCount} / {questions.length} {t.correct}
          </p>
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {formatTime(elapsed)}
          </p>
        </div>

        {/* Auto-advance banner (pass only) */}
        {countingDown && nextQuiz && (
          <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-700">
              Next: <span className="font-semibold">{nextQuiz.title}</span> in {countdown}s
            </p>
            <button
              onClick={() => setAutoAdvance(false)}
              className="text-xs text-gray-500 hover:text-gray-700 underline flex-shrink-0"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t.restartLabel}
          </button>
          {nextQuiz && (
            <button
              onClick={() => router.push(nextQuiz.href)}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              {nextQuiz.title} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
          </h2>
          <Leaderboard entries={lbEntries} quizTitle={quizTitle} quizId={quizId} />
        </div>
      </div>
    );
  }

  // ── Quiz card ─────────────────────────────────────────────────────────────
  const q = questions[currentIndex];
  const picked = picks[q.id];
  const revealed = picked !== undefined;
  const isLast = currentIndex === questions.length - 1;

  const handlePick = (oi: number) => {
    if (revealed) return;
    setPicks((p) => ({ ...p, [q.id]: oi }));
  };

  const handleNext = () => {
    if (isLast) {
      handleDone();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress + timer */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500 tabular-nums">
          {currentIndex + 1}/{questions.length}
        </span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-400 tabular-nums flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {formatTime(elapsed)}
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 pt-6">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-extrabold flex-shrink-0">
            {currentIndex + 1}
          </span>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {q.question || 'What does this sign mean?'}
          </h2>
        </div>

        <div className="flex justify-center py-6">
          <img
            src={q.image}
            alt={`California DMV road sign — question ${currentIndex + 1}`}
            className="max-h-48 w-auto object-contain"
          />
        </div>

        <div className="px-6 pb-4 space-y-3">
          {q.options.map((opt, oi) => {
            const isCorrect = oi === q.correctAnswer;
            const isPicked = picked === oi;
            let cls = 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5 cursor-pointer';
            if (revealed) {
              if (isCorrect) cls = 'border-green-500 bg-green-50 cursor-default';
              else if (isPicked) cls = 'border-red-400 bg-red-50 cursor-default';
              else cls = 'border-gray-200 bg-white opacity-60 cursor-default';
            }
            return (
              <button
                key={oi}
                type="button"
                onClick={() => handlePick(oi)}
                disabled={revealed}
                className={`w-full text-left flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all ${cls}`}
              >
                <span className="font-bold text-gray-500 mt-0.5">{LETTERS[oi]}.</span>
                <span className="flex-1 text-gray-900" dir={dir}>{opt}</span>
                {revealed && isCorrect && <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
                {revealed && isPicked && !isCorrect && <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {!revealed ? (
          <p className="px-6 pb-6 -mt-1 text-sm text-gray-400">{t.pickPrompt}</p>
        ) : (
          <>
            <div className="mx-6 mb-4 rounded-xl bg-gray-50 border border-gray-200 p-4" dir={dir}>
              <span className="font-bold text-gray-900">
                {picked === q.correctAnswer ? `${t.correctWord} ` : `${t.answerWord} `}
                <span className="text-green-700">{q.options[q.correctAnswer]}</span>
              </span>
              {q.explanation && (
                <p className="text-gray-700 mt-1 leading-relaxed">{q.explanation}</p>
              )}
            </div>

            <div className="mx-6">
              <QuizAd currentQuestionIndex={currentIndex} refreshEvery={3} />
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handleNext}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                {isLast ? t.seeResultsLabel : t.nextLabel}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
