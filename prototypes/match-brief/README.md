# match-brief

Prototype of a football prediction assistant. A statistical model produces the probabilities, Claude writes the brief and answers follow-up questions, and every prediction is frozen in an append-only ledger so the track record can be published.

The design rule: **the model makes the numbers, the language model makes the sentences.** Claude never invents or adjusts a probability.

## What is here

| Piece | File | Notes |
|---|---|---|
| Data provider interface | `src/data/types.ts` | results, fixtures, team news |
| Seed data (runs with no key) | `data/seed/*.json` | Galatasaray, Fenerbahçe and Stuttgart results from autumn 2026, verified during the two previews this project grew out of |
| API-Football adapter | `src/data/apiFootballProvider.ts` | endpoint shapes from the public docs, not yet exercised |
| Poisson ratings model | `src/model/poisson.ts` | time-weighted attack and defence ratings, home advantage, shrinkage; tests in `poisson.test.ts` |
| Brief writer | `src/brief/writer.ts` | one structured-output call to Claude Opus 5.5, cached system prompt, model card included |
| Ledger and calibration | `src/ledger/` | append-only JSONL, Brier score, log loss, reliability bins |
| Chat assistant | `src/assistant/chat.ts` | tool runner with get_form, get_prediction, get_team_news, get_track_record |

## Run it

```bash
npm install
cp .env.example .env     # add ANTHROPIC_API_KEY for briefs and chat
npm test
npm run typecheck

# numbers only, replaying the derby with data up to that morning
npm run ask -- "Galatasaray vs Fenerbahçe" --as-of 2026-10-26 --no-llm

# full brief in Turkish (needs the key) and freeze it in the ledger
npm run ask -- "Galatasaray vs Aston Villa" --lang tr

npm run ledger
npm run calibrate        # scores frozen predictions against results on file
npm run chat             # ask follow-up questions, every number comes from a tool
```

`--as-of` is the honest replay switch: the model only sees results before that date, and the ledger refuses to freeze a prediction for a fixture that already happened before the cut-off.

## What the model is

Goals for each side are Poisson with rate `exp(mu + attack_team - defence_opponent [+ home])`. Ratings are fitted by gradient ascent on the time-weighted log-likelihood (half-life 120 days) with ridge shrinkage toward zero, so teams with few matches stay near average. Output: probability of each outcome, the full score grid, over 2.5 and both-teams-to-score. Version string in `MODEL_VERSION`.

Limits, also stated in the model card shown to users: full-time scores only (no xG, line-ups, rest days); teams from different leagues are only comparable where they share opponents; small samples early in a season.

## Next steps

1. A real data feed (API-Football first, an xG feed later) and a nightly job that refreshes results and freezes predictions for the next round.
2. Dixon-Coles low-score correction and a league-strength link so cross-league ties are rated properly.
3. Line-up adjustments: downgrade a side missing key players, from the team-news parser (Haiku 5.5, structured output).
4. A public calibration page fed by the ledger, and a Telegram bot in front of the chat loop.
5. Turkish and English style guide for the brief, with an eval set of 20 matches.
