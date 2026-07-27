import type { Quiz, Question, QuizLanguage } from '@/types/quiz';
import { getAllFixedQuizzes } from './allQuizzes';

// Motorcycle/commercial quizzes share language 'en' but test a different
// license class entirely (air brakes, pre-trip inspection, etc.) — they
// don't belong in a general car-permit simulator pool.
const EXCLUDED_QUIZ_CATEGORIES = new Set(['Motorcycle (Class M)', 'Commercial (Class A/B)']);

// New York DMV quizzes share language 'en' but test New York-specific rules —
// they don't belong in the California simulator's pool. Categories are
// prefixed "New York DMV — ..." so new NY chapters are excluded automatically.
const EXCLUDED_CATEGORY_PREFIXES = ['New York DMV'];

function isExcludedCategory(category: string): boolean {
  return EXCLUDED_QUIZ_CATEGORIES.has(category) || EXCLUDED_CATEGORY_PREFIXES.some((p) => category.startsWith(p));
}

// The only two sign-only quizzes present in getAllFixedQuizzes(); excluded
// from the general pool unless the caller opts in.
const SIGN_ONLY_SLUGS = new Set([
  'dmv-california-turkce-trafik-isareti-testi',
  'examen-senales-trafico-espanol',
]);

interface PoolOptions {
  includeSigns?: boolean;
}

/**
 * Every unique question available for a language, flattened across that
 * language's fixed quiz sets and deduped by question text (several fixed
 * quizzes are verbatim subsets of a larger merged test, e.g. the Spanish
 * exam-1/exam-2/practice-test-1 cluster). IDs are reassigned sequentially in
 * a stable, deterministic order so a given id always refers to the same
 * question across every draw — this is what lets Wrong Answers Review
 * resolve a missed simulator question later.
 */
export function buildLanguagePool(lang: QuizLanguage, options: PoolOptions = {}): Question[] {
  const { includeSigns = false } = options;

  const quizzes = getAllFixedQuizzes().filter(
    (q) =>
      q.language === lang &&
      !isExcludedCategory(q.category) &&
      (includeSigns || !SIGN_ONLY_SLUGS.has(q.slug))
  );

  const seen = new Set<string>();
  const pool: Question[] = [];
  let nextId = 1;
  for (const quiz of quizzes) {
    for (const question of quiz.questions) {
      const key = question.question.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push({ ...question, id: nextId++ });
    }
  }
  return pool;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const DEFAULT_QUESTION_COUNT = 46;

interface DrawOptions extends PoolOptions {
  count?: number;
}

export interface SimulatorDraw {
  quiz: Quiz;
  poolSize: number;
  /** True when the pool is smaller than the requested count — every
   * question in the pool was included instead of a random subset. */
  truncated: boolean;
}

/**
 * Draws a fresh random question set for a language's practice test
 * simulator. Small-pool languages (Armenian, Tagalog) can't fill a
 * 46-question draw, so the full pool is returned in random order instead.
 */
export function drawSimulatorQuiz(lang: QuizLanguage, options: DrawOptions = {}): SimulatorDraw {
  const { count = DEFAULT_QUESTION_COUNT, includeSigns = false } = options;
  const pool = buildLanguagePool(lang, { includeSigns });
  const effectiveCount = Math.min(count, pool.length);
  const questions = shuffleArray(pool).slice(0, effectiveCount);

  const quiz: Quiz = {
    id: `simulator-${lang}`,
    title: 'Practice Test Simulator',
    description: `A random ${effectiveCount}-question set drawn fresh from the full question pool every time.`,
    category: 'Simulator',
    slug: `simulator-${lang}`,
    language: lang,
    questions,
    passingScore: 83,
  };

  return { quiz, poolSize: pool.length, truncated: pool.length < count };
}

/**
 * The full pool for a language, shaped as a Quiz object so it can be
 * registered alongside the fixed quizzes for Wrong Answers Review lookups
 * (which need every question a simulator attempt could have drawn from,
 * not just the subset a particular attempt used).
 */
export function getSimulatorPoolQuiz(lang: QuizLanguage, options: PoolOptions = {}): Quiz {
  const pool = buildLanguagePool(lang, options);
  return {
    id: `simulator-${lang}`,
    title: 'Practice Test Simulator',
    description: 'Full simulator question pool.',
    category: 'Simulator',
    slug: `simulator-${lang}`,
    language: lang,
    questions: pool,
    passingScore: 83,
  };
}
