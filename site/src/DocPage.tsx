import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  NAV,
  PATH_TO_ASSET,
  PATH_TO_SLUG,
  getMarkdown,
  getNavBySlug,
} from "./content";

function rewriteLinks(md: string): string {
  return md.replace(/\]\(([^)]+)\)/g, (full, href: string) => {
    if (PATH_TO_ASSET[href]) return `](${PATH_TO_ASSET[href]})`;
    if (PATH_TO_SLUG[href]) return `](/doc/${PATH_TO_SLUG[href]})`;
    return full;
  });
}

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

  const idx = item ? NAV.findIndex((n) => n.slug === item.slug) : -1;
  const prev = idx > 0 ? NAV[idx - 1] : null;
  const next = idx >= 0 && idx < NAV.length - 1 ? NAV[idx + 1] : null;

  if (!item || !body) {
    return (
      <div className="doc-empty">
        <h1>?????</h1>
        <Link to="/">???</Link>
      </div>
    );
  }

  return (
    <article className="doc">
      <header className="doc-header">
        <p className="doc-eyebrow">{item.group}</p>
        <h1>{item.title}</h1>
      </header>

      <div className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }) => {
              if (!href) return <a {...props}>{children}</a>;
              const internal = resolveInternalHref(href);
              if (internal) {
                return (
                  <Link to={internal} {...props}>
                    {children}
                  </Link>
                );
              }
              if (href.endsWith(".pdf") || href.endsWith(".txt") || href.endsWith(".html")) {
                const asset = ASSETS.find((a) => href.includes(a.href.split("/").pop()!));
                const resolved = asset?.href ?? href;
                return (
                  <a href={resolved} target="_blank" rel="noreferrer" {...props}>
                    {children}
                  </a>
                );
              }
              return (
                <a href={href} target="_blank" rel="noreferrer" {...props}>
                  {children}
                </a>
              );
            },
          }}
        >
          {body}
        </ReactMarkdown>
      </div>

      <nav className="doc-pager">
        {prev ? (
          <Link className="pager prev" to={`/doc/${prev.slug}`}>
            <span>???</span>
            <strong>{prev.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="pager next" to={`/doc/${next.slug}`}>
            <span>???</span>
            <strong>{next.title}</strong>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
