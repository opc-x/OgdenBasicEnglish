#!/usr/bin/env node
/**
 * 为 850 词生成 Ogden 方法论详解 → site/src/word-guides.json
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPO = join(__dirname, "../..");

const words850Src = readFileSync(join(ROOT, "src/words850.ts"), "utf8");
const annotations = JSON.parse(readFileSync(join(ROOT, "src/word-annotations.json"), "utf8"));

function extractList(name) {
  const m = words850Src.match(new RegExp(`const ${name} =\\s*\\n?\\s*"([^"]+)"`));
  return m ? m[1].split(/,\s*/) : [];
}

const OPERATORS = new Set([
  "come", "go", "put", "take", "give", "get", "send", "keep", "let",
  "make", "do", "see", "say", "be", "have", "seem", "may", "will",
]);

const opsSection = words850Src.match(/const OPS_RAW[^]*?\];/)?.[0] || "";
const OPS_WORDS = [...opsSection.matchAll(/w:\s*"([^"]+)"/g)].map((m) => m[1].toLowerCase());
const PIC_WORDS = new Set(extractList("PIC_WORDS"));
const THINGS_WORDS = new Set(extractList("THINGS_WORDS"));
const QUAL_WORDS = new Set(extractList("QUAL_WORDS"));
const OPP_WORDS = new Set(extractList("OPP_WORDS"));

const OPPOSITE_PAIRS = {
  bad: "good", good: "bad",
  short: "long", long: "short",
  white: "black", black: "white",
  wrong: "right", right: "wrong",
  cold: "warm", warm: "cold",
  wet: "dry", dry: "wet",
  awake: "sleep", sleep: "awake",
  dead: "living", living: "dead",
  open: "shut", shut: "open",
  full: "empty", empty: "full",
  up: "down", down: "up",
  in: "out", out: "in",
  on: "off", off: "on",
  over: "under", under: "over",
  before: "after", after: "before",
  first: "last", last: "first",
  same: "different", different: "same",
  near: "far", far: "near",
  thick: "thin", thin: "thick",
  hard: "soft", soft: "hard",
  loud: "quiet", quiet: "loud",
  slow: "quick", quick: "slow",
  high: "low", low: "high",
  tight: "loose", loose: "tight",
  true: "false", false: "true",
  male: "female", female: "male",
  young: "old", old: "young",
  fat: "thin",
  sweet: "acid", acid: "sweet",
};

/** 方向词 — 摘自 01-foundations/directions-prepositions.md */
const PREP_GUIDES = {
  about: { geo: "环绕中心点多向分布", ex: ["go about (到处走)", "talk about (谈论)"] },
  across: { geo: "从一侧横跨到另一侧", ex: ["go across the street", "put across"] },
  after: { geo: "在时空轴后方/之后", ex: ["go after", "come after"] },
  against: { geo: "靠着或逆着受力", ex: ["put against the wall", "go against"] },
  among: { geo: "在三个及以上物体之中", ex: ["go among the people", "be among friends"] },
  at: { geo: "时空坐标上的精确点", ex: ["be at the door", "get at"] },
  before: { geo: "在时空轴前方/之前", ex: ["go before", "come before the judge"] },
  between: { geo: "两点之间的缝隙", ex: ["be between two houses", "put between"] },
  by: { geo: "靠近参照物旁侧", ex: ["go by", "be by the window"] },
  down: { geo: "沿重力方向向下", ex: ["go down", "put down"] },
  from: { geo: "离开起点向外", ex: ["come from", "go from"] },
  in: { geo: "在容器/边界内部", ex: ["be in the house", "put in"] },
  off: { geo: "脱离接触面", ex: ["take off", "get off"] },
  on: { geo: "在接触面上方", ex: ["put on", "be on the table"] },
  over: { geo: "在上方跨过", ex: ["go over", "come over"] },
  through: { geo: "穿过内部通道", ex: ["go through", "get through"] },
  to: { geo: "朝向目标点", ex: ["go to", "give to"] },
  under: { geo: "在下方被覆盖", ex: ["go under", "be under"] },
  up: { geo: "逆重力向上", ex: ["go up", "take up"] },
  with: { geo: "与…一起/用…手段", ex: ["go with", "do with"] },
};

