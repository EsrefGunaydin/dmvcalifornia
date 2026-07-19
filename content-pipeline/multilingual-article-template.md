# Multilingual Article Template

Use this template instead of `article-template.md` whenever the assigned topic in `topic-queue.json` has a `lang` field set to anything other than `"en"`. This applies to any topic, not just license guides: REAL ID, CDL, appointments, points systems, teen licenses, whatever the topic is, in whatever language it's assigned.

The whole point of a `lang != "en"` topic is that it was found through native-language research (real queries, real competitor content, real search behavior in that language) — write for that audience directly. Do not draft in English and translate. Do not write a literal word-for-word translation of an existing English post either: adapt the facts to the language's own audience, framing, and the specific competitor gap the topic's `notes` field describes.

## JSON entry shape

Same base shape as `article-template.md`, plus three fields (`lang`, `translations`, `testCta`):

```json
{
  "id": "<next available integer>",
  "title": "<native-language title, natural phrasing, include the year>",
  "slug": "<see slug rules below>",
  "content": "<rendered HTML, see structure below>",
  "excerpt": "<150-200 chars, native language>",
  "publishedAt": "<YYYY-MM-DDTHH:MM:SSZ>",
  "updatedAt": "<same as publishedAt for new posts>",
  "author": "DMV California",
  "tags": ["<3-6 native-language + transliterated tags>"],
  "lang": "<the topic's lang code, e.g. tr, ar, zh, vi, ko, ru, hy, fa, pa, tl, hi, es>",
  "translations": { "<sibling lang code>": "<sibling post slug>" },
  "metaTitle": "<native language, under 60 chars, keyword-first, no trailing site name>",
  "metaDescription": "<native language, 140-155 chars, one concrete sentence + secondary keyword>",
  "testCta": {
    "heading": "...",
    "blurb": "...",
    "href": "<this language's practice test hub, see table below>",
    "label": "...",
    "relatedLinks": [{ "href": "/...", "label": "..." }]
  },
  "faq": [{ "question": "...", "answer": "..." }]
}
```

Do NOT include `views` or `hero_image` in your draft — the hero image step still runs exactly as in `article-template.md` (Pexels backfill script). The script builds its search query from the post title + primary tag, so keep the `tags` field's first entry as a clean English keyword (e.g. `"DMV office"`, `"driver's license"`) when the native-language title alone would make a poor Pexels search query.

### `translations` — always reciprocal, both directions, same PR

If the topic entry has a `translations_target` field (an existing slug in `blog_posts.json`, usually the English or Spanish sibling article on the same subject), you must:

1. Set your new post's `translations` field to include that sibling: `{ "en": "<target-slug>" }` (or `"es"`, matching whatever language the target actually is).
2. Open the target post in `blog_posts.json` and add a reciprocal entry to **its** `translations` field pointing back to your new slug. If the target post has no `translations` field yet, add one. If it already has other languages in its map, keep them and add yours.
3. If your new post is itself the *n*th language in an existing cluster (e.g. this is the fourth AB 60 translation and Spanish/Turkish/Arabic versions already exist), add your slug to every existing member of that cluster's `translations` map, and copy every existing member into your new post's map. The cluster must be fully reciprocal — every member lists every other member. Check each existing post's current `translations` field before editing; never overwrite unrelated language entries.

This is the same mechanism used for the practice-test hreflang cluster (`src/lib/language-alternates.ts`) and the eleven flagship license guides shipped in July 2026 — `generateMetadata` in `src/app/[slug]/page.tsx` builds hreflang tags from this field automatically, so getting it right matters for indexing, not just on-page cross-links.

### Slug rules

- Latin-script languages (Turkish, Vietnamese, Tagalog, Spanish): native words, ASCII-transliterated (strip diacritics). Examples: `kaliforniyada-ehliyet-nasil-alinir`, `licencia-de-conducir-para-indocumentados-california`.
- Non-Latin-script languages (Arabic, Chinese, Russian, Armenian, Farsi, Punjabi, Korean, Hindi): English-labeled slug naming the language and topic, matching site convention. Examples: `california-real-id-guide-farsi`, `california-cdl-guide-punjabi`.
- Check the slug doesn't collide with an existing post slug or an entry in `RESERVED_SLUGS` in `src/app/[slug]/page.tsx` before finalizing.

### This language's practice-test hub (for `testCta.href` and internal links)

