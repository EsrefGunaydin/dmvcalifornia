'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Quiz, Question, QuizResult, ShuffledQuestion } from '@/types/quiz';
import Results from './Results';
import AdRefreshManager from '@/components/ads/AdRefreshManager';

interface QuizEngineProps {
  quiz: Quiz;
  quizId: string | number;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Shuffle questions and their options
function shuffleQuiz(questions: Question[]): ShuffledQuestion[] {
  // First shuffle the questions order
  const shuffledQuestions = shuffleArray(questions);

  // Then shuffle the options for each question
  return shuffledQuestions.map((question, index) => {
    // Check if the last option is "Both/All of the above" - if so, don't shuffle
    const lastOption = question.options[question.options.length - 1];
    const hasCombinedOption = /^(both|all) of the above$/i.test(lastOption.trim());

    let shuffledOptions: string[];
    let shuffledCorrectAnswer: number;

    if (hasCombinedOption) {
      // Don't shuffle if last option is "Both/All of the above"
      shuffledOptions = [...question.options];
      shuffledCorrectAnswer = question.correctAnswer;
    } else {
      // Create array of option indices [0, 1, 2, ...]
      const optionIndices = question.options.map((_, i) => i);
      const shuffledIndices = shuffleArray(optionIndices);

      // Map options to new positions
      shuffledOptions = shuffledIndices.map(i => question.options[i]);

      // Find where the correct answer moved to
      shuffledCorrectAnswer = shuffledIndices.indexOf(question.correctAnswer);
    }

    return {
      ...question,
      shuffledOptions,
      shuffledCorrectAnswer,
      originalIndex: index,
    };
  });
}

export default function QuizEngine({ quiz, quizId }: QuizEngineProps) {
  // Shuffle questions on component mount or restart
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(new Map());
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [startTime] = useState(new Date().toISOString());

  // Initialize shuffled questions
  useEffect(() => {
    const savedProgress = localStorage.getItem(`quiz-progress-${quiz.id}`);
    const savedShuffle = localStorage.getItem(`quiz-shuffle-${quiz.id}`);

    if (savedProgress && savedShuffle) {
      // Restore saved shuffle
      const progress = JSON.parse(savedProgress);
      const shuffle = JSON.parse(savedShuffle);
      setShuffledQuestions(shuffle);
      setCurrentQuestionIndex(progress.currentQuestion || 0);
      setSelectedAnswers(new Map(Object.entries(progress.answers).map(([k, v]) => [parseInt(k), v as number])));
    } else {
      // Create new shuffle
      const shuffled = shuffleQuiz(quiz.questions);
      setShuffledQuestions(shuffled);
      localStorage.setItem(`quiz-shuffle-${quiz.id}`, JSON.stringify(shuffled));
    }
  }, [quiz.id, quiz.questions]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;
  const hasSelectedAnswer = currentQuestion ? selectedAnswers.has(currentQuestion.id) : false;

  // Save progress to localStorage
  useEffect(() => {
    if (!quizCompleted) {
      const progress = {
        quizId: quiz.id,
        currentQuestion: currentQuestionIndex,
        answers: Object.fromEntries(selectedAnswers),
        startedAt: startTime,
      };
      localStorage.setItem(`quiz-progress-${quiz.id}`, JSON.stringify(progress));
    }
  }, [currentQuestionIndex, selectedAnswers, quiz.id, quizCompleted, startTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = new Map(selectedAnswers);
    newAnswers.set(currentQuestion.id, answerIndex);
    setSelectedAnswers(newAnswers);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      completeQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const completeQuiz = () => {
    const answers = shuffledQuestions.map((question) => {
      const selectedAnswer = selectedAnswers.get(question.id) ?? -1;
      const isCorrect = selectedAnswer === question.shuffledCorrectAnswer;
      return {
        questionId: question.id,
        selectedAnswer,
        isCorrect,
      };
    });

    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = shuffledQuestions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScore;

    const result: QuizResult = {
      quizId: quiz.id,
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      percentage,
      passed,
      answers,
      completedAt: new Date().toISOString(),
    };

    setQuizResult(result);
    setQuizCompleted(true);

    // Save result to localStorage
    const results = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    results.push(result);
    localStorage.setItem('quiz-results', JSON.stringify(results));

    // Clear progress
    localStorage.removeItem(`quiz-progress-${quiz.id}`);
  };

  const handleRestart = () => {
    // Create a new shuffle
    const shuffled = shuffleQuiz(quiz.questions);
    setShuffledQuestions(shuffled);
    localStorage.setItem(`quiz-shuffle-${quiz.id}`, JSON.stringify(shuffled));

    // Reset state
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Map());
    setShowExplanation(false);
    setQuizCompleted(false);
    setQuizResult(null);
    localStorage.removeItem(`quiz-progress-${quiz.id}`);
  };

  if (quizCompleted && quizResult) {
    return <Results result={quizResult} quiz={quiz} quizId={quizId} onRestart={handleRestart} />;
  }

  // Show loading state while shuffling
  if (!currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const selectedAnswer = selectedAnswers.get(currentQuestion.id);
  const isCorrect = selectedAnswer === currentQuestion.shuffledCorrectAnswer;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Ad Refresh Manager - handles smart ad refreshes */}
      <AdRefreshManager
        currentQuestionIndex={currentQuestionIndex}
        quizCompleted={quizCompleted}
        totalQuestions={shuffledQuestions.length}
        refreshInterval={5}
        minTimeBetweenRefresh={30}
      />

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / shuffledQuestions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {currentQuestion.category}
            </span>
            {currentQuestion.difficulty && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {currentQuestion.question}
          </h2>

          {/* Question Image */}
          {currentQuestion.image && (
            <div className="flex justify-center my-6">
              <div className="relative w-full max-w-xs aspect-square">
                <Image
                  src={currentQuestion.image}
                  alt="Traffic sign for question"
                  fill
                  className="object-contain rounded-lg shadow-md border-2 border-gray-200 bg-white p-4"
                  sizes="(max-width: 768px) 100vw, 384px"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.shuffledOptions.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentQuestion.shuffledCorrectAnswer;
            const showCorrectness = showExplanation && isSelected;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showExplanation
                    ? isCorrectAnswer
                      ? 'border-green-500 bg-green-50'
                      : isSelected
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                    : isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showExplanation
                      ? isCorrectAnswer
                        ? 'border-green-500 bg-green-500'
                        : isSelected
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                      : isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {showExplanation && (isCorrectAnswer || isSelected) && (
                      <span className="text-white text-sm">
                        {isCorrectAnswer ? '✓' : '✗'}
                      </span>
                    )}
                    {!showExplanation && isSelected && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <span className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '✓' : '✗'}
              </span>
              <div>
                <h3 className={`font-bold mb-2 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {hasSelectedAnswer && !showExplanation && (
            <button
              onClick={handleShowExplanation}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Check Answer
            </button>
          )}

          {showExplanation && (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}

          {!hasSelectedAnswer && (
            <button
              disabled
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
            >
              Select an answer
            </button>
          )}
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Questions</h3>
        <div className="flex flex-wrap gap-2">
          {shuffledQuestions.map((question, index) => {
            const isAnswered = selectedAnswers.has(question.id);
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={question.id}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setShowExplanation(false);
                }}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  isCurrent
                    ? 'bg-primary text-white'
                    : isAnswered
                    ? 'bg-primary/20 text-primary hover:bg-primary/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
