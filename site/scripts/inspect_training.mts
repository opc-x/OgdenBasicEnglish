import { WORDS } from "../src/words850";
import { TRAINING_SENTENCES } from "../src/practice/trainingData";

const qualWords = WORDS.filter(w => w.t === "qual");
const oppWords = WORDS.filter(w => w.t === "opp");

// Find existing sentences matching some qual or opp word in step 2
const qualSents = TRAINING_SENTENCES.filter(s => s.step === 2 && qualWords.some(w => new RegExp(`\\b${w.w}\\b`, 'i').test(s.sentence)));
const oppSents = TRAINING_SENTENCES.filter(s => s.step === 2 && oppWords.some(w => new RegExp(`\\b${w.w}\\b`, 'i').test(s.sentence)));

console.log("Qual match count in step 2:", qualSents.length);
if (qualSents.length > 0) {
  console.log("Qual samples:", JSON.stringify(qualSents.slice(0, 3), null, 2));
}

console.log("Opp match count in step 2:", oppSents.length);
if (oppSents.length > 0) {
  console.log("Opp samples:", JSON.stringify(oppSents.slice(0, 3), null, 2));
}
