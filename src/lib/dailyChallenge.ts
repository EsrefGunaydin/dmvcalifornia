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
  // dateStr: 'YYYY-MM-DD', as returned by todayPacific()
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

// All daily games/leaderboards reset on this single fixed timezone instead
// of the server's UTC clock (which flipped the "day" at 4-5pm Pacific,
// hours before local midnight) or each visitor's own device timezone
// (which would break the "same puzzle for everyone" premise a shared daily
// leaderboard depends on). Pacific matches this site's primary audience.
// Intl handles PST/PDT automatically, no manual DST offset math.
const RESET_TIMEZONE = 'America/Los_Angeles';

export function todayPacific(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: RESET_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/**
 * Whole calendar days between two YYYY-MM-DD dates (both already resolved
 * in RESET_TIMEZONE via todayPacific()). Parsing as UTC here is just a trick to
 * diff two Y-M-D triples in whole days without DST arithmetic creeping in.
 */
export function daysSinceEpoch(dateStr: string, epochDateStr: string): number {
  const toUTCms = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.floor((toUTCms(dateStr) - toUTCms(epochDateStr)) / 86400000);
}

export function dailyQuizId(date: string): string {
  return `daily-challenge-${date}`;
}
