import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { DataProvider, Fixture, MatchResult, TeamNews } from "./types.js";
import { sameTeam } from "./types.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const seedDir = path.resolve(here, "../../data/seed");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(seedDir, file), "utf8")) as T;
}

/** Bundled seed data so the prototype runs with no API key. Replace with a feed for production. */
export class LocalProvider implements DataProvider {
  name = "local-seed";
  async results(): Promise<MatchResult[]> {
    return readJson<MatchResult[]>("results.json").sort((a, b) => a.date.localeCompare(b.date));
  }
  async fixtures(): Promise<Fixture[]> {
    return readJson<Fixture[]>("fixtures.json");
  }
  async teamNews(team: string): Promise<TeamNews | null> {
    const all = readJson<TeamNews[]>("team-news.json");
    return all.find((t) => sameTeam(t.team, team)) ?? null;
  }
}
