import type { DataProvider, Fixture, MatchResult, TeamNews } from "./types.js";

/**
 * API-Football (api-sports.io) adapter. Endpoints follow the public v3 docs:
 *   GET /fixtures?league=&season=&status=FT   -> results
 *   GET /fixtures?league=&season=&status=NS   -> fixtures
 *   GET /injuries?team=&season=               -> team news (injuries only)
 * Not exercised in this prototype (no key in the sandbox); shapes mirror the documented response.
 */
export class ApiFootballProvider implements DataProvider {
  name = "api-football";
  private base = "https://v3.football.api-sports.io";
  constructor(private key: string, private leagues: number[] = [203], private season = 2026) {}

  private async get<T>(pathAndQuery: string): Promise<T> {
    const res = await fetch(`${this.base}${pathAndQuery}`, { headers: { "x-apisports-key": this.key } });
    if (!res.ok) throw new Error(`api-football ${res.status} on ${pathAndQuery}`);
    const body = (await res.json()) as { response: T };
    return body.response;
  }

  async results(): Promise<MatchResult[]> {
    const out: MatchResult[] = [];
    for (const league of this.leagues) {
      const rows = await this.get<any[]>(`/fixtures?league=${league}&season=${this.season}&status=FT`);
      for (const r of rows) {
        out.push({
          date: r.fixture.date.slice(0, 10),
          competition: r.league.name,
          home: r.teams.home.name,
          away: r.teams.away.name,
          homeGoals: r.goals.home,
          awayGoals: r.goals.away,
          source: "api-football",
        });
      }
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
  }

  async fixtures(): Promise<Fixture[]> {
    const out: Fixture[] = [];
    for (const league of this.leagues) {
      const rows = await this.get<any[]>(`/fixtures?league=${league}&season=${this.season}&status=NS`);
      for (const r of rows) {
        out.push({
          date: r.fixture.date.slice(0, 10),
          competition: r.league.name,
          home: r.teams.home.name,
          away: r.teams.away.name,
          venue: r.fixture.venue?.name,
          kickoff: r.fixture.date,
        });
      }
    }
    return out;
  }

  async teamNews(team: string): Promise<TeamNews | null> {
    const teams = await this.get<any[]>(`/teams?search=${encodeURIComponent(team)}`);
    const id = teams[0]?.team?.id;
    if (!id) return null;
    const rows = await this.get<any[]>(`/injuries?team=${id}&season=${this.season}`);
    return {
      team: teams[0].team.name,
      asOf: new Date().toISOString().slice(0, 10),
      injured: rows.filter((r) => r.player?.type === "Missing Fixture").map((r) => `${r.player.name} (${r.player.reason})`),
      suspended: [],
      doubtful: rows.filter((r) => r.player?.type === "Questionable").map((r) => `${r.player.name} (${r.player.reason})`),
      sources: ["api-football /injuries"],
    };
  }
}
