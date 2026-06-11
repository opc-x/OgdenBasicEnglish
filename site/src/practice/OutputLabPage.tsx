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

// ── Training Tab: group sentences by operator ──
function TrainingTab() {
  // Group Step 1 sentences by operator
  const step1ByOp = useMemo(() => {
    const map = new Map<string, TrainingSentence[]>();
    for (const s of TRAINING_SENTENCES) {
      if (s.step === 1 && s.operator) {
        if (!map.has(s.operator)) map.set(s.operator, []);
        map.get(s.operator)!.push(s);
      }
    }
    return map;
  }, []);

  // Step 2: op+noun combos
  const step2Groups = useMemo(() => {
    const groups: { label: string; sentences: TrainingSentence[] }[] = [];
    let current: TrainingSentence[] = [];
    let currentLabel = "";
    for (const s of TRAINING_SENTENCES) {
      if (s.step !== 2) continue;
      const label = `${s.operator} + ${s.noun} = ${s.replaces}`;
      if (label !== currentLabel) {
        if (current.length > 0) groups.push({ label: currentLabel, sentences: current });
        current = [];
        currentLabel = label;
      }
      current.push(s);
    }
    if (current.length > 0) groups.push({ label: currentLabel, sentences: current });
    return groups;
  }, []);

  // Step 3: scene sentences
  const step3ByScene = useMemo(() => {
    const map = new Map<string, TrainingSentence[]>();
    for (const s of TRAINING_SENTENCES) {
      if (s.step === 3 && s.scene) {
        if (!map.has(s.scene)) map.set(s.scene, []);
        map.get(s.scene)!.push(s);
      }
    }
    return map;
  }, []);

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [expandedOps, setExpandedOps] = useState<Set<string>>(new Set(["put", "take", "go"]));
  const [showTranslation, setShowTranslation] = useState(true);

  const toggleOp = (op: string) => {
    const next = new Set(expandedOps);
    if (next.has(op)) next.delete(op); else next.add(op);
    setExpandedOps(next);
  };

  return (
    <div className="training-tab">
      <div className="training-controls">
        <div className="training-step-tabs">
          <button className={`training-step-btn${activeStep === 1 ? " active" : ""}`} onClick={() => setActiveStep(1)}>
            Step 1 · Operator×方向词 <span className="training-step-count">{TRAINING_SENTENCES.filter(s => s.step === 1).length}句</span>
          </button>
          <button className={`training-step-btn${activeStep === 2 ? " active" : ""}`} onClick={() => setActiveStep(2)}>
            Step 2 · Operator+名词 <span className="training-step-count">{TRAINING_SENTENCES.filter(s => s.step === 2).length}句</span>
          </button>
          <button className={`training-step-btn${activeStep === 3 ? " active" : ""}`} onClick={() => setActiveStep(3)}>
            Step 3 · 场景句 <span className="training-step-count">{TRAINING_SENTENCES.filter(s => s.step === 3).length}句</span>
          </button>
        </div>
        <label className="training-toggle">
          <input type="checkbox" checked={showTranslation} onChange={() => setShowTranslation(!showTranslation)} />
          显示替换动词
        </label>
      </div>

      {/* Step 1: Op × Direction */}
      {activeStep === 1 && (
        <div className="training-step1">
          <p className="practice-hint">
            18 operator × 方向词 = 短语动词，替代 4000+ 普通动词。点喇叭朗读，跟着说。
          </p>
          {Array.from(step1ByOp.entries()).sort().map(([op, sentences]) => {
            // Get unique direction combos
            const combos = Array.from(new Map(sentences.map(s => [`${op}+${s.direction}`, s.replaces])).entries());
            const isExpanded = expandedOps.has(op);
            return (
              <div key={op} className="training-operator-group">
                <button className="training-operator-header" onClick={() => toggleOp(op)}>
                  <span className="training-op-name">{op}</span>
                  <span className="training-op-meta">{combos.length} 个组合 · {sentences.length} 句</span>
                  <span className={`training-op-arrow${isExpanded ? " open" : ""}`}>▼</span>
                </button>
                {isExpanded && (
                  <div className="training-operator-body">
                    {combos.map(([combo, replaces]) => {
                      const comboDir = combo.split("+")[1] || "";
                      const comboSentences = sentences.filter(s => s.direction === comboDir);
                      return (
                        <div key={combo} className="training-combo-row">
                          <div className="training-combo-label">
                            <code>{combo}</code>
                            {showTranslation && <span className="training-replaces"> = {replaces}</span>}
                          </div>
                          <div className="training-combo-sentences">
                            {comboSentences.slice(0, 6).map((s, i) => (
                              <button key={i} className="training-sentence-btn" onClick={() => speakText(s.sentence)} title="点击朗读">
                                {s.sentence}
                              </button>
                            ))}
                            {comboSentences.length > 6 && (
                              <span className="training-more">+{comboSentences.length - 6} more</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 2: Op + Noun */}
      {activeStep === 2 && (
        <div className="training-step2">
          <p className="practice-hint">
            operator + 名词 = 替代抽象动词。decide → make a decision。跟读每句。
          </p>
          {step2Groups.map((group, gi) => (
            <div key={gi} className="training-opnoun-group">
              <div className="training-opnoun-label">{group.label}</div>
              <div className="training-opnoun-sentences">
                {group.sentences.map((s, i) => (
                  <button key={i} className="training-sentence-btn" onClick={() => speakText(s.sentence)} title="点击朗读">
                    {s.sentence}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 3: Scene Sentences */}
      {activeStep === 3 && (
        <div className="training-step3">
          <p className="practice-hint">
            全场景只用 850 词。阅读整段，感受 850 词的表达能力。
          </p>
          {Array.from(step3ByScene.entries()).map(([scene, sentences]) => (
            <div key={scene} className="training-scene-group">
              <h3 className="training-scene-title">{scene}</h3>
              <div className="training-scene-text">
                {sentences.map((s, i) => (
                  <p key={i}>
                    <button className="training-scene-sentence" onClick={() => speakText(s.sentence)} title="点击朗读整段">
                      {s.sentence}
                    </button>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
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
