import { TRAINING_SENTENCES, type TrainingSentence } from "../src/practice/trainingData";
import * as fs from "fs";
import * as path from "path";

const dataPath = path.resolve("scripts/new_sentences_data.json");

if (!fs.existsSync(dataPath)) {
  console.error("new_sentences_data.json not found!");
  process.exit(1);
}

const newSentences: any[] = JSON.parse(fs.readFileSync(dataPath, "utf8"));
console.log(`Loaded ${newSentences.length} new sentences.`);

const existingTexts = new Set(TRAINING_SENTENCES.map(s => s.sentence.toLowerCase().trim()));
let maxId = Math.max(...TRAINING_SENTENCES.map(s => s.id));
if (maxId < 0) maxId = 0;

const mergedList = [...TRAINING_SENTENCES];
let addedCount = 0;

for (const s of newSentences) {
  const normalizedText = s.sentence.toLowerCase().trim();
  if (existingTexts.has(normalizedText)) {
    continue;
  }

  maxId++;
  const mergedSentence: TrainingSentence = {
    id: maxId,
    step: s.step,
    type: s.type,
    sentence: s.sentence,
    zh: s.zh,
    operator: s.operator,
    direction: s.direction,
    noun: s.noun,
    replaces: s.replaces,
    audio: `/audio/sentences/${maxId}.mp3`
  };

  mergedList.push(mergedSentence);
  existingTexts.add(normalizedText);
  addedCount++;
}

console.log(`Added ${addedCount} new unique sentences. Total count is now ${mergedList.length}.`);

// Write back to trainingData.ts
const lines: string[] = [
  "// Auto-generated Ogden BE850 training data with Chinese translations",
  "export type TrainingSentence = {",
  "  id: number; step: number; type: string; sentence: string;",
  "  zh?: string; operator?: string; direction?: string;",
  "  noun?: string; replaces?: string; scene?: string; audio?: string;",
  "};",
  "",
  "export const TRAINING_SENTENCES: TrainingSentence[] = ["
];

for (const s of mergedList) {
  lines.push(`  ${JSON.stringify(s)},`);
}

lines.push("];");

fs.writeFileSync(
  path.resolve("src/practice/trainingData.ts"),
  lines.join("\n") + "\n",
  "utf8"
);
console.log("Successfully wrote merged trainingData.ts");
