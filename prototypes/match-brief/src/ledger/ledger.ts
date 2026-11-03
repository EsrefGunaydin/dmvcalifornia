import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import type { Prediction } from "../model/poisson.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const ledgerPath = path.resolve(here, "../../data/ledger.jsonl");

export interface LedgerEntry {
  id: string;
  createdAt: string;       // wall-clock time the prediction was frozen
  asOf: string;            // data cut-off used by the model
  date: string;            // fixture date
  competition: string;
  home: string;
  away: string;
  modelVersion: string;
  probabilities: { home: number; draw: number; away: number };
  lambdaHome: number;
  lambdaAway: number;
  topScores: { score: string; probability: number }[];
  pick: string;
  briefSummary?: string;
}

/** Append-only. Entries are never edited: that is the whole point of the ledger. */
export function appendEntry(e: Omit<LedgerEntry, "id" | "createdAt">): LedgerEntry {
  const entry: LedgerEntry = { id: randomUUID(), createdAt: new Date().toISOString(), ...e };
  mkdirSync(path.dirname(ledgerPath), { recursive: true });
  appendFileSync(ledgerPath, JSON.stringify(entry) + "\n");
  return entry;
}

export function readEntries(): LedgerEntry[] {
  if (!existsSync(ledgerPath)) return [];
  return readFileSync(ledgerPath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l) as LedgerEntry);
}

export function entryFromPrediction(p: Prediction, meta: { date: string; competition: string; asOf: string; modelVersion: string; briefSummary?: string }): Omit<LedgerEntry, "id" | "createdAt"> {
  const probs = p.probabilities;
  const pick = probs.home >= probs.draw && probs.home >= probs.away ? "home" : probs.away >= probs.draw ? "away" : "draw";
  return {
    asOf: meta.asOf, date: meta.date, competition: meta.competition, home: p.home, away: p.away,
    modelVersion: meta.modelVersion, probabilities: probs, lambdaHome: p.lambdaHome, lambdaAway: p.lambdaAway,
    topScores: p.topScores.slice(0, 5), pick, briefSummary: meta.briefSummary,
  };
}
