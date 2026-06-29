# YouTube DMV Quiz Video — Production Guide

How we build synced DMV quiz videos for YouTube and embed them on the website.
First video: **California DMV Practice Test 2026 — 46 Questions** (`AAYjx6l9X5g`)

---

## Overview

Each video is a set of HTML slide files (1920×1080) that sync to an MP3 voiceover.
We record/export the browser at full screen, then publish to YouTube and embed on the site.

**Stack:** HTML + CSS + Vanilla JS → screen-recorded → ffmpeg audio merge → YouTube → Next.js embed

---

## Step 1 — Create the HTML Slide Files

Each segment (10–14 questions) is its own `.html` file on the Desktop.

### File naming convention
```
dmv-q1-10-synced.html
dmv-q11-21-synced.html
dmv-q22-32-synced.html
dmv-q33-46-synced.html
```

### Key design specs
- Canvas: **1920 × 1080px** (`html, body { width: 1920px; height: 1080px; overflow: hidden; }`)
- Font: `'Arial Black', 'Arial Bold', Arial, sans-serif`
- Background: `#080d1f` (near-black navy)
- DMV blue: `#4e80c4` / `#345488`
- Accent gold: `#F4B942`
- Correct green: `#10B981`
- Wrong: `opacity: .2`

### Slides per file
1. **Intro slide** — title, stat boxes (46 Questions / 83% To Pass / Free), Start button *(first file only)*
2. **Number slide** — big question number (260px), shown before each question
3. **Question slide** — category tag, question text, A/B/C options, progress bar, Q counter
4. **Outro slide** — checkmark, CTA to website + iOS app *(last file only)*

### Progress bar rule (critical)
The bar must reflect position in the **full video**, not just the current segment:

```js
// In showQ(i):
document.getElementById('pfill').style.width = (i / 46 * 100) + '%';

// In showOutro() for intermediate segments (not the last):
document.getElementById('pfill').style.width = (LAST_Q_IN_SEGMENT / 46 * 100) + '%';

// In showOutro() for the final segment:
document.getElementById('pfill').style.width = '100%';
```

Segment progress ranges:
| Segment  | Bar starts at | Bar ends at |
|----------|--------------|-------------|
| Q1–10    | 0%           | 21.7%       |
| Q11–21   | 21.7%        | 45.7%       |
| Q22–32   | 45.7%        | 69.6%       |
| Q33–46   | 69.6%        | 100%        |

### Question counter
Show global question number out of total (not segment-local):
```html
<div class="q-counter">Q<strong id="qnum">1</strong>/ 46</div>
```
Corner badge: `(i+1) + ' / 46'` (updated dynamically in `showQ()`).

### Remove the `?` badge
Replace the red `?` badge with a larger styled Q counter:
```css
.q-counter {
  font-size: 28px; color: #3a4a6a; font-family: Arial, sans-serif; font-weight: 900;
  text-align: center; background: rgba(255,255,255,.04);
  border: 1.5px solid rgba(255,255,255,.1);
  padding: 18px 28px; border-radius: 16px; white-space: nowrap;
}
.q-counter strong { color: #F4B942; font-size: 44px; display: block; line-height: 1; margin-bottom: 4px; }
```

### Audio src paths
```html
<audio id="audio" src="file:///Users/thedaybreak/Downloads/dmv1-10.mp3"></audio>
```

---

## Step 2 — Sync Audio to Slides (ffmpeg silence detection)

After the MP3 voiceover is recorded, derive exact timestamps using silence detection.

```bash
ffmpeg -i /path/to/audio.mp3 -af silencedetect=noise=-35dB:d=0.4 -f null - 2>&1 | grep -E "silence_start|silence_end"
```

### How to read the output
Each question follows this pattern in the audio:

| Silence gap | Meaning | Cue to fire |
|-------------|---------|-------------|
| Long pause (1.1–1.5s) before "Question X" speech | Inter-question gap | `showNum(i)` fires at `silence_end` |
| Pause (1.0–1.2s) after "Question X" is spoken | Speaker pauses before reading | `showQ(i)` fires at `silence_end` |
| Long pause (1.8–2.2s+) after all options are read | Speaker pauses before answer | `reveal()` fires at `silence_end` |

