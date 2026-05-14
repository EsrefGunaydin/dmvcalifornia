# DMV California Blog — Style Guide

This is the voice and craft handbook every new article must follow. Use it as the source of truth when drafting; pin it to the PR description for human reviewers.

## Voice

- **Friendly authority.** We're the helpful friend who happens to know California Vehicle Code by heart. Confident but never condescending.
- **Plain English.** Aim for an 8th-grade reading level. If a legal phrase is unavoidable, define it the first time you use it.
- **Second person.** Address the reader as "you" — not "the driver" or "applicants."
- **Active voice.** "DMV requires…" not "It is required by DMV that…"
- **No AI tells.** Never start with "In today's fast-paced world…" or "It is important to note…". No "delve into," "navigate the complexities," "robust ecosystem." No "as an AI."
- **Contractions are fine** — "you'll," "don't," "it's" — but don't force them.
- **Numerals over spelled-out numbers** in stats and counts (write "5 days," not "five days").

## Format

- **Hook in the first 2 sentences.** Lead with the user benefit or the answer. Save the buildup for later.
- **TL;DR block** as the first block after the H1 — 3-4 sentences summarizing what the reader will learn. This block is the candidate for Google's featured snippet.
- **H2/H3 hierarchy.** Every section is an H2; sub-points are H3. No H4+. Each H2 should be a question or a benefit phrase a person would type into Google.
- **Short paragraphs** — under 100 words, ideally 2-4 sentences each.
- **Bullet lists** for any sequence of 3+ items. Use ordered lists only when order matters.
- **Bold sparingly** — for the key term in a paragraph, not whole sentences.
- **One image per ~500 words** if relevant. Always set alt text describing what the image shows.

## SEO mechanics

- **Primary keyword** must appear in: title, H1, URL slug, first 100 words, at least one H2, the meta description.
- **Secondary keywords** sprinkled naturally — 2-3 mentions across the body.
- **Title** 50-60 chars including "California" or "DMV" when natural.
- **Meta description** 140-160 chars, ends with a CTA verb.
- **Slug** kebab-case, 3-6 words, includes the primary keyword.
- **Word count** target listed per topic in `topic-queue.json` (1,400-2,500 range).

## Internal linking

- **One internal link per ~250 words** on average.
- **Always link** to the most relevant practice test in the TL;DR or first H2.
- **Mix link targets**: blog → blog, blog → /practice-test/*, blog → /dmv-offices/*.
- **Anchor text** is the natural noun phrase, not "click here" or the bare URL.

## Outbound linking

- **At least one** authoritative outbound link per article — prefer `ca.gov`, `chp.ca.gov`, official statute pages, U.S. DOT.
- **No competitors.** Never link to other DMV practice-test sites (driving-tests.org, dmv-permit-test.com, etc.).
- Outbound links open in the same tab (no `target="_blank"` unless it's truly a side reference).

## FAQ section

- **Every article ends with an FAQ.** 3-6 question-and-answer pairs.
- Questions are full sentences that match real Google queries ("How long does the California DMV permit test take?").
- Answers are 2-4 sentences. The first sentence is the direct answer; the rest provide context.
- The same Q&A pairs are emitted in the post's `faq` field (machine-readable, feeds FAQPage JSON-LD).

## Legal accuracy

- **Cite California Vehicle Code section numbers** when discussing a specific rule (e.g., "CVC §22352(b)(1)"). Adds trust signal.
- **Date-stamp time-sensitive facts.** "As of January 2026…"
- **No legal advice.** "Talk to a California-licensed attorney" for anything that touches DUI, custody, immigration consequences.

## Banned phrases

Avoid these in any article. They flag AI generation and tank reader trust.

- "In today's fast-paced world"
- "Navigate the complexities of"
- "Delve into," "dive into," "embark on"
- "In conclusion"
- "It is important to note"
- "Robust ecosystem"
- "Game-changer"
- "Unleash your potential"
- "Look no further"
- "When it comes to"
- Em-dash followed by "it's all about"
- "Whether you're [X] or [Y]" as an opener

## Pre-publish checklist

Use `seo-checklist.md` — every PR must check all boxes before merge.
