'use client';

import { useState } from 'react';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface FlashcardDeckProps {
  cards: Flashcard[];
  title: string;
}

export default function FlashcardDeck({ cards, title }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative perspective-1000">
        <div
          className={`relative w-full min-h-[400px] transition-transform duration-500 transform-style-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Front of Card (Question) */}
          <div
            className={`absolute w-full h-full bg-white rounded-xl shadow-2xl p-8 backface-hidden ${
              isFlipped ? 'invisible' : 'visible'
            }`}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Question
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentCard.question}
                </h3>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Click to see answer</p>
              </div>
            </div>
          </div>

          {/* Back of Card (Answer) */}
          <div
            className={`absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-2xl p-8 backface-hidden rotate-y-180 ${
              isFlipped ? 'visible' : 'invisible'
            }`}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="inline-block bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Answer
                </div>
                <p className="text-2xl font-bold text-white leading-relaxed">
                  {currentCard.answer}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-sm">Click to see question</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>

        {currentIndex === cards.length - 1 ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Start Over
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Card Counter */}
      <div className="mt-6 flex justify-center gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsFlipped(false);
              setShowAnswer(false);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-blue-600 w-8'
                : index < currentIndex
                ? 'bg-green-400'
                : 'bg-gray-300'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
