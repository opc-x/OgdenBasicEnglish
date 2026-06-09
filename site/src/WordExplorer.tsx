import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { WORDS, TIER_META, ANNOTATED_COUNT, isOperator, type Tier, type Word } from "./words850";
import { speak, isSpeechSupported } from "./speak";

type Filter = Tier | "all" | "op18";

const TABS: { id: Filter; label: string }[] = [
  { id: "op18", label: "18 Operator" },
  { id: "all", label: "全部 850" },
  { id: "ops", label: "运作词 100" },
  { id: "pic", label: "看得见 200" },
  { id: "things", label: "抽象 400" },
  { id: "qual", label: "性质 100" },
  { id: "opp", label: "反义 50" },
];

function WordCard({ word }: { word: Word }) {
  const meta = TIER_META[word.t];
  const speakable = isSpeechSupported();
  const op = isOperator(word.w);
  const isSvg = word.img?.startsWith("data:image/svg+xml") ?? false;

  return (
    <div
      className={`word-card word-card--has-img${op ? " word-card--operator" : ""}`}
      style={{ ["--seg" as string]: meta.color }}
    >
      <div className="word-card-img-wrapper">
        {word.img ? (
          <img
            src={word.img}
            alt={word.w}
            className={`word-card-img${isSvg ? " word-card-img--svg" : ""}`}
            loading="lazy"
          />
        ) : (
          <span className="word-card-img-fallback" aria-hidden>{word.w}</span>
        )}
      </div>
      <div className="word-card-body">
        <div className="word-card-header-line">
          <button
            type="button"
            className="word-speak"
            aria-label={`朗读 ${word.w}`}
            disabled={!speakable}
            onClick={() => void speak(word.w)}
            title="点击发音（Sonia 英式女声）"
          >
            <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden>
              <path
                fill="currentColor"
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z"
              />
            </svg>
          </button>
          <span className="word-en">{word.w}</span>
          {op && <span className="word-op-badge">operator</span>}
        </div>
        <div className="word-card-meta-line">
          {word.ipa ? (
            <span className="word-ipa">/{word.ipa}/</span>
          ) : (
            <span className="word-ipa word-ipa-todo">音标补全中</span>
          )}
          {word.link && (
            <Link className="word-link" to={`/doc/${word.link}`} title="跳到知识讲解">
              讲解 →
            </Link>
          )}
        </div>
        <div className="word-cn">{word.cn ?? "—"}</div>
      </div>
    </div>
  );
}

export default function WordExplorer({ defaultFilter = "op18" }: { defaultFilter?: Filter }) {
  const [params, setParams] = useSearchParams();
  const qParam = params.get("q") ?? "";
  const [filter, setFilter] = useState<Filter>(
    (params.get("tab") as Filter) || defaultFilter
  );
  const [q, setQ] = useState(qParam);

  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return WORDS.filter((word) => {
      if (filter === "op18") {
        if (!isOperator(word.w)) return false;
      } else if (filter !== "all" && word.t !== filter) return false;
      if (!query) return true;
      return (
        word.w.toLowerCase().includes(query) ||
        (word.cn ?? "").includes(query)
      );
    });
  }, [filter, q]);

  const onSearch = (value: string) => {
    setQ(value);
    const next = new URLSearchParams(params);
    if (value.trim()) next.set("q", value.trim());
    else next.delete("q");
    setParams(next, { replace: true });
  };

  const onTab = (id: Filter) => {
    setFilter(id);
    const next = new URLSearchParams(params);
    if (id === defaultFilter) next.delete("tab");
    else next.set("tab", id);
    setParams(next, { replace: true });
  };

  return (
    <div className="explorer">
      <div className="explorer-head">
        <span className="explorer-kicker">核心 · 850 词表</span>
        <h3>这 850 个词，就是你要学的全部</h3>
        <p>
          点喇叭听 <strong>Sonia</strong> 英式女声；每个词都有配图（实物照片或 SVG 示意）。
          <strong>{ANNOTATED_COUNT} / 850</strong> 已配英式音标。
        </p>
      </div>

      <div className="explorer-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={filter === t.id}
            className={`explorer-tab${filter === t.id ? " active" : ""}${t.id === "op18" ? " explorer-tab--hot" : ""}`}
            style={
              t.id !== "all" && t.id !== "op18"
                ? ({ ["--seg" as string]: TIER_META[t.id as Tier].color } as React.CSSProperties)
                : undefined
            }
            onClick={() => onTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="explorer-search">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <path
            fill="currentColor"
            d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
          />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="搜单词或中文，如 come / 来 / dog"
          aria-label="搜索单词"
        />
        <span className="explorer-count">{list.length} 个</span>
      </div>

      {list.length ? (
        <div className="word-grid">
          {list.map((word) => (
            <WordCard key={`${word.t}-${word.w}`} word={word} />
          ))}
        </div>
      ) : (
        <p className="explorer-empty">没找到「{q}」，换个词试试。</p>
      )}
    </div>
  );
}
