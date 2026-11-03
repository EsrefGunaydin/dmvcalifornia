import { test } from "node:test";
import assert from "node:assert/strict";
import { fitRatings, predictMatch } from "./poisson.js";
import type { MatchResult } from "../data/types.js";

function league(): MatchResult[] {
  // Strong team "Lions" beats everyone, "Mules" loses to everyone, "Owls" and "Bears" in between.
  const teams = ["Lions", "Owls", "Bears", "Mules"];
  const strength: Record<string, number> = { Lions: 2.4, Owls: 1.4, Bears: 1.2, Mules: 0.5 };
  const out: MatchResult[] = [];
  const day = new Date("2026-03-01T00:00:00Z");
  for (let round = 0; round < 4; round++) {
    for (const h of teams) for (const a of teams) {
      if (h === a) continue;
      day.setUTCDate(day.getUTCDate() + 1);
      out.push({ date: day.toISOString().slice(0, 10), competition: "test", home: h, away: a,
        homeGoals: Math.round((strength[h] / strength[a]) * 1.3), awayGoals: Math.round(strength[a] / strength[h]) });
    }
  }
  return out;
}

test("grid is a distribution and strong home team is favoured", () => {
  const r = fitRatings(league(), { asOf: "2026-04-30" });
  const p = predictMatch(r, "Lions", "Mules");
  const total = p.probabilities.home + p.probabilities.draw + p.probabilities.away;
  assert.ok(Math.abs(total - 1) < 1e-9);
  assert.ok(p.probabilities.home > 0.7, `expected Lions heavy favourites, got ${p.probabilities.home}`);
  assert.ok(p.lambdaHome > p.lambdaAway);
  assert.ok(p.topScores[0].probability > 0 && p.topScores.length === 6);
});

test("home advantage is positive and ratings centre on zero", () => {
  const r = fitRatings(league(), { asOf: "2026-04-30" });
  assert.ok(r.homeAdvantage > 0);
  const meanAtt = Object.values(r.attack).reduce((s, x) => s + x, 0) / r.teams.length;
  assert.ok(Math.abs(meanAtt) < 1e-6);
});

test("as-of date excludes later results", () => {
  const all = league();
  const r = fitRatings(all, { asOf: "2026-03-20" });
  assert.ok(r.matchesUsed < all.length);
  assert.throws(() => fitRatings(all, { asOf: "2026-01-01" }));
});

test("unknown team throws a helpful error", () => {
  const r = fitRatings(league(), { asOf: "2026-04-30" });
  assert.throws(() => predictMatch(r, "Dragons", "Lions"), /team not in ratings/);
});