| lang | hub URL |
|---|---|
| es | `/muestra-del-examen-escrito-para-licencia-de-manejar` |
| tr | `/dmv-turkish-test` |
| zh | `/dmv-chinese-test` |
| ar | `/dmv-arabic-test` |
| hy | `/dmv-armenian-test` |
| fa | `/dmv-farsi-test` |
| pa | `/dmv-punjabi-test` |
| ru | `/dmv-russian-test` |
| tl | `/dmv-tagalog-test` |
| vi | `/dmv-vietnamese-test` |
| ko | `/dmv-korean-test` |
| hi | `/dmv-hindi-test` |

Source of truth if this table ever drifts: `PRACTICE_TEST_HUBS` in `src/lib/language-alternates.ts`.

## Content structure

The full blog-post-standards checklist applies in the target language, same as every English article:

- Opening paragraph that states directly who the article is for and what they'll learn — no throat-clearing.
- `dmv-stats` stat box right after the opening paragraph: 4-5 specific numbers (fees, question counts, deadlines), labels in the target language.
- 4+ clean `<h2>` headings (required for the auto-generated TOC; no nested block elements inside the h2).
- At least one graphic: reuse the two SVG templates from the flagship guides where genuinely relevant (the 4-box document-checklist card and the 5-step process-flow diagram). Working examples to copy the SVG markup from: `california-drivers-license-guide-arabic` or `licencia-de-conducir-para-indocumentados-california` in `blog_posts.json`. Translate only the `<text>` labels and give the `<marker id>` a unique per-language suffix (e.g. `arr-ko2`); keep every coordinate and color identical. Only use them if the topic is genuinely about a checklist or a step-by-step process — don't force them onto a news story.
- At least 2 `dmv-callout` boxes (`-tip` 💡, `-warning` ⚠️, `-law` ⚖️, `-required` ✅), native language.
- A `.dmv-dos-donts` grid (4+ items per column) where the topic has real dos and don'ts.
- 2+ internal links: this language's practice-test hub, plus relevant guides (`/california-real-id-checklist`, `/dmv-offices`, `/california-dmv-fees`, the language's flagship license guide, etc.). Anchor text describes the destination, never a bare URL.
- 1+ official `dmv.ca.gov` outbound link with `target="_blank" rel="noopener noreferrer"`. If linking the driver-handbook PDF, note that it is English-only.
- FAQ (6-8 items) goes in the JSON `faq` field ONLY — exact keys `question`/`answer` — never duplicated as HTML in the content.

Additional rules for this template specifically:

- **Ground every fact in a real source.** WebFetch the topic's `outbound_links`. For anything involving fees, deadlines, or document requirements, verify against dmv.ca.gov directly rather than trusting a competitor site or prior knowledge — fees on this site drifted stale before (all Class C license fees were corrected from $38/$45 to $46 in July 2026). Current verified figures: Class C original/renewal $46, ID card $40, replacement/duplicate $37, motorcycle $46, commercial A/B original $100, commercial renewal $59.
- **Center the audience the topic's `notes` field describes.** These topics came from native-language search research, not from translating the English backlog. "AB 60 in Turkish" is about undocumented residents specifically — a different audience and legal pathway than the visa-holder-focused flagship guides. "Korean written-test mistranslation" is a news-style piece, not a how-to. Match the actual angle in `notes`.
- **Legal sensitivity.** Immigration-adjacent topics (AB 60, "TNT", visa status) must lead with the DMV's confidentiality protections (Vehicle Code §1808.4 — DMV does not share applicant data with immigration enforcement) and be sourced from the official DMV AB 60 page plus the site's own vetted `ab-60-california-driver-license` / `licencia-de-conducir-para-indocumentados-california` posts. Reassuring, factual, compliant tone. Never speculate about enforcement.
- **Humanizer rules apply in the target language.** No em dash or en dash in any script. No literal-translation AI-cliché phrasing. No bold inside list items. Straight quotes where the language uses Latin-alphabet quotation marks. Sentence-case headings per the language's own convention. Vary sentence length; write like a knowledgeable friend, not a government form.
- **Word count**: the topic's `target_length` applies ±15%. For Chinese, count characters and treat the target as an approximate character-equivalent (Chinese doesn't use whitespace-delimited words).

## What NOT to do

- Do not write the article in English and note "translate later." Write it in the target language directly.
- Do not skip the `translations` reciprocal-linking step. An orphaned-language post with no hreflang cluster defeats the purpose of queuing the topic at all.
- Do not invent a practice-test hub URL — use the table above.
- Do not merge multiple languages into one article "for efficiency." One article, one language, per the topic entry.
- Do not restructure or retitle existing ranked posts while adding reciprocal links — the `translations` map addition is the only edit you make to a sibling post (plus the one reverse-link sentence required by the base workflow, if the sibling is also your reverse-link target).
