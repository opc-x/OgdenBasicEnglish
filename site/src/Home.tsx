import { Link } from "react-router-dom";
import { ASSETS, NAV } from "./content";

const STEPS = [
  { n: "01", label: "??", desc: "18 operator · ??? · ????", slug: "operators" },
  { n: "02", label: "??", desc: "850 ??? · Ogden ??", slug: "tier-guide" },
  { n: "03", label: "??", desc: "???? · ?? · ?? — ???", slug: "phrasal" },
  { n: "04", label: "??", desc: "???? · ????", slug: "practice" },
  { n: "05", label: "??", desc: "JSONL · prompts · agent", slug: "distill" },
];

export default function Home() {
  return (
    <div className="home">
      <header className="hero">
        <p className="eyebrow">C.K. Ogden · 1930 · BE850</p>
        <h1>
          Ogden
          <br />
          <em>Basic English</em>
        </h1>
        <p className="lede">
          850 ??? × ???? = ???????????????<strong>??????</strong>?
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/doc/start">
            ???? ?
          </Link>
          <Link className="btn btn-ghost" to="/doc/words">
            ?? 850 ?
          </Link>
        </div>
      </header>

      <section className="panel">
        <h2>????</h2>
        <div className="steps">
          {STEPS.map((s) => (
            <Link key={s.n} className="step-card" to={`/doc/${s.slug}`}>
              <span className="step-num">{s.n}</span>
              <div>
                <strong>{s.label}</strong>
                <p>{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel two-col">
        <div>
          <h2>????</h2>
          <ul className="focus-list">
            <li>
              <span>1</span> 18 ? operator ??????
            </li>
            <li>
              <span>2</span> operator + ?? = ?????~4000 ???
            </li>
            <li>
              <span>3</span> 850 ???????picturable ??
            </li>
            <li>
              <span>4</span> ?????????-ER/-ING/-LY/UN-?
            </li>
            <li>
              <span>5</span> ?? = ??????????
            </li>
          </ul>
        </div>
        <div>
          <h2>????</h2>
          <ul className="asset-list">
            {ASSETS.map((a) => (
              <li key={a.href}>
                <a href={a.href} target="_blank" rel="noreferrer">
                  <span className={`tag tag-${a.kind}`}>{a.kind}</span>
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <h2>????</h2>
        <div className="chapter-grid">
          {NAV.map((item) => (
            <Link key={item.slug} className="chapter-link" to={`/doc/${item.slug}`}>
              <span className="chapter-group">{item.group}</span>
              {item.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
