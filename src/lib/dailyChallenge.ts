import type { Question } from '@/types/quiz';

function mulberry32(seed: number) {
  return function (): number {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromDate(dateStr: string): number {
  // dateStr: 'YYYY-MM-DD' in UTC
  return parseInt(dateStr.replace(/-/g, ''), 10);
}

export function pickDailyQuestions(pool: Question[], n: number, seed: number): Question[] {
  const rng = mulberry32(seed);
  const copy = [...pool];
  const result: Question[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push({ ...copy[idx], id: i + 1 }); // reassign sequential IDs
    copy.splice(idx, 1);
  }
  return result;
}

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export function dailyQuizId(date: string): string {
  return `daily-challenge-${date}`;
}
