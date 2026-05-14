// Types for the "Intersection" right-of-way puzzle game.

export type Direction = 'north' | 'south' | 'east' | 'west';
export type Intent = 'straight' | 'left' | 'right';
export type AgentType = 'car' | 'pedestrian' | 'cyclist' | 'emergency';
export type IntersectionType =
  | 'four-way-stop'
  | 'two-way-stop'
  | 'uncontrolled'
  | 't-intersection'
  | 'signal';

export interface Agent {
  /** Stable id, referenced by correctOrder / stepRules / collisionRules. */
  id: string;
  type: AgentType;
  /** Which arm of the intersection the agent sits on. */
  approachFrom: Direction;
  /** Where the agent is headed — drives the intent arrow. */
  intent: Intent;
  /** Optional lane refinement (bike lane for cyclists, turn lanes, etc.). */
  lane?: 'left' | 'right' | 'bike';
  /** Optional short tag shown on the agent, e.g. "Arrived first". */
  label?: string;
}

export interface IntersectionLevel {
  /** "level-1" .. "level-10" */
  id: string;
  title: string;
  description: string;
  intersectionType: IntersectionType;
  agents: Agent[];
  /** Agent ids in the legal order they may proceed. */
  correctOrder: string[];
  /** agentId -> why this agent goes when it does (shown in the recap). */
  stepRules: Record<string, string>;
  /**
   * Collision rule lookup. Key is "<tappedId>><shouldBeId>" — when the player
   * taps tappedId but shouldBeId had the right of way. A "*" wildcard key
   * provides a fallback rule for any wrong tap not otherwise listed.
   */
  collisionRules: Record<string, string>;
  /** e.g. "CVC §21801" — surfaced in the recap. */
  cvcReference?: string;
}

export interface IntersectionLevelsFile {
  levels: IntersectionLevel[];
}

export interface GameResult {
  levelId: string;
  stars: 1 | 2 | 3;
  attempts: number;
  /** ISO timestamp. */
  solvedAt: string;
}

/** Star rating from the number of failed attempts before solving. */
export function starsForAttempts(attempts: number): 1 | 2 | 3 {
  if (attempts <= 1) return 3;
  if (attempts === 2) return 2;
  return 1;
}
