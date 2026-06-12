import { TRAINING_SENTENCES } from "../src/practice/trainingData";

const step1 = TRAINING_SENTENCES.filter(s => s.step === 1);
console.log(`Total step 1 sentences: ${step1.length}`);

const comboReplaces = new Map<string, Set<string>>();
for (const s of step1) {
  const key = `${s.operator}+${s.direction}`;
  if (!comboReplaces.has(key)) comboReplaces.set(key, new Set());
  if (s.replaces) comboReplaces.get(key)!.add(s.replaces);
}

console.log("Combo replaces sets:");
for (const [key, reps] of comboReplaces.entries()) {
  if (reps.size > 0) {
    console.log(`  ${key}: [${Array.from(reps).join(", ")}] (count: ${reps.size})`);
  }
}
