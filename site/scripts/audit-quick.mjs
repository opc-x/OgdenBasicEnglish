#!/usr/bin/env node
import { chromium } from "/Users/cuijianchen/gh-projects/talkflow/node_modules/playwright/index.mjs";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const BASE = process.argv[2] || "http://127.0.0.1:5180";
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
        const d = await p.evaluate(() => ({
          h1: document.querySelector(".word-detail h1")?.textContent?.trim(),
          hook: document.querySelector(".word-detail-hook p")?.textContent?.length > 10,
          method: !!document.querySelector(".word-detail-method-tag"),
          examples: document.querySelectorAll(".word-detail-examples li").length,
          combine: !!document.querySelector(".word-detail-combine-text"),
          visual: !!(document.querySelector(".word-detail-img, .word-detail-op-visual svg")),
          empty: !!document.querySelector(".word-detail--empty"),
        }));
        if (d.empty || d.h1 !== w || !d.hook || !d.method || d.examples < 2 || !d.combine || !d.visual) {
          failures.push({ w, ...d });
        }
      } catch (e) {
        failures.push({ w, error: e.message });
      } finally {
        await p.close();
      }
    })
  );
  process.stderr.write(`${Math.min(i + BATCH, WORDS.length)}/${WORDS.length}\n`);
}

// alias routes
for (const [alias, canon] of [["i", "I"], ["behaviour", "behavior"], ["colour", "color"]]) {
  const p = await ctx.newPage();
  await p.goto(`${BASE}/word/${alias}`, { waitUntil: "domcontentloaded" });
  const h1 = await p.locator(".word-detail h1").textContent();
  if (h1 !== canon) failures.push({ w: alias, expected: canon, got: h1 });
  await p.close();
}

// grid scroll
const page = await ctx.newPage();
await page.goto(`${BASE}/doc/words?tab=all`, { waitUntil: "domcontentloaded" });
await page.evaluate(async () => {
  for (let i = 0; i < 30; i++) {
    window.scrollBy(0, 800);
    await new Promise((r) => setTimeout(r, 100));
  }
});
await page.waitForTimeout(2000);
const grid = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll(".word-card-img")];
  return {
    cards: document.querySelectorAll(".word-card").length,
    broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
    loaded: imgs.filter((i) => i.naturalWidth > 0).length,
  };
});

console.log(JSON.stringify({
  total: WORDS.length,
  detailFailures: failures.length,
  failures: failures.slice(0, 10),
  grid,
  passRate: ((WORDS.length - failures.length) / WORDS.length * 100).toFixed(2) + "%",
}, null, 2));
await browser.close();
