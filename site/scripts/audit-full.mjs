#!/usr/bin/env node
/**
 * 全量 850 词验收：配图 + 详解页内容 + 讲解链接
 */
import { chromium } from "/Users/cuijianchen/gh-projects/talkflow/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const BASE = process.argv[2] || "http://localhost:5176";
const __dirname = dirname(fileURLToPath(import.meta.url));
const annotations = JSON.parse(readFileSync(join(__dirname, "../src/word-annotations.json"), "utf8"));
const guides = JSON.parse(readFileSync(join(__dirname, "../src/word-guides.json"), "utf8"));
const ALL_WORDS = Object.keys(guides);

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const ctx = browser.contexts()[0] ?? (await browser.newContext());
const page = await ctx.newPage();

const report = {
  base: BASE,
  timestamp: new Date().toISOString(),
  wordCount: ALL_WORDS.length,
  guideCount: Object.keys(guides).length,
  missingGuides: [],
  missingCn: [],
  missingImg: [],
  detailFailures: [],
  brokenDetailImages: [],
  gridBroken: [],
  clickTests: [],
  tierSamples: {},
};

// static data checks
for (const w of ALL_WORDS) {
  if (!guides[w]) report.missingGuides.push(w);
  if (!annotations[w]?.cn) report.missingCn.push(w);
  if (!annotations[w]?.img) report.missingImg.push(w);
}

// grid: all 850 with scroll load
await page.goto(`${BASE}/doc/words?tab=all`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector(".word-card", { timeout: 30000 });

// progressive scroll to trigger lazy load
await page.evaluate(async () => {
  const step = () => {
    window.scrollBy(0, window.innerHeight * 0.8);
  };
  const total = document.querySelectorAll(".word-card").length;
  const steps = Math.ceil(total / 5) + 5;
  for (let i = 0; i < steps; i++) {
    step();
    await new Promise((r) => setTimeout(r, 80));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 500));
  for (let i = 0; i < steps; i++) {
    step();
    await new Promise((r) => setTimeout(r, 120));
  }
});
await page.waitForTimeout(3000);

const gridData = await page.evaluate(() => {
  const cards = [...document.querySelectorAll(".word-card")];
  const broken = [];
  const noImg = [];
  const truncated = [];
  for (const card of cards) {
    const word = card.querySelector(".word-en")?.textContent?.trim();
    const img = card.querySelector(".word-card-img");
    const fallback = card.querySelector(".word-card-img-fallback");
    if (!img && fallback) noImg.push(word);
    else if (img && img.complete && img.naturalWidth === 0) broken.push({ word, src: img.src.slice(-80) });
    const en = card.querySelector(".word-en");
    if (en && en.scrollWidth > en.clientWidth + 2) truncated.push(word);
  }
  return { cardCount: cards.length, broken, noImg, truncated };
});
report.grid = gridData;
report.gridBroken = gridData.broken.map((b) => b.word);