const PRONOUNS = new Set(["i", "he", "she", "it", "we", "you", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "their", "this", "that", "these", "those", "who", "what", "which"]);
const CONJ = new Set(["and", "or", "but", "if", "because", "than", "as", "when", "where", "while", "though", "so", "for", "not", "no", "yes"]);
const QUANT = new Set(["all", "any", "some", "every", "each", "much", "many", "more", "most", "less", "few", "little", "enough", "other", "another", "such", "only", "both", "half", "part"]);

const OP_DATA = {
  come: { concept: "身体朝说话人/观察点移动。", equation: "come + in = 进来", examples: ["Come in.", "Come back."] },
  go: { concept: "身体离开当前位置向外移动。", equation: "go + out = 出去", examples: ["Go out.", "Go back."] },
  put: { concept: "手持物体并使其在某处安放。", equation: "put + down = 放下", examples: ["Put it down.", "Put on your hat."] },
  take: { concept: "伸手握住物体并使之脱离原位。", equation: "take + out = 拿出去", examples: ["Take it out.", "Take my hand."] },
  give: { concept: "将自己持有的东西传递给对方。", equation: "give + back = 归还", examples: ["Give it back.", "Give me the book."] },
  get: { concept: "接收、得到某物，或进入某种状态。", equation: "get + in = 进来", examples: ["Get in.", "Get the key."] },
  send: { concept: "借助媒介将物品或信息送往远处。", equation: "send + out = 发出", examples: ["Send a letter.", "Send it back."] },
  keep: { concept: "维持其现有位置或状态不跑掉。", equation: "keep + out = 挡在外面", examples: ["Keep it.", "Keep out."] },
  let: { concept: "撤销阻碍，放任通行。", equation: "let + in = 放进来", examples: ["Let me in.", "Let go."] },
  make: { concept: "动手改造原材料，塑造出新形态。", equation: "make + ready = 准备好", examples: ["Make a cake.", "Make it clean."] },
  do: { concept: "执行活动过程，关注动作本身。", equation: "do + again = 再做", examples: ["Do your work.", "Do it again."] },
  see: { concept: "视觉器官接收外界光波信号。", equation: "see + clearly = 看清", examples: ["I see a dog.", "See the picture."] },
  say: { concept: "将思想转化为声波输出。", equation: "say + again = 再说", examples: ["Say yes.", "Say it again."] },
  be: { concept: "静态地存在于某处或某种性质中。", equation: "be + in = 在里面", examples: ["Be quiet.", "I am here."] },
  have: { concept: "占有某物或正经历某种状态。", equation: "have + a look = 看一眼", examples: ["I have a book.", "Have a look."] },
  seem: { concept: "感官呈现的样子，不一定是实情。", equation: "seem + like = 好像", examples: ["It seems good.", "You seem tired."] },
  may: { concept: "表示许可或推测可能发生。", equation: "may + be = 也许是", examples: ["You may go.", "It may rain."] },
  will: { concept: "表示将要发生或主观意愿。", equation: "will + go = 将去", examples: ["I will go.", "Will you help?"] },
};

function tierOf(word) {
  if (OPERATORS.has(word)) return "operator";
  if (OPS_WORDS.includes(word)) return "ops";
  if (PIC_WORDS.has(word)) return "pic";
  if (THINGS_WORDS.has(word)) return "things";
  if (QUAL_WORDS.has(word)) return "qual";
  if (OPP_WORDS.has(word)) return "opp";
  return "things";
}

function cn(word) {
  return annotations[word]?.cn || word;
}

