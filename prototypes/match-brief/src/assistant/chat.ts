import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type { DataProvider } from "../data/types.js";
import { fitRatings, predictMatch } from "../model/poisson.js";
import { formFor, formString } from "./context.js";
import { readEntries } from "../ledger/ledger.js";
import { scoreLedger } from "../ledger/calibration.js";
import { BRIEF_MODEL } from "../brief/writer.js";
import { MODEL_CARD } from "../brief/prompt.js";

const CHAT_SYSTEM = `You are a football prediction assistant. Answer like a knowledgeable, plain-spoken friend. Use the tools for every number and every fact about form, results, line-ups or absences; never answer from memory. If a tool cannot answer, say what is missing. Probabilities always come from get_prediction, never from your own judgement. No betting advice, no hype, no em dashes. Answer in the user's language.

${MODEL_CARD}`;

export async function runChat(provider: DataProvider, asOf: string): Promise<void> {
  const client = new Anthropic();
  const results = await provider.results();
  const ratings = fitRatings(results, { asOf });

  const tools = [
    betaZodTool({
      name: "get_form",
      description: "Last N results for a team before the data cut-off, oldest first, with a W/D/L form string.",
      inputSchema: z.object({ team: z.string(), n: z.number().int().min(1).max(15).optional() }),
      run: async ({ team, n }) => {
        const lines = formFor(results, team, asOf, n ?? 8);
        return JSON.stringify({ team, asOf, form: formString(lines), matches: lines });
      },
    }),
    betaZodTool({
      name: "get_prediction",
      description: "Model probabilities, expected goals, top scorelines, over 2.5 and both-teams-to-score for home vs away.",
      inputSchema: z.object({ home: z.string(), away: z.string() }),
      run: async ({ home, away }) => {
        const p = predictMatch(ratings, home, away);
        return JSON.stringify({ home, away, lambdaHome: p.lambdaHome, lambdaAway: p.lambdaAway, probabilities: p.probabilities,
          over25: p.over25, btts: p.btts, topScores: p.topScores, note: p.ratingsNote });
      },
    }),
    betaZodTool({
      name: "get_team_news",
      description: "Injuries, suspensions, doubtful players and probable line-up for a team, with the date the note was compiled.",
      inputSchema: z.object({ team: z.string() }),
      run: async ({ team }) => JSON.stringify((await provider.teamNews(team)) ?? { team, note: "no team news on file" }),
    }),
    betaZodTool({
      name: "get_track_record",
      description: "Calibration of past frozen predictions: Brier score, log loss, pick accuracy and a reliability table.",
      inputSchema: z.object({}),
      run: async () => {
        const rep = scoreLedger(readEntries(), results);
        return JSON.stringify({ scored: rep.scored.length, unresolved: rep.unresolved.length, meanBrier: rep.meanBrier,
          meanLogLoss: rep.meanLogLoss, pickAccuracy: rep.pickAccuracy, reliability: rep.reliability });
      },
    }),
  ];

  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  const rl = createInterface({ input: stdin, output: stdout });
  console.log(`match-brief chat (model ${BRIEF_MODEL}, data cut-off ${asOf}). Type "exit" to quit.`);
  while (true) {
    const q = (await rl.question("> ")).trim();
    if (!q || q === "exit" || q === "quit") break;
    messages.push({ role: "user", content: q });
    const runner = client.beta.messages.toolRunner({
      model: BRIEF_MODEL,
      max_tokens: 4000,
      output_config: { effort: "medium" },
      system: [{ type: "text", text: CHAT_SYSTEM, cache_control: { type: "ephemeral" } }],
      tools,
      messages,
    });
    const final = await runner.runUntilDone();
    messages.push({ role: "assistant", content: final.content });
    const text = final.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    console.log(text || `(stop_reason ${final.stop_reason})`);
  }
  rl.close();
}
