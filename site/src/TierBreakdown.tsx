import { useState } from "react";

type Tier = {
  id: string;
  name: string;
  en: string;
  count: number;
  color: string;
  what: string;
  examples: string[];
  priority: string;
};

/** 数据来自 02-vocabulary/tier-guide.md，合计 100+200+400+100+50 = 850 */
const TIERS: Tier[] = [
  {
    id: "ops",
    name: "运作词",
    en: "Operations",
    count: 100,
    color: "#b45309",
    what: "operator、代词、介词、连接词——造句的骨架。没有这些，一句话都说不出来。",
    examples: ["come", "get", "put", "I", "you", "the", "in", "on", "and", "not"],
    priority: "最先学 · 杠杆最高",
  },
  {
    id: "pic",
    name: "看得见的物",
    en: "Picturable",
    count: 200,
    color: "#15803d",
    what: "具体名词，一个词配一张图，最好背。Richards 的《English Through Pictures》就教这一类。",
    examples: ["dog", "hand", "door", "tree", "foot", "eye", "ship", "house"],
    priority: "尽早学 · 最易记",
  },
  {
    id: "gen",
    name: "抽象的物",
    en: "General things",
    count: 400,
    color: "#1d6fa5",
    what: "抽象名词，量最大也最难，慢慢吃。很多能配 operator 代替动词：give attention、have a look。",
    examples: ["reason", "system", "idea", "fact", "way", "part", "act", "view"],
    priority: "稳步推进 · 最大块",
  },
  {
    id: "qual",
    name: "性质词",
    en: "Qualities",
    count: 100,
    color: "#7e22ce",
    what: "形容词。加 -LY 变副词，用 MORE / MOST 表示程度。",
    examples: ["good", "long", "clear", "new", "true", "open", "free", "wise"],
    priority: "和名词一起学",
  },
  {
    id: "opp",
    name: "反义词",
    en: "Opposites",
    count: 50,
    color: "#be123c",
    what: "成对记忆，和性质词配着学。",
    examples: ["good / bad", "long / short", "awake / asleep", "true / false"],
    priority: "成对记 · 最少",
  },
];

export default function TierBreakdown() {
  const [active, setActive] = useState("ops");
  const tier = TIERS.find((t) => t.id === active)!;

  return (
    <div className="tiers">
      <div className="tiers-head">
        <span className="tiers-kicker">看清结构</span>
        <h3>850 个词，其实只有 5 类</h3>
        <p>不是平铺死背 850 个。点下面任一块，看它是什么、先学还是后学。</p>
      </div>

      {/* 比例条 */}
      <div className="tier-bar" role="tablist" aria-label="850 词分层">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            className={`tier-seg${t.id === active ? " active" : ""}`}
            style={{ flexGrow: t.count, ["--seg" as string]: t.color }}
            onClick={() => setActive(t.id)}
          >
            <span className="tier-seg-count">{t.count}</span>
            <span className="tier-seg-name">{t.name}</span>
          </button>
        ))}
      </div>
      <p className="tier-bar-caption">
        条的宽度 = 词的数量。<strong>抽象名词（400）占了快一半</strong>，是最花时间的一块。
      </p>

      {/* 详情 */}
      <div className="tier-detail" key={active} style={{ ["--seg" as string]: tier.color }}>
        <div className="tier-detail-head">
          <span className="tier-detail-count">{tier.count}</span>
          <div>
            <strong className="tier-detail-name">
              {tier.name} <span className="tier-detail-en">{tier.en}</span>
            </strong>
            <span className="tier-detail-priority">{tier.priority}</span>
          </div>
        </div>
        <p className="tier-detail-what">{tier.what}</p>
        <div className="tier-examples">
          {tier.examples.map((ex) => (
            <span key={ex} className="tier-example">{ex}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
