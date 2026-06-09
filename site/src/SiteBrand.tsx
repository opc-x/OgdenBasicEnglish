/** 全站统一品牌字标 — hero / 侧栏共用 */
export default function SiteBrand({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="site-brand site-brand--sidebar">
        <p className="site-brand-lockup">
          <span className="site-brand-ogden">Ogden</span>
          <em>Basic English</em>
        </p>
        <p className="site-brand-slogan">850 词根，拼出日常九成语境</p>
        <p className="site-brand-eyebrow">C.K. Ogden · 1930</p>
      </div>
    );
  }

  return (
    <header className="site-brand site-brand--hero">
      <div className="site-brand-meta">
        <span className="site-brand-tag">C.K. Ogden</span>
        <span className="site-brand-dot" aria-hidden />
        <span className="site-brand-tag">1930</span>
        <span className="site-brand-dot" aria-hidden />
        <span className="site-brand-tag">850 words</span>
      </div>
      <h1 className="site-brand-title">
        Ogden
        <em>Basic English</em>
      </h1>
    </header>
  );
}
