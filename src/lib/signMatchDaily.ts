import roadSignsData from '@/data/road-signs-test.json';
import { seedFromDate, todayPacific, daysSinceEpoch } from '@/lib/dailyChallenge';
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

// A handful of source questions are scenario-based — the "correct answer" is
// the right action for a hypothetical situation described in the question
// text, not a direct description of what the pictured sign means on its
// own. That reads as a wrong/confusing match once isolated from the
// original question as "image X means Y", which is exactly how this game
// presents it. Override just for this game; the shared quiz data and any
// other page that still shows the full question text alongside the image
// is unaffected.
const MEANING_OVERRIDES: Record<number, string> = {
  // Was "Stop, then proceed when safe" — the answer to a flashing-signal
  // scenario, not what the static round yellow crossbuck sign itself means.
  6: 'Railroad crossing ahead',
  // Was "A convertible with an adult and two children" — an example
  // qualifying vehicle for the quiz question, not a description of the
  // carpool (HOV) lane sign at all.
  7: 'Carpool (HOV) lane: minimum passengers required',
  // Was "The road ahead is closed to traffic in your direction" — doesn't
  // match this sign's own explanation text ("WRONG WAY sign means you're
  // going the wrong direction"). Deliberately matches id 26's wording
  // exactly so the dedup step below collapses these two same-concept signs
  // into one instead of letting two differently-worded "wrong way" meanings
  // both stay selectable.
  4: 'You are heading the wrong direction on a one-way road',
};

// A few source signs share identical meaning text under different images
// (e.g. two signs both meaning "Railroad crossing ahead"). Keep only the
// first sign per unique meaning so no two cards in the pool could be
// legitimately matched by meaning alone while still being flagged wrong.
const ALL_SIGNS: SignMatchSign[] = (() => {
  const seenMeanings = new Set<string>();
  const signs: SignMatchSign[] = [];
  for (const q of roadSignsData.questions) {
    const meaning = MEANING_OVERRIDES[q.id] ?? q.options[q.correctAnswer];
    if (seenMeanings.has(meaning)) continue;
    seenMeanings.add(meaning);
    signs.push({ id: q.id, image: q.image, meaning });
  }
  return signs;
})();

export function signMatchQuizId(date: string): string {
  return `sign-match-${date}`;
}

const EPOCH = '2026-07-20'; // launch day, board #1

export function signMatchDailyIndex(): number {
  return daysSinceEpoch(todayPacific(), EPOCH) + 1;
}

export function todaySignMatch(): { quizId: string; cards: SignMatchCard[]; pairs: number } {
  const date = todayPacific();
  const seed = seedFromDate(date);
  const rng = mulberry32(seed);

  const signs = seededShuffle(ALL_SIGNS, rng).slice(0, PAIRS_PER_ROUND);

  const cards: SignMatchCard[] = signs.flatMap((sign) => [
    { cardId: `${sign.id}-image`, signId: sign.id, kind: 'image' as const, image: sign.image },
    { cardId: `${sign.id}-meaning`, signId: sign.id, kind: 'meaning' as const, meaning: sign.meaning },
  ]);

  return { quizId: signMatchQuizId(date), cards: seededShuffle(cards, rng), pairs: signs.length };
}
