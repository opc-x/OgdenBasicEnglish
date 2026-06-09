import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LEARNING_PHASES, getPhaseItems } from "./content";
import FormulaBar from "./FormulaBar";
import SiteBrand from "./SiteBrand";
import WordMachine from "./WordMachine";
import TierBreakdown from "./TierBreakdown";
import MultiplyMore from "./MultiplyMore";
import WordExplorer from "./WordExplorer";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("revealed");
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  useScrollReveal();
  const mainPhases = LEARNING_PHASES.filter((p) => !p.collapsed);

  return (
    <div className="home">

      {/* ── HERO ── */}
      <header className="hero-archive">
        <SiteBrand />

        {/* 一句话讲清楚——比原文更直白 */}
        <p className="hero-explain">
          英语有 2 万多个词，太多背不完。Ogden 的办法：
          <strong>只记 850 个词根，再学几条「拼词规则」，就能说出日常 90% 的内容。</strong>
        </p>

        <div className="hero-formula-wrap">
          <FormulaBar />
        </div>

        <div className="hero-actions">
          <Link className="btn btn-primary" to="/doc/start">
            开始学 →
          </Link>
          <Link className="btn btn-ghost" to="/doc/sources">
            对照原文出处
          </Link>
        </div>

        {/* Ogden 原话——作为佐证，压缩 */}
        <blockquote className="hero-evidence">
          <p>
            "…850 个英语词，能清楚简单地说出我们平时用 1.5–2 万词所说的几乎一切。"
          </p>
          <cite>
            — C.K. Ogden, 1937 原话，
            <a href="/assets/begr-1937.html" target="_blank" rel="noreferrer">
              查原文 ↗
            </a>
          </cite>
        </blockquote>
      </header>

      {/* ── 造词机器（核心交互）── */}
      <section className="reveal">
        <WordMachine />
      </section>

      {/* ── 850 五类分层 ── */}
      <section className="reveal">
        <TierBreakdown />
      </section>

      {/* ── 850 词表浏览器（核心卖点）── */}
      <section className="reveal">
        <WordExplorer defaultFilter="all" />
      </section>

      {/* ── 词缀 + 复合倍增 ── */}
      <section className="reveal">
        <MultiplyMore />
      </section>

      {/* ── 学习路径 ── */}
      <section className="section reveal reveal-delay-1">
        <div className="section-head">
          <h2>四步学会，循序渐进</h2>
          <p className="section-sub">
            先搭骨架，再装词根，最后用规则把它们「乘」起来。每步可对照左侧导航。
          </p>
        </div>

        <div className="journey-map-home">
          {mainPhases.map((phase, i) => {
            const items = getPhaseItems(phase.id);
            const firstSlug = items[0]?.slug;
            return (
              <div
                key={phase.id}
                className="journey-map-card reveal"
                style={{ transitionDelay: `${0.07 * i}s` }}
              >
                <div className="journey-map-head">
                  <span className="journey-map-step">{phase.step}</span>
                  <div>
                    <strong>{phase.title}</strong>
                    <p>{phase.subtitle}</p>
                    {phase.formula && <code>{phase.formula}</code>}
                  </div>
                </div>
                <ol className="journey-map-list">
                  {items.map((item) => (
                    <li key={item.slug}>
                      <Link to={`/doc/${item.slug}`}>{item.title}</Link>
                    </li>
                  ))}
                </ol>
                {firstSlug && (
                  <Link className="journey-map-enter" to={`/doc/${firstSlug}`}>
                    进入此阶段 →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 出处（降为次要，简洁条带）── */}
      <section className="reveal reveal-delay-2">
        <div className="sources-strip">
          <div className="sources-strip-text">
            <strong>所有内容都能对照原文核对</strong>
            <span>本站是学习整理，灵魂是 Ogden 的一手材料。有疑问以原文为准。</span>
          </div>
          <div className="sources-strip-links">
            <a href="/assets/begr-1937.html" target="_blank" rel="noreferrer">
              <span className="src-mark">HTML</span> begr-1937 全文
            </a>
            <a href="/assets/ogdens-basic-english-850.pdf" target="_blank" rel="noreferrer">
              <span className="src-mark">PDF</span> 850 词表
            </a>
            <Link to="/doc/sources">完整出处索引 →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
