# Content Pipeline

This directory holds the SEO content publishing system for the DMV California blog. Nothing here is deployed to production — it's all source-of-truth for the weekly drafting workflow.

## Files

- **`topic-queue.json`** — prioritized backlog of article ideas with target keywords, length targets, and metadata.
- **`style-guide.md`** — voice and craft rules. Read this before drafting.
- **`article-template.md`** — exact JSON + HTML scaffold for a new post.
- **`seo-checklist.md`** — copy this into every PR; tick every box before merge.

## Workflow (weekly)

1. **Monday 9 AM PT** — automated agent (via `/schedule`) picks the highest-priority `status: ready` topic from `topic-queue.json`.
2. Agent drafts the article per `article-template.md` and `style-guide.md`.
3. Agent appends the new post to `src/data/blog_posts.json`, picks a hero image from `public/images/blog/` or notes a TODO, and adds one reverse link from a topically related existing post.
4. Agent flips the topic's `status` to `drafted` in `topic-queue.json`.
5. Agent opens a PR titled `📝 New article: <title>` with the SEO checklist in the description.
6. You review, edit if needed, merge. Vercel auto-deploys.
7. After merge, manually flip the topic to `status: published`. (Optional: add a post-merge action later.)

## Before generating multiple similar pages

If you're about to add several pages that share a template (one page per state,
per city, per office, per language, and so on), stop and read this first. This
is not a hypothetical: a single commit ("Add driver's license issue date pages
for all 50 states") added 39 near-identical pages outside the weekly PR flow
above in one shot. Google's crawler noticed. Roughly 87 templated DMV office
pages had the same problem independently. Both ended up in "Crawled -
currently not indexed," and untangling it took a multi-week content-quality
investigation and rewrite.

What went wrong wasn't the idea of a page-per-state or page-per-office cluster,
that's a legitimate pattern. It was that every page in the cluster read as the
same paragraph with the state or office name swapped in: same REAL ID
sentence, same renewal sentence, same restriction-code list, word for word.
Google's ranking systems (and, as of a spam update reported in August 2026,
a system specifically aimed at mass-generated content) treat that as a single
thin page duplicated N times, not N real pages.

Rules for any pSEO-style cluster, whether it's one new page or fifty:

- **One page per commit gets full research.** Every fact that can vary by
  state/city/office (agency name, fee, validity period, restriction codes,
  REAL ID specifics) must be verified against that specific entity's official
  source, not copied from a sibling page in the cluster. If you can't verify a
  fact, leave it out. Never invent a "distinctive fact" to make a page feel
  less templated; a real site was caught doing exactly this and it produced
  two fabricated claims that made it most of the way to production before
  being caught.
- **Run the duplication checker before adding pages, not after.**
  `npm run check:duplication -- --slug=<new-slug>` compares a candidate post
  against every existing post using text normalized to strip out the things a
  template varies (names, fees, dates, years), so template clones can't hide
  behind their swapped-in values. A score above 50% means you have a template,
  not a set of distinct articles.
- **Bulk additions (more than one post in a single commit or PR) require the
  same review this repo's normal weekly flow requires:** open a PR, don't
  merge it yourself, and get a human to actually read a sample of the pages,
  not just skim the diff. The 39-page commit that caused this never went
  through a PR.
- **If the honest answer is "there's nothing state-specific to say here,"**
  that's a real answer. Consider a single hub page with a comparison table
  instead of N thin pages. A smaller number of genuinely substantial pages
  beats a larger number of templated ones.

## Manual override

To draft an article ad-hoc without waiting for Monday:

```
claude "Draft the next article in content-pipeline/topic-queue.json. Use article-template.md, style-guide.md, and seo-checklist.md. Open a PR when done."
```

## Refilling the queue

When you run low on `status: ready` topics:
- Use the `/loop` skill with a research prompt to identify trending DMV/California-driving keywords.
- Add new entries in priority order. Tier 1-2 topics rank fastest; Tier 3-4 are long-tail.

## Topic quality bar

Before adding a topic to the queue, check:
- **Search volume**: at least 100+ monthly searches per Ahrefs/SEMrush (or guess via "people also ask" depth).
- **Competition**: not dominated by ca.gov + driving-tests.org — we can crack top 10.
- **Internal link target**: every topic should drive traffic to at least one practice test or DMV-services page.
- **No duplicate intent**: search the existing 49+ posts before adding (`grep -i "<keyword>" src/data/blog_posts.json`).
