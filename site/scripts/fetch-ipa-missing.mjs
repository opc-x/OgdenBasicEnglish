#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/word-annotations.json");
const annotations = JSON.parse(fs.readFileSync(out, "utf8"));

const words = fs
  .readFileSync(path.join(__dirname, "../../02-vocabulary/basic-english-850.txt"), "utf8")
  .trim()
  .split(/\s+/)
  .filter((w) => !annotations[w]?.ipa);

function pickBrIpa(phonetics) {
  if (!phonetics?.length) return null;
  const uk = phonetics.find((p) => p.audio && /-uk\.mp3/i.test(p.audio) && p.text);
  if (uk) return cleanIpa(uk.text);
  const br = phonetics.find((p) => p.text && /ɒ|əʊ|ɑː|ɪə|ʊə/.test(p.text) && !/oʊ/.test(p.text));
  if (br) return cleanIpa(br.text);
  const any = phonetics.find((p) => p.text);
  return any ? cleanIpa(any.text) : null;
}

function cleanIpa(text) {
  return text.replace(/^\/|\/$/g, "").replace(/^\[|\]$/g, "").trim();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let added = 0;

for (const word of words) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) {
      await sleep(300);
      continue;
    }
    const data = await res.json();
    const ipa = pickBrIpa(data[0]?.phonetics);
    if (ipa) {
      annotations[word] = { ...(annotations[word] ?? {}), ipa };
      added++;
    }
    process.stdout.write(`\r+${added} remaining ${words.length - added - (words.indexOf(word))}`);
    await sleep(200);
  } catch {
    await sleep(500);
  }
}

fs.writeFileSync(out, JSON.stringify(annotations, null, 2) + "\n");
console.log(`\nAdded ${added}, total ${Object.keys(annotations).filter((k) => annotations[k].ipa).length}`);
