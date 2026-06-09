#!/usr/bin/env node
/** 从 Free Dictionary API 拉英式 IPA，写入 word-annotations.json */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/word-annotations.json");

const words = fs
  .readFileSync(path.join(__dirname, "../../02-vocabulary/basic-english-850.txt"), "utf8")
  .trim()
  .split(/\s+/);

function pickBrIpa(phonetics) {
  if (!phonetics?.length) return null;
  const withUkAudio = phonetics.find((p) => p.audio && /-uk\.mp3|gb|british/i.test(p.audio) && p.text);
  if (withUkAudio) return cleanIpa(withUkAudio.text);
  const brMarkers = phonetics.filter((p) => p.text && /əʊ|ɒ|ɑː|ɪə|ʊə|ˈ/i.test(p.text) && !/oʊ/.test(p.text));
  if (brMarkers.length) return cleanIpa(brMarkers[0].text);
  const any = phonetics.find((p) => p.text);
  return any ? cleanIpa(any.text) : null;
}

function cleanIpa(text) {
  return text.replace(/^\/|\/$/g, "").replace(/^\[|\]$/g, "").trim();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const annotations = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : {};

for (const word of words) {
  if (annotations[word]?.ipa && !process.argv.includes("--all")) continue;
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) {
      await sleep(120);
      continue;
    }
    const data = await res.json();
    const ipa = pickBrIpa(data[0]?.phonetics);
    if (ipa) annotations[word] = { ...(annotations[word] ?? {}), ipa };
    process.stdout.write(`\r${Object.keys(annotations).length}/${words.length} ${word}`);
    await sleep(150);
  } catch {
  }
}

fs.writeFileSync(out, JSON.stringify(annotations, null, 2) + "\n");
console.log(`\nWrote ${Object.keys(annotations).length} entries → ${out}`);
