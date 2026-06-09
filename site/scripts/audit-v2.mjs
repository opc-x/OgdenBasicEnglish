#!/usr/bin/env node
/** 全量复检：850 详解页（语义解析+配图）+ 词卡网格 + 截图 */
import { chromium } from "/Users/cuijianchen/gh-projects/talkflow/node_modules/playwright/index.mjs";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const BASE = process.argv[2] || "http://127.0.0.1:5181";
const guides = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../src/word-guides.json"), "utf8"));
const WORDS = Object.keys(guides);

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const ctx = browser.contexts()[0];
const failures = [];
const BATCH = 40;

for (let i = 0; i < WORDS.length; i += BATCH) {
  await Promise.all(
    WORDS.slice(i, i + BATCH).map(async (w) => {
      const p = await ctx.newPage();
      try {
        await p.goto(`${BASE}/word/${encodeURIComponent(w)}`, { waitUntil: "domcontentloaded", timeout: 15000 });
        const d = await p.evaluate(() => {
          const img = document.querySelector(".word-detail-img");
          return {
            h1: document.querySelector(".word-detail h1")?.textContent?.trim(),
            hook: (document.querySelector(".word-detail-hook p")?.textContent || "").length > 8,
            chunks: document.querySelectorAll(".word-chunk").length,
            cnLines: document.querySelectorAll(".word-sentence-cn").length,
            sentences: document.querySelectorAll(".word-sentence").length,
            visual: !!(img || document.querySelector(".word-detail-op-visual svg")),
            imgBroken: img ? img.complete && img.naturalWidth === 0 : false,
            empty: !!document.querySelector(".word-detail--empty"),
          };
        });
        const pass = !d.empty && d.h1 === w && d.hook && d.sentences >= 2 && d.chunks >= 3 && d.cnLines >= 2 && d.visual && !d.imgBroken;
        if (!pass) failures.push({ w, ...d });
      } catch (e) {
        failures.push({ w, error: e.message.slice(0, 80) });
      } finally {
        await p.close();
      }
    })
  );
  process.stderr.write(`${Math.min(i + BATCH, WORDS.length)}/${WORDS.length}\n`);
}

// grid: no text-box svgs anymore (check sample of svg-rendered cards) + broken
const page = await ctx.newPage();
await page.goto(`${BASE}/doc/words?tab=all`, { waitUntil: "domcontentloaded" });
await page.evaluate(async () => {
  for (let i = 0; i < 30; i++) { window.scrollBy(0, 900); await new Promise((r) => setTimeout(r, 90)); }
});
await page.waitForTimeout(2500);
const grid = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll(".word-card-img")];
  return {
    cards: document.querySelectorAll(".word-card").length,
    broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.alt),
  };
});

// screenshots for visual review
const shots = ["good", "angry", "boiling", "attention", "because", "run", "quick", "dog"];
const pg = await ctx.newPage();
await pg.setViewportSize({ width: 1440, height: 900 });
for (const w of shots) {
  await pg.goto(`${BASE}/word/${w}`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: `/tmp/v2-${w}.png`, fullPage: true });
}
await pg.goto(`${BASE}/doc/words?tab=qual`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(800);
await pg.screenshot({ path: "/tmp/v2-grid-qual.png" });
await pg.goto(`${BASE}/doc/words?tab=things`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(800);
await pg.screenshot({ path: "/tmp/v2-grid-things.png" });

console.log(JSON.stringify({
  total: WORDS.length,
  failures: failures.length,
  failList: failures.slice(0, 12),
  grid,
  passRate: (((WORDS.length - failures.length) / WORDS.length) * 100).toFixed(2) + "%",
}, null, 2));
await browser.close();
