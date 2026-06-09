import { useState } from "react";
import { Link } from "react-router-dom";
import { speakText } from "../speak";
import { analyzeSentence } from "./be850Lexicon";
import { checkAnswer } from "./checkAnswer";
import { REWRITE_CHALLENGES } from "./rewriteChallenges";
import { SCENARIO_CHALLENGES } from "./scenarioChallenges";
import SentenceAuditor from "./SentenceAuditor";
import SentenceBuilder from "./SentenceBuilder";

type Tab = "build" | "write" | "rewrite" | "scene";

const TABS: { id: Tab; label: string; desc: string }[] = [
  { id: "build", label: "拼句器", desc: "点词块 → 立刻出句" },
  { id: "write", label: "自由造句", desc: "打字 → 逐词变绿/变红" },
  { id: "rewrite", label: "降维改写", desc: "难句 → 你的 BE850" },
  { id: "scene", label: "场景挑战", desc: "课文场景 → 你说出来" },
];

export default function OutputLabPage() {
  const [tab, setTab] = useState<Tab>("build");
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
          学了词和规则不是终点——<strong>在这里拼句、造句、改写</strong>，每个词当场标色，立刻看见你能不能说出来。
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
