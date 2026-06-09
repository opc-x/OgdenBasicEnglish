import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { WORDS, TIER_META, ANNOTATED_COUNT, type Tier, type Word } from "./words850";
import { speak, isSpeechSupported } from "./speak";

type Filter = Tier | "all";

const TABS: { id: Filter; label: string }[] = [
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
  return (
    <div className="word-card" style={{ ["--seg" as string]: meta.color }}>
      <button
        type="button"
        className="word-speak"
        aria-label={`朗读 ${word.w}`}
        disabled={!speakable}
        onClick={() => speak(word.w)}
        title="点击发音"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
          <path
            fill="currentColor"
            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z"
          />
        </svg>
      </button>
      <div className="word-main">
        <span className="word-en">{word.w}</span>
        {word.ipa ? (
          <span className="word-ipa">/{word.ipa}/</span>
        ) : (
          <span className="word-ipa word-ipa-todo">音标补全中</span>
        )}
      </div>
      <span className="word-cn">{word.cn ?? "—"}</span>
      {word.link && (
        <Link className="word-link" to={`/doc/${word.link}`} title="跳到知识讲解">
          讲解 →
        </Link>
      )}
    </div>
  );
}

export default function WordExplorer() {
  const [filter, setFilter] = useState<Filter>("ops");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return WORDS.filter((word) => {
      if (filter !== "all" && word.t !== filter) return false;
      if (!query) return true;
      return (
        word.w.toLowerCase().includes(query) ||
        (word.cn ?? "").includes(query)
      );
    });
  }, [filter, q]);

  return (
    <div className="explorer">
      <div className="explorer-head">
        <span className="explorer-kicker">核心 · 850 词表</span>
        <h3>这 850 个词，就是你要学的全部</h3>
        <p>
          点
          <span className="speak-demo" aria-hidden>
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path
                fill="currentColor"
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"
              />
            </svg>
          </span>
          听发音、看音标和中文，
          运作词可直接跳到讲解。<strong>{ANNOTATED_COUNT} / 850</strong> 已配齐音标+中文，其余分层补全中。
        </p>
      </div>

      {/* 分类标签 */}
      <div className="explorer-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={filter === t.id}
            className={`explorer-tab${filter === t.id ? " active" : ""}`}
            style={
              t.id !== "all"
                ? ({ ["--seg" as string]: TIER_META[t.id as Tier].color } as React.CSSProperties)
                : undefined
            }
            onClick={() => setFilter(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 搜索 */}
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
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜单词或中文，如 come / 来 / dog"
          aria-label="搜索单词"
        />
        <span className="explorer-count">{list.length} 个</span>
      </div>

      {/* 词卡网格 */}
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
