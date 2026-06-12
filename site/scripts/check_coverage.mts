import { WORDS } from "../src/words850";
import { TRAINING_SENTENCES } from "../src/practice/trainingData";

const counts = [0, 0, 0, 0]; // 0, 1, 2, 3+
let neededToMin3 = 0;

for (const w of WORDS) {
  const re = new RegExp(`\\b${w.w.toLowerCase()}\\b`, "i");
  const count = TRAINING_SENTENCES.filter((s) => re.test(s.sentence || "")).length;
  if (count === 0) {
    counts[0]++;
    neededToMin3 += 3;
  } else if (count === 1) {
    counts[1]++;
    neededToMin3 += 2;
  } else if (count === 2) {
    counts[2]++;
    neededToMin3 += 1;
  } else {
    counts[3]++;
  }
}

console.log(`Words with 0 sentences: ${counts[0]}`);
console.log(`Words with 1 sentence: ${counts[1]}`);
console.log(`Words with 2 sentences: ${counts[2]}`);
console.log(`Words with 3+ sentences: ${counts[3]}`);
console.log(`Total sentences needed to bring ALL words to at least 3 sentences: ${neededToMin3}`);
