import { todayPacific, daysSinceEpoch } from '@/lib/dailyChallenge';

export function reactionQuizId(date: string): string {
  return `reaction-test-${date}`;
}

export function todayReactionQuizId(): string {
  return reactionQuizId(todayPacific());
}

const EPOCH = '2026-07-20'; // launch day, board #1

export function reactionDailyIndex(): number {
  return daysSinceEpoch(todayPacific(), EPOCH) + 1;
}
