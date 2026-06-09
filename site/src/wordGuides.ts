import guides from "./word-guides.json";
import { normalizeWordKey } from "./words850";

export type SentenceRole = "op" | "dir" | "n" | "adj" | "pron" | "det" | "conj" | "neg" | "misc";

export type GuideSentence = {
  en: string;
  cn: string;
  parts: [string, SentenceRole][];
};

export type WordGuide = {
  hook: string;
  method: string;
  concept: string;
  equation: string;
  sentences: GuideSentence[];
  combine: string;
  opposite: string | null;
  ogdenTip: string;
};

export const ROLE_META: Record<SentenceRole, { label: string; color: string }> = {
  op: { label: "Operator", color: "#b45309" },
  dir: { label: "方向", color: "#15803d" },
  n: { label: "名词", color: "#1d6fa5" },
  adj: { label: "性质", color: "#7e22ce" },
  pron: { label: "代词", color: "#be123c" },
  det: { label: "限定", color: "#6b7280" },
  conj: { label: "连接", color: "#0e7490" },
  neg: { label: "否定", color: "#dc2626" },
  misc: { label: "", color: "#6b6258" },
};

const MAP = guides as Record<string, WordGuide>;

export function getWordGuide(word: string): WordGuide | undefined {
  const key = normalizeWordKey(word);
  return MAP[key] ?? MAP[key.toLowerCase()];
}
