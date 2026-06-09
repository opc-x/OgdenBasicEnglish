export type NavItem = {
  title: string;
  path: string;
  slug: string;
  phaseId: string;
  badge?: string;
  /** 非文档页路由，如 /words */
  href?: string;
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
    id: "core",
    step: "★",
    title: "核心必背",
    subtitle: "18 operator + 850 词表",
    formula: "先背熟这 18 个",
  },
  {
    id: "skeleton",
    step: "1",
    title: "搭骨架",
    subtitle: "方向词 + 语法规则",
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
    subtitle: "站内跟读 + 问答，直接开练",
    formula: "官方课文 · 示范句 · 填空",
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
  { phaseId: "core", title: "18 个 Operator（必背）", path: "01-foundations/operators-18.md", slug: "operators", badge: "重点" },
  { phaseId: "core", title: "850 词随时查", path: "", slug: "words-search", href: "/words", badge: "查询" },
  { phaseId: "skeleton", title: "方向词与介词", path: "01-foundations/directions-prepositions.md", slug: "directions" },
  { phaseId: "skeleton", title: "语法规则卡", path: "01-foundations/grammar-rules.md", slug: "grammar" },
  { phaseId: "roots", title: "分层学习指南", path: "02-vocabulary/tier-guide.md", slug: "tier-guide" },
  { phaseId: "roots", title: "850 词（Ogden 序）", path: "02-vocabulary/words-ogden-order.md", slug: "words" },
  { phaseId: "multiply", title: "短语动词", path: "03-composition/phrasal-verbs.md", slug: "phrasal" },
  { phaseId: "multiply", title: "词缀扩展", path: "03-composition/derivation-affixes.md", slug: "affixes" },
  { phaseId: "multiply", title: "复合词", path: "03-composition/compounds.md", slug: "compounds" },
  { phaseId: "practice", title: "造句实战", path: "", slug: "practice-lab", href: "/practice/lab", badge: "见效" },
  { phaseId: "practice", title: "示范句跟读", path: "", slug: "practice-sbs", href: "/practice/step-by-step/body", badge: "开练" },
  { phaseId: "practice", title: "Basic Teacher 课", path: "", slug: "practice-bt", href: "/practice/basic-teacher/bt1", badge: "开练" },
  { phaseId: "practice", title: "练习资源索引", path: "04-practice/reading-list.md", slug: "practice" },
  { phaseId: "reference", title: "1937 Pamphlet 索引", path: "reference/begr-1937.md", slug: "begr" },
  { phaseId: "reference", title: "资源调研（中文）", path: "reference/survey-zh.md", slug: "survey" },
  { phaseId: "reference", title: "版权说明", path: "reference/copyright.md", slug: "copyright" },
  { phaseId: "agent", title: "Agent JSONL Schema", path: "05-distill/schema.md", slug: "distill" },
];

/** 主路径（不含参考库 / Agent）用于首页学习地图 */
export const MAIN_PHASE_IDS = ["map", "core", "skeleton", "roots", "multiply", "practice"];

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
