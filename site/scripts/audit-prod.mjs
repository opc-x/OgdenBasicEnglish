#!/usr/bin/env node
import { chromium } from "/Users/cuijianchen/gh-projects/talkflow/node_modules/playwright/index.mjs";

const PROD = process.argv[2] || "https://ogden-basic-english-omega.vercel.app";
const SAMPLES = ["dog", "come", "attention", "good", "apple", "behavior"];

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();
const results = [];

for (const w of SAMPLES) {
  await page.goto(`${PROD}/word/${w}`, { waitUntil: "networkidle", timeout: 60000 });
  const d = await page.evaluate(() => ({
    hook: document.querySelector(".word-detail-hook p")?.textContent?.trim()?.slice(0, 40),
    method: document.querySelector(".word-detail-method-tag")?.textContent?.trim(),
    examples: document.querySelectorAll(".word-detail-examples li").length,
    visual: !!(document.querySelector(".word-detail-img, .word-detail-op-visual svg")),
    imgOk: (() => {
      const img = document.querySelector(".word-detail-img");
      return !img || (img.complete && img.naturalWidth > 0);
    })(),
    h1: document.querySelector(".word-detail h1")?.textContent,
  }));
  results.push({ w, ...d, ok: !!(d.hook && d.method && d.examples >= 2 && d.visual) });
}

await page.goto(`${PROD}/doc/words?tab=pic`, { waitUntil: "networkidle" });
await page.waitForSelector(".word-card");
const grid = await page.evaluate(() => ({
  cards: document.querySelectorAll(".word-card").length,
  broken: [...document.querySelectorAll(".word-card-img")].filter((i) => i.complete && i.naturalWidth === 0).length,
}));
await page.screenshot({ path: "/tmp/ag-prod-pic.png" });

console.log(JSON.stringify({ prod: PROD, results, grid, allOk: results.every((r) => r.ok) }, null, 2));
await browser.close();