### CUES array structure
```js
const CUES = [
  { t: 20.34, fn: () => showNum(0) },  // "Question 1" starts
  { t: 22.27, fn: () => showQ(0) },    // question text starts
  { t: 37.90, fn: () => reveal() },    // answer announced
  // ...
  { t: 291.5, fn: () => showOutro() },
];
```

Cues fire on `audio.addEventListener('timeupdate', ...)`. After any seek, call `cuesFired.clear()` so cues re-fire correctly.

---

## Step 3 — Merge All Segments into One File

### Get exact audio durations
```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 /path/to/file.mp3
```

### Merge audio with ffmpeg
```bash
printf "file '/path/dmv1-10.mp3'\nfile '/path/dmv11-21.mp3'\nfile '/path/dmv22-32.mp3'\nfile '/path/dmv33-46.mp3'\n" > /tmp/concat.txt
ffmpeg -f concat -safe 0 -i /tmp/concat.txt -c copy /path/dmv-all-46.mp3 -y
```

### Merge HTML
Create `dmv-all-46-synced.html` with:
- All questions in one `QS = [...]` array (no OFFSET, 0-indexed)
- All CUES with time offsets added:
  ```
  File 2 offset = duration of file 1
  File 3 offset = duration of file 1 + file 2
  File 4 offset = duration of file 1 + file 2 + file 3
  ```
- Add a `showNum(firstIndexOfNewSegment)` cue exactly at each offset to bridge segments
- Single `<audio>` tag pointing to the merged MP3
- Only one intro (from first file) and one outro (from last file)

---

## Step 4 — YouTube Video Metadata

### Title formula
```
California DMV Practice Test [YEAR] — [N] Real Questions with Answers & Explanations
```
Keep under 60 chars for full display in search results.

### Description structure
1. Hook (2 lines — visible before "show more")
2. Links: website + iOS app
3. Timestamps for every question (use the `showQ` cue times, converted to `M:SS`)
4. All practice test links from dmvcalifornia.us
5. iOS app CTA
6. Topics covered bullet list
7. Hashtags

### Convert cue time to timestamp
```
seconds → Math.floor(t/60) + ':' + String(Math.floor(t%60)).padStart(2,'0')
```

### Hashtags
```
#CaliforniaDMV #DMVPracticeTest #CaliforniaPermitTest #DMVTest2026
#CaliforniaDrivingTest #DMVWrittenTest #PermitTest #CaliforniaDMV2026
#DriversLicense #DMVTestQuestions
```

---

## Step 5 — Embed on the Website

### How it works
The `KeywordHub` component reads an optional `youtubeId` field and renders a responsive 16:9 iframe above the FAQ section.

### To add a video to a hub page
1. Open `src/data/seo-hubs.ts`
2. Find the hub config (e.g. `'california-dmv-practice-test'`)
3. Add: `youtubeId: 'VIDEO_ID_HERE',`
4. Commit and push — Vercel deploys automatically

### Embed renders at
`https://dmvcalifornia.us/<hub-slug>` — between the test cards and the FAQ

---

## Videos Published So Far

| Video | YouTube ID | Hub page | Language |
|-------|-----------|----------|----------|
| CA DMV Practice Test 2026 — 46 Questions | `AAYjx6l9X5g` | `/california-dmv-practice-test` | English |

---

## Next Video: Spanish Version

Target page: `/california-dmv-practice-test-espanol`

**Checklist:**
- [ ] Translate all 46 questions + explanations into Spanish
- [ ] Record Spanish voiceover MP3s (same segment structure: Q1–10, Q11–21, Q22–32, Q33–46)
- [ ] Copy the English HTML files, update question text to Spanish
- [ ] Run silence detection on each Spanish MP3 and update CUES
- [ ] Merge audio + HTML into `dmv-espanol-all-46-synced.html`
- [ ] Upload to YouTube with Spanish title/description
- [ ] Add `youtubeId` to the `'california-dmv-practice-test-espanol'` hub in `seo-hubs.ts`
- [ ] Commit + push → auto-deploy

**Spanish YouTube title formula:**
```
Examen de Manejo California 2026 — 46 Preguntas con Respuestas y Explicaciones
```

**Spanish hub slug:** `california-dmv-practice-test-espanol`
**Hub key in seo-hubs.ts:** `'california-dmv-practice-test-espanol'`