// click 讲解 from grid (sample words)
const clickWords = ["dog", "come", "attention", "good", "because", "apple"];
for (const w of clickWords) {
  await page.goto(`${BASE}/doc/words?tab=all&q=${w}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".word-link", { timeout: 10000 });
  const href = await page.locator(".word-card").first().locator(".word-link").getAttribute("href");
  await page.locator(".word-card").first().locator(".word-link").click();
  await page.waitForURL(/\/word\//, { timeout: 10000 });
  const url = page.url();
  const ok = url.includes(`/word/${w}`) || url.includes(encodeURIComponent(w));
  report.clickTests.push({ word: w, href, landed: url, ok });
}

// detail page batch check — all 850 (fast, no screenshot)
const BATCH = 50;
for (let i = 0; i < ALL_WORDS.length; i += BATCH) {
  const chunk = ALL_WORDS.slice(i, i + BATCH);
  await Promise.all(
    chunk.map(async (w) => {
      const p = await ctx.newPage();
      try {
        await p.goto(`${BASE}/word/${encodeURIComponent(w)}`, {
          waitUntil: "domcontentloaded",
          timeout: 20000,
        });
        const d = await p.evaluate(() => ({
          h1: document.querySelector(".word-detail h1")?.textContent?.trim(),
          hook: !!document.querySelector(".word-detail-hook p")?.textContent?.trim(),
          method: !!document.querySelector(".word-detail-method-tag")?.textContent?.trim(),
          concept: !!document.querySelector(".word-detail-method p")?.textContent?.trim(),
          examples: document.querySelectorAll(".word-detail-examples li").length,
          combine: !!document.querySelector(".word-detail-combine-text")?.textContent?.trim(),
          visual: !!(
            document.querySelector(".word-detail-img") ||
            document.querySelector(".word-detail-op-visual svg")
          ),
          imgBroken:
            (() => {
              const img = document.querySelector(".word-detail-img");
              return img ? img.complete && img.naturalWidth === 0 : false;
            })(),
          empty: !!document.querySelector(".word-detail--empty"),
        }));
        const pass =
          !d.empty &&
          d.h1 === w &&
          d.hook &&
          d.method &&
          d.concept &&
          d.examples >= 2 &&
          d.combine &&
          d.visual;
        if (!pass) {
          report.detailFailures.push({ word: w, ...d, pass });
        }
        if (d.imgBroken) report.brokenDetailImages.push(w);
      } catch (e) {
        report.detailFailures.push({ word: w, error: e.message, pass: false });
      } finally {
        await p.close();
      }
    })
  );
  process.stderr.write(`detail ${Math.min(i + BATCH, ALL_WORDS.length)}/${ALL_WORDS.length}\n`);
}

// tier visual samples with screenshots
const TIER_SAMPLES = {
  operator: "come",
  ops_prep: "about",
  ops_conj: "because",
  pic: "dog",
  things: "attention",
  qual: "good",
  opp: "bad",
};
for (const [tier, w] of Object.entries(TIER_SAMPLES)) {
  await page.goto(`${BASE}/word/${w}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `/tmp/ag-final-${tier}-${w}.png`, fullPage: true });
  const snap = await page.evaluate(() => ({
    hook: document.querySelector(".word-detail-hook p")?.textContent?.trim(),
    method: document.querySelector(".word-detail-method-tag")?.textContent?.trim(),
    examples: [...document.querySelectorAll(".word-detail-examples li span")].map((e) => e.textContent),
  }));
  report.tierSamples[tier] = { word: w, ...snap };
}

await page.screenshot({ path: "/tmp/ag-final-grid-all.png", fullPage: false });
await page.goto(`${BASE}/doc/words?tab=pic`, { waitUntil: "domcontentloaded" });
await page.waitForSelector(".word-card");
await page.screenshot({ path: "/tmp/ag-final-grid-pic.png", fullPage: false });

report.summary = {
  missingGuides: report.missingGuides.length,
  missingCn: report.missingCn.length,
  missingImg: report.missingImg.length,
  gridCards: gridData.cardCount,
  gridBroken: report.gridBroken.length,
  gridNoImg: gridData.noImg.length,
  gridTruncated: gridData.truncated.length,
  detailFailures: report.detailFailures.length,
  brokenDetailImages: report.brokenDetailImages.length,
  clickOk: report.clickTests.filter((t) => t.ok).length,
  passRate: (
    ((ALL_WORDS.length - report.detailFailures.length) / ALL_WORDS.length) *
    100
  ).toFixed(1),
};

writeFileSync("/tmp/ag-full-audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
if (report.detailFailures.length) {
  console.log("FAILURES (first 15):", JSON.stringify(report.detailFailures.slice(0, 15), null, 2));
}
if (report.gridBroken.length) {
  console.log("GRID BROKEN (first 15):", report.gridBroken.slice(0, 15));
}
await browser.close();
