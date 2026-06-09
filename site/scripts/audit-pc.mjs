#!/usr/bin/env node
import { createRequire } from "module";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const require = createRequire(new URL("file:///Users/cuijianchen/gh-projects/talkflow/package.json"));
const { chromium } = require("playwright");

const BASE = process.argv[2] || "http://localhost:5175";
const OUT = "/tmp/ogden-audit-pc";
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "1440", w: 1440, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
];

const PAGES = [
  ["home", "/"],
  ["words-things", "/doc/words?tab=things"],
  ["words-pic", "/doc/words?tab=pic"],
  ["word-act", "/word/act"],
  ["operators", "/doc/operators"],
  ["grammar", "/doc/grammar"],
  ["practice-lab", "/practice/lab"],
  ["practice-sbs", "/practice/step-by-step/body"],
];

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const ctx = browser.contexts()[0];
const page = ctx.pages()[0] ?? (await ctx.newPage());
const report = [];

for (const vp of VIEWPORTS) {
  await page.setViewportSize({ width: vp.w, height: vp.h });
  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(500);
    const m = await page.evaluate(() => {
      const main = document.querySelector(".main");
      const grid = document.querySelector(".word-grid");
      const imgs = [...document.querySelectorAll(".word-card-img")].slice(0, 20);
      const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0 && !i.src?.endsWith(".svg")).length;
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 4;
      const mainRect = main?.getBoundingClientRect();
      const gridH = grid?.getBoundingClientRect().height ?? 0;
      const gridMax = grid ? getComputedStyle(grid).maxHeight : "";
      return {
        mainW: Math.round(mainRect?.width ?? 0),
        mainClass: main?.className ?? "",
        contentW: Math.round(document.querySelector(".explorer, .doc, .practice-page, .word-detail")?.getBoundingClientRect().width ?? 0),
        gridCols: grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0,
        gridH: Math.round(gridH),
        gridMaxH: gridMax,
        brokenImgs20: broken,
        overflowX: overflow,
        scrollW: document.documentElement.scrollWidth,
        vw: window.innerWidth,
      };
    });
    const shot = join(OUT, `${name}-${vp.name}.png`);
    await page.screenshot({ path: shot });
    report.push({ page: name, vp: vp.name, ...m, shot });
    const ok = !m.overflowX && m.brokenImgs20 === 0 && (m.gridMaxH === "none" || !grid);
    console.log(`${ok ? "OK" : "!!"} ${name}@${vp.name} main=${m.mainW} content=${m.contentW} cols=${m.gridCols} gridH=${m.gridH} broken=${m.brokenImgs20}`);
  }
}

writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2));
await browser.close();
