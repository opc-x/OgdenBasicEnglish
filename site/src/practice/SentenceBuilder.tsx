import { useState } from "react";
import { speakText } from "../speak";
import { BUILDER_CHIPS } from "./be850Lexicon";
import SentenceAuditor from "./SentenceAuditor";

const GROUPS: { key: keyof typeof BUILDER_CHIPS; label: string }[] = [
  { key: "subject", label: "谁" },
  { key: "operator", label: "动作 operator" },
  { key: "direction", label: "方向" },
  { key: "object", label: "什么" },
  { key: "tail", label: "连接" },
];

export default function SentenceBuilder() {
  const [parts, setParts] = useState<string[]>([]);

  const sentence = parts.join(" ");
  const add = (w: string) => setParts((p) => [...p, w]);
  const pop = () => setParts((p) => p.slice(0, -1));
  const clear = () => setParts([]);

  return (
    <div className="builder">
      <p className="practice-hint">点选词块拼句子——立刻看到造句效果和 BE850 合规率。</p>

      <div className="builder-sentence" aria-live="polite">
        {sentence || <span className="builder-placeholder">点下面词块开始拼…</span>}
      </div>

      <div className="builder-actions">
        <button type="button" className="btn btn-primary btn-sm" disabled={!sentence} onClick={() => speakText(sentence)}>
          朗读整句
        </button>
        <button type="button" className="btn btn-ghost btn-sm" disabled={!parts.length} onClick={pop}>
          删一词
        </button>
        <button type="button" className="btn btn-ghost btn-sm" disabled={!parts.length} onClick={clear}>
          清空
        </button>
      </div>

      <SentenceAuditor text={sentence} showEmpty />

      {GROUPS.map(({ key, label }) => (
        <div key={key} className="builder-group">
          <span className="builder-group-label">{label}</span>
          <div className="builder-chips">
            {BUILDER_CHIPS[key].map((w) => (
              <button key={w} type="button" className="builder-chip" onClick={() => add(w)}>
                {w}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
