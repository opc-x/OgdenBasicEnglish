export type NavItem = {
  title: string;
  path: string;
  slug: string;
  phaseId: string;
  badge?: string;
};

export type NavPhase = {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  formula?: string;
  collapsed?: boolean;
};

export type AssetLink = {
  label: string;
  href: string;
  kind: "pdf" | "txt" | "html";
};

export const CORE_FORMULA =
  "850 词根 × operator × 方向 × 词缀 × 复合 = 日常英语";

export const LEARNING_PHASES: NavPhase[] = [
  {
    id: "map",
    step: "0",
    title: "先看地图",
    subtitle: "搞懂 Ogden 在干什么",
  },
  {
    id: "skeleton",
    step: "1",
    title: "搭骨架",
    subtitle: "没有普通动词，动作靠 operator 拼",
    formula: "operator × 方向 → 短语动词",
  },
  {
    id: "roots",
    step: "2",
    title: "装词根",
    subtitle: "850 五类分层，不是死背 850 个词",
    formula: "五类词根，分层装入",
  },
  {
    id: "multiply",
    step: "3",
    title: "开倍增",
    subtitle: "组合规则是 BE850 的灵魂",
    formula: "词根 × 组合 ≈ 日常 90%",
  },
  {
    id: "practice",
    step: "4",
    title: "练输出",
    subtitle: "在约束集里读和说",
  },
  {
    id: "reference",
    step: "·",
    title: "参考库",
    subtitle: "原文对照",
    collapsed: true,
  },
  {
    id: "agent",
    step: "·",
    title: "Agent",
    subtitle: "蒸馏 schema",
    collapsed: true,
  },
];

/** 主学习路径 + 附录，顺序即推荐阅读/翻页顺序 */
export const NAV: NavItem[] = [
  { phaseId: "map", title: "从这里开始", path: "00-START-HERE.md", slug: "start", badge: "第 1 步" },
  { phaseId: "map", title: "原始材料出处", path: "reference/sources.md", slug: "sources", badge: "核对" },
  { phaseId: "skeleton", title: "18 个 Operator", path: "01-foundations/operators-18.md", slug: "operators" },
  { phaseId: "skeleton", title: "方向词与介词", path: "01-foundations/directions-prepositions.md", slug: "directions" },
  { phaseId: "skeleton", title: "语法规则卡", path: "01-foundations/grammar-rules.md", slug: "grammar" },
  { phaseId: "roots", title: "分层学习指南", path: "02-vocabulary/tier-guide.md", slug: "tier-guide" },
  { phaseId: "roots", title: "850 词（Ogden 序）", path: "02-vocabulary/words-ogden-order.md", slug: "words" },
  { phaseId: "multiply", title: "短语动词", path: "03-composition/phrasal-verbs.md", slug: "phrasal" },
  { phaseId: "multiply", title: "词缀扩展", path: "03-composition/derivation-affixes.md", slug: "affixes" },
  { phaseId: "multiply", title: "复合词", path: "03-composition/compounds.md", slug: "compounds" },
  { phaseId: "practice", title: "阅读与练习", path: "04-practice/reading-list.md", slug: "practice" },
  { phaseId: "reference", title: "1937 Pamphlet 索引", path: "reference/begr-1937.md", slug: "begr" },
  { phaseId: "reference", title: "资源调研（中文）", path: "reference/survey-zh.md", slug: "survey" },
  { phaseId: "reference", title: "版权说明", path: "reference/copyright.md", slug: "copyright" },
  { phaseId: "agent", title: "Agent JSONL Schema", path: "05-distill/schema.md", slug: "distill" },
];

/** 主路径（不含参考库 / Agent）用于首页学习地图 */
export const MAIN_PHASE_IDS = ["map", "skeleton", "roots", "multiply", "practice"];

export const MAIN_NAV = NAV.filter((n) => MAIN_PHASE_IDS.includes(n.phaseId));

export const ASSETS: AssetLink[] = [
  { label: "850 词 PDF", href: "/assets/ogdens-basic-english-850.pdf", kind: "pdf" },
  { label: "850 词 TXT", href: "/assets/basic-english-850.txt", kind: "txt" },
  { label: "English Through Pictures · Book 1", href: "/assets/english-through-pictures-book1.pdf", kind: "pdf" },
  { label: "begr-1937 全文 HTML", href: "/assets/begr-1937.html", kind: "html" },
];

const modules = import.meta.glob<string>("../../**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function getMarkdown(path: string): string | null {
  const key = `../../${path}`;
  return modules[key] ?? null;
}

export function getNavBySlug(slug: string): NavItem | undefined {
  return NAV.find((n) => n.slug === slug);
}

export function getPhase(phaseId: string): NavPhase | undefined {
  return LEARNING_PHASES.find((p) => p.id === phaseId);
}

export function getPhaseItems(phaseId: string): NavItem[] {
  return NAV.filter((n) => n.phaseId === phaseId);
}

export function getStepIndex(slug: string): number {
  return NAV.findIndex((n) => n.slug === slug);
}

/** @deprecated use getPhase */
export const GROUPS = LEARNING_PHASES.map((p) => p.title);

export const PATH_TO_SLUG: Record<string, string> = {};
for (const item of NAV) {
  PATH_TO_SLUG[item.path] = item.slug;
  PATH_TO_SLUG[`../${item.path}`] = item.slug;
}

export const PATH_TO_ASSET: Record<string, string> = {
  "../02-vocabulary/ogdens-basic-english-850.pdf": "/assets/ogdens-basic-english-850.pdf",
  "../02-vocabulary/basic-english-850.txt": "/assets/basic-english-850.txt",
  "../04-practice/english-through-pictures-book1.pdf": "/assets/english-through-pictures-book1.pdf",
  "../reference/begr-1937.html": "/assets/begr-1937.html",
  "ogdens-basic-english-850.pdf": "/assets/ogdens-basic-english-850.pdf",
  "basic-english-850.txt": "/assets/basic-english-850.txt",
  "english-through-pictures-book1.pdf": "/assets/english-through-pictures-book1.pdf",
  "begr-1937.html": "/assets/begr-1937.html",
};
