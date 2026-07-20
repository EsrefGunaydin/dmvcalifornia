// Types for the Road Sign Memory Match game.

export interface SignMatchSign {
  id: number;
  image: string;
  /** Short meaning text, e.g. "Do not enter". Pulled from the correct answer
   * of the corresponding road-signs-test.json question. */
  meaning: string;
}

export type SignMatchCardKind = 'image' | 'meaning';

export interface SignMatchCard {
  /** Unique per card in the grid (two cards share the same signId). */
  cardId: string;
  signId: number;
  kind: SignMatchCardKind;
  image?: string;
  meaning?: string;
}

export interface SignMatchResult {
  /** Total card flips (two flips = one attempt at a pair). */
  moves: number;
  /** Flips that did not result in a match. */
  mistakes: number;
  pairs: number;
  stars: 1 | 2 | 3;
  elapsedMs: number;
  completedAt: string;
}

/**
 * Star rating. Perfect play matches every pair on the first attempt for that
 * pair (mistakes === 0). A "mistake" is one flip that didn't complete a match.
 */
export function starsForSignMatch(pairs: number, mistakes: number): 1 | 2 | 3 {
  if (mistakes === 0) return 3;
  if (mistakes <= pairs) return 2;
  return 1;
}

/** Leaderboard percentage: perfect play (moves === pairs*2) scores 100. */
export function percentageFromMoves(moves: number, pairs: number): number {
  const ideal = pairs * 2;
  return Math.max(0, Math.min(100, Math.round((ideal / moves) * 100)));
}
