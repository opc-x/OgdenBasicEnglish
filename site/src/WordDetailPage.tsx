import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getWord, normalizeWordKey, TIER_META, isOperator } from "./words850";
import { speak, speakText, isSpeechSupported } from "./speak";
import { OGDEN_TIER, fixImageUrl, ogdenSourceLinks } from "./wordSources";
import { getWordGuide, ROLE_META } from "./wordGuides";
import { getOperatorEntry } from "./operatorData";
import OperatorVisual from "./OperatorVisual";
import { TRAINING_SENTENCES } from "./practice/trainingData";

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
              <h2>BE850 例句 · 语义解析</h2>
              <div className="word-sentence-legend">
                {(["op", "dir", "n", "adj", "pron", "conj", "neg"] as const)
                  .filter((r) =>
                    guide.sentences.some((s) => s.parts.some(([, role]) => role === r)),
                  )
                  .map((r) => (
                    <span key={r} className="word-role-chip" style={{ ["--role" as string]: ROLE_META[r].color }}>
                      {ROLE_META[r].label}
                    </span>
                  ))}
              </div>
              <ul>
                {guide.sentences.map((s) => (
                  <li key={s.en} className="word-sentence">
                    <div className="word-sentence-en">
                      {s.parts.map(([chunk, role], i) => (
                        <span
                          key={`${chunk}-${i}`}
                          className={`word-chunk word-chunk--${role}`}
                          style={{ ["--role" as string]: ROLE_META[role].color }}
                          title={ROLE_META[role].label || undefined}
                        >
                          {chunk}
                        </span>
                      ))}
                      <button
                        type="button"
                        className="word-speak word-speak--sm"
                        aria-label={`朗读 ${s.en}`}
                        disabled={!isSpeechSupported()}
                        onClick={() => void speakText(s.en)}
                        title="点喇叭听 Sonia 英式女声"
                      >
                        <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="word-sentence-cn">{s.cn}</p>
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

      {/* ── 训练数据区块：展示该词在训练句中的实际用法 ── */}
      {(() => {
        const wordLower = word.w.toLowerCase();
        // 筛选训练数据中包含该词的句子（匹配完整单词）
        const pattern = new RegExp(`\\b${wordLower}\\b`, "i");
        const trainingMatches = TRAINING_SENTENCES.filter((s) =>
          pattern.test(s.sentence || "")
        );
        if (trainingMatches.length === 0) return null;
        return (
          <section className="word-detail-training">
            <h2>训练例句 <span className="word-detail-training-count">({trainingMatches.length} 句)</span></h2>
            <p className="word-detail-training-hint">这些句子来自你的训练库，只用了 BE850 词表内的词。跟着读就是训练。</p>
            <ul className="word-training-list">
              {trainingMatches.map((s) => (
                <li key={s.id} className="word-training-row">
                  <span className="word-training-sentence">{s.sentence}</span>
                  {s.zh && <span className="word-training-zh">{s.zh}</span>}
                  <button
                    type="button"
                    className="word-speak word-speak--sm"
                    aria-label={`朗读 ${s.sentence}`}
                    onClick={() => void speakText(s.sentence || "", s.id)}
                    title="点喇叭听 Sonia 英式女声"
                  >
                    <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z"
                      />
                    </svg>
                  </button>
                  {s.replaces && (
                    <span className="word-training-replaces">= {s.replaces}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })()}
    </article>
  );
}
