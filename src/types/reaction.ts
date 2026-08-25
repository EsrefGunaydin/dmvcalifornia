// Types for the Brake Reaction Test game.

export const ROUNDS_PER_GAME = 5;
/** Recorded when a player clicks before the stimulus appears. */
export const FALSE_START_PENALTY_MS = 1000;

export interface ReactionRound {
  round: number;
  reactionMs: number;
  falseStart: boolean;
}

export interface ReactionResult {
  rounds: ReactionRound[];
  averageMs: number;
  bestMs: number;
  falseStarts: number;
  stars: 1 | 2 | 3;
  completedAt: string;
}

/**
 * Star rating against the player's BEST round, not their average — the same
 * "best attempt counts" logic as high jump: you get several tries, and your
 * result is the best one you cleared, not the average across misses.
 * Thresholds are tighter than a simple average would need, since the best of
 * 5 tries is naturally faster than the average of 5 (selection effect):
 * ~200ms is a strong single reaction, ~300ms a typical one.
 */
export function starsForReaction(bestMs: number, falseStarts: number): 1 | 2 | 3 {
  if (falseStarts >= 2) return 1;
  if (bestMs <= 200) return 3;
  if (bestMs <= 300) return 2;
  return 1;
}

/**
 * Leaderboard percentage from a best-round time. Asymptotic curve (never
 * saturates except in the limit as bestMs approaches 0) instead of a flat
 * ratio: a straight `(300 / bestMs) * 100` clamp made every sub-300ms score
 * tie at 100, which is most real players, so the leaderboard couldn't rank
 * anyone against each other once they beat 300ms.
 */
export function percentageFromReaction(bestMs: number): number {
  const REFERENCE_MS = 150;
  return Math.max(0, Math.min(100, Math.round((REFERENCE_MS / (bestMs + REFERENCE_MS)) * 100)));
}

/**
 * Feet a car travels during a given reaction time at a given speed.
 * 1.467 converts mph to feet/second (5280 / 3600).
 */
export function stoppingDistanceFeet(speedMph: number, reactionMs: number): number {
  return Math.round(speedMph * 1.467 * (reactionMs / 1000));
}
