import { useMemo, useState } from "react";
import { speakText, isSpeechSupported } from "../speak";
import { getOperatorEntry } from "../operatorData";
import { WORDS } from "../words850";
import OperatorVisual from "../OperatorVisual";
import { TRAINING_SENTENCES, type TrainingSentence } from "./trainingData";

// 18 operator 固定顺序（与首页 / 词表页一致）
const OP_ORDER = [
  "put", "take", "go", "come", "get", "give", "make", "keep", "send",
  "let", "see", "have", "do", "be", "seem", "say", "may", "will",
];

// operator 的全部变位（着色时识别）
const OP_FORMS = new Set<string>([
  ...OP_ORDER,
  "puts", "putting", "takes", "took", "taken", "taking", "goes", "went", "gone", "going",
  "comes", "came", "coming", "gets", "got", "getting", "gives", "gave", "given", "giving",
  "makes", "made", "making", "keeps", "kept", "keeping", "sends", "sent", "sending",
  "lets", "letting", "sees", "saw", "seen", "seeing", "has", "had", "having",
  "does", "did", "done", "doing", "is", "are", "am", "was", "were", "been", "being",
  "seems", "seemed", "says", "said", "saying", "would", "might",
]);

// 运作词·方向/介词（Ogden OPERATIONS 100 的子集）
const DIRECTIVES = new Set<string>([
  "about", "across", "after", "against", "among", "at", "before", "between",
  "by", "down", "from", "in", "off", "on", "over", "through", "to", "under",
  "up", "with", "as", "for", "of", "till", "than", "out", "forward", "back",
  "away", "apart", "aside", "along", "together", "without", "round", "near",
]);

const PRONOUNS = new Set<string>([
  "i", "he", "she", "it", "we", "you", "they", "who",
  "him", "her", "them", "his", "my", "your", "our", "their", "its", "me", "us",
]);

// 内容词角色：名词(things/pic) → n，性质(qual/opp) → adj
const TIER_ROLE: Record<string, "n" | "adj"> = {};
for (const w of WORDS) {
  if (w.t === "pic" || w.t === "things") TIER_ROLE[w.w] = "n";
  else if (w.t === "qual" || w.t === "opp") TIER_ROLE[w.w] = "adj";
}

const NO_DIR = "—";

type Role = "op" | "dir" | "n" | "adj" | "pron" | "misc";
type Mode = "dir" | "noun"; // 配方向 / 配抽象名词

type DirMap = Map<string, TrainingSentence[]>;

function roleOf(bare: string): Role {
  if (OP_FORMS.has(bare)) return "op";
  if (DIRECTIVES.has(bare)) return "dir";
  if (PRONOUNS.has(bare)) return "pron";
  const t = TIER_ROLE[bare] ?? TIER_ROLE[bare.replace(/s$/, "")];
  if (t) return t;
  return "misc";
}

