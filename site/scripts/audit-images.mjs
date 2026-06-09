#!/usr/bin/env node
import { createRequire } from "module";
const require = createRequire(new URL("file:///Users/cuijianchen/gh-projects/talkflow/package.json"));
const { chromium } = require("playwright");

const BASE = "https://ogden-basic-english-omega.vercel.app";
const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const page = (await browser.contexts()[0].pages()[0]) || await browser.contexts()[0].newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(BASE + "/doc/words?tab=things", { waitUntil: "networkidle", timeout: 60000 });

const result = await page.evaluate(async () => {
  const imgs = [...document.querySelectorAll(".word-card-img")].slice(0, 30);
  await Promise.all(imgs.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((res) => { img.onload = res; img.onerror = res; });
  }));
  return imgs.map((img) => ({
    src: img.getAttribute("src")?.slice(0, 60),
    nw: img.naturalWidth,
    nh: img.naturalHeight,
    ok: img.naturalWidth > 0 || img.src?.endsWith(".svg"),
  }));
});

const broken = result.filter((r) => !r.ok);
console.log("sample", result.length, "broken", broken.length);
console.log(JSON.stringify(result.slice(0, 8), null, 2));
if (broken.length) console.log("BROKEN", broken);

await page.screenshot({ path: "/tmp/ogden-audit/things-check.png" });
await browser.close();
