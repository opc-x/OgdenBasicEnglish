import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { speakText } from "../speak";
import { analyzeSentence } from "./be850Lexicon";
import { checkAnswer } from "./checkAnswer";
import { REWRITE_CHALLENGES } from "./rewriteChallenges";
import { SCENARIO_CHALLENGES } from "./scenarioChallenges";
import SentenceAuditor from "./SentenceAuditor";
import SentenceBuilder from "./SentenceBuilder";
import { TRAINING_SENTENCES, type TrainingSentence } from "./trainingData";

type Tab = "build" | "write" | "rewrite" | "scene" | "train";

const TABS: { id: Tab; label: string; desc: string }[] = [
  { id: "train", label: "训练", desc: "842句-Ogden三步走" },
  { id: "build", label: "拼句器", desc: "点词块 → 立刻出句" },
  { id: "write", label: "自由造句", desc: "打字 → 逐词变绿/变红" },
  { id: "rewrite", label: "降维改写", desc: "难句 → 你的 BE850" },
  { id: "scene", label: "场景挑战", desc: "课文场景 → 你说出来" },
];

// ── Training Tab: numbered list with speaker icon + English + Chinese ──
function TrainingTab() {
  const step1ByOp = useMemo(() => {
    const map = new Map<string, TrainingSentence[]>();
    for (const s of TRAINING_SENTENCES) if (s.step === 1 && s.operator) {
      if (!map.has(s.operator)) map.set(s.operator, []);
      map.get(s.operator)!.push(s);
    }
    return map;
  }, []);

  const step2Groups = useMemo(() => {
    const groups: { label: string; replaces: string; sentences: TrainingSentence[] }[] = [];
    let cur: TrainingSentence[] = []; let cl = ""; let cr = "";
    for (const s of TRAINING_SENTENCES) {
      if (s.step !== 2) continue;
      const k = `${s.operator}+${s.noun}`;
      if (k !== cl) { if (cur.length) groups.push({label:cl,replaces:cr,sentences:cur}); cur=[]; cl=k; cr=s.replaces||""; }
      cur.push(s);
    }
    if (cur.length) groups.push({label:cl,replaces:cr,sentences:cur});
    return groups;
  }, []);

  const step3ByScene = useMemo(() => {
    const map = new Map<string, TrainingSentence[]>();
    for (const s of TRAINING_SENTENCES) if (s.step === 3 && s.scene) {
      if (!map.has(s.scene)) map.set(s.scene, []);
      map.get(s.scene)!.push(s);
    }
    return map;
  }, []);

  const [activeStep, setActiveStep] = useState<1|2|3>(1);
  const [expandedOps, setExpandedOps] = useState<Set<string>>(new Set(["put","take","go"]));

  const toggleOp = (op:string) => {
    const n = new Set(expandedOps); n.has(op)?n.delete(op):n.add(op); setExpandedOps(n);
  };

  let globalIdx = 0;
  const renderRow = (s:TrainingSentence) => {
    globalIdx++;
    return (
    <li key={s.id} className="training-row">
      <span className="training-row-num">{globalIdx}</span>
      <button className="training-row-speaker" onClick={() => speakText(s.sentence)} title="Sonia 英式女声朗读" aria-label="朗读">🔊</button>
      <span className="training-row-en">{s.sentence}</span>
      {s.zh && <span className="training-row-zh">{s.zh}</span>}
    </li>
  );

  return (
    <div className="training-tab">
      <button className={`training-step-btn${activeStep===1?" active":""}`} onClick={()=>setActiveStep(1)}>Step 1 · 18 Operator × 方向/介词 <em>{step1ByOp.size}个operator·{TRAINING_SENTENCES.filter(s=>s.step===1).length}句</em></button>
      <button className={`training-step-btn${activeStep===2?" active":""}`} onClick={()=>setActiveStep(2)}>Step 2 · Step1 × 850 词 <em>（可见名词/抽象名词/性质词/反义词）·{step2Groups.length}组合·{TRAINING_SENTENCES.filter(s=>s.step===2).length}句</em></button>
      <button className={`training-step-btn${activeStep===3?" active":""}`} onClick={()=>setActiveStep(3)}>Step 3 · 场景句 <em>{step3ByScene.size}场景·{TRAINING_SENTENCES.filter(s=>s.step===3).length}句</em></button>

      {activeStep===1 && (
        <div>
          {Array.from(step1ByOp.entries()).sort().map(([op,sentences])=>{
            const dirs = new Map<string,TrainingSentence[]>();
            for (const s of sentences) { const d=s.direction||""; if(!dirs.has(d)) dirs.set(d,[]); dirs.get(d)!.push(s); }
            const open = expandedOps.has(op);
            return (
              <div key={op} className="training-op-block">
                <button className="training-op-header" onClick={()=>toggleOp(op)}>
                  <strong className="training-op-name">{op}</strong>
                  <span className="training-op-meta">{dirs.size}个方向词{'\u00b7'}{sentences.length}句{'\u00b7'}{Array.from(dirs.keys()).sort().join(', ')}</span>
                  <span className={`training-op-arrow${open?" open":""}`}>▼</span>
                </button>
                {open && <div className="training-op-body">
                  {Array.from(dirs.entries()).sort().map(([dir,ds])=>(
                    <div key={dir} className="training-dir-group">
                      <div className="training-dir-label"><code>{op} + {dir}</code>{ds[0]?.replaces&&<span className="training-replaces"> = {ds[0].replaces}</span>}</div>
                      <ol className="training-sentence-list">{ds.map(s=>renderRow(s))}</ol>
                    </div>
                  ))}
                </div>}
              </div>
            );
          })}
        </div>
      )}

      {activeStep===2 && (
        <div>{step2Groups.map((g,i)=>(
          <div key={i} className="training-opnoun-block">
            <div className="training-opnoun-label"><code>{g.label}</code> = {g.replaces}<span className="training-opnoun-count">{g.sentences.length}句</span></div>
            <ol className="training-sentence-list">{g.sentences.map(s=>renderRow(s))}</ol>
          </div>
        ))}</div>
      )}

      {activeStep===3 && (
        <div>{Array.from(step3ByScene.entries()).map(([scene,sentences])=>(
          <div key={scene} className="training-scene-block">
            <h3 className="training-scene-title">{scene}</h3>
            <ol className="training-sentence-list">{sentences.map(s=>renderRow(s))}</ol>
          </div>
        ))}</div>
      )}
    </div>
  );
}

// ── Main Output Lab ──

export default function OutputLabPage() {
  const [tab, setTab] = useState<Tab>("train");  // Default to training tab
  const [freeText, setFreeText] = useState("");
  const [rewriteIdx, setRewriteIdx] = useState(0);
  const [rewriteInput, setRewriteInput] = useState("");
  const [rewriteChecked, setRewriteChecked] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneText, setSceneText] = useState("");
  const [sceneRevealed, setSceneRevealed] = useState(false);

  const challenge = REWRITE_CHALLENGES[rewriteIdx];
  const scene = SCENARIO_CHALLENGES[sceneIdx];

  const rewriteResult = rewriteChecked
    ? checkAnswer(rewriteInput, challenge.models)
    : null;

  const sceneAnalysis = sceneText.trim() ? analyzeSentence(sceneText) : null;
  const sceneKeywordsHit =
    scene.mustUse?.filter((kw) => sceneText.toLowerCase().includes(kw)) ?? [];

  return (
    <div className="output-lab">
      <header className="practice-header">
        <p className="practice-kicker">第 4 步 · 练输出 · 看见效果</p>
        <h1>造句实战</h1>
        <p className="practice-sub">
          学了词和规则不是终点——<strong>在这里拼句、造句、改写、训练</strong>，每个词当场标色，立刻看见你能不能说出来。
        </p>
      </header>

      <div className="lab-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`lab-tab${tab === t.id ? " lab-tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className="lab-tab-label">{t.label}</span>
            <span className="lab-tab-desc">{t.desc}</span>
          </button>
        ))}
      </div>

      {tab === "train" && <TrainingTab />}

      {tab === "build" && (
        <section className="practice-section lab-panel">
          <h2>拼句器</h2>
          <SentenceBuilder />
        </section>
      )}

      {tab === "write" && (
        <section className="practice-section lab-panel">
          <h2>自由造句</h2>
          <p className="practice-hint">
            用你学过的 operator + 850 词写一句完整英语。绿色=合规，紫色=operator，红色=超纲（附替换提示）。
          </p>
          <textarea
            className="lab-textarea"
            rows={4}
            placeholder="I put the book on the table."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
          />
          <div className="lab-textarea-actions">
            <button type="button" className="btn btn-primary btn-sm" disabled={!freeText.trim()} onClick={() => speakText(freeText)}>
              朗读
            </button>
          </div>
          <SentenceAuditor text={freeText} showEmpty />
        </section>
      )}

      {tab === "rewrite" && (
        <section className="practice-section lab-panel">
          <h2>降维改写</h2>
          <p className="practice-hint">把普通英语改成 BE850——动词换 operator，删掉花哨词。</p>

          <div className="lab-challenge-nav">
            {REWRITE_CHALLENGES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`lab-challenge-pill${i === rewriteIdx ? " active" : ""}`}
                onClick={() => {
                  setRewriteIdx(i);
                  setRewriteInput("");
                  setRewriteChecked(false);
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="lab-hard-card">
            <span className="lab-card-tag">普通英语</span>
            <p className="lab-hard-text">{challenge.hard}</p>
            <p className="lab-hard-zh">{challenge.hardZh}</p>
          </div>

          <textarea
            className="lab-textarea"
            rows={3}
            placeholder="用 BE850 改写…"
            value={rewriteInput}
            onChange={(e) => {
              setRewriteInput(e.target.value);
              setRewriteChecked(false);
            }}
          />

          <div className="lab-textarea-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setRewriteChecked(true)}
              disabled={!rewriteInput.trim()}
            >
              对照检查
            </button>
            {rewriteInput.trim() && <button type="button" className="btn btn-ghost btn-sm" onClick={() => speakText(rewriteInput)}>朗读我的</button>}
          </div>

          <SentenceAuditor text={rewriteInput} />

          {rewriteChecked && (
            <div className="lab-result-card">
              <span className="lab-card-tag">效果</span>
              {rewriteResult === "correct" && <p className="lab-result-ok">✓ 与官方范例一致或等价</p>}
              {rewriteResult === "close" && <p className="lab-result-ok">≈ 方向对了，对照下方范例微调</p>}
              {rewriteResult === "wrong" && <p className="lab-result-warn">再试——记得用 operator 替代普通动词</p>}
              <p className="lab-note">{challenge.note}</p>
              <p className="lab-model-label">官方范例：</p>
              {challenge.models.map((m) => (
                <button key={m} type="button" className="lab-model-line" onClick={() => speakText(m)}>
                  {m}
                </button>
              ))}
              <p className="lab-ops-hint">
                本关 operator：<code>{challenge.operators.join(", ")}</code>
              </p>
            </div>
          )}
        </section>
      )}

      {tab === "scene" && (
        <section className="practice-section lab-panel">
          <h2>场景挑战</h2>
          <p className="practice-hint">课文场景——用 2–3 句 BE850 说出来，再对照官方示范。</p>

          <div className="lab-scene-picker">
            {SCENARIO_CHALLENGES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`lab-scene-btn${i === sceneIdx ? " active" : ""}`}
                onClick={() => {
                  setSceneIdx(i);
                  setSceneText("");
                  setSceneRevealed(false);
                }}
              >
                <strong>{s.titleZh}</strong>
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          <div className="lab-scene-card">
            <span className="lab-card-tag">{scene.source}</span>
            <p className="lab-scene-prompt">{scene.promptZh}</p>
            <p className="lab-scene-hint">提示：{scene.hint}</p>
            {scene.mustUse && (
              <p className="lab-scene-must">
                尽量用到：<code>{scene.mustUse.join(", ")}</code>
                {sceneKeywordsHit.length > 0 && (
                  <span className="lab-must-hit"> · 已用 {sceneKeywordsHit.length}/{scene.mustUse.length}</span>
                )}
              </p>
            )}
          </div>

          <textarea
            className="lab-textarea"
            rows={4}
            placeholder="Write 2–3 sentences in Basic English…"
            value={sceneText}
            onChange={(e) => {
              setSceneText(e.target.value);
              setSceneRevealed(false);
            }}
          />

          <div className="lab-textarea-actions">
            <button type="button" className="btn btn-primary btn-sm" disabled={!sceneText.trim()} onClick={() => setSceneRevealed(true)}>
              看官方示范
            </button>
            {sceneText.trim() && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => speakText(sceneText)}>
                朗读我的
              </button>
            )}
          </div>

          <SentenceAuditor text={sceneText} />

          {sceneAnalysis && sceneAnalysis.score >= 80 && sceneKeywordsHit.length >= (scene.mustUse?.length ?? 0) && (
            <p className="auditor-win">✓ 场景过关：合规率高 + 关键词齐全。</p>
          )}

          {sceneRevealed && (
            <div className="lab-result-card">
              <span className="lab-card-tag">官方示范 · 你能说出这些就是效果</span>
              {scene.modelSentences.map((m) => (
                <button key={m} type="button" className="lab-model-line" onClick={() => speakText(m)}>
                  {m}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className="lab-more">
        <span>跟课深化：</span>
        <Link to="/practice/step-by-step/body">示范句跟读</Link>
        <Link to="/practice/basic-teacher/bt1">Basic Teacher</Link>
        <Link to="/doc/operators">18 Operators</Link>
      </footer>
    </div>
  );
}
