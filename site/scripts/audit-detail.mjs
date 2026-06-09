#!/usr/bin/env node
/** 用 antigravity CDP 审计词表配图 + 详解页 */
import { chromium } from "/Users/cuijianchen/gh-projects/talkflow/node_modules/playwright/index.mjs";
import { writeFileSync } from "fs";

const BASE = process.argv[2] || "http://127.0.0.1:5173";
const SAMPLES = ["dog", "come", "good", "bad", "attention", "about", "time"];

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const ctx = browser.contexts()[0] ?? (await browser.newContext());
let page = ctx.pages().find((p) => p.url().includes("5173")) ?? (await ctx.newPage());

const report = { base: BASE, words: [], grid: {} };

// 词表页
await page.goto(`${BASE}/doc/words`, { waitUntil: "networkidle", timeout: 30000 });
await page.bringToFront();
await page.screenshot({ path: "/tmp/ag-words-grid.png", fullPage: false });

const broken = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll(".word-card img, .word-grid img")];
  return imgs.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.alt || img.src);
});
const total = await page.evaluate(() => document.querySelectorAll(".word-card").length);
report.grid = { totalCards: total, brokenImages: broken };

// 各详解页
for (const w of SAMPLES) {
  await page.goto(`${BASE}/word/${w}`, { waitUntil: "networkidle", timeout: 30000 });
  const data = await page.evaluate(() => {
    const hook = document.querySelector(".word-detail-hook p")?.textContent?.trim();
    const method = document.querySelector(".word-detail-method-tag")?.textContent?.trim();
    const concept = document.querySelector(".word-detail-method p:not(.word-detail-method-tag):not(.word-detail-tip)")?.textContent?.trim();
    const examples = [...document.querySelectorAll(".word-detail-examples li span")].map((el) => el.textContent?.trim());
    const hasVisual = !!document.querySelector(".word-detail-img, .word-detail-op-visual svg, .word-detail-op-visual");
    const imgBroken = (() => {
      const img = document.querySelector(".word-detail-img");
      if (!img) return false;
      return !img.complete || img.naturalWidth === 0;
    })();
    const h1 = document.querySelector(".word-detail h1")?.textContent;
    return { hook, method, concept, examples, hasVisual, imgBroken, h1 };
  });
  await page.screenshot({ path: `/tmp/ag-word-${w}.png`, fullPage: true });
  report.words.push({ word: w, ...data, ok: !!(data.hook && data.method && data.hasVisual) });
}

writeFileSync("/tmp/ag-audit-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
