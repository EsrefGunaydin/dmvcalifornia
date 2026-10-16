/**
 * Captures the website screenshots an info video shows (DMV pages, mostly),
 * so they are real, current, and reproducible. Each entry in the video
 * JSON's `screens` map is:
 *   { url, steps?: [...], scrollTo?, clip?, fullPage? }
 * where each step is one of
 *   { click: "link or button text", nth?: 0 }   click the nth match
 *   { followLink: "link text" }                 go to that link's href (for
 *                                                links that open a new tab)
 *   { scrollTo: "text" }
 *   { wait: ms }
 * Pages are shot at 1280 x 900 CSS pixels, scaled 1.5x, which fills the
 * slide's picture card at readable text sizes.
 *
 * Usage: node scripts/video-pipeline/captureScreens.js <videoId> [--force]
 * Writes content-pipeline/info-videos/assets/<videoId>/<key>.png and
 * skips keys that already exist unless --force.
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const REPO_ROOT = path.join(__dirname, '..', '..');
const HIDE_CSS = '.grecaptcha-badge, [id*="cookie" i], [class*="cookie" i], [id*="feedback" i], [class*="feedback" i], [aria-label*="feedback" i], iframe[title*="chat" i] { display: none !important; }';

// Removes what is not part of the page the slide talks about: the DMV's
// site-wide alert popup ("Vote Early, California!" in Oct 2026), the
// floating "Ask DMV" chat button and the "Feedback" tab.
async function tidyPage(page) {
  await page.addStyleTag({ content: HIDE_CSS });
  // The DMV's site-wide alert ("Vote Early, California!") lives in an
  // iframe injected by its A/B testing tool, so it is invisible to the
  // page's own DOM queries: close it inside its frame, then drop the frame.
  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) continue;
    let text = '';
    try { text = await frame.evaluate(() => document.body ? document.body.innerText : ''); } catch (e) { continue; }
    if (!/Vote Early|General Election/i.test(text)) continue;
    try {
      const close = frame.locator('button, [role="button"], a').filter({ hasText: /^(×|x|close)$/i }).first();
      if (await close.count()) await close.click({ timeout: 2000 });
    } catch (e) { /* fall through to removing the frame */ }
    const el = await frame.frameElement().catch(() => null);
    if (el) await el.evaluate((node) => node.remove()).catch(() => {});
  }
  await page.evaluate(() => {
    const kill = (el) => el && el.parentElement && el.parentElement.removeChild(el);
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      const text = (el.innerText || '').trim();
      if (el.children.length === 0 && /^(Ask DMV|Feedback)$/i.test(text)) {
        let node = el;
        for (let i = 0; i < 3 && node.parentElement && node.parentElement !== document.body; i++) node = node.parentElement;
        kill(node);
      }
    }
    const alert = Array.from(document.querySelectorAll('body *')).find((el) => /Vote Early, California/i.test(el.textContent || '') && el.getBoundingClientRect().height < 400 && el.getBoundingClientRect().height > 100);
    if (alert) {
      let node = alert;
      while (node.parentElement && node.parentElement !== document.body && node.parentElement.getBoundingClientRect().height < 420) node = node.parentElement;
      kill(node);
    }
  });
  await page.waitForTimeout(300);
}

async function runSteps(page, steps) {
  for (const step of steps || []) {
    if (step.click) {
      await page.getByText(step.click, { exact: false }).nth(step.nth || 0).click();
      await page.waitForTimeout(step.wait || 2500);
    } else if (step.followLink) {
      // Links that open a new tab (the DMV's "Get an Appointment") carry the
      // booking state in session storage, which only a real popup inherits;
      // navigating to the href directly lands on an empty page. So click,
      // adopt the popup, and continue the steps there.
      const link = page.getByText(step.followLink, { exact: false }).nth(step.nth || 0);
      const popupPromise = page.context().waitForEvent('page', { timeout: 10000 }).catch(() => null);
      await link.click();
      const popup = await popupPromise;
      if (popup) {
        await popup.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
        page = popup;
      } else {
        await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
      }
      await page.waitForTimeout(step.wait || 2500);
    } else if (step.scrollTo) {
      await page.getByText(step.scrollTo, { exact: false }).nth(step.nth || 0).scrollIntoViewIfNeeded();
      await page.waitForTimeout(step.wait || 600);
    } else if (step.wait) {
      await page.waitForTimeout(step.wait);
    }
  }
  return page;
}

async function captureScreens(videoId, { force = false } = {}) {
  const videoPath = path.join(REPO_ROOT, 'content-pipeline', 'info-videos', `${videoId}.json`);
  const video = JSON.parse(fs.readFileSync(videoPath, 'utf8'));
  const screens = video.screens || {};
  const outDir = path.join(REPO_ROOT, 'content-pipeline', 'info-videos', 'assets', videoId);
  fs.mkdirSync(outDir, { recursive: true });

  // CAPTURE_HEADED=1 opens a real window, useful when a site misbehaves headless.
  const browser = await chromium.launch({ headless: !process.env.CAPTURE_HEADED });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1.5,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  const results = {};
  const failed = [];
  try {
    for (const [key, spec] of Object.entries(screens)) {
      const outPath = path.join(outDir, `${key}.png`);
      if (spec.manual) {
        if (!fs.existsSync(outPath)) throw new Error(`${key} is marked manual but ${outPath} is missing`);
        results[key] = outPath;
        console.log(`  ${key}: manual capture, kept`);
        continue;
      }
      if (fs.existsSync(outPath) && !force) {
        results[key] = outPath;
        console.log(`  ${key}: kept existing`);
        continue;
      }
      process.stdout.write(`  ${key}: ${spec.url} ... `);
      try {
      await page.goto(spec.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(1500);
      const shotPage = await runSteps(page, spec.steps);
      if (spec.scrollTo) {
        await shotPage.getByText(spec.scrollTo, { exact: false }).first().scrollIntoViewIfNeeded();
        await shotPage.waitForTimeout(600);
      }
      if (spec.scrollBy) {
        await shotPage.evaluate((dy) => window.scrollBy(0, dy), spec.scrollBy);
        await shotPage.waitForTimeout(400);
      }
      await tidyPage(shotPage);
      await shotPage.screenshot({ path: outPath, clip: spec.clip, fullPage: Boolean(spec.fullPage) });
      if (shotPage !== page) await shotPage.close();
      results[key] = outPath;
      console.log('ok');
      } catch (err) {
        console.log(`FAILED: ${String(err.message).split('\n')[0]}`);
        failed.push(key);
      }
    }
  } finally {
    await browser.close();
  }
  if (failed.length) throw new Error(`Screenshots failed: ${failed.join(', ')}`);
  return results;
}

module.exports = { captureScreens };

if (require.main === module) {
  const [videoId, flag] = process.argv.slice(2);
  if (!videoId) {
    console.error('Usage: node scripts/video-pipeline/captureScreens.js <videoId> [--force]');
    process.exit(1);
  }
  captureScreens(videoId, { force: flag === '--force' }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
