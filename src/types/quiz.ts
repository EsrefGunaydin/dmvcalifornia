export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option (0-3)
  explanation?: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  image?: string; // optional image path for the question
};

export type ShuffledQuestion = Question & {
  shuffledOptions: string[]; // shuffled version of options
  shuffledCorrectAnswer: number; // updated correct answer index after shuffling
  originalIndex: number; // original position in the quiz
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  questions: Question[];
  passingScore: number; // percentage (e.g., 83 for 83%)
  timeLimit?: number; // in minutes (optional)
};

export type QuizResult = {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  completedAt: string;
};

export type QuizProgress = {
  quizId: string;
  currentQuestion: number;
  answers: Map<number, number>;
  startedAt: string;
};

export type LeaderboardEntry = {
  id: number;
  quizId: number;
  date: string;
  name: string;
  email: string;
  points: number;
  percentage: number;
  completedAt: string;
};
