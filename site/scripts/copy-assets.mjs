import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/assets");

const copies = [
  ["02-vocabulary/ogdens-basic-english-850.pdf", "ogdens-basic-english-850.pdf"],
  ["02-vocabulary/basic-english-850.txt", "basic-english-850.txt"],
  ["04-practice/english-through-pictures-book1.pdf", "english-through-pictures-book1.pdf"],
  ["reference/begr-1937.html", "begr-1937.html"],
  ["reference/mirrors/books-catalog.html", "books-catalog.html"],
  ["01-foundations/operators_spatial_concept.png", "operators_spatial_concept.png"],
  ["01-foundations/playbook_roadmap.png", "playbook_roadmap.png"],
];

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });
  let n = 0;
  for (const name of fs.readdirSync(srcDir)) {
    if (!name.endsWith(".mp3")) continue;
    fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
    n++;
  }
  return n;
}

fs.mkdirSync(out, { recursive: true });

for (const [src, dest] of copies) {
  const from = path.join(root, src);
  const to = path.join(out, dest);
  if (!fs.existsSync(from)) {
    console.warn(`skip missing: ${src}`);
    continue;
  }
  fs.copyFileSync(from, to);
  console.log(`copied ${src} → public/assets/${dest}`);
}

const audioN = copyDir(path.join(root, "02-vocabulary/audio"), path.join(out, "audio"));
if (audioN) console.log(`copied ${audioN} pronunciation mp3 → public/assets/audio/`);

const wordImgSrc = path.join(root, "02-vocabulary/word-img");
const wordImgDest = path.join(out, "word-img");
if (fs.existsSync(wordImgSrc)) {
  fs.mkdirSync(wordImgDest, { recursive: true });
  let n = 0;
  for (const name of fs.readdirSync(wordImgSrc)) {
    if (!/\.(jpg|jpeg|png|svg|webp)$/i.test(name)) continue;
    fs.copyFileSync(path.join(wordImgSrc, name), path.join(wordImgDest, name));
    n++;
  }
  if (n) console.log(`copied ${n} word images → public/assets/word-img/`);
}
