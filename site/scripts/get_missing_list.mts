import { WORDS } from "../src/words850";
import { TRAINING_SENTENCES } from "../src/practice/trainingData";
import * as fs from "fs";
import * as path from "path";

const missingList: { word: string; needed: number; tier: string }[] = [];
let totalNeeded = 0;

for (const w of WORDS) {
  const re = new RegExp(`\\b${w.w.toLowerCase()}\\b`, "i");
  const count = TRAINING_SENTENCES.filter((s) => re.test(s.sentence || "")).length;
  if (count < 3) {
    const needed = 3 - count;
    missingList.push({ word: w.w, needed, tier: w.t });
    totalNeeded += needed;
  }
}

fs.writeFileSync(
  path.resolve("scripts/missing_words.json"),
  JSON.stringify(missingList, null, 2),
  "utf8"
);

console.log(`Total words needing padding: ${missingList.length}`);
console.log(`Total sentences needed: ${totalNeeded}`);
