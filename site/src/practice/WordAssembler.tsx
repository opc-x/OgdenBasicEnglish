import { useMemo, useState } from "react";
import { speakText, isSpeechSupported } from "../speak";
import { getOperatorEntry } from "../operatorData";
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

const NO_DIR = "—";

type DirMap = Map<string, TrainingSentence[]>;

export default function WordAssembler() {
  // index: operator -> direction -> sentences（覆盖所有含 operator 的训练句）
  const index = useMemo(() => {
    const map = new Map<string, DirMap>();
    const dirSet = new Set<string>();
    for (const s of TRAINING_SENTENCES) {
      if (!s.operator) continue;
      const op = s.operator;
      const dir = s.direction || NO_DIR;
      if (dir !== NO_DIR) dirSet.add(dir);
      if (!map.has(op)) map.set(op, new Map());
      const dm = map.get(op)!;
      if (!dm.has(dir)) dm.set(dir, []);
      dm.get(dir)!.push(s);
    }
    return { map, dirSet };
  }, []);

  const [op, setOp] = useState<string>("put");
  const [dir, setDir] = useState<string>("on");

  const dirMap = index.map.get(op);
  const dirs = useMemo(() => {
    if (!dirMap) return [] as string[];
    return Array.from(dirMap.keys()).sort((a, b) => (a === NO_DIR ? -1 : b === NO_DIR ? 1 : a.localeCompare(b)));
  }, [dirMap]);

  // 切 operator 时把 direction 落到该 op 的第一个有效方向
  const activeDir = dirMap?.has(dir) ? dir : dirs[0] ?? NO_DIR;
  const sentences = dirMap?.get(activeDir) ?? [];
  const opEntry = getOperatorEntry(op);

  // 该 op+dir 最常见的 replaces（被替代的普通动词）
  const replaces = useMemo(() => {
    const count = new Map<string, number>();
    for (const s of sentences) if (s.replaces) count.set(s.replaces, (count.get(s.replaces) ?? 0) + 1);
    let best = ""; let n = 0;
    for (const [k, v] of count) if (v > n) { best = k; n = v; }
    return best;
  }, [sentences]);

  const renderChunks = (sentence: string) =>
    sentence.split(/(\s+)/).map((tok, i) => {
      if (/^\s+$/.test(tok)) return tok;
      const bare = tok.toLowerCase().replace(/^[("'[]+|[)"'\],.!?;:]+$/g, "");
      let role: "op" | "dir" | "misc" = "misc";
      if (OP_FORMS.has(bare)) role = "op";
      else if (bare === activeDir || index.dirSet.has(bare)) role = "dir";
      return (
        <span key={i} className={`asm-chunk asm-chunk--${role}`}>
          {tok}
        </span>
      );
    });

  return (
    <div className="assembler">
      <p className="asm-intro">
        Ogden 拼词造句：选一个 <strong>动作 operator</strong>，配一个 <strong>物理方向</strong>，立刻看见它替代了哪个普通动词，以及真实例句。
      </p>

      {/* Step 1 · 18 Operator */}
      <div className="asm-step">
        <span className="asm-step-label"><em>01</em> 选动作 · Operator</span>
        <div className="asm-op-grid">
          {OP_ORDER.map((o) => (
            <button
              key={o}
              type="button"
              className={`asm-op-chip${o === op ? " asm-op-chip--active" : ""}`}
              onClick={() => setOp(o)}
            >
              <span className="asm-op-visual"><OperatorVisual type={o} /></span>
              <span className="asm-op-word">{o}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 · 方向 */}
      <div className="asm-step">
        <span className="asm-step-label"><em>02</em> 选方向 · Direction</span>
        <div className="asm-dir-row">
          {dirs.map((d) => (
            <button
              key={d}
              type="button"
              className={`asm-dir-chip${d === activeDir ? " asm-dir-chip--active" : ""}`}
              onClick={() => setDir(d)}
            >
              {d === NO_DIR ? "直接造句" : d}
            </button>
          ))}
        </div>
      </div>

      {/* 公式条：operator + direction = 普通动词 */}
      <div className="asm-formula">
        <code className="asm-formula-op">{op}</code>
        {activeDir !== NO_DIR && (
          <>
            <span className="asm-formula-plus">+</span>
            <code className="asm-formula-dir">{activeDir}</code>
          </>
        )}
        <span className="asm-formula-eq">=</span>
        <span className="asm-formula-result">{replaces || "（基础动作）"}</span>
        {opEntry?.vector && <span className="asm-formula-vector">{opEntry.vector}</span>}
      </div>

      {/* 着色图例 */}
      <div className="asm-legend">
        <span className="asm-legend-chip asm-legend-chip--op">Operator 动作</span>
        <span className="asm-legend-chip asm-legend-chip--dir">方向</span>
        <span className="asm-legend-chip asm-legend-chip--misc">850 词</span>
      </div>

      {/* Step 3 · 例句 */}
      <div className="asm-result">
        <div className="asm-result-head">
          <span className="asm-result-count">{sentences.length} 句</span>
          <span className="asm-result-hint">点「听」放 Sonia 英式女声（已配真人音频）</span>
        </div>
        <ul className="asm-sentence-list">
          {sentences.map((s) => (
            <li key={s.id} className="asm-sentence">
              <div className="asm-sentence-body">
                <div className="asm-sentence-en">
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
                </div>
                {s.zh && <p className="asm-sentence-zh">{s.zh}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
