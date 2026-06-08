export type NavItem = {
  title: string;
  path: string;
  slug: string;
  group: string;
  badge?: string;
};

export type AssetLink = {
  label: string;
  href: string;
  kind: "pdf" | "txt" | "html";
};

export const NAV: NavItem[] = [
  { group: "??", title: "?????", path: "00-START-HERE.md", slug: "start", badge: "??" },
  { group: "01 ??", title: "18 ? Operator", path: "01-foundations/operators-18.md", slug: "operators" },
  { group: "01 ??", title: "??? & ??", path: "01-foundations/directions-prepositions.md", slug: "directions" },
  { group: "01 ??", title: "?????", path: "01-foundations/grammar-rules.md", slug: "grammar" },
  { group: "02 ??", title: "??????", path: "02-vocabulary/tier-guide.md", slug: "tier-guide" },
  { group: "02 ??", title: "850 ??Ogden ??", path: "02-vocabulary/words-ogden-order.md", slug: "words" },
  { group: "03 ??", title: "????", path: "03-composition/phrasal-verbs.md", slug: "phrasal" },
  { group: "03 ??", title: "????", path: "03-composition/derivation-affixes.md", slug: "affixes" },
  { group: "03 ??", title: "???", path: "03-composition/compounds.md", slug: "compounds" },
  { group: "04 ??", title: "?? & ??", path: "04-practice/reading-list.md", slug: "practice" },
  { group: "05 ??", title: "Agent JSONL Schema", path: "05-distill/schema.md", slug: "distill" },
  { group: "??", title: "1937 Pamphlet ??", path: "reference/begr-1937.md", slug: "begr" },
  { group: "??", title: "????????", path: "reference/survey-zh.md", slug: "survey" },
  { group: "??", title: "????", path: "reference/copyright.md", slug: "copyright" },
];

export const ASSETS: AssetLink[] = [
  { label: "850 ? PDF", href: "/assets/ogdens-basic-english-850.pdf", kind: "pdf" },
  { label: "850 ? TXT", href: "/assets/basic-english-850.txt", kind: "txt" },
  { label: "English Through Pictures ù Book 1", href: "/assets/english-through-pictures-book1.pdf", kind: "pdf" },
  { label: "begr-1937 ?? HTML", href: "/assets/begr-1937.html", kind: "html" },
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

export const GROUPS = [...new Set(NAV.map((n) => n.group))];

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
