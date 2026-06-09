#!/usr/bin/env node
/**
 * 全站审计：配图加载 + PC 视口布局
 */
import { createRequire } from "module";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const require = createRequire(
  new URL("file:///Users/cuijianchen/gh-projects/talkflow/package.json")
);
const { chromium } = require("playwright");

const BASE = process.argv[2] || "https://ogden-basic-english-omega.vercel.app";
const OUT = "/tmp/ogden-audit";
mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: "home", path: "/" },
  { name: "words-things", path: "/doc/words?tab=things" },
  { name: "words-pic", path: "/doc/words?tab=pic" },
  { name: "word-act", path: "/word/act?tab=things" },
  { name: "operators", path: "/doc/operators" },
  { name: "grammar", path: "/doc/grammar" },
  { name: "practice-lab", path: "/practice/lab" },
  { name: "words-search", path: "/words" },
];

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const ctx = browser.contexts()[0] ?? (await browser.newContext({ viewport: { width: 1440, height: 900 } }));
let page = ctx.pages().find((p) => p.url().includes("ogden")) ?? (await ctx.newPage());
await page.setViewportSize({ width: 1440, height: 900 });

const report = [];

for (const { name, path } of PAGES) {
  const url = BASE + path;
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);

  const metrics = await page.evaluate(() => {
    const main = document.querySelector(".main") ?? document.querySelector("main") ?? document.body;
    const mainRect = main.getBoundingClientRect();
    const imgs = [...document.querySelectorAll(".word-card-img, .word-detail-img")];
    const broken = imgs.filter((img) => {
      if (!img.complete || img.naturalWidth === 0) return true;
      return false;
    }).length;
    const overflowX = document.documentElement.scrollWidth > window.innerWidth + 2;
    const mainTooWide = mainRect.width > window.innerWidth - 320;
    const mainTooNarrow = mainRect.width < 480 && window.innerWidth > 1000;
    const grid = document.querySelector(".word-grid");
    const cardW = grid?.firstElementChild?.getBoundingClientRect().width ?? 0;
    return {
      vw: window.innerWidth,
      mainW: Math.round(mainRect.width),
      mainPad: getComputedStyle(main).paddingLeft,
      brokenImgs: broken,
      totalWordImgs: imgs.length,
      overflowX,
      mainTooWide,
      mainTooNarrow,
      cardW: Math.round(cardW),
      hScroll: document.documentElement.scrollWidth,
    };
  });

  const shot = join(OUT, `${name}-1440.png`);
  await page.screenshot({ path: shot, fullPage: false });
  report.push({ name, url, ...metrics, shot });
  console.log(JSON.stringify({ name, ...metrics }));
}

writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log("REPORT", join(OUT, "report.json"));
await browser.close();
