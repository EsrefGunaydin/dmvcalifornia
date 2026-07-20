import { todayUTC } from '@/lib/dailyChallenge';

export function reactionQuizId(date: string): string {
  return `reaction-test-${date}`;
}

export function todayReactionQuizId(): string {
  return reactionQuizId(todayUTC());
}

const EPOCH = new Date(Date.UTC(2026, 6, 20)); // launch day, board #1

export function reactionDailyIndex(): number {
  const now = new Date();
  const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const utcEpoch = Date.UTC(EPOCH.getUTCFullYear(), EPOCH.getUTCMonth(), EPOCH.getUTCDate());
  return Math.floor((utcNow - utcEpoch) / 86400000) + 1;
}
