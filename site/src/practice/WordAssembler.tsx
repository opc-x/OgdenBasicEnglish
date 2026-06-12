import { useMemo, useState } from "react";
import { speakText, isSpeechSupported } from "../speak";
import { getOperatorEntry } from "../operatorData";
import { WORDS, isOperator } from "../words850";
import OperatorVisual from "../OperatorVisual";
import { TRAINING_SENTENCES, type TrainingSentence } from "./trainingData";

export type AssemblerTier = "op18" | "ops" | "all" | "pic" | "things" | "qual" | "opp";

// 18 operator 固定顺序
const OP_ORDER = [
  "put", "take", "go", "come", "get", "give", "make", "keep", "send",
  "let", "see", "have", "do", "be", "seem", "say", "may", "will",
];

const OP_FORMS = new Set<string>([
  ...OP_ORDER,
  "puts", "putting", "takes", "took", "taken", "taking", "goes", "went", "gone", "going",
  "comes", "came", "coming", "gets", "got", "getting", "gives", "gave", "given", "giving",
  "makes", "made", "making", "keeps", "kept", "keeping", "sends", "sent", "sending",
  "lets", "letting", "sees", "saw", "seen", "seeing", "has", "had", "having",
  "does", "did", "done", "doing", "is", "are", "am", "was", "were", "been", "being",
  "seems", "seemed", "says", "said", "saying", "would", "might",
]);

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

const TIER_ROLE: Record<string, "n" | "adj"> = {};
for (const w of WORDS) {
  if (w.t === "pic" || w.t === "things") TIER_ROLE[w.w] = "n";
  else if (w.t === "qual" || w.t === "opp") TIER_ROLE[w.w] = "adj";
}

const NO_DIR = "—";
type Role = "op" | "dir" | "n" | "adj" | "pron" | "misc";
type DirMap = Map<string, TrainingSentence[]>;

function roleOf(bare: string): Role {
  if (OP_FORMS.has(bare)) return "op";
  if (DIRECTIVES.has(bare)) return "dir";
  if (PRONOUNS.has(bare)) return "pron";
  const t = TIER_ROLE[bare] ?? TIER_ROLE[bare.replace(/s$/, "")];
  if (t) return t;
  return "misc";
}