export default function WordAssembler() {
  // op -> direction -> 句（step1：物理短语动词）
  const dirIndex = useMemo(() => {
    const map = new Map<string, DirMap>();
    for (const s of TRAINING_SENTENCES) {
      if (s.step !== 1 || !s.operator) continue;
      const dir = s.direction || NO_DIR;
      if (!map.has(s.operator)) map.set(s.operator, new Map());
      const dm = map.get(s.operator)!;
      if (!dm.has(dir)) dm.set(dir, []);
      dm.get(dir)!.push(s);
    }
    return map;
  }, []);

  // op -> noun -> 句（step2：抽象搭配 make a decision）
  const nounIndex = useMemo(() => {
    const map = new Map<string, DirMap>();
    for (const s of TRAINING_SENTENCES) {
      if (s.step !== 2 || !s.operator || !s.noun) continue;
      if (!map.has(s.operator)) map.set(s.operator, new Map());
      const dm = map.get(s.operator)!;
      if (!dm.has(s.noun)) dm.set(s.noun, []);
      dm.get(s.noun)!.push(s);
    }
    return map;
  }, []);

  const [op, setOp] = useState("put");
  const [mode, setMode] = useState<Mode>("dir");
  const [dir, setDir] = useState("on");
  const [noun, setNoun] = useState("");

  const activeIndex = mode === "dir" ? dirIndex : nounIndex;
  const keyMap = activeIndex.get(op);
  const keys = useMemo(() => {
    if (!keyMap) return [] as string[];
    return Array.from(keyMap.keys()).sort((a, b) =>
      a === NO_DIR ? -1 : b === NO_DIR ? 1 : a.localeCompare(b),
    );
  }, [keyMap]);

  const sel = mode === "dir" ? dir : noun;
  const activeKey = keyMap?.has(sel) ? sel : keys[0] ?? "";
  const sentences = keyMap?.get(activeKey) ?? [];
  const opEntry = getOperatorEntry(op);

  // 该组合最常见的 replaces（被替代的普通动词）
  const replaces = useMemo(() => {
    const c = new Map<string, number>();
    for (const s of sentences) if (s.replaces) c.set(s.replaces, (c.get(s.replaces) ?? 0) + 1);
    let best = ""; let n = 0;
    for (const [k, v] of c) if (v > n) { best = k; n = v; }
    return best;
  }, [sentences]);

  const pickOp = (o: string) => {
    setOp(o);
    const dm = (mode === "dir" ? dirIndex : nounIndex).get(o);
    const first = dm ? Array.from(dm.keys())[0] : "";
    if (mode === "dir") setDir(first ?? ""); else setNoun(first ?? "");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    const dm = (m === "dir" ? dirIndex : nounIndex).get(op);
    const first = dm ? Array.from(dm.keys())[0] : "";
    if (m === "dir") setDir(first ?? ""); else setNoun(first ?? "");
  };

  const renderChunks = (sentence: string) =>
    sentence.split(/(\s+)/).map((tok, i) => {
      if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
      const bare = tok.toLowerCase().replace(/^[("'[]+|[)"'\],.!?;:]+$/g, "");
      const role = roleOf(bare);
      return (
        <span key={i} className={`asm-chunk asm-chunk--${role}`}>
          {tok}
        </span>
      );
    });

  return (
    <div className="assembler">
      <p className="asm-intro">
        Ogden 拼词造句 = <strong>三层叠加</strong>：先选 1 个<strong>动作引擎</strong>，配 1 个<strong>运作词</strong>拼出短语动作，再挂<strong>内容词</strong>说完整句——18 × 运作词 × 850 词，覆盖日常九成场景。
      </p>

      {/* STEP 1 · Operator */}
      <div className="asm-step">
        <span className="asm-step-label"><em>01</em> 选动作引擎 · 18 Operator</span>
        <div className="asm-op-grid">
          {OP_ORDER.map((o) => (
            <button
              key={o}
              type="button"
              className={`asm-op-chip${o === op ? " asm-op-chip--active" : ""}`}
              onClick={() => pickOp(o)}
            >
              <span className="asm-op-visual"><OperatorVisual type={o} /></span>
              <span className="asm-op-word">{o}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2 · 配运作词（方向/介词 或 抽象名词） */}
      <div className="asm-step">
        <span className="asm-step-label"><em>02</em> 配运作词 → 拼出短语动作</span>
        <div className="asm-mode-toggle">
          <button type="button" className={`asm-mode-btn${mode === "dir" ? " active" : ""}`} onClick={() => switchMode("dir")}>
            + 方向/介词<small>put + on = 穿</small>
          </button>
          <button type="button" className={`asm-mode-btn${mode === "noun" ? " active" : ""}`} onClick={() => switchMode("noun")} disabled={!nounIndex.get(op)}>
            + 抽象名词<small>make + decision = 决定</small>
          </button>
        </div>
        <div className="asm-dir-row">
          {keys.length === 0 && <span className="asm-empty">该 operator 暂无此类组合，换一个试试</span>}
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              className={`asm-dir-chip${k === activeKey ? " asm-dir-chip--active" : ""}`}
              onClick={() => (mode === "dir" ? setDir(k) : setNoun(k))}
            >
              {k === NO_DIR ? "直接" : k}
            </button>
          ))}
        </div>
      </div>

      {/* 公式条 */}
      {activeKey && (
        <div className="asm-formula">
          <code className="asm-formula-op">{op}</code>
          {activeKey !== NO_DIR && (
            <>
              <span className="asm-formula-plus">+</span>
              <code className={mode === "dir" ? "asm-formula-dir" : "asm-formula-noun"}>{activeKey}</code>
            </>
          )}
          <span className="asm-formula-eq">=</span>
          <span className="asm-formula-result">{replaces || "（基础动作）"}</span>
          {opEntry?.vector && <span className="asm-formula-vector">{opEntry.vector}</span>}
        </div>
      )}

      {/* STEP 3 · 真实例句（全程语义着色 + 发音） */}
      <div className="asm-step">
        <span className="asm-step-label"><em>03</em> 挂内容词 → 真实例句</span>
        <div className="asm-legend">
          <span className="asm-legend-chip asm-legend-chip--op">动作 operator</span>
          <span className="asm-legend-chip asm-legend-chip--dir">运作词·方向</span>
          <span className="asm-legend-chip asm-legend-chip--n">名词 things</span>
          <span className="asm-legend-chip asm-legend-chip--adj">性质 qualities</span>
        </div>
        <div className="asm-result-head">
          <span className="asm-result-count">{sentences.length} 句</span>
          <span className="asm-result-hint">点「听」放 Sonia 英式女声（已配真人音频）</span>
        </div>
        <ul className="asm-sentence-list">
          {sentences.map((s) => (
            <li key={s.id} className="asm-sentence">
              <div className="asm-sentence-body">
                <p className="asm-sentence-en">
                  {renderChunks(s.sentence)}
                  <button
                    type="button"
                    className="word-speak word-speak--sm"
                    aria-label={`朗读 ${s.sentence}`}
                    disabled={!isSpeechSupported()}
                    onClick={() => void speakText(s.sentence, s.id)}
                  >
                    听
                  </button>
                </p>
                {s.zh && <p className="asm-sentence-zh">{s.zh}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
