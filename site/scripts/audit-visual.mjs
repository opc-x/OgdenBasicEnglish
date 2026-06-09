#!/usr/bin/env node
import { chromium } from "/Users/cuijianchen/gh-projects/talkflow/node_modules/playwright/index.mjs";

const BASE = process.argv[2] || "http://127.0.0.1:5180";
const SHOTS = [
  { path: "/doc/words?tab=all", file: "/tmp/ag-ok-grid-all.png" },
  { path: "/doc/words?tab=pic", file: "/tmp/ag-ok-grid-pic.png" },
  { path: "/doc/words?tab=things", file: "/tmp/ag-ok-grid-things.png" },
  { path: "/word/dog", file: "/tmp/ag-ok-dog.png" },
  { path: "/word/come", file: "/tmp/ag-ok-come.png" },
  { path: "/word/attention", file: "/tmp/ag-ok-attention.png" },
  { path: "/word/good", file: "/tmp/ag-ok-good.png" },
  { path: "/word/because", file: "/tmp/ag-ok-because.png" },
  { path: "/word/apple", file: "/tmp/ag-ok-apple.png" },
  { path: "/word/behavior", file: "/tmp/ag-ok-behavior.png" },
];

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const ctx = browser.contexts()[0];
const page = await ctx.newPage();

for (const s of SHOTS) {
  await page.goto(BASE + s.path, { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: s.file, fullPage: s.path.includes("/word/"), timeout: 15000 });
  console.log("ok", s.file);
}

// click 讲解 from dog search
await page.goto(`${BASE}/doc/words?tab=pic&q=dog`, { waitUntil: "domcontentloaded" });
await page.locator(".word-link").first().click();
await page.waitForURL(/\/word\/dog/);
await page.screenshot({ path: "/tmp/ag-ok-click-dog.png", fullPage: true, timeout: 15000 });
console.log("click flow ok");

await browser.close();
