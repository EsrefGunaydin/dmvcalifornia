# Project: DMV California

## Writing content

Apply humanizer patterns (from `~/.claude/skills/humanizer/SKILL.md`) to ALL written content before finalizing: blog posts, page copy, meta descriptions, CTAs, headings, etc.

Key rules:
- No em dashes (— or –). Replace with a comma, period, colon, or parentheses.
- No AI vocabulary: crucial, pivotal, vibrant, delve, highlight, showcase, tapestry, testament, underscore, foster, enhance, landscape (abstract), align with, key (adjective).
- No rule-of-three padding. Use as many points as actually exist.
- No promotional language: nestled, breathtaking, must-visit, renowned, groundbreaking.
- No -ing pile-ons: "ensuring that..., highlighting..., contributing to..."
- No generic conclusions: "the future looks bright", "exciting times lie ahead."
- Vary sentence length. Short punchy sentences mixed with longer ones.
- Prefer "is/are/has" over "serves as / boasts / features."
- Headings in sentence case, not Title Case.
- No bold headers inside bullet lists.
- No emojis.

## Tech stack

- Next.js 14 app router
- TypeScript — no curly/smart quotes (U+2018/U+2019) as JS string delimiters
- Tailwind CSS — DMV blue: `dmv-500` (#4e80c4), `dmv-700` (#345488)
- Blog data: `src/data/blog_posts.json`
- Lucide React ^0.553.0 for all icons (no emoji replacements)

## TypeScript / build

Run type-check with:
```
/Users/thedaybreak/Desktop/CODE/dmvcalifornia/node_modules/.bin/tsc --noEmit --project /Users/thedaybreak/Desktop/CODE/dmvcalifornia/tsconfig.json
```

## Blog post fields (blog_posts.json)

Optional fields: `hero_image`, `youtubeId`, `metaTitle`, `metaDescription`, `testCta`, `faq`, `translations`, `lang`

To embed YouTube video: add `"youtubeId": "VIDEO_ID"` to the post. The renderer in `src/app/[slug]/page.tsx` handles the embed automatically with muted autoplay.
