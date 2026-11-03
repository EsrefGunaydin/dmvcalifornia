import { getProvider } from "./data/provider.js";
import { buildContext, findFixture, formString } from "./assistant/context.js";
import { hasApiKey, writeBrief } from "./brief/writer.js";
import { appendEntry, entryFromPrediction, readEntries } from "./ledger/ledger.js";
import { scoreLedger } from "./ledger/calibration.js";
import { MODEL_VERSION } from "./model/poisson.js";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const flag = (name: string) => process.argv.includes(`--${name}`);
const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
const today = () => new Date().toISOString().slice(0, 10);

async function ask(): Promise<void> {
  const query = process.argv.slice(3).filter((a) => !a.startsWith("--") && a !== arg("as-of") && a !== arg("lang")).join(" ");
  if (!query) throw new Error('usage: npm run ask -- "Home vs Away" [--as-of YYYY-MM-DD] [--lang tr|en] [--no-llm] [--no-ledger]');
  const provider = getProvider();
  const [fixtures, results] = await Promise.all([provider.fixtures(), provider.results()]);
  const asOf = arg("as-of") ?? today();
  const fixture = findFixture(fixtures, results, query, asOf);
  if (!fixture) throw new Error(`no fixture matches "${query}"`);
  const { ctx, prediction } = await buildContext(provider, fixture, asOf);

  console.log(`\n${fixture.home} vs ${fixture.away}  (${fixture.competition}, ${fixture.date}${fixture.kickoff ? ", " + fixture.kickoff : ""})`);
  console.log(`data cut-off ${asOf}, ${provider.name}, ${MODEL_VERSION}\n`);
  console.log(`form ${fixture.home}: ${formString(ctx.form.home)}   ${fixture.away}: ${formString(ctx.form.away)}`);
  const p = prediction.probabilities;
  console.log(`expected goals ${prediction.lambdaHome.toFixed(2)} : ${prediction.lambdaAway.toFixed(2)}`);
  console.log(`home ${pct(p.home)}  draw ${pct(p.draw)}  away ${pct(p.away)}   over 2.5 ${pct(prediction.over25)}  btts ${pct(prediction.btts)}`);
  console.log(`top scores: ${prediction.topScores.map((s) => `${s.score} ${pct(s.probability)}`).join(", ")}`);
  console.log(prediction.ratingsNote);

  let briefSummary: string | undefined;
  if (!flag("no-llm") && hasApiKey()) {
    const lang = (arg("lang") as "tr" | "en") ?? "en";
    const brief = await writeBrief(ctx, lang);
    briefSummary = brief.summary;
    console.log(`\n${brief.headline}\npick ${brief.predicted_score}\n`);
    for (const f of brief.key_factors) console.log(`- ${f}`);
    console.log(`\n${brief.team_news_note}\n${brief.totals_lean}\n`);
    console.log(brief.summary);
    console.log(`\ncaveats: ${brief.caveats.join(" ")}`);
  } else if (!flag("no-llm")) {
    console.log("\n(no ANTHROPIC_API_KEY set: numbers only, brief skipped)");
  }

  if (!flag("no-ledger") && fixture.date >= asOf) {
    const entry = appendEntry(entryFromPrediction(prediction, { date: fixture.date, competition: fixture.competition, asOf, modelVersion: MODEL_VERSION, briefSummary }));
    console.log(`\nledger: frozen as ${entry.id} at ${entry.createdAt}`);
  } else if (!flag("no-ledger")) {
    console.log(`\nledger: not written (fixture date ${fixture.date} is before cut-off ${asOf}; use --as-of to replay honestly)`);
  }
}

async function ledger(): Promise<void> {
  const entries = readEntries();
  if (!entries.length) { console.log("ledger is empty"); return; }
  for (const e of entries) {
    console.log(`${e.createdAt.slice(0, 16)}  ${e.date}  ${e.home} vs ${e.away}  H ${pct(e.probabilities.home)} D ${pct(e.probabilities.draw)} A ${pct(e.probabilities.away)}  pick ${e.pick}  top ${e.topScores[0]?.score}  (${e.modelVersion}, cut-off ${e.asOf})`);
  }
}

async function calibrate(): Promise<void> {
  const provider = getProvider();
  const rep = scoreLedger(readEntries(), await provider.results());
  console.log(`scored ${rep.scored.length} predictions, ${rep.unresolved.length} awaiting results`);
  if (!rep.scored.length) return;
  console.log(`mean Brier ${rep.meanBrier!.toFixed(3)} (uniform 0.667)   mean log loss ${rep.meanLogLoss!.toFixed(3)} (uniform 1.099)   pick accuracy ${pct(rep.pickAccuracy!)}`);
  console.log("\nreliability (predicted vs observed, by probability bin, all three outcomes):");
  for (const b of rep.reliability) console.log(`  ${b.bin}  predicted ${pct(b.predicted)}  observed ${pct(b.observed)}  n=${b.n}`);
  console.log("\nper match:");
  for (const s of rep.scored) console.log(`  ${s.entry.date} ${s.entry.home} ${s.result.homeGoals}-${s.result.awayGoals} ${s.entry.away}: p(${s.outcome}) was ${pct(s.entry.probabilities[s.outcome])}, Brier ${s.brier.toFixed(3)}, pick ${s.pickCorrect ? "right" : "wrong"}, exact score ${s.exactScoreHit ? "hit" : "miss"}`);
}

async function chat(): Promise<void> {
  if (!hasApiKey()) throw new Error("chat needs ANTHROPIC_API_KEY");
  const { runChat } = await import("./assistant/chat.js");
  await runChat(getProvider(), arg("as-of") ?? today());
}

const cmd = process.argv[2];
const commands: Record<string, () => Promise<void>> = { ask, chat, ledger, calibrate };
if (!cmd || !commands[cmd]) {
  console.log("usage: tsx src/index.ts <ask|chat|ledger|calibrate> ...");
  process.exit(1);
}
commands[cmd]().catch((err) => { console.error(err instanceof Error ? err.message : err); process.exit(1); });
