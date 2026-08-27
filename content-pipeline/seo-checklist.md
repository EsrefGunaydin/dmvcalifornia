# SEO Checklist — Every PR Must Pass

Copy this block into the PR description for any new article. Tick every box.

## On-page SEO
- [ ] Primary keyword in **title**, **H1**, **URL slug**, **first 100 words**, **at least one H2**, **meta description**
- [ ] Title is 50-60 characters
- [ ] Meta description (excerpt) is 140-160 characters and ends with a CTA verb
- [ ] Slug is kebab-case, 3-6 words
- [ ] Word count matches the target listed in `topic-queue.json` (±15%)

## Structure
- [ ] TL;DR block of 3-4 sentences immediately after the H1
- [ ] H2/H3 hierarchy only (no H4+)
- [ ] Every H2 reads like a search query or benefit phrase
- [ ] No paragraph longer than 100 words
- [ ] At least one bulleted/ordered list

## Linking
- [ ] At least **3 internal links** to `/practice-test/*` and/or `/blog/*` (or other site pages)
- [ ] At least **1 outbound link** to an authoritative source (ca.gov, chp.ca.gov, U.S. DOT, official handbook)
- [ ] Anchor text uses natural phrasing (never "click here")
- [ ] No links to competitor practice-test sites

## FAQ
- [ ] FAQ section with 3-6 Q&A pairs at the end of the article body
- [ ] Same Q&A pairs included in the post's `faq` field (machine-readable)
- [ ] Each question is a full sentence matching a real Google query
- [ ] Each answer is 2-4 sentences

## Media
- [ ] Hero image set via `hero_image` field
- [ ] All images have descriptive alt text (not empty, not "image")
- [ ] At least one image every ~500 words (or zero if not relevant)

## Voice
- [ ] No banned phrases (see `style-guide.md`)
- [ ] Second person ("you") used consistently
- [ ] Active voice
- [ ] 8th-grade reading level

## Schema & metadata
- [ ] `author` slug exists in `blog_authors.json` (or new author added)
- [ ] `tags` include at least one existing category from `blog_posts.json` plus 1-2 secondary
- [ ] `publishedAt` is today's date in ISO format
- [ ] `updatedAt` set to today if updating an existing post

## Cross-linking
- [ ] At least **one existing post** has been updated in this same PR to link **to** the new article (reverse linking — pick a contextually related post and add a sentence with a link)

## Duplication
- [ ] `npm run check:duplication -- --slug=<new-slug>` reports no cluster for this post
- [ ] If this PR adds more than one post (a template/cluster pattern — e.g. "add page X for every state/city/office"), STOP. See "Before generating multiple similar pages" in `content-pipeline/README.md` first. Do not open this PR without following that process.

## Build
- [ ] `npx tsc --noEmit` passes
- [ ] Dev server renders the new article at its slug (HTTP 200)
- [ ] Hero image displays
- [ ] FAQ accordion expands
- [ ] TOC generates (if article has 3+ H2s)
- [ ] Page source contains `<script type="application/ld+json">` with both Article and FAQPage schemas (paste a screenshot of Google Rich Results Test in PR description)
