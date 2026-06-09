import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getWord, normalizeWordKey, TIER_META, isOperator } from "./words850";
import { speak, isSpeechSupported } from "./speak";
import { OGDEN_TIER, fixImageUrl, ogdenSourceLinks } from "./wordSources";
import { getWordGuide } from "./wordGuides";
import { getOperatorEntry } from "./operatorData";
import OperatorVisual from "./OperatorVisual";

export default function WordDetailPage() {
  const { word: raw = "" } = useParams();
  const wordKey = normalizeWordKey(raw);
  const word = getWord(wordKey);
  const guide = getWordGuide(wordKey);
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
  const opEntry = op ? getOperatorEntry(word.w) : undefined;
  const img = word.img ? fixImageUrl(word.img) : undefined;
  const isSvg = img?.startsWith("data:image/svg+xml") || img?.endsWith(".svg");
  const sources = ogdenSourceLinks(word.w, word.t);
  const oppWord = guide?.opposite;

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

      {guide && (
        <section className="word-detail-hook" aria-label="秒懂">
          <span className="word-detail-hook-label">秒懂</span>
          <p>{guide.hook}</p>
        </section>
      )}

      <div className="word-detail-visual">
        {op ? (
          <div className="word-detail-op-visual">
            <OperatorVisual type={word.w} />
            {opEntry && (
              <p className="word-detail-op-vector">{opEntry.vector}</p>
            )}
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
            ? "Picturable · 指着图就能说"
            : op
              ? "Operator · 物理动作模型"
              : isSvg
                ? "语义示意 SVG"
                : "配图辅助记忆"}
        </p>
      </div>

      {guide && (
        <>
          <section className="word-detail-method">
            <h2>Ogden 方法论</h2>
            <p className="word-detail-method-tag">{guide.method}</p>
            <p>{guide.concept}</p>
            {guide.equation && (
              <div className="word-detail-equation">
                <span>公式</span>
                <code>{guide.equation}</code>
              </div>
            )}
            {guide.ogdenTip && (
              <p className="word-detail-tip">{guide.ogdenTip}</p>
            )}
          </section>

          {guide.sentences.length > 0 && (
            <section className="word-detail-examples">
              <h2>BE850 例句</h2>
              <ul>
                {guide.sentences.map((s) => (
                  <li key={s}>
                    <span>{s}</span>
                    <button
                      type="button"
                      className="word-speak word-speak--sm"
                      aria-label={`朗读 ${s}`}
                      disabled={!isSpeechSupported()}
                      onClick={() => void speak(s)}
                    >
                      听
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {guide.combine && (
            <section className="word-detail-combine">
              <h2>组合用法</h2>
              <p className="word-detail-combine-text">{guide.combine}</p>
              {opEntry && (
                <ul className="word-detail-combine-list">
                  {opEntry.examples.map((ex) => (
                    <li key={ex}>{ex}</li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {oppWord && (
            <section className="word-detail-opposite">
              <h2>反义对照</h2>
              <p>
                与{" "}
                <Link to={`/word/${oppWord}`} className="word-detail-opp-link">
                  {oppWord}
                </Link>{" "}
                成对记忆。
              </p>
            </section>
          )}
        </>
      )}

      <section className="word-detail-ogden">
        <h2>原文分类</h2>
        <p>{tier.sourceNote}</p>
        {op && (
          <p>
            完整 18 Operator 矩阵见{" "}
            <Link to="/doc/operators">Operator 讲解页</Link>。
          </p>
        )}
      </section>

      <section className="word-detail-sources">
        <h2>对照原文</h2>
        <p className="word-detail-sources-hint">Ogden / Basic English 一手材料，请以原文为准。</p>
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
