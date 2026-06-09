import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getWord, TIER_META, isOperator } from "./words850";
import { speak, isSpeechSupported } from "./speak";
import { OGDEN_TIER, fixImageUrl, ogdenSourceLinks } from "./wordSources";
import OperatorVisual from "./OperatorVisual";

export default function WordDetailPage() {
  const { word: raw = "" } = useParams();
  const wordKey = decodeURIComponent(raw).toLowerCase();
  const word = getWord(wordKey);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const backTab = params.get("tab");

  if (!word) {
    return (
      <div className="word-detail word-detail--empty">
        <h1>未找到「{wordKey}」</h1>
        <Link to="/doc/words">返回词表</Link>
      </div>
    );
  }

  const tier = OGDEN_TIER[word.t];
  const meta = TIER_META[word.t];
  const op = isOperator(word.w);
  const img = word.img ? fixImageUrl(word.img) : undefined;
  const isSvg = img?.startsWith("data:image/svg+xml") || img?.endsWith(".svg");
  const sources = ogdenSourceLinks(word.w, word.t);

  const backTo = backTab ? `/doc/words?tab=${backTab}` : "/doc/words";

  return (
    <article className="word-detail" style={{ ["--seg" as string]: meta.color }}>
      <nav className="word-detail-back">
        <button type="button" className="word-detail-back-btn" onClick={() => navigate(backTo)}>
          ← 返回词表
        </button>
      </nav>

      <header className="word-detail-header">
        <p className="word-detail-eyebrow">
          Ogden Basic English · {tier.title} · {tier.subtitle}
        </p>
        <div className="word-detail-title-row">
          <h1>{word.w}</h1>
          {op && <span className="word-op-badge">operator</span>}
          <button
            type="button"
            className="word-speak word-speak--lg"
            aria-label={`朗读 ${word.w}`}
            disabled={!isSpeechSupported()}
            onClick={() => void speak(word.w)}
          >
            发音
          </button>
        </div>
        {word.ipa && <p className="word-detail-ipa">/{word.ipa}/</p>}
        {word.cn && <p className="word-detail-cn">{word.cn}</p>}
      </header>

      <div className="word-detail-visual">
        {op ? (
          <div className="word-detail-op-visual">
            <OperatorVisual type={word.w} />
          </div>
        ) : img ? (
          <img
            src={img}
            alt={word.w}
            className={`word-detail-img${isSvg ? " word-detail-img--svg" : ""}`}
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src.includes("/200px-")) el.src = el.src.replace("/200px-", "/120px-");
            }}
          />
        ) : null}
        <p className="word-detail-visual-caption">
          {word.t === "pic"
            ? "Ogden 可画图词 · 插图来自 Basic English 配图集（Wikimedia .agr）"
            : isSvg
              ? "抽象词示意 SVG（语义图标）"
              : "配图来自 Wikimedia Commons / Wikipedia"}
        </p>
      </div>

      <section className="word-detail-ogden">
        <h2>Ogden 原文分类</h2>
        <p>{tier.sourceNote}</p>
        {op && (
          <p>
            本站{" "}
            <Link to="/doc/operators">18 Operator 讲解</Link>
            {" "}基于 begr-1937 Verb-Elimination 一节。
          </p>
        )}
      </section>

      <section className="word-detail-sources">
        <h2>对照原文</h2>
        <p className="word-detail-sources-hint">以下均为 Ogden / Basic English 一手材料或标准附录，请以原文为准。</p>
        <ul className="word-detail-source-list">
          {sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label} ↗
              </a>
              {s.note && <span>{s.note}</span>}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
