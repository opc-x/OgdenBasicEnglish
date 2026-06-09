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

/* ── 例句语义解析 ── */
const ROLE_OP = new Set([
  ...OPERATORS,
  "comes", "goes", "puts", "takes", "gives", "gets", "sends", "keeps", "lets",
  "makes", "does", "sees", "says", "seems", "is", "am", "are", "was", "were", "has", "had", "did", "came", "went",
]);
const ROLE_DIR = new Set([
  "about", "across", "after", "against", "among", "at", "before", "between", "by",
  "down", "from", "in", "off", "on", "over", "through", "to", "under", "up", "with",
  "out", "back", "away", "forward", "here", "there", "north", "south", "east", "west",
]);
const ROLE_DET = new Set(["a", "an", "the", "my", "your", "his", "her", "its", "our", "their", "more", "much", "some", "all", "any", "every", "other", "such", "one", "two"]);
const ROLE_NEG = new Set(["not", "no"]);
const ROLE_PRON = new Set(["i", "he", "she", "it", "we", "you", "they", "me", "him", "her", "us", "them", "who", "this", "that"]);
const ROLE_CONJ = new Set(["and", "or", "but", "if", "because", "than", "as", "when", "where", "while", "though", "so", "for"]);
const ROLE_ADJ_EXTRA = new Set(["ready", "better", "longer", "hungry", "later", "important"]);
const ROLE_N_EXTRA = new Set([
  "book", "books", "key", "cake", "hat", "letter", "picture", "look", "school", "rule", "fact",
  "judge", "man", "men", "money", "friends", "people", "street", "wall", "window", "door",
  "houses", "side", "bed", "tea", "milk", "bread", "water", "food", "rain", "day", "test", "one",
]);

