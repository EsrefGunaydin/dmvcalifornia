// AUTO-GENERATED base view estimates for quizzes.
// Grounded in real leaderboard engagement (submissions x funnel multiplier)
// plus a category/language floor. Live views from /api/quiz-views are ADDED
// on top of these. Safe to hand-edit any number below.

export const QUIZ_BASE_VIEWS: Record<string, number> = {
  "california-dmv-practice-test-2026": 2960,
  "dmv-simulation-test-1": 8960,
  "dmv-simulation-test-2": 5900,
  "practice-test-1": 4320,
  "practice-test-2": 2860,
  "practice-test-3": 2860,
  "practice-test-4": 2730,
  "practice-test-5": 2060,
  "practice-test-6": 2020,
  "practice-test-7": 1810,
  "practice-test-8": 2150,
  "practice-test-9": 1900,
  "practice-test-10": 2040,
  "practice-test-11": 1790,
  "practice-test-12": 1660,
  "practice-test-13": 1790,
  "practice-test-14": 1830,
  "practice-test-15": 2210,
  "practice-test-16": 2130,
  "practice-test-mixed-review": 2310,
  "dmv-simulation-test-3": 3760,
  "sample-questions-test": 1980,
  "dmv-spanish-practice-test-1": 2200,
  "dmv-spanish-practice-test-2": 1570,
  "dmv-spanish-simulation-test-1": 4950,
  "chinese-simulator-test": 2550,
  "chinese-practice-test-1": 1470,
  "chinese-practice-test-2": 1100,
  "turkish-test-1": 2330,
  "turkish-test-2": 1070,
  "arabic-simulator-test": 940,
  "arabic-practice-test-1": 940,
  "arabic-practice-test-2": 940,
  "armenian-simulator-test": 890,
  "farsi-simulator-test": 1190,
  "punjabi-simulator-test": 1050,
  "russian-simulator-test": 870,
  "tagalog-simulator-test": 920,
  "tagalog-practice-test-1": 870,
  "vietnamese-simulator-test": 930,
  "motorcycle-class-m-test-1": 1440,
  "commercial-class-a-b-test-1": 1380,
  "commercial-class-a-b-test-2": 1380,
  "turkish-sign-test": 1820,
  "spanish-sign-test": 2150
};

// The three daily games (sign-match, reaction-test, dmvordle) mint a new
// quizId every day (e.g. "sign-match-2026-07-20"), so they can never get a
// fixed entry in QUIZ_BASE_VIEWS above — a per-date key would only cover one
// day and fall through to the generic hash fallback (800-2300) every day
// after, which reads as an obviously fake number for a brand-new feature.
// Matched by prefix, then hashed into a narrow, modest 99-112 floor instead —
// same hash technique as the generic fallback below, just a tighter range.
// Since the date is embedded in the quizId, this gives a different (but
// stable for everyone that day) number per game per day, not one flat
// constant that would look copy-pasted across all three. The live count
// from /api/quiz-views is added on top and grows from here as real plays
// happen — this floor is a modest promotional starting point, not a claim
// about real historical traffic.
const DAILY_GAME_PREFIXES = ['sign-match-', 'reaction-test-', 'dmvordle-'];

function hash32(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

export function getBaseViews(quizId: string | number): number {
  const key = String(quizId);
  if (QUIZ_BASE_VIEWS[key] != null) return QUIZ_BASE_VIEWS[key];
  if (DAILY_GAME_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    return 99 + (hash32(key) % 14); // 99-112 inclusive
  }
  // deterministic fallback for any quiz not in the map
  return 800 + (hash32(key) % 1500);
}
