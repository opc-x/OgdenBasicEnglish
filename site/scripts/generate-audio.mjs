#!/usr/bin/env node
/** 用 edge-tts en-GB-SoniaNeural 生成 850 词发音 MP3 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const audioDir = path.join(root, "02-vocabulary/audio");
const edgeTts = path.join(__dirname, ".venv-tts/bin/edge-tts");
const VOICE = "en-GB-SoniaNeural";

const words = fs
  .readFileSync(path.join(root, "02-vocabulary/basic-english-850.txt"), "utf8")
  .trim()
  .split(/\s+/);

function slug(word) {
  return word.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "word";
}

async function generate(word) {
  const file = path.join(audioDir, `${slug(word)}.mp3`);
  if (fs.existsSync(file) && !process.argv.includes("--all")) return "skip";
  await execFileAsync(edgeTts, ["--voice", VOICE, "--text", word, "--write-media", file]);
  return "ok";
}

fs.mkdirSync(audioDir, { recursive: true });

let ok = 0;
let skip = 0;
let fail = 0;

for (const word of words) {
  try {
    const r = await generate(word);
    if (r === "skip") skip++;
    else {
      ok++;
      process.stdout.write(`\r✓ ${ok} generated (${word})`);
    }
  } catch (e) {
    fail++;
    console.error(`\n✗ ${word}:`, e.message);
  }
}

console.log(`\nDone: ${ok} generated, ${skip} skipped, ${fail} failed → ${audioDir}`);
