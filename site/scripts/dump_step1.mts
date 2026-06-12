import { TRAINING_SENTENCES } from "../src/practice/trainingData";
import * as fs from "fs";

const step1 = TRAINING_SENTENCES.filter(s => s.step === 1);
const output = step1.map(s => `${s.id}\t${s.operator}+${s.direction}\t${s.sentence}\t${s.zh}\t${s.replaces}`).join("\n");
fs.writeFileSync("step1_dump.txt", output);
console.log(`Dumped ${step1.length} sentences to step1_dump.txt`);
