/**
 * 把词表配图落到 public/assets/word-img/，JSON 只存本地路径。
 * 外链图下载到本地；data URI 解码为 .svg 文件（大幅减小 JS 包）。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ANN_PATH = join(__dirname, "../src/word-annotations.json");
const OUT_DIR = join(__dirname, "../../02-vocabulary/word-img");
const UA = "OgdenBasicEnglish/1.0 (image-mirror)";

mkdirSync(OUT_DIR, { recursive: true });

const ann = JSON.parse(readFileSync(ANN_PATH, "utf8"));
const SPELLING = { behavior: "behaviour", color: "colour", harbor: "harbour", humor: "humour" };

async function download(url, dest) {
  const r = await fetch(url.replace(/\/200px-/g, "/120px-"), {
    headers: { "User-Agent": UA, Referer: "https://ogden-basic-english-omega.vercel.app/" },
    redirect: "follow",
  });
  if (!r.ok) return false;
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(dest, buf);
  return true;
}

async function wikiThumb(word) {
  const r = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`,
    { headers: { "User-Agent": UA } }
  );
  if (!r.ok) return null;
  const j = await r.json();
  return j.thumbnail?.source?.replace(/\/(\d+)px-/, "/120px-") || null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let local = 0, fetched = 0, svgFile = 0, failed = 0;
const onlyMissing = process.argv.includes("--only-missing");
const tryWiki = !process.argv.includes("--no-wiki");

const retryHttp = process.argv.includes("--retry-http");
const words = Object.keys(ann);
for (let i = 0; i < words.length; i++) {
  const word = words[i];
  const entry = ann[word];
  let img = entry.img;
  if (retryHttp && !img?.startsWith("http")) continue;
  if (!img) {
    const alias = SPELLING[word];
    if (alias && ann[alias]?.img) img = ann[alias].img;
  }
  if (!img) { failed++; continue; }

  const jpgPath = join(OUT_DIR, `${word}.jpg`);
  const svgPath = join(OUT_DIR, `${word}.svg`);
  const localJpg = `/assets/word-img/${word}.jpg`;
  const localSvg = `/assets/word-img/${word}.svg`;

  if (onlyMissing && (existsSync(jpgPath) || existsSync(svgPath))) {
    entry.img = existsSync(jpgPath) ? localJpg : localSvg;
    local++;
    continue;
  }

  if (img.startsWith("data:image/svg+xml")) {
    const raw = decodeURIComponent(img.replace(/^data:image\/svg\+xml,/, ""));
    writeFileSync(svgPath, raw);
    entry.img = localSvg;
    svgFile++;
    continue;
  }

  if (img.startsWith("/assets/word-img/")) {
    local++;
    continue;
  }

  if (img.startsWith("http")) {
    await sleep(350);
    if (await download(img, jpgPath)) {
      entry.img = localJpg;
      fetched++;
    } else if (tryWiki) {
      await sleep(200);
      const thumb = await wikiThumb(word);
      if (thumb && (await download(thumb, jpgPath))) {
        entry.img = localJpg;
        fetched++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
    continue;
  }

  failed++;
  if ((i + 1) % 100 === 0) console.log(`  ${i + 1}/${words.length}`);
}

// 同步美式拼写别名
for (const [us, uk] of Object.entries(SPELLING)) {
  if (ann[uk] && !ann[us]) ann[us] = { ...ann[uk] };
  if (ann[us]?.img?.startsWith("/assets/") && ann[uk]) ann[uk].img = ann[us].img;
}

writeFileSync(ANN_PATH, JSON.stringify(ann, null, 2) + "\n");
console.log(`mirror done: fetched=${fetched} svgFiles=${svgFile} alreadyLocal=${local} failed=${failed}`);
console.log(`img dir: ${OUT_DIR}`);