function roleOf(tokenRaw) {
  const t = tokenRaw.toLowerCase().replace(/[.,!?;:'"—·]/g, "");
  if (!t) return "misc";
  if (ROLE_OP.has(t)) return "op";
  if (ROLE_NEG.has(t)) return "neg";
  if (ROLE_DIR.has(t)) return "dir";
  if (ROLE_PRON.has(t)) return "pron";
  if (ROLE_DET.has(t)) return "det";
  if (ROLE_CONJ.has(t)) return "conj";
  if (QUAL_WORDS.has(t) || OPP_WORDS.has(t) || ROLE_ADJ_EXTRA.has(t)) return "adj";
  if (PIC_WORDS.has(t) || THINGS_WORDS.has(t) || ROLE_N_EXTRA.has(t) || PIC_WORDS.has(t.replace(/s$/, "")) || THINGS_WORDS.has(t.replace(/s$/, ""))) return "n";
  return "misc";
}

/** 句子 → {en, cn, parts:[[chunk, role]]}；冠词/限定词并入后面的名词块 */
function S(en, cn) {
  const tokens = en.split(/\s+/);
  const parts = [];
  let pendingDet = null;
  for (const tok of tokens) {
    const r = roleOf(tok);
    if (r === "det") {
      pendingDet = pendingDet ? `${pendingDet} ${tok}` : tok;
      continue;
    }
    const text = pendingDet ? `${pendingDet} ${tok}` : tok;
    pendingDet = null;
    parts.push([text, r]);
  }
  if (pendingDet) parts.push([pendingDet, "det"]);
  return { en, cn, parts };
}

const OP_DATA = {
  come: { concept: "身体朝说话人/观察点移动。", equation: "come + in = 进来", examples: [["Come in.", "进来。"], ["Come back.", "回来。"]] },
  go: { concept: "身体离开当前位置向外移动。", equation: "go + out = 出去", examples: [["Go out.", "出去。"], ["Go back.", "回去。"]] },
  put: { concept: "手持物体并使其在某处安放。", equation: "put + down = 放下", examples: [["Put it down.", "把它放下。"], ["Put on your hat.", "戴上你的帽子。"]] },
  take: { concept: "伸手握住物体并使之脱离原位。", equation: "take + out = 拿出去", examples: [["Take it out.", "把它拿出去。"], ["Take my hand.", "抓住我的手。"]] },
  give: { concept: "将自己持有的东西传递给对方。", equation: "give + back = 归还", examples: [["Give it back.", "把它还回来。"], ["Give me the book.", "把书给我。"]] },
  get: { concept: "接收、得到某物，或进入某种状态。", equation: "get + in = 进来", examples: [["Get in.", "进来/上车。"], ["Get the key.", "去拿钥匙。"]] },
  send: { concept: "借助媒介将物品或信息送往远处。", equation: "send + out = 发出", examples: [["Send a letter.", "寄一封信。"], ["Send it back.", "把它退回去。"]] },
  keep: { concept: "维持其现有位置或状态不跑掉。", equation: "keep + out = 挡在外面", examples: [["Keep it.", "留着它。"], ["Keep out.", "别进来。"]] },
  let: { concept: "撤销阻碍，放任通行。", equation: "let + in = 放进来", examples: [["Let me in.", "让我进去。"], ["Let go.", "放手。"]] },
  make: { concept: "动手改造原材料，塑造出新形态。", equation: "make + ready = 准备好", examples: [["Make a cake.", "做一个蛋糕。"], ["Make it clean.", "把它弄干净。"]] },
  do: { concept: "执行活动过程，关注动作本身。", equation: "do + again = 再做", examples: [["Do your work.", "做你的事。"], ["Do it again.", "再做一次。"]] },
  see: { concept: "视觉器官接收外界光波信号。", equation: "see + clearly = 看清", examples: [["I see a dog.", "我看见一只狗。"], ["See the picture.", "看这张图。"]] },
  say: { concept: "将思想转化为声波输出。", equation: "say + again = 再说", examples: [["Say yes.", "说「好」。"], ["Say it again.", "再说一遍。"]] },
  be: { concept: "静态地存在于某处或某种性质中。", equation: "be + in = 在里面", examples: [["Be quiet.", "安静。"], ["I am here.", "我在这里。"]] },
  have: { concept: "占有某物或正经历某种状态。", equation: "have + a look = 看一眼", examples: [["I have a book.", "我有一本书。"], ["Have a look.", "看一眼。"]] },
  seem: { concept: "感官呈现的样子，不一定是实情。", equation: "seem + like = 好像", examples: [["It seems good.", "看起来不错。"], ["You seem tired.", "你看起来累了。"]] },
  may: { concept: "表示许可或推测可能发生。", equation: "may + be = 也许是", examples: [["You may go.", "你可以走了。"], ["It may rain.", "可能要下雨。"]] },
  will: { concept: "表示将要发生或主观意愿。", equation: "will + go = 将去", examples: [["I will go.", "我会去。"], ["Will you help?", "你愿意帮忙吗？"]] },
};

/* 方向词例句（en + cn） */
const PREP_SENT = {
  about: [["Go about the town.", "在城里到处走。"], ["Say something about it.", "说说关于它的事。"]],
  across: [["Go across the street.", "过马路。"], ["Put it across the line.", "把它横放过线。"]],
  after: [["Come after me.", "跟在我后面来。"], ["Go after the dog.", "去追那只狗。"]],
  against: [["Put it against the wall.", "把它靠墙放。"], ["He is against the idea.", "他反对这个想法。"]],
  among: [["Go among the people.", "走进人群中。"], ["Be among friends.", "在朋友们中间。"]],
  at: [["Be at the door.", "在门口。"], ["See him at school.", "在学校见到他。"]],
  before: [["Go before me.", "走在我前面。"], ["Come before night.", "天黑前来。"]],
  between: [["Be between two houses.", "在两座房子之间。"], ["Put it between the books.", "把它放在书之间。"]],
  by: [["Go by the house.", "从房子旁经过。"], ["Be by the window.", "在窗边。"]],
  down: [["Go down.", "下去。"], ["Put it down.", "把它放下。"]],
  from: [["Come from the house.", "从房子那边来。"], ["Take it from him.", "从他那里拿走。"]],
  in: [["Be in the house.", "在房子里。"], ["Put it in the box.", "把它放进盒子。"]],
  off: [["Take it off.", "把它脱下来。"], ["Get off the train.", "下火车。"]],
  on: [["Put it on the table.", "把它放在桌上。"], ["Put on your coat.", "穿上你的外套。"]],
  over: [["Go over the bridge.", "过桥。"], ["Come over here.", "过来这边。"]],
  through: [["Go through the door.", "穿过这道门。"], ["See through the window.", "透过窗户看。"]],
  to: [["Go to school.", "去学校。"], ["Give it to me.", "把它给我。"]],
  under: [["Go under the bridge.", "从桥下过。"], ["Be under the table.", "在桌子下面。"]],
  up: [["Go up.", "上去。"], ["Take it up.", "把它拿起来。"]],
  with: [["Come with me.", "跟我来。"], ["Do it with care.", "小心地做。"]],
};

/* 连接词例句 */
const CONJ_SENT = {
  and: [["I have bread and milk.", "我有面包和牛奶。"], ["He and I go together.", "他和我一起去。"]],
  or: [["Tea or milk?", "茶还是牛奶？"], ["Go now or go later.", "现在走，或者晚点走。"]],
  but: [["It is small but strong.", "它很小，但很结实。"], ["I go, but he keeps here.", "我走，但他留在这里。"]],
  if: [["If you go, I will go.", "如果你去，我就去。"], ["If it is wet, keep in the house.", "如果下雨，就待在屋里。"]],
  because: [["I go to bed because I am tired.", "我去睡觉，因为我累了。"], ["He is happy because he has food.", "他很开心，因为他有吃的。"]],
  than: [["This is longer than that.", "这个比那个长。"], ["He is taller than I.", "他比我高。"]],
  as: [["Do as I say.", "照我说的做。"], ["It is as good as new.", "它和新的一样好。"]],
  when: [["Come when you are ready.", "你准备好就来。"], ["When I come in, he goes out.", "我进来时他出去。"]],
  where: [["This is where I am.", "这就是我在的地方。"], ["Go where the sun is.", "去有太阳的地方。"]],
  while: [["Keep quiet while I say it.", "我说话时保持安静。"], ["He came while I was out.", "我外出时他来了。"]],
  though: [["Though it is hard, I will do it.", "虽然难，我也会做。"], ["He goes, though it is late.", "虽然晚了，他还是去。"]],
  so: [["I am tired, so I will go to bed.", "我累了，所以去睡觉。"], ["It is good, so take it.", "它很好，拿着吧。"]],
  for: [["This is for you.", "这是给你的。"], ["Take it for the journey.", "带上它路上用。"]],
  not: [["It is not cold.", "天不冷。"], ["Do not go.", "别去。"]],
  no: [["I have no time.", "我没有时间。"], ["No, it is not good.", "不，这不好。"]],
  yes: [["Yes, it is good.", "是的，很好。"], ["Say yes or no.", "说「是」还是「否」。"]],
};

/* 量词例句 */
const QUANT_SENT = {
  all: [["All men go.", "所有人都去。"], ["I have all of it.", "我全部都有。"]],
  any: [["Any man may go.", "任何人都可以去。"], ["I do not have any.", "我一个也没有。"]],
  some: [["Some men go.", "一些人去。"], ["I have some money.", "我有一些钱。"]],
  every: [["Every man goes.", "每个人都去。"], ["Every day is new.", "每天都是新的。"]],
  much: [["I have much work.", "我有很多活要做。"], ["There is not much time.", "时间不多了。"]],
  little: [["I have little time.", "我时间很少。"], ["Give me a little water.", "给我一点水。"]],
  enough: [["I have enough food.", "我有足够的食物。"], ["It is enough.", "够了。"]],
  other: [["The other man goes.", "另一个人去。"], ["Give me the other one.", "把另一个给我。"]],
  such: [["Such men are good.", "这样的人是好人。"], ["I have no such book.", "我没有这样的书。"]],
  only: [["Only one man goes.", "只有一个人去。"], ["It is only a test.", "这只是个测试。"]],
};

/* 其余功能词例句 */
const OPS_SENT = {
  a: [["A book is on the table.", "桌上有一本书。"], ["Give me a hand.", "帮我一把。"]],
  the: [["The book is here.", "那本书在这里。"], ["Take the key.", "拿上那把钥匙。"]],
  of: [["The top of the box.", "盒子的顶部。"], ["A friend of mine.", "我的一个朋友。"]],
  till: [["Keep it till tomorrow.", "把它留到明天。"], ["Be here till night.", "待到晚上。"]],
  how: [["How do you do it?", "你是怎么做到的？"], ["See how it goes.", "看看进展如何。"]],
  why: [["Why do you go?", "你为什么要走？"], ["This is why I came.", "这就是我来的原因。"]],
  again: [["Do it again.", "再做一次。"], ["Come again tomorrow.", "明天再来。"]],
  ever: [["It is better than ever.", "比以往任何时候都好。"], ["Did you ever see it?", "你见过它吗？"]],
  far: [["It is far from here.", "离这里很远。"], ["Do not go far.", "别走远。"]],
  near: [["The school is near.", "学校很近。"], ["Come near the fire.", "靠近火一点。"]],
  forward: [["Go forward.", "向前走。"], ["Put it forward.", "把它往前放。"]],
  here: [["Come here.", "过来。"], ["I am here.", "我在这里。"]],
  there: [["Go there.", "去那边。"], ["The book is there.", "书在那边。"]],
  now: [["Do it now.", "现在就做。"], ["He is here now.", "他现在在这里。"]],
  then: [["First this, then that.", "先这个，再那个。"], ["I was young then.", "那时我还年轻。"]],
  out: [["Go out.", "出去。"], ["Take it out.", "把它拿出去。"]],
  still: [["Keep still.", "保持不动。"], ["He is still here.", "他还在这里。"]],
  together: [["We go together.", "我们一起走。"], ["Put them together.", "把它们放在一起。"]],
  well: [["He does it well.", "他做得很好。"], ["All is well.", "一切都好。"]],
  almost: [["It is almost full.", "几乎满了。"], ["I am almost ready.", "我差不多准备好了。"]],
  even: [["Even a boy may do it.", "连男孩都能做。"], ["It is even better.", "甚至更好。"]],
  quite: [["It is quite good.", "相当好。"], ["I am quite ready.", "我完全准备好了。"]],
  very: [["It is very good.", "非常好。"], ["He is very tall.", "他非常高。"]],
  tomorrow: [["Come tomorrow.", "明天来。"], ["Tomorrow is a new day.", "明天是新的一天。"]],
  yesterday: [["He came yesterday.", "他昨天来的。"], ["Yesterday was cold.", "昨天很冷。"]],
  north: [["Go north.", "往北走。"], ["The wind is from the north.", "风从北边来。"]],
  south: [["Go south.", "往南走。"], ["The birds go south.", "鸟儿南飞。"]],
  east: [["The sun comes up in the east.", "太阳从东方升起。"], ["Go east.", "往东走。"]],
  west: [["The sun goes down in the west.", "太阳在西边落下。"], ["Go west.", "往西走。"]],
  please: [["Come in, please.", "请进。"], ["Please give it to me.", "请把它给我。"]],
  i: [["I see it.", "我看见它了。"], ["I will go.", "我会去。"]],
  he: [["He sees it.", "他看见它了。"], ["He will go.", "他会去。"]],
  you: [["You see it.", "你看见它了。"], ["You may go.", "你可以走了。"]],
  who: [["Who is there?", "谁在那里？"], ["Who has the key?", "钥匙在谁那里？"]],
  this: [["This is good.", "这个很好。"], ["Take this.", "拿着这个。"]],
  that: [["That is a dog.", "那是一只狗。"], ["Give me that.", "把那个给我。"]],
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
      sentences: d.examples.map(([en, c]) => S(en, c)),
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
      sentences: (PREP_SENT[word] || []).map(([en, c]) => S(en, c)),
      combine: `come ${word} · go ${word} · put ${word} · take ${word}`,
      opposite: opp,
      ogdenTip: "见 01-foundations/directions-prepositions.md",
    };
  }

  if (tier === "ops" && (PRONOUNS.has(word) || word === "I")) {
    const sent = OPS_SENT[word.toLowerCase()] || [[`${word.charAt(0).toUpperCase() + word.slice(1)} see it.`, `${chinese}看见它。`], [`${word.charAt(0).toUpperCase() + word.slice(1)} will go.`, `${chinese}会去。`]];
    return {
      hook: `指着说话的人或物：${chinese}（${word}）。`,
      method: "Ops · 代词",
      concept: "Ogden 保留最少代词，句子里用 I/you/he + operator 就能说清谁在做什么。",
      equation: `${word} + operator + noun`,
      sentences: sent.map(([en, c]) => S(en, c)),
      combine: `${word} + see/go/have/make…`,
      opposite: null,
      ogdenTip: "代词不占 850 名额外的词，与 operator 直接搭配。",
    };
  }

  if (tier === "ops" && CONJ.has(word)) {
    const sent = CONJ_SENT[word] || [];
    return {
      hook: `连接两个想法：${chinese}（${word}）。`,
      method: "Ops · 连接词",
      concept: `用 ${word} 把两个 BE850 短句接起来，不必用复杂从句结构。`,
      equation: `句子 A + ${word} + 句子 B`,
      sentences: sent.map(([en, c]) => S(en, c)),
      combine: `短句 + ${word} + 短句`,
      opposite: null,
      ogdenTip: "语法骨架见 01-foundations/grammar-rules.md",
    };
  }

  if (tier === "ops" && QUANT.has(word)) {
    const sent = QUANT_SENT[word] || [[`I have ${word} of it.`, `我有${chinese}。`], [`Take ${word}.`, `拿${chinese}。`]];
    return {
      hook: `数量/范围：${chinese}（${word}）。`,
      method: "Ops · 量词",
      concept: "BE850 用 all/some/much 等少量词表达数量，避免 numerous/abundant。",
      equation: `${word} + noun`,
      sentences: sent.map(([en, c]) => S(en, c)),
      combine: `${word} + 名词`,
      opposite: null,
      ogdenTip: "量词修饰名词，不单独成句。",
    };
  }

  if (tier === "ops") {
    const sent = OPS_SENT[word.toLowerCase()] || [[`It is ${word}.`, `它是${chinese}。`], [`Say it with "${word}".`, `用 ${word} 造个短句。`]];
    return {
      hook: `骨架词：${chinese}（${word}）—— 撑起句子的功能词。`,
      method: "Ops · 功能词",
      concept: "Ogden 第 1 类（Operators + 方向 + 功能词）是句子的乘法基础，850 词里这一层最少但最关键。",
      equation: `${word} + operator / noun`,
      sentences: sent.map(([en, c]) => S(en, c)),
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
      sentences: [
        S(`I see ${a} ${noun}.`, `我看见${chinese}。`),
        S(`This is ${a} ${noun}.`, `这是${chinese}。`),
        S(`The ${noun} is on the table.`, `${chinese}在桌子上。`),
      ],
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
      sentences: (() => {
        const art = /^[aeiou]/i.test(word) ? "an" : "a";
        return [
          S(`This is ${art} ${word} book.`, `这是一本${chinese.replace(/的$/, "")}的书。`),
          S(`He is ${art} ${word} man.`, `他是个${chinese.replace(/的$/, "")}的人。`),
          S(`It is very ${word}.`, `它非常${chinese.replace(/的$/, "")}。`),
        ];
      })(),
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
      sentences: [
        S(`It is ${word}, not ${opp || "the other"}.`, `它是${chinese.replace(/的$/, "")}的，不是${opp ? cn(opp).replace(/的$/, "") : "相反"}的。`),
        S(`This side is ${word}.`, `这一面是${chinese.replace(/的$/, "")}的。`),
      ],
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
    attention: [["Give attention to the book.", "把注意力放在书上。"], ["He gives attention to it.", "他在专心做这件事。"], ["Do not give attention to that.", "别理那个。"]],
    decision: [["Make a decision.", "做个决定。"], ["This is a hard decision.", "这是个艰难的决定。"], ["He made a good decision.", "他做了个好决定。"]],
    knowledge: [["I have knowledge of this.", "我了解这件事。"], ["He has no knowledge of it.", "他对此一无所知。"], ["Give knowledge to them.", "把知识传授给他们。"]],
    question: [["I have a question.", "我有一个问题。"], ["Give an answer to the question.", "回答这个问题。"], ["That is a good question.", "那是个好问题。"]],
    answer: [["Give an answer.", "给出回答。"], ["This is the answer.", "这就是答案。"], ["I have no answer.", "我没有答案。"]],
    work: [["Do your work.", "做你的工作。"], ["This is hard work.", "这是件苦差事。"], ["He has much work.", "他有很多活要干。"]],
    time: [["I have no time.", "我没有时间。"], ["This is a good time.", "现在是个好时机。"], ["Give me more time.", "再给我点时间。"]],
  };
  const cnNoun = chinese.replace(/[（(].*$/, "").trim();
  const defaultSentences = [
    [`I have ${word}.`, `我有${cnNoun}。`],
    [`Give ${word} to him.`, `把${cnNoun}给他。`],
    [`This ${word} is important.`, `这个${cnNoun}很重要。`],
  ];

  return {
    hook: thingHooks[word] || `${chinese} —— BE850 用一个名词 ${word} 承载这个概念。`,
    method: "General Things · 抽象事物 400",
    concept: "Ogden 第 2 类：不用复杂动词（decide, consider, attend），改用 operator + 抽象名词。这是 BE850 能覆盖日常英语的关键乘法。",
    equation: `have ${word} · give ${word} · make ${word}`,
    sentences: (thingSentences[word] || defaultSentences).map(([en, c]) => S(en, c)),
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
