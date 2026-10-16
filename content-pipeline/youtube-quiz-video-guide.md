# YouTube DMV Quiz Video — Production Guide

How we build synced DMV quiz videos for YouTube and embed them on the website.
First video (old manual process): **California DMV Practice Test 2026 — 46 Questions** (`AAYjx6l9X5g`)
First video on the automated pipeline: **California DMV Practice Test in Spanish — 40 Questions** (`InU6I3Tsc8o`)

---

## Overview

The whole process is automated end to end via `scripts/video-pipeline/`. No more hand-built HTML slide files, no manual screen recording, no manual ffmpeg silence-detection to sync audio.

**Stack:** quiz JSON → per-slide narration text → ElevenLabs TTS, model `eleven_v3` (audio + exact duration) → Playwright screenshot of a Next.js render route → ffmpeg assembly (image durations match their own audio clip exactly) → YouTube Data API upload (title/description/tags/thumbnail all generated).

Each slide (intro, per-question number, per-question question, per-question reveal, outro, thumbnail) gets its own short TTS clip. Because the clip's own duration is known exactly (via `ffprobe`), there's no need to detect silence or guess timestamps — the slide is just held on screen for exactly as long as its own audio lasts, then the next one starts.

---

## One-time setup (already done on this machine)

- **ElevenLabs API key** → `.env.local` as `ELEVENLABS_API_KEY` (Text to Speech: Access, Voices: Read — no other scopes needed)
- **Playwright + Chromium** → `npm install` already includes it (`devDependencies`). After any Playwright version bump run `npx playwright install chromium` again, or the job fails at the first screenshot (this is what killed the Aug 27 to Sep 17, 2026 runs).
- **ffmpeg** → the `ffmpeg-static` npm package (native arm64 build, installed by `npm install`). The pipeline no longer uses `/usr/local/bin/ffmpeg`, which is an Intel binary this Mac cannot run any more. Audio durations are measured by decoding with the same ffmpeg (`ffprobeDuration.js`), so ffprobe is not needed.
- **Node** → `run-weekly.sh` picks the newest arm64 Node 20+ under `~/.nvm` on its own (Intel builds fail with `Bad CPU type in executable` since the Sep 24, 2026 run).
- **YouTube OAuth** → `credentials/youtube-client-secret.json` (Google Cloud OAuth client, Desktop app type) + `credentials/youtube-token.json` (refresh token, generated once via `npm run video:youtube:auth`). Both gitignored, never committed.
- The Google Cloud OAuth app is in **Testing** mode, so Google expires its refresh tokens after 7 days and uploads fail with `invalid_grant` (it did on Oct 16, 2026). Re-run `npm run video:youtube:auth credentials/youtube-client-secret.json` to fix it, or, to stop it recurring, open the project's OAuth consent screen in Google Cloud Console and click **Publish app**: a published app in the sensitive-scope tier keeps the token until it is revoked (Google shows an unverified-app warning at sign-in, which is fine for your own channel).
- To redo the YouTube auth from scratch: Google Cloud Console → new project → enable "YouTube Data API v3" → OAuth consent screen (External, add your Google account as a test user) → Credentials → Create OAuth client ID (Desktop app) → put `client_id`/`client_secret` in `credentials/youtube-client-secret.json` → `npm run video:youtube:auth credentials/youtube-client-secret.json` → open the printed URL, approve.

---

## Scripts (`scripts/video-pipeline/`)

