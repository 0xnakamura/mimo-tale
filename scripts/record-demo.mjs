/**
 * Playwright-based demo recorder for mimo-tale.
 *
 * Records a complete playthrough of the mock-mode 5-beat story arc:
 *   setup → chapter 1 → pick branch A → chapter 2 → pick branch B
 *   → chapter 3 → pick branch A → chapter 4 (is_ending=true) → epilogue
 *
 * Output:
 *   docs/img/demo.webm           Playwright native (lossless, ~3-8 MB)
 *   docs/img/demo.mp4            ffmpeg-converted, 1280x800 @ 30fps
 *   docs/img/demo.gif            ffmpeg-generated 15 fps preview, ≤ 5 MB
 *
 * Run:
 *   node scripts/record-demo.mjs                  # default mock mode
 *   BASE_URL=http://localhost:3001 node scripts/record-demo.mjs
 */

import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUT_DIR = "docs/img";
const VIEWPORT = { width: 1280, height: 800 };
const TMP_DIR = "/tmp/mimo-tale-recording";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const t0 = Date.now();
const log = (msg) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] ${msg}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: VIEWPORT,
  recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  reducedMotion: "no-preference",
  colorScheme: "dark",
});

const page = await context.newPage();
page.on("console", (m) => {
  if (m.type() === "error") log(`[console.error] ${m.text()}`);
});

try {
  log(`opening ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500); // let the splash form animate in + viewer read it

  log("clicking preset 'The Lantern at the Threshold'");
  await page.getByRole("button", { name: /Lantern at the Threshold/i }).click();
  await page.waitForTimeout(2000);

  log("clicking 'Begin chapter 1 →'");
  await page.getByRole("button", { name: /Begin chapter 1/i }).click();

  // Loop: wait for a chapter card with branches, then click the first branch.
  // Stop once is_ending lands (no more branches → epilogue UI shows).
  for (let i = 1; i <= 6; i++) {
    log(`waiting for chapter ${i} to render…`);
    await page.waitForSelector("article", { timeout: 30_000 });
    // Wait until the audio player and image are both visible
    await page.waitForFunction(
      (idx) => {
        const arts = document.querySelectorAll("article");
        if (arts.length < idx) return false;
        const last = arts[arts.length - 1];
        if (!last) return false;
        const img = last.querySelector("figure img");
        const audio = last.querySelector("audio");
        return img && img.complete && audio;
      },
      i,
      { timeout: 30_000 },
    );

    // Find branch buttons in the latest article
    const branchButtons = await page
      .locator("article")
      .last()
      .locator("button:has(span.flex-1)") // BranchPicker buttons (have span.flex-1)
      .all();

    if (branchButtons.length === 0) {
      log(`chapter ${i}: no branches found — epilogue reached, stopping.`);
      await page.waitForTimeout(5000);
      break;
    }

    // Smoothly scroll the newest chapter into view and let the reader linger
    await page
      .locator("article")
      .last()
      .evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    await page.waitForTimeout(2800); // dwell so a viewer can actually read the prose

    // Pick branch A on odd chapters, branch B on even — keeps things visually varied
    const pick = i % 2 === 0 ? Math.min(1, branchButtons.length - 1) : 0;
    log(`chapter ${i}: clicking branch ${String.fromCharCode(65 + pick)}`);
    await branchButtons[pick].scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await branchButtons[pick].click();
    await page.waitForTimeout(1100);
  }

  log("recording done — closing context");
} catch (e) {
  log(`error: ${e.message}`);
  process.exitCode = 1;
} finally {
  await context.close();
  await browser.close();
}

// Locate the video file Playwright wrote
const videoFiles = readdirSync(TMP_DIR).filter((f) => f.endsWith(".webm"));
if (videoFiles.length === 0) {
  console.error("no video file produced");
  process.exit(1);
}
const srcWebm = join(TMP_DIR, videoFiles[0]);
const dstWebm = join(OUT_DIR, "demo.webm");
renameSync(srcWebm, dstWebm);
log(`saved ${dstWebm}`);

// Convert to mp4 (h264, web-friendly)
const dstMp4 = join(OUT_DIR, "demo.mp4");
log(`converting → ${dstMp4}`);
execSync(
  `ffmpeg -y -i "${dstWebm}" -c:v libx264 -pix_fmt yuv420p -preset slow -crf 22 -movflags +faststart "${dstMp4}"`,
  { stdio: "inherit" },
);

// Generate a 15 fps GIF for README hero (≤ 5 MB)
const dstGif = join(OUT_DIR, "demo.gif");
log(`converting → ${dstGif}`);
execSync(
  `ffmpeg -y -i "${dstMp4}" -vf "fps=15,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${dstGif}"`,
  { stdio: "inherit" },
);

log("✓ done");
log(`  webm: ${dstWebm}`);
log(`  mp4:  ${dstMp4}`);
log(`  gif:  ${dstGif}`);