function renderChunks(sentence: string) {
  return sentence.split(/(\s+)/).map((tok, i) => {
    if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
    const bare = tok.toLowerCase().replace(/^[("'[]+|[)"'\],.!?;:]+$/g, "");
    return <span key={i} className={`asm-chunk asm-chunk--${roleOf(bare)}`}>{tok}</span>;
  });
}

function SentenceRow({ s }: { s: TrainingSentence }) {
  return (
    <li className="asm-sentence">
      <div className="asm-sentence-body">
        <p className="asm-sentence-en">
          {renderChunks(s.sentence)}
          <button
            type="button"
            className="word-speak word-speak--sm"
            aria-label={`朗读 ${s.sentence}`}
            disabled={!isSpeechSupported()}
            onClick={() => void speakText(s.sentence, s.id)}
            title="点喇叭听 Sonia 英式女声"
          >
            <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.5 7-8.8s-3-7.8-7-8.8z"
              />
            </svg>
          </button>
        </p>
        {s.zh && <p className="asm-sentence-zh">{s.zh}</p>}
      </div>
    </li>
  );
}

const Legend = () => (
  <div className="asm-legend">
    <span className="asm-legend-chip asm-legend-chip--op">动作 operator</span>
    <span className="asm-legend-chip asm-legend-chip--dir">运作词·方向</span>
    <span className="asm-legend-chip asm-legend-chip--n">名词 things</span>
    <span className="asm-legend-chip asm-legend-chip--adj">性质 qualities</span>
  </div>
);

function RulesGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="asm-rules-guide">
      <button
        type="button"
        className="asm-rules-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="asm-rules-toggle-icon">{isOpen ? "▼" : "▶"}</span>
        <span>💡 Ogden 拼词造句五大倍增规则（点击折叠/展开）</span>
      </button>

      {isOpen && (
        <div className="asm-rules-content">
          <div className="asm-rules-grid">
            <div className="asm-rule-card">
              <h4>1. 动作 + 方向 = 短语动词</h4>
              <p>消灭普通动词，用 18个动作引擎与方向/介词组合，替代 4000+ 传统词汇。</p>
              <div className="asm-rule-example">
                <code>put</code> + <code>on</code> = <strong>穿 (wear)</strong> <br />
                <code>take</code> + <code>off</code> = <strong>脱 (undress)</strong>
              </div>
            </div>

            <div className="asm-rule-card">
              <h4>2. 名词派生词后缀 (-er/-ing/-ed)</h4>
              <p>约 300 个核心名词可以派生人/动作/状态，且不增加新词根负担。</p>
              <div className="asm-rule-example">
                <code>work</code> + <code>-er</code> = <strong>worker (工人)</strong> <br />
                <code>work</code> + <code>-ing</code> = <strong>working (工作着)</strong> <br />
                <code>work</code> + <code>-ed</code> = <strong>worked (已工作)</strong>
              </div>
            </div>

            <div className="asm-rule-card">
              <h4>3. 性质词 + -ly = 副词</h4>
              <p>性质词（形容词）加上 <code>-ly</code> 后缀，变为副词修饰动作。</p>
              <div className="asm-rule-example">
                <code>quick</code> + <code>-ly</code> = <strong>quickly (快地)</strong> <br />
                <code>slow</code> + <code>-ly</code> = <strong>slowly (慢地)</strong>
              </div>
            </div>

            <div className="asm-rule-card">
              <h4>4. 前缀 un- = 反义词</h4>
              <p>在性质词前加上 <code>un-</code>，可直接表达相反的意思。</p>
              <div className="asm-rule-example">
                <code>happy</code> + <code>un-</code> = <strong>unhappy (不快乐)</strong> <br />
                <code>clean</code> + <code>un-</code> = <strong>unclean (不干净)</strong>
              </div>
            </div>

            <div className="asm-rule-card">
              <h4>5. 两个核心词合成 = 复合词</h4>
              <p>将两个基础词拼在一起，构成新的名词或代词。</p>
              <div className="asm-rule-example">
                <code>sun</code> + <code>light</code> = <strong>sunlight (阳光)</strong> <br />
                <code>rain</code> + <code>coat</code> = <strong>raincoat (雨衣)</strong> <br />
                <code>some</code> + <code>one</code> = <strong>someone (某人)</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 模式 A：operator × 运作词（动作类 tab） ──
function OperatorMode() {
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
  const [mode, setMode] = useState<"dir" | "noun">("dir");
  const [sel, setSel] = useState("on");

  const activeIndex = mode === "dir" ? dirIndex : nounIndex;
  const keyMap = activeIndex.get(op);
  const keys = useMemo(() => {
    if (!keyMap) return [] as string[];
    return Array.from(keyMap.keys()).sort((a, b) => (a === NO_DIR ? -1 : b === NO_DIR ? 1 : a.localeCompare(b)));
  }, [keyMap]);
  const activeKey = keyMap?.has(sel) ? sel : keys[0] ?? "";
  const sentences = keyMap?.get(activeKey) ?? [];
  const opEntry = getOperatorEntry(op);
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
    setSel(dm ? Array.from(dm.keys())[0] ?? "" : "");
  };
  const switchMode = (m: "dir" | "noun") => {
    setMode(m);
    const dm = (m === "dir" ? dirIndex : nounIndex).get(op);
    setSel(dm ? Array.from(dm.keys())[0] ?? "" : "");
  };

  // 量化：当前 operator 已覆盖多少组合 / 多少句
  const opCombos = (dirIndex.get(op)?.size ?? 0) + (nounIndex.get(op)?.size ?? 0);
  const opSentences =
    [...(dirIndex.get(op)?.values() ?? [])].reduce((a, v) => a + v.length, 0) +
    [...(nounIndex.get(op)?.values() ?? [])].reduce((a, v) => a + v.length, 0);

  return (
    <div className="assembler">
      <p className="asm-intro">
        Ogden 拼词造句 = <strong>三层叠加</strong>：选 1 个<strong>动作引擎</strong>，配 1 个<strong>运作词</strong>拼出短语，再挂内容词成句。
      </p>
      <RulesGuide />

      <div className="asm-step">
        <span className="asm-step-label"><em>01</em> 选动作引擎 · 18 Operator</span>
        <div className="asm-op-grid">
          {OP_ORDER.map((o) => (
            <button key={o} type="button" className={`asm-op-chip${o === op ? " asm-op-chip--active" : ""}`} onClick={() => pickOp(o)}>
              <span className="asm-op-visual"><OperatorVisual type={o} /></span>
              <span className="asm-op-word">{o}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="asm-step">
        <span className="asm-step-label"><em>02</em> 配运作词 → 拼出短语动作
          <b className="asm-stat">{op} 已覆盖 {opCombos} 组合 · {opSentences} 句</b>
        </span>
        <div className="asm-mode-toggle">
          <button type="button" className={`asm-mode-btn${mode === "dir" ? " active" : ""}`} onClick={() => switchMode("dir")}>+ 方向/介词<small>put + on = 穿</small></button>
          <button type="button" className={`asm-mode-btn${mode === "noun" ? " active" : ""}`} onClick={() => switchMode("noun")} disabled={!nounIndex.get(op)}>+ 抽象名词<small>make + decision = 决定</small></button>
        </div>
        <div className="asm-dir-row">
          {keys.length === 0 && <span className="asm-empty">该 operator 暂无此类组合</span>}
          {keys.map((k) => (
            <button key={k} type="button" className={`asm-dir-chip${k === activeKey ? " asm-dir-chip--active" : ""}`} onClick={() => setSel(k)}>
              {k === NO_DIR ? "直接" : k}
            </button>
          ))}
        </div>
      </div>

      {activeKey && (
        <div className="asm-formula">
          <code className="asm-formula-op">{op}</code>
          {activeKey !== NO_DIR && (<><span className="asm-formula-plus">+</span><code className={mode === "dir" ? "asm-formula-dir" : "asm-formula-noun"}>{activeKey}</code></>)}
          <span className="asm-formula-eq">=</span>
          <span className="asm-formula-result">{replaces || "（基础动作）"}</span>
          {opEntry?.vector && <span className="asm-formula-vector">{opEntry.vector}</span>}
        </div>
      )}

      <div className="asm-step">
        <span className="asm-step-label"><em>03</em> 挂内容词 → 真实例句 <b className="asm-stat">{sentences.length} 句</b></span>
        <Legend />
        <ul className="asm-sentence-list">{sentences.map((s) => <SentenceRow key={s.id} s={s} />)}</ul>
      </div>
    </div>
  );
}

// ── 模式 B：内容词造句（名词/性质 tab） ──
function ContentMode({ tier }: { tier: "pic" | "things" | "qual" | "opp" }) {
  // 该分类的词
  const words = useMemo(() => WORDS.filter((w) => w.t === tier), [tier]);
  // 每个词 → 含它的训练句
  const wordSentences = useMemo(() => {
    const map = new Map<string, TrainingSentence[]>();
    for (const w of words) {
      const re = new RegExp(`\\b${w.w.toLowerCase()}\\b`, "i");
      const hits = TRAINING_SENTENCES.filter((s) => re.test(s.sentence || ""));
      if (hits.length) map.set(w.w, hits);
    }
    return map;
  }, [words]);

  const covered = wordSentences.size;
  const total = words.length;
  const pct = total ? Math.round((covered / total) * 100) : 0;

  const coveredWords = useMemo(() => words.filter((w) => wordSentences.has(w.w)), [words, wordSentences]);
  const [sel, setSel] = useState<string>("");
  const activeWord = sel || coveredWords[0]?.w || "";
  const sentences = wordSentences.get(activeWord) ?? [];

  return (
    <div className="assembler">
      <p className="asm-intro">
        用<strong>这一类词</strong>造句：点一个词，看它在 BE850 真实句子里怎么用——operator 当动作、它当内容词。
      </p>
      <RulesGuide />

      <div className="asm-coverage">
        <div className="asm-coverage-bar"><span style={{ width: `${pct}%` }} /></div>
        <span className="asm-coverage-text">已有例句覆盖 <b>{covered}/{total}</b> 词（{pct}%）<i>剩余 {total - covered} 词待生成补全</i></span>
      </div>

      <div className="asm-step">
        <span className="asm-step-label"><em>选词</em> {tier === "pic" ? "看得见的物" : tier === "things" ? "抽象的物" : tier === "qual" ? "性质词" : "反义词"}（{covered} 个有例句）</span>
        <div className="asm-word-row">
          {coveredWords.map((w) => (
            <button key={w.w} type="button" className={`asm-word-chip${w.w === activeWord ? " asm-word-chip--active" : ""}`} onClick={() => setSel(w.w)}>
              {w.w}<small>{wordSentences.get(w.w)!.length}</small>
            </button>
          ))}
          {covered === 0 && <span className="asm-empty">这一类暂无现成例句——下一步用模型批量生成。</span>}
        </div>
      </div>

      {activeWord && (
        <div className="asm-step">
          <span className="asm-step-label"><em>例句</em> <code className="asm-formula-op" style={{ fontSize: "0.95rem" }}>{activeWord}</code> 在真实句中的用法 <b className="asm-stat">{sentences.length} 句</b></span>
          <Legend />
          <ul className="asm-sentence-list">{sentences.map((s) => <SentenceRow key={s.id} s={s} />)}</ul>
        </div>
      )}
    </div>
  );
}

export default function WordAssembler({ tier = "op18" }: { tier?: AssemblerTier }) {
  void isOperator;
  if (tier === "pic" || tier === "things" || tier === "qual" || tier === "opp") {
    return <ContentMode tier={tier} />;
  }
  return <OperatorMode />;
}
