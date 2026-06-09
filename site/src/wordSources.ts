import type { Tier } from "./words850";
import { isOperator } from "./words850";

/** Ogden 850 词表原文分类（words.html） */
export const OGDEN_TIER: Record<
  Tier,
  { title: string; subtitle: string; sourceNote: string }
> = {
  ops: {
    title: "OPERATIONS",
    subtitle: "100 words",
    sourceNote: "Operators, pronouns, prepositions, conjunctions, adverbs — Ogden word list § Operations.",
  },
  pic: {
    title: "THINGS — Picturable",
    subtitle: "200 words",
    sourceNote: "Concrete nouns Ogden marked as drawable; picture set (.agr illustrations on Wikimedia).",
  },
  things: {
    title: "THINGS — General",
    subtitle: "400 words",
    sourceNote: "General nouns in Ogden's second Things class.",
  },
  qual: {
    title: "QUALITIES — General",
    subtitle: "100 words",
    sourceNote: "Descriptive adjectives in Ogden's Qualities class.",
  },
  opp: {
    title: "QUALITIES — Opposites",
    subtitle: "50 words",
    sourceNote: "Opposite-pair adjectives in Ogden's Qualities class.",
  },
};

export function fixImageUrl(url: string): string {
  return url.replace(/\/200px-/g, "/120px-");
}

export function ogdenSourceLinks(word: string, tier: Tier) {
  const wiktionary = `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`;
  const wordsList = "https://zbenglish.net/sites/basic/words.html";
  const alpha = "https://zbenglish.net/sites/basic/wordalph.html";
  const links: { label: string; url: string; note?: string }[] = [
    { label: "Ogden 850 词表（原序）", url: wordsList, note: "zbenglish 镜像" },
    { label: "Ogden 850 词表（字母序）", url: alpha },
    { label: "Wiktionary 词条", url: wiktionary, note: "释义与例句" },
  ];
  if (isOperator(word)) {
    links.unshift({
      label: "begr-1937 · Verb-Elimination",
      url: "https://zbenglish.net/sites/basic/begr.html#verb",
      note: "18 operator 原文",
    });
  }
  if (tier === "pic") {
    links.unshift({
      label: "Ogden 可画图词表",
      url: "https://zbenglish.net/sites/basic/words.html",
      note: "Picturable 200 · 配图来自 Basic English 插图集",
    });
  }
  return links;
}
