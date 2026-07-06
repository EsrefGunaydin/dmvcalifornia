'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, X, Clock, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuizAd from '@/components/QuizAd';

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
  nextLabel: 'Next Question',
  seeResultsLabel: 'Finish Quiz',
  restartLabel: 'Try again',
  yourScoreLabel: 'Your score',
};

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
  nextQuiz,
}: {
  questions: SignQuestion[];
  labels?: Partial<SignQuizLabels>;
  dir?: 'ltr' | 'rtl';
  quizId?: string;
  nextQuiz?: { href: string; title: string };
}) {
  const t: SignQuizLabels = { ...DEFAULT_LABELS, ...labels };
  const router = useRouter();

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [picks, setPicks] = useState<Record<number, number>>({});   // final submitted picks
  const [pending, setPending] = useState<number | undefined>();     // selected but not yet submitted
  const [showExplanation, setShowExplanation] = useState(false);
  const [done, setDone] = useState(false);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }, []);
  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);
  useEffect(() => { if (done && timerRef.current) clearInterval(timerRef.current); }, [done]);

  // GA virtual pageview per question
  const firstMount = useRef(true);
  useEffect(() => {
    if (firstMount.current) { firstMount.current = false; return; }
    const path = `${window.location.pathname}/q/${currentIndex + 1}`;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: path, page_location: window.location.origin + path, page_title: `Sign ${currentIndex + 1} of ${questions.length}` });
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(['event', 'page_view', { page_path: path }]);
    }
  }, [currentIndex, questions.length]);

  const correctCount = questions.filter((q) => picks[q.id] === q.correctAnswer).length;
  const pct = done ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = done && pct >= PASSING_PCT;

  // Leaderboard submission modal
  const [showModal, setShowModal] = useState(false);
  const [lbName, setLbName] = useState('');
  const [lbEmail, setLbEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Auto-advance countdown
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

  const handleSubmitLeaderboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lbName.trim()) { setSubmitError('Please enter your name'); return; }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, name: lbName.trim(), email: lbEmail.trim() || '', percentage: pct, points: correctCount * 10, completedAt: new Date().toISOString() }),
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
    setPending(undefined);
    setCurrentIndex(0);
    setDone(false);
    setElapsed(0);
    setShowExplanation(false);
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

  // ── Results screen ──────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Leaderboard modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <div className={`text-5xl font-extrabold mb-1 ${passed ? 'text-green-600' : 'text-red-500'}`}>{pct}%</div>
                <p className="text-gray-600 text-sm">{correctCount}/{questions.length} correct · {formatTime(elapsed)}</p>
              </div>
              {submitted ? (
                <div className="text-center py-4">
                  <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Score saved!</p>
                </div>
              ) : (
                <>
                  <p className="text-center text-sm font-medium text-gray-700 mb-4">Add your score to the leaderboard</p>
                  <form onSubmit={handleSubmitLeaderboard} className="space-y-3">
                    <input type="text" placeholder="Your name *" value={lbName} onChange={(e) => setLbName(e.target.value)} maxLength={50} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                    <input type="email" placeholder="Email (optional)" value={lbEmail} onChange={(e) => setLbEmail(e.target.value)} className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                    {submitError && <p className="text-red-500 text-xs">{submitError}</p>}
                    <div className="flex gap-3 pt-1">
                      <button type="submit" disabled={submitting} className="flex-1 bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors disabled:opacity-60">
                        {submitting ? 'Saving...' : 'Save score'}
                      </button>
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">
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
        <div className={`bg-white rounded-lg shadow-lg p-8 text-center mb-6 ${passed ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'}`}>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">{t.yourScoreLabel}</p>
          <div className={`text-7xl font-extrabold mb-3 ${passed ? 'text-green-600' : 'text-red-500'}`}>{pct}%</div>
          <p className="text-lg text-gray-600 mb-2">{correctCount} / {questions.length} {t.correct}</p>
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatTime(elapsed)}</p>
        </div>

        {/* Auto-advance */}
        {countingDown && nextQuiz && (
          <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-700">Next: <span className="font-semibold">{nextQuiz.title}</span> in {countdown}s</p>
            <button onClick={() => setAutoAdvance(false)} className="text-xs text-gray-500 hover:text-gray-700 underline flex-shrink-0">Cancel</button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={handleRestart} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
            <RotateCcw className="w-4 h-4" /> {t.restartLabel}
          </button>
          {nextQuiz && (
            <button onClick={() => router.push(nextQuiz.href)} className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              {nextQuiz.title} →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Quiz card ───────────────────────────────────────────────────────────
  const q = questions[currentIndex];
  const submittedPick = picks[q.id];
  const hasSubmitted = submittedPick !== undefined;
  const isCorrect = hasSubmitted && submittedPick === q.correctAnswer;
  const isLast = currentIndex === questions.length - 1;
  const pctComplete = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelect = (oi: number) => {
    if (hasSubmitted) return;
    setPending(oi);
  };

  const handleCheckAnswer = () => {
    if (pending === undefined) return;
    setPicks((p) => ({ ...p, [q.id]: pending }));
    setPending(undefined);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLast) {
      setDone(true);
      setShowModal(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setShowExplanation(false);
      setPending(undefined);
    }
  };

  const handlePrevious = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
    setShowExplanation(picks[questions[currentIndex - 1].id] !== undefined);
    setPending(undefined);
  };

  const jumpTo = (idx: number) => {
    setCurrentIndex(idx);
    setShowExplanation(picks[questions[idx].id] !== undefined);
    setPending(undefined);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {formatTime(elapsed)}
            <span className="ml-2">{pctComplete}% Complete</span>
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${pctComplete}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
        {/* Sign image */}
        <div className="flex justify-center mb-6">
          <img src={q.image} alt={`Road sign — question ${currentIndex + 1}`} className="max-h-48 w-auto object-contain" />
        </div>

        {/* Question text */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6" dir={dir}>
          {q.question || 'What does this sign mean?'}
        </h2>

        {/* Answer options */}
        <div className="space-y-3 mb-6">
          {q.options.map((opt, oi) => {
            const isSubmittedCorrect = hasSubmitted && oi === q.correctAnswer;
            const isSubmittedWrong = hasSubmitted && oi === submittedPick && oi !== q.correctAnswer;
            const isSubmittedOther = hasSubmitted && oi !== q.correctAnswer && oi !== submittedPick;
            const isPending = !hasSubmitted && oi === pending;

            let borderCls = 'border-gray-200 hover:border-primary/50 hover:bg-gray-50';
            let circleCls = 'border-gray-300';
            if (hasSubmitted) {
              if (isSubmittedCorrect) { borderCls = 'border-green-500 bg-green-50'; circleCls = 'border-green-500 bg-green-500'; }
              else if (isSubmittedWrong) { borderCls = 'border-red-500 bg-red-50'; circleCls = 'border-red-500 bg-red-500'; }
              else if (isSubmittedOther) { borderCls = 'border-gray-200 bg-gray-50'; circleCls = 'border-gray-300'; }
            } else if (isPending) {
              borderCls = 'border-primary bg-primary/5';
              circleCls = 'border-primary bg-primary';
            }

            return (
              <button
                key={oi}
                type="button"
                onClick={() => handleSelect(oi)}
                disabled={hasSubmitted}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${borderCls} ${hasSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${circleCls}`}>
                    {hasSubmitted && (isSubmittedCorrect || isSubmittedWrong) && (
                      <span className="text-white">
                        {isSubmittedCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                    )}
                    {!hasSubmitted && isPending && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-gray-900" dir={dir}>{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`} dir={dir}>
            <div className="flex items-start gap-3">
              <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </span>
              <div>
                <p className={`font-bold mb-1 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {isCorrect ? t.correctWord : `${t.answerWord} ${q.options[q.correctAnswer]}`}
                </p>
                {q.explanation && <p className="text-gray-700 text-sm">{q.explanation}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {!hasSubmitted && pending !== undefined && (
            <button onClick={handleCheckAnswer} className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Check Answer
            </button>
          )}

          {showExplanation && (
            <button onClick={handleNext} className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
              {isLast ? t.seeResultsLabel : t.nextLabel}
            </button>
          )}

          {!hasSubmitted && pending === undefined && (
            <button disabled className="flex-1 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed">
              Select an answer
            </button>
          )}
        </div>
      </div>

      {/* Ad below card */}
      <QuizAd currentQuestionIndex={currentIndex} refreshEvery={3} />

      {/* Question navigation grid */}
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Questions</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((sq, idx) => {
            const isAnswered = picks[sq.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={`qn-${idx}`}
                onClick={() => jumpTo(idx)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  isCurrent
                    ? 'bg-primary text-white'
                    : isAnswered
                    ? 'bg-primary/20 text-primary hover:bg-primary/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
