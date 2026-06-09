import { Link } from "react-router-dom";
import { GLOBAL_SOURCES, getPageSources, type SourceLink } from "./sources";

function SourceList({ items }: { items: SourceLink[] }) {
  return (
    <ul className="source-list">
      {items.map((s) => (
        <li key={s.url + s.label}>
          {s.url.startsWith("/doc/") ? (
            <Link to={s.url}>{s.label}</Link>
          ) : (
            <a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
          )}
          {s.note && <span className="source-note">{s.note}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function SourcesPanel({ slug }: { slug: string }) {
  const pageSources = getPageSources(slug);
  if (slug === "sources") return null;
  return (
    <aside className="sources-panel">
      <h2>原始材料出处</h2>
      <p className="sources-disclaimer">本站为学习整理，非 Ogden 官方出版物。请对照下方链接核对原文。</p>
      {pageSources.length > 0 && (<><h3>本页相关</h3><SourceList items={pageSources} /></>)}
      <h3>通用参考</h3>
      <SourceList items={GLOBAL_SOURCES.filter((s) => s.url !== "/doc/sources")} />
      <p className="sources-more"><Link to="/doc/sources">查看完整出处索引 →</Link></p>
    </aside>
  );
}
