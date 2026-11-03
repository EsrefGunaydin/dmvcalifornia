import type { DataProvider, Fixture, MatchResult, TeamNews } from "../data/types.js";
import { sameTeam } from "../data/types.js";
import { fitRatings, predictMatch, MODEL_VERSION, type Prediction, type Ratings } from "../model/poisson.js";

export interface FormLine { date: string; competition: string; opponent: string; venue: "H" | "A"; score: string; result: "W" | "D" | "L"; }

export interface MatchContext {
  fixture: Fixture;
  asOf: string;
  modelVersion: string;
  model: {
    lambdaHome: number; lambdaAway: number;
    probabilities: Prediction["probabilities"];
    over25: number; btts: number;
    topScores: Prediction["topScores"];
    ratingsNote: string;
  };
  form: { home: FormLine[]; away: FormLine[] };
  teamNews: { home: TeamNews | null; away: TeamNews | null };
  dataSource: string;
}

export function formFor(results: MatchResult[], team: string, asOf: string, n = 8): FormLine[] {
  return results
    .filter((r) => r.date < asOf && (sameTeam(r.home, team) || sameTeam(r.away, team)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-n)
    .map((r) => {
      const isHome = sameTeam(r.home, team);
      const gf = isHome ? r.homeGoals : r.awayGoals, ga = isHome ? r.awayGoals : r.homeGoals;
      return { date: r.date, competition: r.competition, opponent: isHome ? r.away : r.home, venue: isHome ? "H" : "A",
        score: `${gf}-${ga}`, result: gf > ga ? "W" : gf === ga ? "D" : "L" };
    });
}

export function formString(lines: FormLine[]): string { return lines.map((l) => l.result).join(""); }

export async function buildContext(provider: DataProvider, fixture: Fixture, asOf: string): Promise<{ ctx: MatchContext; prediction: Prediction; ratings: Ratings }> {
  const results = await provider.results();
  const ratings = fitRatings(results, { asOf });
  const prediction = predictMatch(ratings, fixture.home, fixture.away);
  const [homeNews, awayNews] = await Promise.all([provider.teamNews(fixture.home), provider.teamNews(fixture.away)]);
  const ctx: MatchContext = {
    fixture, asOf, modelVersion: MODEL_VERSION,
    model: { lambdaHome: prediction.lambdaHome, lambdaAway: prediction.lambdaAway, probabilities: prediction.probabilities,
      over25: prediction.over25, btts: prediction.btts, topScores: prediction.topScores, ratingsNote: prediction.ratingsNote },
    form: { home: formFor(results, fixture.home, asOf), away: formFor(results, fixture.away, asOf) },
    teamNews: { home: homeNews, away: awayNews },
    dataSource: provider.name,
  };
  return { ctx, prediction, ratings };
}

/** Find a fixture by free text such as "Galatasaray vs Fenerbahçe" or "gs fener". */
export function findFixture(fixtures: Fixture[], results: MatchResult[], query: string, asOf?: string): Fixture | null {
  const parts = query.split(/\s+(?:vs?\.?|v|-|@|against|karşı)\s+|\s+/i).filter(Boolean);
  const candidates: Fixture[] = [
    ...fixtures,
    ...results.map((r) => ({ date: r.date, competition: r.competition, home: r.home, away: r.away })),
  ];
  const hits = candidates.filter((f) => {
    const txt = `${f.home} ${f.away}`;
    return parts.every((p) => sameTeam(f.home, p) || sameTeam(f.away, p) || txt.toLowerCase().includes(p.toLowerCase()));
  });
  if (!hits.length) return null;
  if (asOf) {
    const onOrAfter = hits.filter((h) => h.date >= asOf).sort((a, b) => a.date.localeCompare(b.date));
    if (onOrAfter.length) return onOrAfter[0];
  }
  return hits.sort((a, b) => b.date.localeCompare(a.date))[0];
}
