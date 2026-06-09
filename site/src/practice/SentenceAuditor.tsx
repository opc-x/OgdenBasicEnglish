import { analyzeSentence } from "./be850Lexicon";

type Props = {
  text: string;
  showEmpty?: boolean;
};

export default function SentenceAuditor({ text, showEmpty }: Props) {
  const trimmed = text.trim();
  if (!trimmed && !showEmpty) return null;

  const { tokens, score, be850Count, violationCount, operatorsUsed } = analyzeSentence(trimmed || "");

  return (
    <div className="auditor">
      {trimmed ? (
        <>
          <div className="auditor-score-row">
            <div className="auditor-score-bar" aria-hidden>
              <span className="auditor-score-fill" style={{ width: `${score}%` }} />
            </div>
            <span className="auditor-score-label">
              BE850 覆盖率 <strong>{score}%</strong>
              <span className="auditor-score-meta">
                {be850Count} 词合规
                {violationCount > 0 && ` · ${violationCount} 个超纲`}
              </span>
            </span>
          </div>

          <p className="auditor-tokens" aria-label="逐词分析">
            {tokens.map((t, i) => (
              <span key={`${t.normalized}-${i}`} className={`auditor-token auditor-token--${t.status}`} title={t.hint}>
                {t.raw}
              </span>
            ))}
          </p>

          {operatorsUsed.length > 0 && (
            <p className="auditor-ops">
              用到的 operator：<code>{operatorsUsed.join(", ")}</code>
            </p>
          )}

          {violationCount > 0 && (
            <ul className="auditor-hints">
              {tokens
                .filter((t) => t.status === "violation")
                .map((t) => (
                  <li key={t.normalized}>
                    <strong>{t.normalized}</strong> → {t.hint}
                  </li>
                ))}
            </ul>
          )}

          {score === 100 && violationCount === 0 && trimmed.split(/\s+/).length >= 4 && (
            <p className="auditor-win">✓ 全句合规——这就是学了 850 词 + 规则后的输出效果。</p>
          )}
        </>
      ) : (
        <p className="auditor-empty">输入或拼装句子后，这里实时显示每个词是否在 850 范围内。</p>
      )}
    </div>
  );
}
