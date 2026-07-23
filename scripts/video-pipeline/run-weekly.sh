#!/bin/bash
# Wrapper for the weekly launchd job: starts a dedicated dev server just for
# this run (so it never collides with a dev server you might have open),
# runs the pipeline against it, then shuts it down. launchd runs with a
# minimal environment, so PATH is set explicitly here.
set -uo pipefail

export PATH="/Users/thedaybreak/.nvm/versions/node/v20.19.5/bin:/usr/local/bin:/usr/bin:/bin"
REPO_ROOT="/Users/thedaybreak/Desktop/CODE/dmvcalifornia"
cd "$REPO_ROOT"

mkdir -p output/video-pipeline
LOG="output/video-pipeline/weekly-run-$(date +%Y%m%d-%H%M%S).log"
DEV_LOG="/tmp/dmv-weekly-dev-server.log"

echo "[run-weekly] Starting dedicated dev server..." >> "$LOG"
npm run dev -- -p 3799 > "$DEV_LOG" 2>&1 &
DEV_PID=$!

cleanup() {
  kill "$DEV_PID" 2>/dev/null
}
trap cleanup EXIT

READY=""
for i in $(seq 1 30); do
  if curl -s -o /dev/null "http://localhost:3799"; then
    READY="1"
    break
  fi
  sleep 1
done

if [ -z "$READY" ]; then
  echo "[run-weekly] Dev server never came up, aborting." >> "$LOG"
  cat "$DEV_LOG" >> "$LOG"
  exit 1
fi

ACTUAL_PORT=$(grep -oE "localhost:[0-9]+" "$DEV_LOG" | head -1 | grep -oE "[0-9]+$")
ACTUAL_PORT=${ACTUAL_PORT:-3799}
echo "[run-weekly] Dev server up on port $ACTUAL_PORT" >> "$LOG"

VIDEO_RENDER_BASE_URL="http://localhost:$ACTUAL_PORT" node scripts/video-pipeline/weeklyRun.js >> "$LOG" 2>&1
STATUS=$?

echo "[run-weekly] Finished with exit code $STATUS" >> "$LOG"
exit $STATUS
