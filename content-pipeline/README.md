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
