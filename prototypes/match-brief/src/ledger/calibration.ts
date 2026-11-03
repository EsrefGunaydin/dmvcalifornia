import type { LedgerEntry } from "./ledger.js";
import type { MatchResult } from "../data/types.js";
import { sameTeam } from "../data/types.js";

export interface Scored {
  entry: LedgerEntry;
  result: MatchResult;
  outcome: "home" | "draw" | "away";
  brier: number;
  logLoss: number;
  pickCorrect: boolean;
  exactScoreHit: boolean;
}

export interface CalibrationReport {
  scored: Scored[];
  unresolved: LedgerEntry[];
  meanBrier: number | null;      // multiclass Brier, 0 is perfect, 0.667 is uniform
  meanLogLoss: number | null;    // 1.0986 is uniform
  pickAccuracy: number | null;
  reliability: { bin: string; predicted: number; observed: number; n: number }[];
}

export function scoreLedger(entries: LedgerEntry[], results: MatchResult[]): CalibrationReport {
  const scored: Scored[] = [], unresolved: LedgerEntry[] = [];
  for (const e of entries) {
    const r = results.find((x) => x.date === e.date && sameTeam(x.home, e.home) && sameTeam(x.away, e.away));
    if (!r) { unresolved.push(e); continue; }
    const outcome = r.homeGoals > r.awayGoals ? "home" : r.homeGoals === r.awayGoals ? "draw" : "away";
    const p = e.probabilities;
    const brier = (["home", "draw", "away"] as const).reduce((s, k) => s + Math.pow(p[k] - (k === outcome ? 1 : 0), 2), 0);
    const logLoss = -Math.log(Math.max(p[outcome], 1e-9));
    scored.push({ entry: e, result: r, outcome, brier, logLoss, pickCorrect: e.pick === outcome,
      exactScoreHit: e.topScores[0]?.score === `${r.homeGoals}-${r.awayGoals}` });
  }
  const n = scored.length;
  const bins = Array.from({ length: 10 }, (_, i) => ({ lo: i / 10, hi: (i + 1) / 10, pSum: 0, oSum: 0, n: 0 }));
  for (const s of scored) for (const k of ["home", "draw", "away"] as const) {
    const p = s.entry.probabilities[k];
    const b = bins[Math.min(9, Math.floor(p * 10))];
    b.pSum += p; b.oSum += s.outcome === k ? 1 : 0; b.n += 1;
  }
  return {
    scored, unresolved,
    meanBrier: n ? scored.reduce((s, x) => s + x.brier, 0) / n : null,
    meanLogLoss: n ? scored.reduce((s, x) => s + x.logLoss, 0) / n : null,
    pickAccuracy: n ? scored.filter((x) => x.pickCorrect).length / n : null,
    reliability: bins.filter((b) => b.n > 0).map((b) => ({ bin: `${b.lo.toFixed(1)}-${b.hi.toFixed(1)}`, predicted: b.pSum / b.n, observed: b.oSum / b.n, n: b.n })),
  };
}
