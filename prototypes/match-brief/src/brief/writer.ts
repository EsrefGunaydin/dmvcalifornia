import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { BriefSchema, type Brief } from "./schema.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import type { MatchContext } from "../assistant/context.js";

export const BRIEF_MODEL = process.env.BRIEF_MODEL ?? "claude-opus-5-5";

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** One structured-output call. The system prompt is cached because it is identical for every match. */
export async function writeBrief(ctx: MatchContext, lang: "tr" | "en"): Promise<Brief> {
  const client = new Anthropic();
  const response = await client.messages.parse({
    model: BRIEF_MODEL,
    max_tokens: 4000,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    output_config: { format: zodOutputFormat(BriefSchema) },
    messages: [{ role: "user", content: `Language: ${lang}\n\nDATA:\n${JSON.stringify(ctx, null, 1)}` }],
  });
  if (!response.parsed_output) throw new Error(`brief did not parse (stop_reason ${response.stop_reason})`);
  return response.parsed_output;
}
