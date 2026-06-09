import type { ReactNode } from "react";

type IconProps = { size?: number };

function Svg({ size = 16, children }: { size?: number; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export const PHASE_ICONS: Record<string, (p: IconProps) => ReactNode> = {
  map: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </Svg>
  ),
  skeleton: (p) => (
    <Svg {...p}>
      <path d="M4 18V6l8-3 8 3v12" />
      <path d="M12 3v15M4 10h16" />
    </Svg>
  ),
  roots: (p) => (
    <Svg {...p}>
      <path d="M12 22V8" />
      <path d="M6 12c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M8 22c2-4 8-4 8 0" />
    </Svg>
  ),
  multiply: (p) => (
    <Svg {...p}>
      <path d="M7 7l10 10M17 7L7 17" />
      <circle cx="12" cy="12" r="9" />
    </Svg>
  ),
  practice: (p) => (
    <Svg {...p}>
      <path d="M4 6h16v14H4z" />
      <path d="M8 6V4h8v2M9 11h6M9 15h4" />
    </Svg>
  ),
  reference: (p) => (
    <Svg {...p}>
      <path d="M5 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2z" />
    </Svg>
  ),
  agent: (p) => (
    <Svg {...p}>
      <path d="M8 6h8M8 10h8M8 14h5" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </Svg>
  ),
};

export const SLUG_ICONS: Record<string, (p: IconProps) => ReactNode> = {
  start: (p) => (
    <Svg {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  ),
  sources: (p) => (
    <Svg {...p}>
      <path d="M10 14H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <rect x="10" y="10" width="10" height="10" rx="2" />
    </Svg>
  ),
  operators: (p) => (
    <Svg {...p}>
      <path d="M13 3L5 14h6l-1 7 9-12h-6l1-6z" />
    </Svg>
  ),
  directions: (p) => (
    <Svg {...p}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </Svg>
  ),
  grammar: (p) => (
    <Svg {...p}>
      <path d="M6 4h12v16H6z" />
      <path d="M9 9h6M9 13h4" />
    </Svg>
  ),
  "tier-guide": (p) => (
    <Svg {...p}>
      <path d="M4 18h16M6 14h12M8 10h8M10 6h4" />
    </Svg>
  ),
  words: (p) => (
    <Svg {...p}>
      <path d="M8 6h8M8 10h8M8 14h5" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </Svg>
  ),
  phrasal: (p) => (
    <Svg {...p}>
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="12" r="3" />
      <path d="M11 12h2" />
    </Svg>
  ),
  affixes: (p) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  compounds: (p) => (
    <Svg {...p}>
      <rect x="3" y="8" width="8" height="8" rx="1" />
      <rect x="13" y="8" width="8" height="8" rx="1" />
    </Svg>
  ),
  practice: (p) => (
    <Svg {...p}>
      <path d="M4 6h16v12H4z" />
      <path d="M8 10h8M8 14h5" />
    </Svg>
  ),
  begr: (p) => (
    <Svg {...p}>
      <path d="M6 4h9l5 5v11H6z" />
      <path d="M15 4v5h5" />
    </Svg>
  ),
  survey: (p) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" />
    </Svg>
  ),
  copyright: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5a3.5 3.5 0 1 0 0 5" />
    </Svg>
  ),
  distill: (p) => (
    <Svg {...p}>
      <path d="M8 4h8v4H8zM6 10h12v10H6z" />
      <path d="M10 14h4" />
    </Svg>
  ),
};

export const PHASE_COLORS: Record<string, string> = {
  map: "#b45309",
  skeleton: "#0369a1",
  roots: "#15803d",
  multiply: "#c2410c",
  practice: "#7c3aed",
  reference: "#78716c",
  agent: "#78716c",
};

export function PhaseIcon({ id, size = 18 }: { id: string; size?: number }) {
  const Icon = PHASE_ICONS[id] ?? PHASE_ICONS.map;
  return <span className="nav-icon">{Icon({ size })}</span>;
}

export function SlugIcon({ slug, size = 15 }: { slug: string; size?: number }) {
  const Icon = SLUG_ICONS[slug] ?? SLUG_ICONS.start;
  return <span className="nav-icon nav-icon--sm">{Icon({ size })}</span>;
}
