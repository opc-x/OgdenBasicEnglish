/**
 * 修复配图：200px→120px、拼写别名、为 things 类 SVG 词重抓 Commons 图。
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ANN_PATH = join(__dirname, "../src/word-annotations.json");

const SPELLING = {
  behavior: "behaviour",
  color: "colour",
  harbor: "harbour",
  humor: "humour",
};

const UA = "OgdenBasicEnglish/1.0 (study; image-fix)";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function commonsThumb(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", `filetype:bitmap ${query}`);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url");
  url.searchParams.set("iiurlwidth", "120");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const j = await r.json();
  const pages = j.query?.pages;
  if (!pages) return null;
  const first = Object.values(pages)[0];
  return first?.imageinfo?.[0]?.thumburl || null;
}

async function wikiThumb(word) {
  const r = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`,
    { headers: { "User-Agent": UA } }
  );
  if (!r.ok) return null;
  const j = await r.json();
  if (!j.thumbnail?.source) return null;
  return j.thumbnail.source.replace(/\/(\d+)px-/, "/120px-");
}

async function ogdenAgr(word) {
  const cap = word.charAt(0).toUpperCase() + word.slice(1);
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${cap}.agr.jpg?width=120`;
  const r = await fetch(url, { method: "HEAD", headers: { "User-Agent": UA }, redirect: "follow" });
  if (r.ok && r.url.includes("upload.wikimedia.org")) return r.url;
  return null;
}

const ann = JSON.parse(readFileSync(ANN_PATH, "utf8"));

// 拼写别名
for (const [us, uk] of Object.entries(SPELLING)) {
  if (ann[uk] && !ann[us]) ann[us] = { ...ann[uk] };
}

let fixedPx = 0;
for (const v of Object.values(ann)) {
  if (v.img?.includes("/200px-")) {
    v.img = v.img.replace(/\/200px-/g, "/120px-");
    fixedPx++;
  }
}

const w850 = readFileSync(join(__dirname, "../src/words850.ts"), "utf8");
const things = w850.match(/const THINGS_WORDS[\s\S]*?"([^"]+)"/)[1].split(",").map((s) => s.trim());

const retrySvg = process.argv.includes("--retry-things");
let upgraded = 0;

if (retrySvg) {
  const targets = things.filter((w) => ann[w]?.img?.startsWith("data:"));
  console.log(`Retrying ${targets.length} things words with SVG...`);
  for (let i = 0; i < targets.length; i++) {
    const word = targets[i];
    let img =
      (await ogdenAgr(word)) ||
      (await wikiThumb(word)) ||
      (await commonsThumb(word));
    if (!img) {
      await sleep(80);
      img = await commonsThumb(`${word} photo`);
    }
    if (img) {
      ann[word].img = img;
      upgraded++;
    }
    if ((i + 1) % 40 === 0) console.log(`  ${i + 1}/${targets.length}`);
    await sleep(100);
  }
}

writeFileSync(ANN_PATH, JSON.stringify(ann, null, 2) + "\n");
console.log(`fixed ${fixedPx} broken 200px URLs, spelling aliases synced, upgraded ${upgraded} things images`);
