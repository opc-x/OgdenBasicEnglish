import * as fs from "fs";
import * as path from "path";

const filePath = path.resolve("src/practice/trainingData.ts");
const content = fs.readFileSync(filePath, "utf8");

const lines = content.split("\n");
const jsonLines: string[] = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('{"id":') || (trimmed.startsWith('{') && trimmed.includes('"id":'))) {
    let clean = trimmed;
    if (clean.endsWith(",")) {
      clean = clean.slice(0, -1);
    }
    jsonLines.push("  " + clean);
  }
}

const newContent = `// Auto-generated Ogden BE850 training data with Chinese translations
export type TrainingSentence = {
  id: number; step: number; type: string; sentence: string;
  zh?: string; operator?: string; direction?: string;
  noun?: string; replaces?: string; scene?: string; audio?: string;
};

const JSON_STR = \`[
${jsonLines.join(",\n")}
]\`;

export const TRAINING_SENTENCES: TrainingSentence[] = JSON.parse(JSON_STR);
`;

fs.writeFileSync(filePath, newContent, "utf8");
console.log("Successfully converted trainingData.ts to JSON string layout!");
