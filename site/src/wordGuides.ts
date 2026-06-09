import guides from "./word-guides.json";
import { normalizeWordKey } from "./words850";

export type WordGuide = {
  hook: string;
  method: string;
  concept: string;
  equation: string;
  sentences: string[];
  combine: string;
  opposite: string | null;
  ogdenTip: string;
};

const MAP = guides as Record<string, WordGuide>;

export function getWordGuide(word: string): WordGuide | undefined {
  const key = normalizeWordKey(word);
  return MAP[key] ?? MAP[key.toLowerCase()];
}
