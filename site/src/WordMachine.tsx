import { useState } from "react";

type Combo = { dir: string; result: string; cn: string; replaces: string };
type OpEntry = { op: string; gloss: string; combos: Combo[] };

/** 每个 operator 配几个真实的 BE850 短语动词，右侧给出它替代掉的「难词」。 */
const MACHINE: OpEntry[] = [
  {
    op: "get", gloss: "得到 / 变成",
    combos: [
      { dir: "up", result: "get up", cn: "起来", replaces: "rise" },
      { dir: "off", result: "get off", cn: "下车", replaces: "dismount" },
      { dir: "back", result: "get back", cn: "拿回", replaces: "recover" },
      { dir: "out", result: "get out", cn: "出去", replaces: "exit" },
    ],
  },
  {
    op: "put", gloss: "放置",
    combos: [
      { dir: "off", result: "put off", cn: "推迟", replaces: "postpone" },
      { dir: "together", result: "put together", cn: "组装", replaces: "assemble" },
      { dir: "on", result: "put on", cn: "穿上", replaces: "don" },
      { dir: "out", result: "put out", cn: "熄灭", replaces: "extinguish" },
    ],
  },
  {
    op: "take", gloss: "拿 / 取",
    combos: [
      { dir: "off", result: "take off", cn: "脱掉 · 起飞", replaces: "remove" },
      { dir: "in", result: "take in", cn: "吸收", replaces: "absorb" },
      { dir: "up", result: "take up", cn: "开始做", replaces: "commence" },
      { dir: "over", result: "take over", cn: "接管", replaces: "assume" },
    ],
  },
  {
    op: "give", gloss: "给出",
    combos: [
      { dir: "up", result: "give up", cn: "放弃", replaces: "surrender" },
      { dir: "in", result: "give in", cn: "屈服", replaces: "yield" },
      { dir: "back", result: "give back", cn: "归还", replaces: "return" },
      { dir: "out", result: "give out", cn: "分发", replaces: "distribute" },
    ],
  },
  {
    op: "go", gloss: "去 / 进行",
    combos: [
      { dir: "on", result: "go on", cn: "继续", replaces: "continue" },
      { dir: "through", result: "go through", cn: "经历", replaces: "undergo" },
      { dir: "out", result: "go out", cn: "出去", replaces: "exit" },
      { dir: "off", result: "go off", cn: "响 · 离开", replaces: "depart" },
    ],
  },
  {
    op: "make", gloss: "制造 / 使",
    combos: [
      { dir: "up", result: "make up", cn: "编造 · 和好", replaces: "invent" },
      { dir: "out", result: "make out", cn: "看清", replaces: "discern" },
      { dir: "off", result: "make off", cn: "逃走", replaces: "flee" },
    ],
  },
];

export default function WordMachine() {
  const [opIdx, setOpIdx] = useState(1); // 默认 put（put off 是最经典的例子）
  const [dirIdx, setDirIdx] = useState(0);

  const entry = MACHINE[opIdx];
  const combo = entry.combos[dirIdx];

  return (
    <div className="machine">
      <div className="machine-head">
        <span className="machine-kicker">动手试试</span>
        <h3>造词机器：不背单词，用规则拼</h3>
        <p>
          BE850 没有 <code>postpone</code>、<code>assemble</code> 这种词。
          想要它们？用你已经会的 <strong>operator + 方向</strong> 现场拼出来。
        </p>
      </div>

      {/* 第一步：选 operator */}
      <div className="machine-row">
        <span className="machine-row-label">
          <span className="machine-step-num">1</span> 选一个 operator
        </span>
        <div className="chip-track">
          {MACHINE.map((e, i) => (
            <button
              key={e.op}
              type="button"
              className={`chip chip-op${i === opIdx ? " active" : ""}`}
              onClick={() => {
                setOpIdx(i);
                setDirIdx(0);
              }}
            >
              {e.op}
            </button>
          ))}
        </div>
      </div>

      {/* 第二步：配方向 */}
      <div className="machine-row">
        <span className="machine-row-label">
          <span className="machine-step-num">2</span> 配一个方向
        </span>
        <div className="chip-track">
          {entry.combos.map((c, i) => (
            <button
              key={c.dir}
              type="button"
              className={`chip chip-dir${i === dirIdx ? " active" : ""}`}
              onClick={() => setDirIdx(i)}
            >
              {c.dir}
            </button>
          ))}
        </div>
      </div>

      {/* 结果：动画展示 */}
      <div className="machine-result" key={`${opIdx}-${dirIdx}`}>
        <div className="result-equation">
          <span className="eq-op">{entry.op}</span>
          <span className="eq-plus">+</span>
          <span className="eq-dir">{combo.dir}</span>
          <span className="eq-arrow" aria-hidden>→</span>
          <span className="eq-result">
            <span className="eq-en">{combo.result}</span>
            <span className="eq-cn">{combo.cn}</span>
          </span>
        </div>
        <div className="result-replaces">
          普通英语得专门背 <code className="hard-word">{combo.replaces}</code>
          <span className="result-replaces-arrow">——你却用 {entry.op} + {combo.dir} 就造出来了</span>
        </div>
      </div>

      {/* 杠杆说明 */}
      <div className="machine-leverage">
        <div className="leverage-math">
          <span className="lev-big">18</span>
          <span className="lev-label">operator</span>
          <span className="lev-x">×</span>
          <span className="lev-big">~20</span>
          <span className="lev-label">方向</span>
          <span className="lev-eq">≈</span>
          <span className="lev-big lev-accent">数百</span>
          <span className="lev-label">动作</span>
        </div>
        <p className="leverage-note">
          Ogden 原话：这套办法可以替掉英语里约 <strong>4000 个动词</strong>。
          <a href="/assets/begr-1937.html" target="_blank" rel="noreferrer">查原文 ↗</a>
        </p>
      </div>
    </div>
  );
}
