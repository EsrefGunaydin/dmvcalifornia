# YouTube DMV Quiz Video — Production Guide

How we build synced DMV quiz videos for YouTube and embed them on the website.
First video (old manual process): **California DMV Practice Test 2026 — 46 Questions** (`AAYjx6l9X5g`)
First video on the automated pipeline: **California DMV Practice Test in Spanish — 40 Questions** (`InU6I3Tsc8o`)

---

## Overview

The whole process is automated end to end via `scripts/video-pipeline/`. No more hand-built HTML slide files, no manual screen recording, no manual ffmpeg silence-detection to sync audio.

**Stack:** quiz JSON → per-slide narration text → ElevenLabs TTS (audio + exact duration) → Playwright screenshot of a Next.js render route → ffmpeg assembly (image durations match their own audio clip exactly) → YouTube Data API upload (title/description/tags/thumbnail all generated).

Each slide (intro, per-question number, per-question question, per-question reveal, outro, thumbnail) gets its own short TTS clip. Because the clip's own duration is known exactly (via `ffprobe`), there's no need to detect silence or guess timestamps — the slide is just held on screen for exactly as long as its own audio lasts, then the next one starts.

---

## One-time setup (already done on this machine)

- **ElevenLabs API key** → `.env.local` as `ELEVENLABS_API_KEY` (Text to Speech: Access, Voices: Read — no other scopes needed)
- **Playwright + Chromium** → `npm install` already includes it (`devDependencies`)
- **YouTube OAuth** → `credentials/youtube-client-secret.json` (Google Cloud OAuth client, Desktop app type) + `credentials/youtube-token.json` (refresh token, generated once via `npm run video:youtube:auth`). Both gitignored, never committed.
- To redo the YouTube auth from scratch: Google Cloud Console → new project → enable "YouTube Data API v3" → OAuth consent screen (External, add your Google account as a test user) → Credentials → Create OAuth client ID (Desktop app) → put `client_id`/`client_secret` in `credentials/youtube-client-secret.json` → `npm run video:youtube:auth credentials/youtube-client-secret.json` → open the printed URL, approve.

---

## Scripts (`scripts/video-pipeline/`)

| File | Purpose |
|---|---|
| `buildCues.js` | Quiz JSON → ordered list of slide "cues" (narration text + slide state). Language-aware (`en`/`es` templates, driven by the quiz's `language` field). |
| `tts.js` | Calls ElevenLabs TTS (`/v1/text-to-speech/{voiceId}`), writes an MP3. `listVoices()` lists available voices. |
| `ffprobeDuration.js` | Reads an audio file's exact duration via `ffprobe`. |
| `renderSlide.js` | Playwright wrapper — screenshots `/internal/video-render/[quizId]?state=...&q=...` at 1920×1080. |
| `assemble.js` | ffmpeg: builds a concat-demuxer image list (each frame held for its own clip's duration) + concatenated audio track, muxes into the final MP4. |
| `metadata.js` | Builds the YouTube title/description/tags. Language-aware (translated section headers, translated "more tests" links). Truncates the title to YouTube's 100-char limit. |
| `generateVideo.js` | Orchestrator: `node scripts/video-pipeline/generateVideo.js <quizId> --voice <voiceId> [--limit N] [--out dir]`. Produces `<quizId>.mp4`, `youtube-metadata.json`, `thumbnail.png`. |
| `youtubeAuth.js` | One-time OAuth authorization (loopback redirect flow). |
| `youtubeUpload.js` | `node scripts/video-pipeline/youtubeUpload.js <outputDir> [--privacy private|unlisted|public]`. Uploads the video + sets the thumbnail. Defaults to `private` — review before flipping to public. |
| `weeklyRun.js` | Picks the next `ready` item from `content-pipeline/video-queue.json`, runs generate + upload (private), marks it published. |
| `run-weekly.sh` | Wrapper the launchd job calls — starts a dedicated dev server on port 3799, runs `weeklyRun.js` against it, tears the server down after. |

The render route itself, `src/app/internal/video-render/[quizId]/page.tsx`, is a server component (no client JS) that reproduces the navy/gold slide design from the old manual HTML files, driven entirely by URL query params (`state=intro|number|question|reveal|outro|thumbnail`, `q=<index>`). It's disabled outside `NODE_ENV !== 'production'` so it never becomes a reachable production URL — it only needs to exist for the local `next dev` server Playwright screenshots against.

---

## Manual run (one video, right now)

```bash
npm run dev                                        # in one terminal, needed for Playwright to screenshot against
npm run video:generate <quizId> -- --voice <voiceId>
npm run video:youtube:upload output/video-pipeline/<quizId> -- --privacy private
```

`npm run video:voices` lists ElevenLabs voice IDs available on the account.

`output/` is gitignored — generated videos/audio never get committed.

---

## Weekly automation

`content-pipeline/video-queue.json` is the queue — same pattern as the blog pipeline's `topic-queue.json`. Each item: `{ "quizId": "...", "voice": "...", "status": "ready" | "published" }`. `weeklyRun.js` always picks the lowest-index `ready` item, generates, uploads as private, then flips it to `published` with the video ID and timestamp.

**This runs locally (launchd), not as a cloud RemoteTrigger routine** — unlike the blog publisher, this pipeline needs the local ElevenLabs key and YouTube OAuth token, which a cloud sandbox can't access.

- launchd job: `~/Library/LaunchAgents/com.dmvcalifornia.video-pipeline.weekly.plist`
- Schedule: **Thursday 2:00 PM Pacific Time** (weekday afternoons test best for YouTube long-form engagement; Thursday/Friday edge out other weekdays per 2026 posting-time data)
- Manual trigger for testing: `launchctl kickstart gui/$(id -u)/com.dmvcalifornia.video-pipeline.weekly`
- Logs: `/tmp/dmv-video-pipeline-weekly.log` (launchd stdout/stderr) and `output/video-pipeline/weekly-run-*.log` (pipeline output)
- Reload after editing the plist: `launchctl bootout gui/$(id -u)/com.dmvcalifornia.video-pipeline.weekly` then `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.dmvcalifornia.video-pipeline.weekly.plist`

### Known gotcha: macOS Full Disk Access

The project lives under `~/Desktop`, a TCC-protected folder. A launchd job spawns `/bin/bash` as a fresh process with no inherited permissions — it gets `Operation not permitted` reading anything under Desktop until `bash` is added to **System Settings → Privacy & Security → Full Disk Access**. Just toggling it on isn't always enough — **a full logout/login (or restart) is often required** before the grant actually takes effect for background/daemon processes; toggling the switch off and back on did not resolve it in testing here.

### Expanding the queue beyond `quizzes.json`

Only quizzes already inside `src/data/quizzes.json` (currently `en` + `es`) are wired up. Other languages live in separate files (`turkish-quizzes.json`, `ko-quizzes.json`, `vietnamese-quizzes.json`, etc.) — extend `generateVideo.js`'s `findQuiz()` to search across all of them before queuing non-en/es quizzes.

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
