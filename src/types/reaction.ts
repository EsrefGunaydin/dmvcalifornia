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
 * Star rating against typical simple visual-reaction-time benchmarks.
 * ~250ms is a commonly cited average for a simple visual reaction; braking
 * reaction in real driving is much slower because it includes recognition
 * and decision time, not just a known "go" signal.
 */
export function starsForReaction(averageMs: number, falseStarts: number): 1 | 2 | 3 {
  if (falseStarts >= 2) return 1;
  if (averageMs <= 250) return 3;
  if (averageMs <= 400) return 2;
  return 1;
}

/** Leaderboard percentage: 300ms maps to 100, scaling down as it slows. */
export function percentageFromReaction(averageMs: number): number {
  return Math.max(0, Math.min(100, Math.round((300 / averageMs) * 100)));
}

/**
 * Feet a car travels during a given reaction time at a given speed.
 * 1.467 converts mph to feet/second (5280 / 3600).
 */
export function stoppingDistanceFeet(speedMph: number, reactionMs: number): number {
  return Math.round(speedMph * 1.467 * (reactionMs / 1000));
}
