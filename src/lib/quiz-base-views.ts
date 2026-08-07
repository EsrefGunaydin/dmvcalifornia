// Policy (2026-08-07): no synthetic or starter numbers on view/play counts
// anywhere on the site. getBaseViews always returns 0 — every social-proof
// counter (QuizViewTracker, the site-wide stats route) is now exactly the
// real tracked count from /api/quiz-views / the quiz_views collection, no
// more, no less. Kept as a function (not deleted) so none of its 30+ call
// sites need to change.
export function getBaseViews(_quizId: string | number): number {
  return 0;
}
