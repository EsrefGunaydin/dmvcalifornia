import roadSignsData from '@/data/road-signs-test.json';
import { seedFromDate, todayUTC } from '@/lib/dailyChallenge';
import type { SignMatchCard, SignMatchSign } from '@/types/signMatch';

const PAIRS_PER_ROUND = 8;

function mulberry32(seed: number) {
  return function (): number {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A few source signs share identical meaning text under different images
// (e.g. two signs both meaning "Railroad crossing ahead"). Keep only the
// first sign per unique meaning so no two cards in the pool could be
// legitimately matched by meaning alone while still being flagged wrong.
const ALL_SIGNS: SignMatchSign[] = (() => {
  const seenMeanings = new Set<string>();
  const signs: SignMatchSign[] = [];
  for (const q of roadSignsData.questions) {
    const meaning = q.options[q.correctAnswer];
    if (seenMeanings.has(meaning)) continue;
    seenMeanings.add(meaning);
    signs.push({ id: q.id, image: q.image, meaning });
  }
  return signs;
})();

export function signMatchQuizId(date: string): string {
  return `sign-match-${date}`;
}

const EPOCH = new Date(Date.UTC(2026, 6, 20)); // launch day, board #1

export function signMatchDailyIndex(): number {
  const now = new Date();
  const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const utcEpoch = Date.UTC(EPOCH.getUTCFullYear(), EPOCH.getUTCMonth(), EPOCH.getUTCDate());
  return Math.floor((utcNow - utcEpoch) / 86400000) + 1;
}

export function todaySignMatch(): { quizId: string; cards: SignMatchCard[]; pairs: number } {
  const date = todayUTC();
  const seed = seedFromDate(date);
  const rng = mulberry32(seed);

  const signs = seededShuffle(ALL_SIGNS, rng).slice(0, PAIRS_PER_ROUND);

  const cards: SignMatchCard[] = signs.flatMap((sign) => [
    { cardId: `${sign.id}-image`, signId: sign.id, kind: 'image' as const, image: sign.image },
    { cardId: `${sign.id}-meaning`, signId: sign.id, kind: 'meaning' as const, meaning: sign.meaning },
  ]);

  return { quizId: signMatchQuizId(date), cards: seededShuffle(cards, rng), pairs: signs.length };
}
