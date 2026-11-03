import type { MatchResult } from "../data/types.js";
import { normalizeTeam } from "../data/types.js";

export const MODEL_VERSION = "poisson-ratings-0.1";

export interface FitOptions {
  asOf?: string;          // use only results strictly before this date
  halfLifeDays?: number;  // time decay of match weights
  iterations?: number;
  learningRate?: number;
  ridge?: number;         // shrinkage of ratings toward 0 (league average); default 5 pseudo-matches
}

export interface Ratings {
  asOf: string;
  teams: string[];
  attack: Record<string, number>;
  defence: Record<string, number>;
  mu: number;             // log of average goals per team per match
  homeAdvantage: number;  // log-scale home boost
  matchesUsed: number;
  matchCount: Record<string, number>;
}

function dayDiff(a: string, b: string): number {
  return (new Date(a).getTime() - new Date(b).getTime()) / 86_400_000;
}

/**
 * Time-weighted Poisson ratings. Goals ~ Poisson(exp(mu + att_home - def_away + home)) and
 * Poisson(exp(mu + att_away - def_home)). Fitted by gradient ascent on the weighted log-likelihood
 * with ridge shrinkage so teams with few matches stay near the average.
 */
export function fitRatings(results: MatchResult[], opts: FitOptions = {}): Ratings {
  const halfLife = opts.halfLifeDays ?? 120;
  const iterations = opts.iterations ?? 600;
  const lr = opts.learningRate ?? 0.08;
  const ridge = opts.ridge ?? 5.0;
  const homePrior = 0.25; // typical log-scale home advantage; pulled toward this when data is thin
  const asOf = opts.asOf ?? maxDatePlusOne(results);
  const used = results.filter((r) => r.date < asOf);
  if (used.length === 0) throw new Error(`no results before ${asOf}`);

  const key = (t: string) => normalizeTeam(t);
  const teams = Array.from(new Set(used.flatMap((r) => [key(r.home), key(r.away)]))).sort();
  const attack: Record<string, number> = {}, defence: Record<string, number> = {}, matchCount: Record<string, number> = {};
  for (const t of teams) { attack[t] = 0; defence[t] = 0; matchCount[t] = 0; }

  const rows = used.map((r) => {
    const w = Math.pow(0.5, Math.max(0, dayDiff(asOf, r.date)) / halfLife);
    matchCount[key(r.home)] += 1; matchCount[key(r.away)] += 1;
    return { h: key(r.home), a: key(r.away), hg: r.homeGoals, ag: r.awayGoals, w };
  });
  const totalW = rows.reduce((s, r) => s + r.w, 0);
  const meanGoals = rows.reduce((s, r) => s + r.w * (r.hg + r.ag), 0) / (2 * totalW);
  let mu = Math.log(Math.max(meanGoals, 0.3));
  let home = 0.2;

  for (let it = 0; it < iterations; it++) {
    const gA: Record<string, number> = {}, gD: Record<string, number> = {};
    for (const t of teams) { gA[t] = 0; gD[t] = 0; }
    let gMu = 0, gHome = 0;
    for (const r of rows) {
      const lh = Math.exp(mu + attack[r.h] - defence[r.a] + home);
      const la = Math.exp(mu + attack[r.a] - defence[r.h]);
      const eh = r.w * (r.hg - lh), ea = r.w * (r.ag - la);
      gA[r.h] += eh; gD[r.a] -= eh; gHome += eh; gMu += eh;
      gA[r.a] += ea; gD[r.h] -= ea; gMu += ea;
    }
    for (const t of teams) {
      const n = matchCount[t] + ridge;
      attack[t] += lr * (gA[t] - ridge * attack[t]) / n;
      defence[t] += lr * (gD[t] - ridge * defence[t]) / n;
    }
    mu += lr * gMu / (2 * totalW);
    home += lr * (gHome + ridge * (homePrior - home)) / (totalW + ridge);
    // identifiability: centre ratings
    const ma = mean(Object.values(attack)), md = mean(Object.values(defence));
    for (const t of teams) { attack[t] -= ma; defence[t] -= md; }
    mu += ma - md;
  }
  return { asOf, teams, attack, defence, mu, homeAdvantage: home, matchesUsed: rows.length, matchCount };
}

function mean(xs: number[]): number { return xs.reduce((s, x) => s + x, 0) / xs.length; }
function maxDatePlusOne(results: MatchResult[]): string {
  const max = results.reduce((m, r) => (r.date > m ? r.date : m), "0000-00-00");
  const d = new Date(max); d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export interface Prediction {
  home: string; away: string;
  lambdaHome: number; lambdaAway: number;
  probabilities: { home: number; draw: number; away: number };
  over25: number; btts: number;
  topScores: { score: string; probability: number }[];
  grid: number[][];
  ratingsNote: string;
}

function poissonPmf(k: number, lambda: number): number {
  let p = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) p *= lambda / i;
  return p;
}

export function predictMatch(r: Ratings, homeTeam: string, awayTeam: string, maxGoals = 10): Prediction {
  const h = resolveTeam(r, homeTeam), a = resolveTeam(r, awayTeam);
  const lambdaHome = Math.exp(r.mu + r.attack[h] - r.defence[a] + r.homeAdvantage);
  const lambdaAway = Math.exp(r.mu + r.attack[a] - r.defence[h]);
  const grid: number[][] = [];
  let pH = 0, pD = 0, pA = 0, over = 0, btts = 0;
  const scores: { score: string; probability: number }[] = [];
  for (let i = 0; i <= maxGoals; i++) {
    grid[i] = [];
    for (let j = 0; j <= maxGoals; j++) {
      const p = poissonPmf(i, lambdaHome) * poissonPmf(j, lambdaAway);
      grid[i][j] = p;
      if (i > j) pH += p; else if (i === j) pD += p; else pA += p;
      if (i + j > 2.5) over += p;
      if (i > 0 && j > 0) btts += p;
      scores.push({ score: `${i}-${j}`, probability: p });
    }
  }
  const norm = pH + pD + pA;
  scores.sort((x, y) => y.probability - x.probability);
  const note = `${homeTeam}: ${r.matchCount[h]} matches in sample; ${awayTeam}: ${r.matchCount[a]} matches. Ratings shrink toward average when samples are small.`;
  return {
    home: homeTeam, away: awayTeam, lambdaHome, lambdaAway,
    probabilities: { home: pH / norm, draw: pD / norm, away: pA / norm },
    over25: over / norm, btts: btts / norm,
    topScores: scores.slice(0, 6).map((s) => ({ ...s, probability: s.probability / norm })),
    grid, ratingsNote: note,
  };
}

export function resolveTeam(r: Ratings, name: string): string {
  const k = normalizeTeam(name);
  if (r.teams.includes(k)) return k;
  const hit = r.teams.find((t) => t.startsWith(k) || k.startsWith(t) || t.includes(k));
  if (!hit) throw new Error(`team not in ratings: ${name}. Known: ${r.teams.join(", ")}`);
  return hit;
}
