import { z } from "zod";

export const BriefSchema = z.object({
  headline: z.string().describe("One sentence with the pick and the main reason"),
  predicted_score: z.string().describe("Home-Away, e.g. 2-1, chosen from the model's score grid"),
  key_factors: z.array(z.string()).min(4).max(7).describe("One sentence each, grounded only in the supplied data"),
  form_summary_home: z.string(),
  form_summary_away: z.string(),
  team_news_note: z.string(),
  totals_lean: z.string().describe("Over or under 2.5 and both teams to score, with the model's percentages"),
  caveats: z.array(z.string()).min(1).max(5),
  summary: z.string().describe("Three to five plain sentences a fan can read in twenty seconds"),
});
export type Brief = z.infer<typeof BriefSchema>;
