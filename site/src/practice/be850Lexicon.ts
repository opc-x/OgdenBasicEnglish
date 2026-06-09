import { OPERATOR_WORDS, WORDS, isOperator } from "../words850";

const CORE = new Set(WORDS.map((w) => w.w));

/** operator 常见变位（仍算合规） */
const OPERATOR_FORMS = new Set([
  "am", "is", "are", "was", "were", "been", "being",
  "does", "did", "done", "doing",
  "has", "had", "having",
  "goes", "went", "gone", "going",
  "comes", "came", "coming",
  "gets", "got", "getting",
  "gives", "gave", "given", "giving",
  "puts", "putting",
  "takes", "took", "taken", "taking",
  "makes", "made", "making",
  "keeps", "kept", "keeping",
  "lets", "letting",
  "seems", "seemed", "seeming",
  "says", "said", "saying",
  "sees", "saw", "seen", "seeing",
  "sends", "sent", "sending",
  "will", "would", "may", "might", "can", "could",
]);

/** 语法规则 §10 · 国际通用词（节选） */
const INTERNATIONAL = new Set([
  "radio", "hotel", "taxi", "telephone", "telegram", "cinema", "club", "coffee",
  "college", "dance", "engine", "gas", "infant", "linen", "milk", "park", "passenger",
  "petrol", "program", "programme", "restaurant", "sport", "zoo",
]);

/** 常见「普通动词」→ operator 拼法提示 */
export const VERB_HINTS: Record<string, string> = {
  enter: "go in / come in",
  exit: "go out / get out",
  decide: "make a decision",
  postpone: "put off",
  continue: "go on",
  arrive: "come to",
  depart: "go from",
  remove: "take off / take away",
  assemble: "put together",
  discover: "make a discovery",
  understand: "have knowledge of",
  want: "have a desire for",
  need: "have a need for",
  read: "do reading",
  write: "do writing",
  eat: "have a meal / put food in mouth",
  drink: "take a drink",
  buy: "give money for",
  sell: "give for money",
  open: "make open",
  close: "make shut",
  start: "make a start",
  stop: "come to a stop",
  help: "give help",
  think: "have thoughts",
  know: "have knowledge",
  believe: "have a belief",
  remember: "have in memory",
  forget: "have no memory of",
  explain: "give an account of",
  describe: "give a description of",
};

export type TokenStatus = "operator" | "core" | "affix" | "intl" | "violation";

export type AnalyzedToken = {
  raw: string;
  normalized: string;
  status: TokenStatus;
  stem?: string;
  hint?: string;
};

function strip(token: string): string {
  return token.toLowerCase().replace(/^[("'[]+|[)"'\],.!?;:]+$/g, "");
}

function stemMatch(word: string): { ok: true; stem: string; affix?: string } | { ok: false } {
  if (CORE.has(word)) return { ok: true, stem: word };
  if (INTERNATIONAL.has(word)) return { ok: true, stem: word };

  if (word.startsWith("un") && word.length > 4 && CORE.has(word.slice(2))) {
    return { ok: true, stem: word.slice(2), affix: "un-" };
  }
  if (word.endsWith("ly") && word.length > 3 && CORE.has(word.slice(0, -2))) {
    return { ok: true, stem: word.slice(0, -2), affix: "-ly" };
  }
  if (word.endsWith("ing") && word.length > 4) {
    const base = word.slice(0, -3);
    if (CORE.has(base)) return { ok: true, stem: base, affix: "-ing" };
    if (CORE.has(base + "e")) return { ok: true, stem: base + "e", affix: "-ing" };
  }
  if (word.endsWith("ed") && word.length > 3) {
    const base = word.slice(0, -2);
    if (CORE.has(base)) return { ok: true, stem: base, affix: "-ed" };
    if (CORE.has(word.slice(0, -1))) return { ok: true, stem: word.slice(0, -1), affix: "-ed" };
  }
  if (word.endsWith("er") && word.length > 3 && CORE.has(word.slice(0, -2))) {
    return { ok: true, stem: word.slice(0, -2), affix: "-er" };
  }
  if (word.endsWith("es") && word.length > 3 && CORE.has(word.slice(0, -2))) {
    return { ok: true, stem: word.slice(0, -2), affix: "-es" };
  }
  if (word.endsWith("s") && word.length > 2 && CORE.has(word.slice(0, -1))) {
    return { ok: true, stem: word.slice(0, -1), affix: "-s" };
  }

  return { ok: false };
}

export function analyzeSentence(text: string): {
  tokens: AnalyzedToken[];
  score: number;
  be850Count: number;
  violationCount: number;
  operatorsUsed: string[];
} {
  const parts = text.split(/\s+/).filter(Boolean);
  const tokens: AnalyzedToken[] = [];
  const operatorsUsed = new Set<string>();
  let good = 0;

  for (const raw of parts) {
    const normalized = strip(raw);
    if (!normalized) continue;

    if (isOperator(normalized) || OPERATOR_FORMS.has(normalized)) {
      if (isOperator(normalized)) operatorsUsed.add(normalized);
      tokens.push({ raw, normalized, status: "operator", stem: normalized });
      good++;
      continue;
    }

    const m = stemMatch(normalized);
    if (m.ok) {
      const status: TokenStatus =
        m.stem && INTERNATIONAL.has(m.stem) ? "intl" : m.affix ? "affix" : "core";
      tokens.push({ raw, normalized, status, stem: m.stem, hint: m.affix });
      good++;
      continue;
    }

    tokens.push({
      raw,
      normalized,
      status: "violation",
      hint: VERB_HINTS[normalized] ?? "不在 850 词表内",
    });
  }

  const violationCount = tokens.filter((t) => t.status === "violation").length;
  const total = tokens.length;
  const score = total === 0 ? 0 : Math.round((good / total) * 100);

  return {
    tokens,
    score,
    be850Count: good,
    violationCount,
    operatorsUsed: [...operatorsUsed],
  };
}

export const BUILDER_CHIPS = {
  subject: ["I", "He", "She", "It", "We", "They", "The man", "My friend", "The woman"],
  operator: [...OPERATOR_WORDS.filter((o) => ["put", "take", "go", "get", "come", "give", "make", "is", "are", "do", "have"].includes(o))],
  direction: ["in", "on", "off", "out", "to", "from", "at", "by", "between", "over", "under", "with", "into"],
  object: ["the table", "the book", "the room", "the door", "my hand", "the pot", "a flower", "the train", "my friend", "the ticket"],
  tail: ["and", "not", "here", "there", "now"],
} as const;
