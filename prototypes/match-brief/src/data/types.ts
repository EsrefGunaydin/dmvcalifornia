export interface MatchResult {
  date: string;        // ISO date, kickoff day
  competition: string;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  source?: string;     // where the score was verified
}

export interface Fixture {
  date: string;
  competition: string;
  home: string;
  away: string;
  venue?: string;
  kickoff?: string;    // local time text, e.g. "20:45 TRT"
}

export interface TeamNews {
  team: string;
  asOf: string;
  manager?: string;
  injured: string[];
  suspended: string[];
  doubtful: string[];
  probableXI?: string[];
  formation?: string;
  notes?: string;
  sources?: string[];
}

export interface DataProvider {
  name: string;
  results(): Promise<MatchResult[]>;
  fixtures(): Promise<Fixture[]>;
  teamNews(team: string): Promise<TeamNews | null>;
}

/** Lowercase, strip diacritics and club suffixes so "Fenerbahçe SK" and "fenerbahce" match. */
export function normalizeTeam(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .toLowerCase()
    .replace(/\b(sk|fk|jk|fc|cf|vfb|sc|bk|spor kulubu|s\.k\.)\b/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sameTeam(a: string, b: string): boolean {
  const x = normalizeTeam(a), y = normalizeTeam(b);
  return x === y || x.startsWith(y) || y.startsWith(x);
}
