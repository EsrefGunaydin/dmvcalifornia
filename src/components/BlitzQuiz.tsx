'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Zap, Trophy, Check, X, Clock } from 'lucide-react';
import QuizAd from '@/components/QuizAd';
import { useStreak } from '@/hooks/useStreak';
import type { MarathonQuestion } from '@/components/MarathonQuiz';

const QUESTION_TIME = 15;   // seconds per question
const QUESTIONS_PER_BLITZ = 20;
const LETTERS = ['A', 'B', 'C', 'D'];

// Auto-advance delay after revealing (ms)
const REVEAL_DELAY = 1500;
const TIMEOUT_DELAY = 900;

interface BlitzAnswer {
  id: number | string;
  picked: number | null; // null = timed out
  correct: boolean;
  timeLeft: number; // seconds remaining when answered (0 on timeout)
  points: number;
}

function calcPoints(correct: boolean, timeLeft: number): number {
  if (!correct) return 0;
  if (timeLeft > 10) return 20;
  if (timeLeft > 5) return 15;
  return 10;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BlitzQuiz({ questions: allQuestions }: { questions: MarathonQuestion[] }) {
  const { recordStudy } = useStreak();

  const [questions, setQuestions] = useState<MarathonQuestion[]>(() =>
    shuffle(allQuestions).slice(0, QUESTIONS_PER_BLITZ)
  );
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<BlitzAnswer[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [done, setDone] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPoints = answers.reduce((s, a) => s + a.points, 0);
  const maxPoints = QUESTIONS_PER_BLITZ * 20;
  const current = questions[idx];

  const stopTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const stopAdvance = useCallback(() => {
    if (advanceRef.current) { clearTimeout(advanceRef.current); advanceRef.current = null; }
  }, []);

  const advance = useCallback((answerList: BlitzAnswer[]) => {
    stopAdvance();
    const nextIdx = idx + 1;
    if (nextIdx >= questions.length) {
      setDone(true);
      recordStudy();
      return;
    }
    setIdx(nextIdx);
    setPicked(null);
    setRevealed(false);
    setTimedOut(false);
    setTimeLeft(QUESTION_TIME);
  }, [idx, questions.length, recordStudy, stopAdvance]);

  const recordAnswer = useCallback((pickedIndex: number | null, currentTimeLeft: number) => {
    stopTimer();
    const correct = pickedIndex !== null && pickedIndex === current.correctAnswer;
    const pts = calcPoints(correct, currentTimeLeft);
    const answer: BlitzAnswer = {
      id: current.id,
      picked: pickedIndex,
      correct,
      timeLeft: currentTimeLeft,
      points: pts,
    };
    const next = [...answers, answer];
    setAnswers(next);
    setRevealed(true);
    advanceRef.current = setTimeout(() => advance(next), pickedIndex === null ? TIMEOUT_DELAY : REVEAL_DELAY);
  }, [advance, answers, current, stopTimer]);

  // Countdown timer
  useEffect(() => {
    if (done || revealed) return;
    setTimeLeft(QUESTION_TIME);
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Timeout
          setTimedOut(true);
          recordAnswer(null, 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { stopTimer(); stopAdvance(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, done]);

  const handlePick = (optionIdx: number) => {
    if (revealed) return;
    setPicked(optionIdx);
    stopTimer();
    recordAnswer(optionIdx, timeLeft);
  };

  const restart = () => {
    stopTimer();
    stopAdvance();
    setQuestions(shuffle(allQuestions).slice(0, QUESTIONS_PER_BLITZ));
    setIdx(0);
    setAnswers([]);
    setPicked(null);
    setRevealed(false);
    setTimedOut(false);
    setTimeLeft(QUESTION_TIME);
    setDone(false);
  };

  // ── Done screen ────────────────────────────────────────────────────────────
  if (done) {
    const correct = answers.filter((a) => a.correct).length;
    const timeouts = answers.filter((a) => a.picked === null).length;
    const pct = Math.round((totalPoints / maxPoints) * 100);
    const fastest = answers.filter((a) => a.correct).sort((a, b) => b.timeLeft - a.timeLeft)[0];

    return (
      <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl border-2 border-yellow-200 shadow-sm p-10">
        <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Blitz complete!</h2>
        <p className="text-5xl font-black text-primary mt-4 mb-1">{totalPoints}</p>
        <p className="text-sm text-gray-500 mb-6">pts out of {maxPoints}</p>

        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-700">{correct}</p>
            <p className="text-xs text-gray-500 mt-1">Correct</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-600">{answers.length - correct}</p>
            <p className="text-xs text-gray-500 mt-1">Wrong</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-600">{timeouts}</p>
            <p className="text-xs text-gray-500 mt-1">Timed out</p>
          </div>
        </div>

        {fastest && (
          <p className="text-sm text-gray-600 mb-8">
            Fastest correct answer: <span className="font-semibold">{QUESTION_TIME - fastest.timeLeft + 1}s</span> remaining
            {fastest.timeLeft > 10 && ' (speed bonus earned)'}
          </p>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={restart}
            className="px-7 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Play again
          </button>
          <a
            href="/california-dmv-marathon-test"
            className="px-7 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Try the marathon
          </a>
        </div>
      </div>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  const barPct = (timeLeft / QUESTION_TIME) * 100;
  const barColor = timeLeft > 9 ? 'bg-green-500' : timeLeft > 4 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Sticky header */}
      <div className="sticky top-2 z-20 mb-6 rounded-xl bg-white/95 backdrop-blur border-2 border-gray-200 shadow-sm px-5 py-3">
        <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-2">
          <span>
            Question <span className="font-bold text-gray-900">{idx + 1}</span>/{questions.length}
          </span>
          <span className="flex items-center gap-1.5 text-primary font-bold">
            <Zap className="w-4 h-4" />
            {totalPoints} pts
          </span>
          <span className={`flex items-center gap-1 font-mono font-bold ${timeLeft <= 4 ? 'text-red-600' : 'text-gray-700'}`}>
            <Clock className="w-3.5 h-3.5" />
            {timeLeft}s
          </span>
        </div>

        {/* Timer bar */}
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
            style={{ width: `${barPct}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">{current.question}</h3>

        <div className="space-y-3">
          {current.options.map((opt, oi) => {
            const isCorrect = oi === current.correctAnswer;
            const isPicked = picked === oi;
            let cls = 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5 cursor-pointer';
            if (revealed) {
              if (isCorrect) cls = 'border-green-500 bg-green-50 cursor-default';
              else if (isPicked) cls = 'border-red-400 bg-red-50 cursor-default';
              else cls = 'border-gray-100 bg-white opacity-50 cursor-default';
            }
            return (
              <button
                key={oi}
                type="button"
                disabled={revealed}
                onClick={() => handlePick(oi)}
                className={`w-full text-left flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all ${cls}`}
              >
                <span className="font-bold text-gray-400 mt-0.5 w-5 flex-shrink-0">{LETTERS[oi]}.</span>
                <span className="flex-1 text-gray-900">{opt}</span>
                {revealed && isCorrect && <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
                {revealed && isPicked && !isCorrect && <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Reveal feedback */}
        {revealed && (
          <div className={`mt-5 rounded-xl p-4 flex items-start gap-3 ${timedOut ? 'bg-gray-50 border border-gray-200' : answers.at(-1)?.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex-1">
              <span className="font-bold text-gray-900">
                {timedOut ? "Time's up!" : answers.at(-1)?.correct ? 'Correct!' : 'Wrong'}
              </span>
              {answers.at(-1)?.points ? (
                <span className="ml-2 inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" />+{answers.at(-1)!.points} pts
                </span>
              ) : null}
              {current.explanation && (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{current.explanation}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dot progress trail */}
      <div className="mt-5 flex justify-center flex-wrap gap-1.5">
        {questions.map((_, i) => {
          if (i < answers.length) {
            const a = answers[i];
            return (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${a.correct ? 'bg-green-500' : 'bg-red-400'}`}
              />
            );
          }
          return (
            <div
              key={i}
              className={`rounded-full transition-all ${i === idx ? 'w-4 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-gray-200'}`}
            />
          );
        })}
      </div>

      <QuizAd currentQuestionIndex={idx} />
    </div>
  );
}
