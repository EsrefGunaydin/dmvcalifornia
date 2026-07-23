const { chromium } = require('playwright');

const BASE_URL = process.env.VIDEO_RENDER_BASE_URL || 'http://localhost:3000';

class SlideRenderer {
  async start() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage({ viewport: { width: 1920, height: 1080 } });
  }

  async assertServerUp() {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok && res.status !== 404) {
        throw new Error(`Unexpected status ${res.status}`);
      }
    } catch (err) {
      throw new Error(
        `Can't reach ${BASE_URL} — start the dev server first with "npm run dev" in another terminal. (${err.message})`
      );
    }
  }

  async shoot(quizId, cue, outPath) {
    const url = new URL(`${BASE_URL}/internal/video-render/${quizId}`);
    url.searchParams.set('state', cue.state);
    if (cue.q !== null && cue.q !== undefined) url.searchParams.set('q', String(cue.q));

    await this.page.goto(url.toString(), { waitUntil: 'networkidle' });
    await this.page.screenshot({ path: outPath });
    return outPath;
  }

  async stop() {
    await this.browser?.close();
  }
}

module.exports = { SlideRenderer };
