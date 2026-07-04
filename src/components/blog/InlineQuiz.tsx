'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Trophy, FileText } from 'lucide-react';

export interface InlineQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CtaCard {
  href: string;
  title: string;
  description: string;
  label: string;
  icon: 'shield' | 'trophy' | 'clipboard';
}

export interface InlineQuizConfig {
  questions: InlineQuizQuestion[];
  ctaCards: CtaCard[];
  header?: string;
  subheader?: string;
}

const ICONS = {
  shield: Shield,
  trophy: Trophy,
  clipboard: FileText,
};

function ScoreLabel({ pct }: { pct: number }) {
  if (pct === 100) return <span className="text-green-600">Perfect score</span>;
  if (pct >= 67) return <span className="text-amber-600">Not bad</span>;
  return <span className="text-red-600">Time to study up</span>;
}

function shuffleOptions(questions: InlineQuizQuestion[]): InlineQuizQuestion[] {
  return questions.map((q) => {
    const correctText = q.options[q.correctAnswer];
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    return { ...q, options: shuffled, correctAnswer: shuffled.indexOf(correctText) };
  });
}

export default function InlineQuiz({ questions, ctaCards, header, subheader }: InlineQuizConfig) {
  // Shuffle option order once on mount so the correct answer isn't always the same position
  const [shuffled] = useState(() => shuffleOptions(questions));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<'selecting' | 'answered'>('selecting');
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = shuffled[current];
  const isLast = current === shuffled.length - 1;

  function pick(index: number) {
    if (phase === 'answered') return;
    setSelected(index);
  }

  function checkAnswer() {
    if (selected === null) return;
    if (selected === q.correctAnswer) setScore((s) => s + 1);
    setPhase('answered');
  }

  function goBack() {
    if (current === 0) return;
    setCurrent((c) => c - 1);
    setSelected(null);
    setPhase('selecting');
  }

  function advance() {
    if (isLast) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase('selecting');
    }
  }

  const pct = Math.round((score / shuffled.length) * 100);

  // Score-based recommended card index: 100% → 0 (hardest), 33-66% → 1 (medium), 0% → 2 (basics)
  const recommendedIdx = pct === 100 ? 0 : pct >= 34 ? 1 : 2;

  if (done) {
    return (
      <div className="not-prose bg-white rounded-2xl shadow-sm border-2 border-orange-400 p-6 md:p-8 mb-8">
        {/* Score */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold mb-3 ${
              pct === 100
                ? 'bg-green-50 text-green-600 border-2 border-green-200'
                : pct >= 67
                ? 'bg-amber-50 text-amber-600 border-2 border-amber-200'
                : 'bg-red-50 text-red-600 border-2 border-red-200'
            }`}
          >
            {score}/{shuffled.length}
          </div>
          <p className="text-lg font-bold text-gray-900">
            <ScoreLabel pct={pct} /> — what do you want to do next?
          </p>
        </div>

        {/* 3 CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ctaCards.map((card, i) => {
            const Icon = ICONS[card.icon] ?? FileText;
            const isRecommended = i === recommendedIdx;
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`group flex flex-col rounded-2xl border-2 p-4 transition-all hover:shadow-md ${
                  isRecommended
                    ? 'border-orange-400 bg-orange-500 hover:bg-orange-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {isRecommended && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-100 mb-2">
                    Recommended for you
                  </span>
                )}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    isRecommended ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <p className={`text-sm font-bold mb-1 ${isRecommended ? 'text-white' : 'text-gray-900'}`}>
                  {card.title}
                </p>
                <p className={`text-xs leading-snug flex-1 ${isRecommended ? 'text-orange-100' : 'text-gray-500'}`}>{card.description}</p>
                <span
                  className={`mt-3 text-xs font-extrabold group-hover:underline ${
                    isRecommended ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {card.label} →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose rounded-2xl overflow-hidden shadow-md mb-8">
      {/* Orange header band */}
      {header && (
        <div className="bg-orange-500 px-6 py-5">
          <p className="text-xl font-extrabold text-white leading-snug">{header}</p>
          {subheader && <p className="text-base font-semibold text-gray-900 mt-1">{subheader}</p>}
        </div>
      )}

      {/* White quiz area */}
      <div className="bg-white px-6 md:px-8 pt-5 pb-6">

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Question {current + 1} of {shuffled.length}
        </span>
      </div>

      {/* Question */}
      <p className="text-lg font-bold text-gray-900 mb-6 leading-snug">{q.question}</p>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correctAnswer;
          const isWrong = phase === 'answered' && isSelected && !isCorrect;
          const showCorrect = phase === 'answered' && isCorrect;

          let cardCls =
            'w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border transition-all ';

          if (phase === 'answered') {
            if (showCorrect) cardCls += 'border-green-400 bg-green-50';
            else if (isWrong) cardCls += 'border-red-400 bg-red-50';
            else cardCls += 'border-gray-100 bg-gray-50';
          } else if (isSelected) {
            cardCls += 'border-orange-400 bg-orange-50 cursor-pointer';
          } else {
            cardCls += 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer';
          }

          let radioCls =
            'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ';

          if (phase === 'answered') {
            if (showCorrect) radioCls += 'border-green-500 bg-green-500';
            else if (isWrong) radioCls += 'border-red-400 bg-red-400';
            else radioCls += 'border-gray-300 bg-white';
          } else if (isSelected) {
            radioCls += 'border-orange-500 bg-orange-500';
          } else {
            radioCls += 'border-gray-300 bg-white';
          }

          const showDot = phase === 'answered' ? showCorrect || isWrong : isSelected;

          return (
            <button
              key={i}
              className={cardCls}
              onClick={() => pick(i)}
              disabled={phase === 'answered'}
            >
              <span className={radioCls}>
                {showDot && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path
                      d="M10 3L5 8.5 2 5.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                )}
              </span>
              <span
                className={`text-sm font-medium ${
                  phase === 'answered'
                    ? showCorrect
                      ? 'text-green-800'
                      : isWrong
                      ? 'text-red-700'
                      : 'text-gray-400'
                    : isSelected
                    ? 'text-orange-900'
                    : 'text-gray-700'
                }`}
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {phase === 'answered' && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 mb-5 leading-relaxed">
          {q.explanation}
        </p>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        {phase === 'selecting' ? (
          <button
            onClick={checkAnswer}
            disabled={selected === null}
            className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default text-white font-extrabold text-base py-4 px-6 rounded-2xl transition-colors"
          >
            <span>Check answer</span>
            <span className="text-xl leading-none">→</span>
          </button>
        ) : (
          <button
            onClick={advance}
            className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base py-4 px-6 rounded-2xl transition-colors"
          >
            <span>{isLast ? 'See my score' : 'Next question'}</span>
            <span className="text-xl leading-none">→</span>
          </button>
        )}
        {current > 0 && phase === 'selecting' && (
          <button
            onClick={goBack}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            ← Previous question
          </button>
        )}
      </div>
      </div>
    </div>
  );
}
