/** 核心公式可视化 — 850 × 规则链 = 日常英语（乘法，不是加法） */
export default function FormulaBar({ compact = false }: { compact?: boolean }) {
  const rules = ["operator", "方向", "词缀", "复合"];

  return (
    <div
      className={`formula-bar${compact ? " formula-bar--compact" : ""}`}
      aria-label="850 词根乘以组合规则等于日常英语"
    >
      <span className="formula-cell formula-cell--roots">
        <strong>850</strong>
        {!compact && <small>词根</small>}
      </span>

      <span className="formula-op" aria-hidden>
        ×
      </span>

      <span className="formula-cell formula-cell--rules">
        {rules.map((r, i) => (
          <span key={r} className="formula-rule-chain">
            {i > 0 && (
              <span className="formula-op formula-op--inline" aria-hidden>
                ×
              </span>
            )}
            <span className="formula-rule">{r}</span>
          </span>
        ))}
      </span>

      <span className="formula-op" aria-hidden>
        =
      </span>

      <span className="formula-cell formula-cell--result">
        <strong>日常英语</strong>
        {!compact && <small>覆盖 90%+</small>}
      </span>
    </div>
  );
}
