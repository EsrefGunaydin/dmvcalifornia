'use client';

import { useState, useEffect } from 'react';
import QuizAd from '@/components/QuizAd';
import StickyVerticalAd from '@/components/ads/StickyVerticalAd';
import { useStreak } from '@/hooks/useStreak';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  questionEn?: string;
  answerEn?: string;
}

export interface FlashcardLabels {
  question: string;
  answer: string;
  flipToAnswer: string;
  flipToQuestion: string;
  card: string;
  of: string;
  complete: string;
  previous: string;
  next: string;
  reset: string;
  startOver: string;
  gotIt: string;
  stillLearning: string;
}

const DEFAULT_LABELS: FlashcardLabels = {
  question: 'Question',
  answer: 'Answer',
  flipToAnswer: 'Click to flip',
  flipToQuestion: 'Click to flip back',
  card: 'Card',
  of: 'of',
  complete: 'Complete',
  previous: 'Previous',
  next: 'Next',
  reset: 'Reset',
  startOver: 'Start Over',
  gotIt: 'Got it',
  stillLearning: 'Still learning',
};

interface FlashcardDeckProps {
  cards: Flashcard[];
  title: string;
  deckId?: string;
  /** Text direction for the primary (native) card text. */
  dir?: 'ltr' | 'rtl';
  /** Localized UI strings. Falls back to English. */
  labels?: Partial<FlashcardLabels>;
}

type CardStatus = 'review' | 'done';

export default function FlashcardDeck({ cards, title, deckId, dir = 'ltr', labels }: FlashcardDeckProps) {
  const t: FlashcardLabels = { ...DEFAULT_LABELS, ...labels };
  const storageKey = deckId ? `flashcard-progress-${deckId}` : null;

  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [doneCount, setDoneCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const { recordStudy } = useStreak();

  // Load saved progress or start fresh
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const { remainingIds, done } = JSON.parse(saved) as { remainingIds: number[]; done: number };
          const remaining = cards.filter(c => remainingIds.includes(c.id));
          if (remaining.length === 0) {
            setFinished(true);
            setDoneCount(done);
          } else {
            setQueue(remaining);
            setDoneCount(done);
          }
          return;
        } catch { /* fall through */ }
      }
    }
    setQueue([...cards]);
    setDoneCount(0);
  }, [cards, storageKey]);

  const save = (remaining: Flashcard[], done: number) => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ remainingIds: remaining.map(c => c.id), done }));
  };

  const currentCard = queue[0];
  const total = cards.length;

  const handleFlip = () => setIsFlipped(f => !f);

  const handleGotIt = () => {
    const next = queue.slice(1);
    const newDone = doneCount + 1;
    setDoneCount(newDone);
    setIsFlipped(false);
    if (next.length === 0) {
      setFinished(true);
      save([], newDone);
      recordStudy();
    } else {
      setQueue(next);
      save(next, newDone);
    }
  };

  const handleStillLearning = () => {
    // Move current card to the back of the queue
    const next = [...queue.slice(1), queue[0]];
    setQueue(next);
    setIsFlipped(false);
    save(next, doneCount);
  };

  const handleReset = () => {
    setQueue([...cards]);
    setDoneCount(0);
    setIsFlipped(false);
    setFinished(false);
    if (storageKey) localStorage.removeItem(storageKey);
  };

  const mastered = doneCount;
  const progressPct = Math.round((mastered / total) * 100);
  const stars = mastered === total ? 3 : mastered >= total * 0.66 ? 2 : mastered >= total * 0.33 ? 1 : 0;

  // ── Finished screen ───────────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <div className="text-5xl mb-4">
          {stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🥉'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {stars === 3 ? 'Perfect! All cards mastered.' : `${mastered} of ${total} cards mastered.`}
        </h2>
        <p className="text-gray-600 mb-8">
          {stars === 3
            ? 'You knew every card. Great work — now test yourself for real.'
            : 'Keep practicing the ones you marked "Still learning."'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Start over
          </button>
          <a
            href="/practice-test/california-dmv-practice-test-2026"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Take the full practice test
          </a>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <StickyVerticalAd position="left" currentIndex={doneCount} />
      <StickyVerticalAd position="right" currentIndex={doneCount} />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {mastered} / {total} mastered
          </span>
          <span className="text-sm font-medium text-gray-700">
            {queue.length} remaining
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="[perspective:1000px] mb-6">
        <div
          className={`relative w-full h-64 sm:h-80 transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-white rounded-xl shadow-xl p-8 [backface-visibility:hidden] flex flex-col justify-between">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {t.question}
              </span>
              <p className="text-xl font-bold text-gray-900 leading-snug" dir={dir}>
                {currentCard.question}
              </p>
              {currentCard.questionEn && (
                <p className="text-sm text-gray-500 italic mt-2" dir="ltr">
                  {currentCard.questionEn}
                </p>
              )}
            </div>
            <p className="text-center text-sm text-gray-400">{t.flipToAnswer}</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-700 rounded-xl shadow-xl p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
            <div>
              <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                {t.answer}
              </span>
              <p className="text-xl font-bold text-white leading-snug" dir={dir}>
                {currentCard.answer}
              </p>
              {currentCard.answerEn && (
                <p className="text-sm text-white/70 italic mt-2" dir="ltr">
                  {currentCard.answerEn}
                </p>
              )}
            </div>
            <p className="text-center text-sm text-white/60">{t.flipToQuestion}</p>
          </div>
        </div>
      </div>

      {/* Got it / Still learning — only visible after flip */}
      <div className={`transition-opacity duration-200 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex gap-3 justify-center mb-6">
          <button
            onClick={(e) => { e.stopPropagation(); handleStillLearning(); }}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t.stillLearning}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleGotIt(); }}
            className="flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t.gotIt}
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleReset}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t.reset} deck
        </button>
      </div>

      <QuizAd currentQuestionIndex={doneCount} />

      {/* Dot trail */}
      <div className="mt-4 flex justify-center flex-wrap gap-1.5">
        {cards.map((c, i) => {
          const inQueue = queue.some(q => q.id === c.id);
          const isCurrent = currentCard.id === c.id;
          return (
            <div
              key={c.id}
              className={`rounded-full transition-all ${
                isCurrent
                  ? 'w-4 h-3 bg-primary'
                  : inQueue
                  ? 'w-2.5 h-2.5 bg-gray-300'
                  : 'w-2.5 h-2.5 bg-green-400'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
