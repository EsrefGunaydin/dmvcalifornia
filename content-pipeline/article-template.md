# Article Template

When drafting a new article, follow this exact structure. The output is a new entry in `src/data/blog_posts.json`.

## JSON entry shape

Append this object to the `posts` array. Sort the array so newest `publishedAt` is first.

```json
{
  "id": <next available integer>,
  "title": "<H1 — 50-60 chars, primary keyword early>",
  "slug": "<kebab-case-slug>",
  "content": "<rendered HTML, see body template below>",
  "excerpt": "<140-160 chars, ends with CTA verb>",
  "publishedAt": "<YYYY-MM-DDTHH:MM:SSZ>",
  "updatedAt": "<same as publishedAt for new posts>",
  "author": "<full name matching blog_authors.json>",
  "tags": ["<primary tag>", "<secondary tag>"],
  "views": 0,
  "hero_image": "/images/blog/<slug>.webp",
  "faq": [
    {"question": "<full sentence question>", "answer": "<2-4 sentence answer with optional <a> tags>"},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}
```

## HTML body template

The `content` field is a string of HTML. Use this scaffold — everything inside `<!-- -->` is guidance, remove before publishing.

```html
<p><strong>TL;DR:</strong> <!-- 3-4 sentences. Lead with the answer. Include the primary keyword. End with a link to the most relevant practice test or guide. --></p>

<!-- TOC auto-generates when there are 3+ H2s, inserted automatically by the page renderer. Don't add a manual TOC. -->

<h2>What is [the topic]?</h2>
<p><!-- Define the topic. Cite CVC sections where relevant. --></p>

<h2>Who needs [the thing] in California?</h2>
<p><!-- Audience specifics. Eligibility. --></p>
<ul>
  <li><!-- bullet --></li>
  <li><!-- bullet --></li>
  <li><!-- bullet --></li>
</ul>

<h2>How to [do the action] step by step</h2>
<ol>
  <li><strong>Step 1:</strong> <!-- action --></li>
  <li><strong>Step 2:</strong> <!-- action --></li>
  <li><strong>Step 3:</strong> <!-- action --></li>
</ol>

<h2>Common mistakes to avoid</h2>
<p><!-- 3-5 pitfalls with specific examples. --></p>

<h2>What this means for [audience segment]</h2>
<p><!-- Tie back to user benefit. Internal link to a relevant practice test or another post. --></p>

<h2>Practice for your California DMV test</h2>
<p>Our <a href="/practice-test">free California DMV practice tests</a> mirror the real exam format with 1,164+ questions across 11 languages. <a href="/practice-test/X">Start the X test</a> in <!-- 2-3 minutes --> and find out where you stand.</p>

<!-- FAQ section is rendered separately from the post's `faq` field via the FAQ component on the page. Do NOT duplicate it in HTML. -->
```

## Where to find good source URLs

- **Official statute / news**: ca.gov, dmv.ca.gov, chp.ca.gov
- **Driver Handbook**: https://www.dmv.ca.gov/portal/file/california-driver-handbook-pdf/
- **Motorcycle Handbook**: https://www.dmv.ca.gov/portal/file/motorcycle-driver-handbook-pdf/
- **Commercial Handbook**: https://www.dmv.ca.gov/portal/file/california-commercial-driver-handbook-pdf/
- **New laws page**: https://www.dmv.ca.gov/portal/news-and-media/dmv-highlights-new-laws-in-2026/
- **CVC search**: https://leginfo.legislature.ca.gov/

## Image sourcing

- **First check** `public/images/blog/` for existing imagery that fits.
- **If creating a new image**, save as `public/images/blog/<slug>.webp` at 1200x630 (OpenGraph spec).
- **Never** hotlink external images.
- Set descriptive alt text on every `<img>`.

## Reverse linking

When you create a new post, also pick ONE existing post that's topically related and add a single sentence with a link to your new post inside its `content`. Both changes go in the same PR. This is non-negotiable — orphan articles don't rank.

Example reverse-link insert:
```html
<p>For a deeper dive into <a href="/your-new-article-slug">[your topic]</a>, see our 2026 guide.</p>
