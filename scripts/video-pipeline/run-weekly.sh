#!/bin/bash
# Wrapper for the weekly launchd job: starts a dedicated dev server just for
# this run (so it never collides with a dev server you might have open),
# runs the pipeline against it, then shuts it down. launchd runs with a
# minimal environment, so PATH is set explicitly here.
set -uo pipefail

REPO_ROOT="/Users/thedaybreak/Desktop/CODE/dmvcalifornia"
cd "$REPO_ROOT"

mkdir -p output/video-pipeline
LOG="output/video-pipeline/weekly-run-$(date +%Y%m%d-%H%M%S).log"
DEV_LOG="/tmp/dmv-weekly-dev-server.log"

# Notify on every failure, not only on success: the job failed quietly for
# seven weeks (Aug 27 to Oct 15, 2026) before anyone looked at the logs.
fail() {
  echo "[run-weekly] $1" >> "$LOG"
  osascript -e "display notification \"$1 See $LOG\" with title \"Video pipeline FAILED\"" 2>/dev/null
  exit 1
}

# Pick a Node build that matches this machine. This Mac is arm64 and no longer
# runs Intel binaries ("Bad CPU type in executable"), and nvm has both kinds
# installed, so the newest arm64 Node 20+ wins.
ARCH="$(uname -m)"
NODE_BIN=""
for candidate in $(ls -d "$HOME"/.nvm/versions/node/v*/bin 2>/dev/null | sort -V -r); do
  major=$(basename "$(dirname "$candidate")" | sed -E 's/^v([0-9]+).*/\1/')
  if [ "$major" -ge 20 ] && file -b "$candidate/node" | grep -q "$ARCH"; then
    NODE_BIN="$candidate"
    break
  fi
done
[ -n "$NODE_BIN" ] || fail "No $ARCH Node 20+ found under ~/.nvm/versions/node."
export PATH="$NODE_BIN:/usr/bin:/bin"
echo "[run-weekly] Using node from $NODE_BIN ($(node --version))" >> "$LOG"

# Preflight: every binary the pipeline needs must actually run on this machine.
node -e 'require("ffmpeg-static")' 2>/dev/null || fail "ffmpeg-static is not installed (npm install)."
"$(node -p 'require("ffmpeg-static")')" -version >/dev/null 2>&1 || fail "The ffmpeg-static binary does not run on this machine."
CHROME="$(node -p 'require("playwright").chromium.executablePath()' 2>/dev/null)"
[ -x "$CHROME" ] || fail "Playwright Chromium is missing. Run: npx playwright install chromium"
[ -f credentials/youtube-token.json ] || fail "credentials/youtube-token.json is missing."
grep -q '^ELEVENLABS_API_KEY=' .env.local 2>/dev/null || fail "ELEVENLABS_API_KEY is not set in .env.local."
echo "[run-weekly] Preflight OK: node $(node --version), ffmpeg $("$(node -p 'require("ffmpeg-static")')" -version | head -1 | cut -d' ' -f3), chromium present." >> "$LOG"

# `run-weekly.sh --preflight` stops here: use it after a macOS, Node or
# Playwright update to check the job will run on Thursday.
if [ "${1:-}" = "--preflight" ]; then
  tail -1 "$LOG"
  exit 0
fi

echo "[run-weekly] Starting dedicated dev server..." >> "$LOG"
npm run dev -- -p 3799 > "$DEV_LOG" 2>&1 &
DEV_PID=$!

cleanup() {
  kill "$DEV_PID" 2>/dev/null
}
trap cleanup EXIT

READY=""
for i in $(seq 1 60); do
  if curl -s -o /dev/null "http://localhost:3799"; then
    READY="1"
    break
  fi
  sleep 1
done

if [ -z "$READY" ]; then
  cat "$DEV_LOG" >> "$LOG"
  fail "Dev server never came up."
fi

ACTUAL_PORT=$(grep -oE "localhost:[0-9]+" "$DEV_LOG" | head -1 | grep -oE "[0-9]+$")
ACTUAL_PORT=${ACTUAL_PORT:-3799}
echo "[run-weekly] Dev server up on port $ACTUAL_PORT" >> "$LOG"

VIDEO_RENDER_BASE_URL="http://localhost:$ACTUAL_PORT" node scripts/video-pipeline/weeklyRun.js >> "$LOG" 2>&1
STATUS=$?

echo "[run-weekly] Finished with exit code $STATUS" >> "$LOG"
if [ "$STATUS" -ne 0 ]; then
  fail "weeklyRun.js exited with code $STATUS."
fi
exit 0
