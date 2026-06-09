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
  ["01-foundations/operators_spatial_concept.png", "operators_spatial_concept.png"],
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