function guideFor(word) {
  const tier = tierOf(word);
  const chinese = cn(word);
  const opp = OPPOSITE_PAIRS[word] ?? null;

  if (tier === "operator") {
    const d = OP_DATA[word];
    const moveTip =
      word === "come" || word === "go"
        ? "与方向词相乘：come/go + in/out/back 取代 enter/leave/return。"
        : "Ogden 动词消除：这一个 operator 配名词或方向，覆盖一整类复杂说法。";
    return {
      hook: `指着动作本身：${chinese} —— BE850 用这一个词取代一整类复杂动词。`,
      method: "Operator · 18 个动作根",
      concept: `${d.concept} ${moveTip}`,
      equation: d.equation,
      sentences: d.examples,
      combine: `Operator + 方向/名词：${d.equation}`,
      opposite: null,
      ogdenTip: "见 01-foundations/operators-18.md · 18 × 方向 = 上千动词",
    };
  }

  if (tier === "ops" && PREP_GUIDES[word]) {
    const p = PREP_GUIDES[word];
    return {
      hook: `空间几何：${chinese} —— ${p.geo}。`,
      method: "Direction · 方向/介词",
      concept: `BE850 把 ${word} 当作物理矢量：与 18 个 Operator 相乘，取代 attend/arrive/enter 等复杂动词。`,
      equation: `Operator + ${word}`,
      sentences: p.ex,
      combine: `come ${word} · go ${word} · put ${word} · take ${word}`,
      opposite: opp,
      ogdenTip: "见 01-foundations/directions-prepositions.md",
    };
  }

  if (tier === "ops" && PRONOUNS.has(word)) {
    return {
      hook: `指着说话的人或物：${chinese}（${word}）。`,
      method: "Ops · 代词",
      concept: "Ogden 保留最少代词，句子里用 I/you/he + operator 就能说清谁在做什么。",
      equation: `${word} + operator + noun`,
      sentences: [`${word.charAt(0).toUpperCase() + word.slice(1)} see it.`, `${word.charAt(0).toUpperCase() + word.slice(1)} will go.`],
      combine: `${word} + see/go/have/make…`,
      opposite: null,
      ogdenTip: "代词不占 850 名额外的词，与 operator 直接搭配。",
    };
  }

  if (tier === "ops" && CONJ.has(word)) {
    return {
      hook: `连接两个想法：${chinese}（${word}）。`,
      method: "Ops · 连接词",
      concept: `用 ${word} 把两个 BE850 短句接起来，不必用复杂从句结构。`,
      equation: `句子 A ${word} 句子 B`,
      sentences: word === "because" ? ["I go because I am tired.", "He is happy because he has food."] : [`I see it ${word} you see it.`, `Go ${word} stay — pick one.`],
      combine: `短句 + ${word} + 短句`,
      opposite: null,
      ogdenTip: "语法骨架见 01-foundations/grammar-rules.md",
    };
  }

  if (tier === "ops" && QUANT.has(word)) {
    return {
      hook: `数量/范围：${chinese}（${word}）。`,
      method: "Ops · 量词",
      concept: "BE850 用 all/some/much 等少量词表达数量，避免 numerous/abundant。",
      equation: `${word} + noun`,
      sentences: [`${word.charAt(0).toUpperCase() + word.slice(1)} men go.`, `I have ${word} money.`],
      combine: `${word} + 名词`,
      opposite: null,
      ogdenTip: "量词修饰名词，不单独成句。",
    };
  }

  if (tier === "ops") {
    return {
      hook: `骨架词：${chinese}（${word}）—— 撑起句子的功能词。`,
      method: "Ops · 功能词",
      concept: "Ogden 第 1 类（Operators + 方向 + 功能词）是句子的乘法基础，850 词里这一层最少但最关键。",
      equation: `${word} + operator / noun`,
      sentences: [`… ${word} …`, `Use ${word} in a short sentence.`],
      combine: `与 operator、名词组合造句`,
      opposite: opp,
      ogdenTip: "见 02-vocabulary/tier-guide.md 第 1 层",
    };
  }

  if (tier === "pic") {
    const noun = word === "fowl" ? "bird" : word;
    const a = /^[aeiou]/i.test(noun) ? "an" : "a";
    return {
      hook: `指着就能说：${chinese} —— 这就是 ${word}。`,
      method: "Picturable · 可画图 200",
      concept: "Ogden 第 3 类：能看见、能指、能拍照的名词。学的时候先认图，再记拼写；不用背抽象定义。",
      equation: `see ${a} ${noun} · have ${a} ${noun}`,
      sentences: [`I see ${a} ${noun}.`, `This is ${a} ${noun}.`, `The ${noun} is on the table.`],
      combine: `see/have/put/take + ${noun} · ${noun} + is + qual`,
      opposite: null,
      ogdenTip: "English Through Pictures 即用此类词建立视觉-语言映射",
    };
  }

  if (tier === "qual") {
    const pair = opp ? `，反义是 ${cn(opp)}（${opp}）` : "";
    return {
      hook: `形容「${chinese}」—— 放在名词前面${pair}。`,
      method: "Quality · 性质 100",
      concept: "Ogden 第 4 类：直接修饰名词。a good book, a long road。程度用 more/most，不用 complicated。",
      equation: `${word} + noun`,
      sentences: [`a ${word} book`, `a ${word} man`, `It is very ${word}.`],
      combine: `a ${word} + 名词 · be ${word} · seem ${word}`,
      opposite: opp,
      ogdenTip: "性质词 + 200 picturable 名词 = 大量具体描述",
    };
  }

  if (tier === "opp") {
    const pair = opp ? `${cn(opp)}（${opp}）` : "其反义 qual 词";
    return {
      hook: `与 ${pair} 成对 —— ${chinese}（${word}）。`,
      method: "Opposite · 反义 50",
      concept: "Ogden 第 5 类：把常见反义单独列出，与第 4 类性质词对照记忆，秒懂对比。",
      equation: `${word} ↔ ${opp || "?"}`,
      sentences: [`It is ${word}, not ${opp || "the other"}.`, `The ${word} side · the ${opp || "other"} side`],
      combine: `not ${word} · ${word} and not ${opp || "…"}`,
      opposite: opp,
      ogdenTip: "反义对记忆：一次记两个，效率翻倍",
    };
  }

  // things — 抽象名词，用 operator + noun 替代复杂动词
  const thingHooks = {
    act: "做一件事 —— 不说 perform，说 do an act。",
    addition: "加出来的结果 —— 不说 calculate，说 make an addition。",
    attention: "心思放在某处 —— 不说 focus，说 give attention to …。",
    decision: "做出选择 —— 不说 decide，说 make a decision。",
    knowledge: "脑子里有的东西 —— have knowledge of …。",
    love: "心里的感情 —— have love for …。",
    time: "钟表上的刻度 —— 一切事件发生的背景。",
    work: "付出劳动 —— do work，不说 labor。",
    fear: "心里的害怕 —— have fear of …。",
    hope: "心里的盼望 —— have hope for …。",
    memory: "过去留在脑里 —— have a memory of …。",
    question: "问出来的东西 —— make a question。",
    answer: "回应 —— give an answer。",
    change: "变掉的状态 —— make a change。",
    order: "排好的次序 —— give an order。",
  };
  const thingSentences = {
    attention: ["Give attention to the book.", "He gives attention to it.", "Do not give attention to that."],
    decision: ["Make a decision.", "This is a hard decision.", "I have no decision."],
    knowledge: ["I have knowledge of this.", "He has no knowledge of it.", "Give knowledge to them."],
    question: ["Make a question.", "I have a question.", "Give an answer to the question."],
    answer: ["Give an answer.", "This is the answer.", "I have no answer."],
    work: ["Do work.", "This is hard work.", "He has much work."],
    time: ["I have no time.", "This is a good time.", "Give me more time."],
  };
  const defaultSentences = [
    `Give ${word} to this.`,
    `I have ${word}.`,
    `This ${word} is important.`,
  ];

  return {
    hook: thingHooks[word] || `${chinese} —— BE850 用一个名词 ${word} 承载这个概念。`,
    method: "General Things · 抽象事物 400",
    concept: "Ogden 第 2 类：不用复杂动词（decide, consider, attend），改用 operator + 抽象名词。这是 BE850 能覆盖日常英语的关键乘法。",
    equation: `have ${word} · give ${word} · make ${word}`,
    sentences: thingSentences[word] || defaultSentences,
    combine: `give/have/make/take + ${word} · ${word} + of + noun`,
    opposite: opp,
    ogdenTip: "见 reference/begr-1937.md — 动词消除（verb elimination）",
  };
}

// canonical 850（与 words850.ts BASE_WORDS 一致，不用 annotations 里的英式重复键）
const CANONICAL = [
  ...OPS_WORDS.map((w) => ({ w, tier: tierOf(w) })),
  ...[...PIC_WORDS].map((w) => ({ w, tier: "pic" })),
  ...[...THINGS_WORDS].map((w) => ({ w, tier: "things" })),
  ...[...QUAL_WORDS].map((w) => ({ w, tier: "qual" })),
  ...[...OPP_WORDS].map((w) => ({ w, tier: "opp" })),
];

const guides = {};
for (const { w } of CANONICAL) {
  guides[w] = guideFor(w);
}

writeFileSync(join(ROOT, "src/word-guides.json"), JSON.stringify(guides, null, 0));
console.log(`word-guides.json: ${Object.keys(guides).length} entries (canonical)`);
