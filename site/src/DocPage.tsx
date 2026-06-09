import { useMemo, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SourcesPanel from "./SourcesPanel";
import WordMachine from "./WordMachine";
import TierBreakdown from "./TierBreakdown";
import MultiplyMore from "./MultiplyMore";
import WordExplorer from "./WordExplorer";
import OperatorsGrid from "./OperatorsGrid";
import PlaybookPlay from "./PlaybookPlay";
import DirectionsVisual from "./DirectionsVisual";
import {
  NAV,
  PATH_TO_ASSET,
  PATH_TO_SLUG,
  getMarkdown,
  getNavBySlug,
  getPhase,
  getStepIndex,
} from "./content";

function rewriteLinks(md: string): string {
  return md.replace(/\]\(([^)]+)\)/g, (full, href: string) => {
    if (PATH_TO_ASSET[href]) return `](${PATH_TO_ASSET[href]})`;
    if (PATH_TO_SLUG[href]) return `](/doc/${PATH_TO_SLUG[href]})`;
    return full;
  });
}

/** 把首页的交互可视化复用到对应 doc 页，作为「先看图，再读细节」的引子。 */
const DOC_VISUALS: Record<string, ReactNode> = {
  start: <PlaybookPlay />,
  operators: <OperatorsGrid />,
  directions: <DirectionsVisual />,
  phrasal: <WordMachine />,
  "tier-guide": <TierBreakdown />,
  words: <WordExplorer />,
  affixes: <MultiplyMore />,
  compounds: <MultiplyMore />,
};

function resolveInternalHref(href: string): string | null {
  if (PATH_TO_ASSET[href]) return PATH_TO_ASSET[href];
  if (PATH_TO_SLUG[href]) return `/doc/${PATH_TO_SLUG[href]}`;
  if (href.startsWith("/doc/")) return href;
  return null;
}

export default function DocPage() {
  const { slug = "" } = useParams();
  const item = getNavBySlug(slug);
  const raw = item ? getMarkdown(item.path) : null;
  const body = useMemo(() => (raw ? rewriteLinks(raw) : null), [raw]);
  const idx = item ? getStepIndex(item.slug) : -1;
  const prev = idx > 0 ? NAV[idx - 1] : null;
  const next = idx >= 0 && idx < NAV.length - 1 ? NAV[idx + 1] : null;
  const phase = item ? getPhase(item.phaseId) : null;

  if (!item || !body) {
    return (<div className="doc-empty"><h1>页面不存在</h1><Link to="/">回首页</Link></div>);
  }

  return (
    <article className="doc">
      <header className="doc-header">
        <p className="doc-eyebrow">
          {phase ? `${phase.step} ${phase.title}` : ""}
          {idx >= 0 ? ` · 第 ${idx + 1} / ${NAV.length} 步` : ""}
        </p>
        <h1>{item.title}</h1>
        {phase?.subtitle && <p className="doc-phase-sub">{phase.subtitle}</p>}
      </header>
      <div className="doc-body">
        <div className="prose">
          {DOC_VISUALS[slug] && (
            <div className="doc-visual">
              <span className="doc-visual-hint">先看图，再读细节 ↓</span>
              {DOC_VISUALS[slug]}
            </div>
          )}
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            a: ({ href, children, ...props }) => {
              if (!href) return <a {...props}>{children}</a>;
              const internal = resolveInternalHref(href);
              if (internal) {
                if (internal.startsWith("/doc/")) return <Link to={internal} {...props}>{children}</Link>;
                return <a href={internal} target="_blank" rel="noreferrer" {...props}>{children}</a>;
              }
              return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
            },
            table: ({ children, ...props }) => (
              <div className="table-wrapper">
                <table {...props}>{children}</table>
              </div>
            ),
            img: ({ src, alt, ...props }) => {
              const isConcept = alt?.includes("Concept");
              return (
                <img
                  src={src}
                  alt={alt}
                  style={{
                    maxWidth: "100%",
                    width: isConcept ? "480px" : "auto",
                    display: "block",
                    margin: "1.5rem auto",
                    borderRadius: "12px",
                    border: "1px solid var(--border-soft)",
                    boxShadow: "var(--shadow-sm)",
                    background: "var(--bg-card)",
                    padding: "0.5rem",
                  }}
                  {...props}
                />
              );
            },
          }}>{body}</ReactMarkdown>
        </div>
        <SourcesPanel slug={slug} />
      </div>
      <nav className="doc-pager">
        {prev ? <Link className="pager prev" to={`/doc/${prev.slug}`}><span>上一章</span><strong>{prev.title}</strong></Link> : <span />}
        {next ? <Link className="pager next" to={`/doc/${next.slug}`}><span>下一章</span><strong>{next.title}</strong></Link> : <span />}
      </nav>
    </article>
  );
}