| File | Purpose |
|---|---|
| `buildCues.js` | Quiz JSON → ordered list of slide "cues" (narration text + slide state). Language-aware (`en`/`es` templates, driven by the quiz's `language` field). |
| `tts.js` | Calls ElevenLabs TTS (`/v1/text-to-speech/{voiceId}`) with the `eleven_v3` model (the pace the ElevenLabs site previews voices with; `multilingual_v2` read about a third faster), writes an MP3. `listVoices()` lists available voices. |
| `ffprobeDuration.js` | Exact audio duration: decodes the clip with ffmpeg and counts samples. |
| `ffmpegBin.js` | Resolves the ffmpeg binary (`ffmpeg-static`, falling back to PATH). |
| `renderSlide.js` | Playwright wrapper — screenshots `/internal/video-render/[quizId]?state=...&q=...` at 1920×1080. Hides the Next.js dev badge (`<nextjs-portal>`) first; it used to be captured into every slide. |
| `assemble.js` | ffmpeg: builds a concat-demuxer image list (each frame held for its own clip's duration) + concatenated audio track, muxes into the final MP4. |
| `metadata.js` | Builds the YouTube title/description/tags. Language-aware (translated section headers, translated "more tests" links). Truncates the title to YouTube's 100-char limit. |
| `generateVideo.js` | Orchestrator: `node scripts/video-pipeline/generateVideo.js <quizId> --voice <voiceId> [--limit N] [--out dir]`. Produces `<quizId>.mp4`, `youtube-metadata.json`, `thumbnail.png`. |
| `youtubeAuth.js` | One-time OAuth authorization (loopback redirect flow). |
| `youtubeUpload.js` | `node scripts/video-pipeline/youtubeUpload.js <outputDir> [--privacy private|unlisted|public]`. Uploads the video + sets the thumbnail. Defaults to `private` — review before flipping to public. |
| `weeklyRun.js` | Picks the next `ready` item from `content-pipeline/video-queue.json`, runs generate + upload (private), marks it `published`. |
| `run-weekly.sh` | Wrapper the launchd job calls — picks an arm64 Node, checks ffmpeg, Chromium, the YouTube token and the ElevenLabs key, starts a dedicated dev server on port 3799, runs `weeklyRun.js` against it, tears the server down after. Every failure posts a macOS notification. `run-weekly.sh --preflight` runs only the checks. |
| `setVideoPrivacy.js` | `node scripts/video-pipeline/setVideoPrivacy.js <videoId> <private\|unlisted\|public>`. Flips an already-uploaded video's YouTube privacy. Requires the broader `youtube` OAuth scope (see one-time setup) — the upload-only scope can't do this. |
| `publishToSite.js` | `node scripts/video-pipeline/publishToSite.js <quizId> [--privacy public\|unlisted]`. The "go live" step, run by hand after you've reviewed a private upload in YouTube Studio: flips privacy, adds the video to `/videos`, and embeds it on whichever hub/blog post the queue item names. See "Publishing a reviewed video" below. |

The render route itself, `src/app/internal/video-render/[quizId]/page.tsx`, is a server component (no client JS) that reproduces the navy/gold slide design from the old manual HTML files, driven entirely by URL query params (`state=intro|number|question|reveal|outro|thumbnail`, `q=<index>`). It's disabled outside `NODE_ENV !== 'production'` so it never becomes a reachable production URL — it only needs to exist for the local `next dev` server Playwright screenshots against.

---

## Manual run (one video, right now)

```bash
npm run dev                                        # in one terminal, needed for Playwright to screenshot against
npm run video:generate <quizId> -- --voice <voiceId>
npm run video:youtube:upload output/video-pipeline/<quizId> -- --privacy private
```

`npm run video:voices` lists ElevenLabs voice IDs available on the account (needs a key with Voices read permission; the current key only has Text to Speech).

**Voices:** Spanish videos use Ninoska (`zl1Ut8dvwcVSuQSB9XkG`, a Voice Library "Spanish teacher" voice, about 115 words per minute on v3). English videos use Vanesa (`9BYUod15YOH2aePSd97v`, Voice Library, about 85 words per minute on v3, with natural pauses). The first five Spanish videos used the stock Sarah voice (`EXAVITQu4vr4xnSDxMaL`), which many other channels also use; it is no longer used. `weeklyRun.js` picks the default by the quiz's language when a queue item has no `voice`.

`output/` is gitignored — generated videos/audio never get committed.

---

## Weekly automation

`content-pipeline/video-queue.json` is the queue — same pattern as the blog pipeline's `topic-queue.json`. Each item: `{ "quizId": "...", "voice": "...", "status": "ready" | "published" }`. `weeklyRun.js` always picks the lowest-index `ready` item, generates, uploads as private, then flips it to `published` with the video ID and timestamp.

**This runs locally (launchd), not as a cloud RemoteTrigger routine** — unlike the blog publisher, this pipeline needs the local ElevenLabs key and YouTube OAuth token, which a cloud sandbox can't access.

- launchd job: `~/Library/LaunchAgents/com.dmvcalifornia.video-pipeline.weekly.plist`
- Schedule: **Thursday 10:00 AM local time** (the plist's `StartCalendarInterval`). The upload lands private, so the time only decides when the review notification arrives; publishing time is whenever `publishToSite.js` is run.
- Manual trigger for testing: `launchctl kickstart gui/$(id -u)/com.dmvcalifornia.video-pipeline.weekly`
- Logs: `/tmp/dmv-video-pipeline-weekly.log` (launchd stdout/stderr) and `output/video-pipeline/weekly-run-*.log` (pipeline output). A failed run also posts a "Video pipeline FAILED" notification; a 133-byte log means the dev server never started.
- Reload after editing the plist: `launchctl bootout gui/$(id -u)/com.dmvcalifornia.video-pipeline.weekly` then `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.dmvcalifornia.video-pipeline.weekly.plist`

### Known gotcha: macOS Full Disk Access

The project lives under `~/Desktop`, a TCC-protected folder. A launchd job spawns `/bin/bash` as a fresh process with no inherited permissions — it gets `Operation not permitted` reading anything under Desktop until `bash` is added to **System Settings → Privacy & Security → Full Disk Access**. Just toggling it on isn't always enough — **a full logout/login (or restart) is often required** before the grant actually takes effect for background/daemon processes; toggling the switch off and back on did not resolve it in testing here.

### Expanding the queue beyond `quizzes.json`

Only quizzes already inside `src/data/quizzes.json` (currently `en` + `es`) are wired up. Other languages live in separate files (`turkish-quizzes.json`, `ko-quizzes.json`, `vietnamese-quizzes.json`, etc.) — extend `generateVideo.js`'s `findQuiz()` to search across all of them before queuing non-en/es quizzes.

---

## Presentation-style info videos (`generateMotionVideo.js`)

For non-quiz videos made from a blog post (first one: `dmv-appointment-2026`, from the `dmv-appointment` post). Every slide is an animation rendered frame by frame, not a held screenshot.

**Stack:** beat script JSON (`content-pipeline/info-videos/<videoId>.json`) → ElevenLabs TTS per beat (cached by narration text in the output `work/` dir) → `/internal/video-render-motion/[videoId]?beat=<key>&d=<seconds>` rendered at 30 fps by stepping `window.__seek(t)` and streaming JPEG frames into ffmpeg → MP4 + thumbnail + YouTube metadata (`metadata-info.js`, which reads `description`, `links`, `tags`, `closing` from the JSON).

```bash
npm run dev                                                    # render route needs the dev server
node scripts/video-pipeline/generateMotionVideo.js <videoId>   # [--beats a,b] for a quick preview, [--out dir], [--fps 30]
node scripts/video-pipeline/youtubeUpload.js output/video-pipeline/<videoId> --privacy private
```

**Slide layouts** (`layout` on each beat; see `MotionSlide.tsx`): `title` (hook), `bullets` (list builds in one by one, spread across the narration, each row with a lucide icon from `onScreen.icons`), `steps` (numbered timeline), `stat` (big number counts up, or a phone number types in), `image` (text left, picture right in a card; `frame: "browser"` draws a browser window for screenshots; `fit: "full"` puts a photo behind the whole slide; `fit: "contain"` shrinks the card to a wide screenshot's shape), `grid` (a row of photo `tiles`, one Pexels photo each, for lists of physical things), `compare` (horizontal bars that grow to `items[].value`), `flow` (a root node branching into `steps`, with `bullets` as the notes under each), `map` (a California outline that fills with `count` dots next to a big number), `cta`. A three.js scene of floating tiles drifts behind every slide, continuous across cuts, unless the beat has a clip.

**Moving backgrounds:** a beat with `videoQuery` gets one Pexels HD clip (`findPexelsVideo`, at least 6 s, 1280 to 1920 wide; `videoSkip: n` takes a later result). The generator downloads it to `output/.../clips/`, samples it to 15 fps JPEG frames under `public/video-frames/<videoId>/<beat>/` (gitignored, looped to the narration length) and the slide shows frame `floor(t * 15)` behind a dark gradient. Pexels media is credited in the YouTube description.

**Pictures:** `screens` in the JSON lists website screenshots to capture (`captureScreens.js`: url, optional `steps` of clicks/followLink/scrollTo, saved to `content-pipeline/info-videos/assets/<videoId>/` and committed; existing files are kept unless `--force`; `manual: true` marks one captured by hand, as the DMV's booking calendar had to be, because the DMV's A/B-tested booking app does not render in headless Chromium). An `image` beat with `imageQuery` gets one Pexels photo (`pexels.js`), written back into the beat as `image` so re-renders use the same one, and credited in the YouTube description. Use photos sparingly; screenshots and animated text are the house style.

**Writing the script:** condense the post to 550 to 700 words (the info-video voice `qSeXEcewz7tA0Q0qk9fH` on v3 reads about 195 words a minute, so that is about 3 to 3.5 minutes; it is set per video in the JSON's `voice`), re-check every fact against the official source on the day, and note the check date in `_readme` and `closing`. Numbers that change through the day (DMV wait times) get "about".

---

## Publishing a reviewed video (go live)

Every upload lands as **private** by design — nothing is public or embedded on the site until you deliberately take it live. Once you've watched a video in YouTube Studio and you're happy with it:

1. Open `content-pipeline/video-queue.json`, find the item (`status: "published"`), and add:
   - `cardTitle` / `cardDescription` — short, human-written copy for its card on `/videos`. `publishToSite.js` refuses to run without these; it never invents generic copy.
   - `embedHubSlug` (optional) — a key from `src/data/seo-hubs.ts` (e.g. `'california-dmv-practice-test-espanol'`) if this is the flagship video for that hub. The hub's video section defaults to English copy ("Watch: California DMV Practice Test 2026") — for a non-English hub also set `embedHubHeading` / `embedHubSubtitle` / `embedHubTitle` or the script will warn and leave the English default in place.
   - `embedBlogSlug` (optional) — a slug from `src/data/blog_posts.json` if there's a blog post this video is genuinely relevant to. Pick this by hand — it's an editorial call, not something to automate blindly. Same English-default caveat as hubs: set `embedBlogHeading` / `embedBlogSubtitle` / `embedBlogTitle` for non-English posts.
2. Run: `npm run video:publish -- <quizId>` (defaults to `--privacy public`, pass `--privacy unlisted` instead if you want it playable but not searchable/listed).
3. This flips YouTube privacy, adds the video to `src/data/videos.json` (powers `/videos`), and patches the named hub/blog post with `youtubeId`. It's idempotent — already-applied embeds are skipped on rerun.
4. Review the diff, then commit and push (Vercel deploys automatically).

Only one hub or blog post gets the embed automatically per queue item — if a video is relevant to more than one page, add the second `youtubeId` by hand the same way the first one was added.

---

## YouTube metadata format

Title: `<quiz title> | <Answers Explained / Respuestas Explicadas> (<N> Questions/Preguntas)`, truncated to 100 chars (YouTube's hard limit — some quiz titles are already bilingual/long and need truncating).

Description sections (see `metadata.js` for the exact `en`/`es` strings):
1. Hook paragraph
2. Site + iOS app links
3. "JUMP TO ANY QUESTION" timestamps (column-aligned, auto-generated from each question's actual cue duration)
4. "MORE FREE PRACTICE TESTS" links (language-specific list — Spanish only lists the 2 pages that actually exist in Spanish, doesn't overclaim)
5. "DOWNLOAD THE FREE iOS APP"
6. "TOPICS COVERED" (unique `category` values from the quiz's own questions)
7. Closing line

---

## Embed on the website (unchanged)

The `KeywordHub` component reads an optional `youtubeId` field and renders a responsive 16:9 iframe above the FAQ section.

1. Open `src/data/seo-hubs.ts`
2. Find the hub config (e.g. `'california-dmv-practice-test'`)
3. Add: `youtubeId: 'VIDEO_ID_HERE',`
4. Commit and push — Vercel deploys automatically

Embed renders at `https://dmvcalifornia.us/<hub-slug>`, between the test cards and the FAQ.

---

## Videos published so far

| Video | YouTube ID | Quiz ID | Language | Privacy |
|---|---|---|---|---|
| CA DMV Practice Test 2026 — 46 Questions (old manual pipeline) | `AAYjx6l9X5g` | — | English | Public, embedded on `/california-dmv-practice-test` |
| CA DMV Practice Test in Spanish — 40 Questions | `InU6I3Tsc8o` | `dmv-spanish-simulation-test-1` | Spanish | Private (pending review) |

Full progress/status lives in `content-pipeline/video-queue.json`, not this file — check there for what's queued next.
