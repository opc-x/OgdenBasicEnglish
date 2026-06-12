import { analyzeSentence } from "../src/practice/be850Lexicon";
import * as fs from "fs";
import * as path from "path";

const dataPath = path.resolve("scripts/new_sentences_data.json");

if (!fs.existsSync(dataPath)) {
  console.log("No new_sentences_data.json file found yet.");
  process.exit(0);
}

const newSentences = JSON.parse(fs.readFileSync(dataPath, "utf8"));
console.log(`Loaded ${newSentences.length} sentences to validate.`);

let failures = 0;
for (let i = 0; i < newSentences.length; i++) {
  const s = newSentences[i];
  const analysis = analyzeSentence(s.sentence);
  if (analysis.score !== 100) {
    failures++;
    console.error(`Validation Failure at index ${i} (word: ${s.noun || s.direction || "unknown"}):`);
    console.error(`  Sentence: "${s.sentence}"`);
    console.error(`  Score: ${analysis.score}`);
    console.error(`  Violations:`, analysis.tokens.filter(t => t.status === "violation"));
  }
}

if (failures === 0) {
  console.log(`All ${newSentences.length} sentences successfully validated! 0 failures.`);
} else {
  console.error(`Validation complete. Found ${failures} failures.`);
  process.exit(1);
}
