import { Link } from "react-router-dom";

type RoadmapStep = {
  week: string;
  title: string;
  enTitle: string;
  goal: string;
  color: string;
  bgLight: string;
  borderCol: string;
  todo: { text: string; link: string; isWords?: boolean }[];
  svgIcon: React.ReactNode;
};

export default function RoadmapVisual() {
  const steps: RoadmapStep[] = [
    {
      week: "第 1 周",
      title: "构建动作骨架",
      enTitle: "WEEK 1: SKELETON",
      goal: "抛弃传统复杂动词，理解物理动作和方向的几何结合。",
      color: "#10b981", // Emerald
      bgLight: "rgba(16, 185, 129, 0.04)",
      borderCol: "rgba(16, 185, 129, 0.15)",
      svgIcon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
        </svg>
      ),
      todo: [
        { text: "18个 Operator 动作词", link: "/doc/operators" },
        { text: "20个物理方向与介词", link: "/doc/directions" },
        { text: "10条减法语法规则", link: "/doc/grammar" }
      ]
    },
    {
      week: "第 2 周",
      title: "分层装配词根",
      enTitle: "WEEK 2: ROOTS",
      goal: "将 850 词根分为不同层级塞进句子骨架，绝非死记硬背。",
      color: "#0ea5e9", // Sky
      bgLight: "rgba(14, 165, 233, 0.04)",
      borderCol: "rgba(14, 165, 233, 0.15)",
      svgIcon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22 12 2v20Z" />
          <path d="M12 2 22 22H12Z" />
          <path d="M12 12H5" />
          <path d="M12 8H7" />
          <path d="M12 16H9" />
        </svg>
      ),
      todo: [
        { text: "阅读分层掌握指南", link: "/doc/tier-guide" },
        { text: "850词表随时查询", link: "/words", isWords: true },
        { text: "掌握 200 个可画图词", link: "/doc/words" }
      ]
    },
    {
      week: "第 3 周",
      title: "启动乘数倍增",
      enTitle: "WEEK 3: MULTIPLIER",
      goal: "掌握复合词和词缀扩展规则，使 850 词发挥数千词的表达力。",
      color: "#f59e0b", // Amber
      bgLight: "rgba(245, 158, 11, 0.04)",
      borderCol: "rgba(245, 158, 11, 0.15)",
      svgIcon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      todo: [
        { text: "100组核心短语动词", link: "/doc/phrasal" },
        { text: "6大核心派生词缀", link: "/doc/affixes" },
        { text: "复合词左右拼合逻辑", link: "/doc/compounds" }
      ]
    },
    {
      week: "第 4 周",
      title: "在限制内输出",
      enTitle: "WEEK 4: PRACTICE",
      goal: "进行受限集的英文读写练习，真正摆脱对庞杂生词的依赖。",
      color: "#8b5cf6", // Violet
      bgLight: "rgba(139, 92, 246, 0.04)",
      borderCol: "rgba(139, 92, 246, 0.15)",
      svgIcon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      ),
      todo: [
        { text: "阅读与练习推荐书单", link: "/doc/practice" },
        { text: "精读《看图学英语》", link: "/doc/practice" },
        { text: "尝试用受限集写日记", link: "/doc/practice" }
      ]
    }
  ];

  return (
    <div className="roadmap-container" style={{ margin: "2rem 0", fontFamily: "var(--sans)" }}>
      <style>{`
        .roadmap-grid-interactive {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          position: relative;
        }

        .roadmap-interactive-card {
          background: #ffffff;
          border: 1px solid var(--border-soft);
          border-radius: 16px;
          padding: 1.5rem 1.25rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .roadmap-interactive-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: var(--theme-color);
          opacity: 0.8;
        }

        .roadmap-interactive-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          border-color: var(--theme-color);
        }

        .step-badge-custom {
          font-family: var(--mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--theme-color);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.75rem;
          display: inline-block;
          background: var(--bg-light);
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          border: 1px solid var(--border-col);
        }

        .step-title-custom {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--ink);
          margin: 0.25rem 0 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .step-goal-custom {
          font-size: 0.82rem;
          color: var(--ink-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          min-height: 3rem;
        }

        .step-todo-list-custom {
          margin: auto 0 0 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px dashed var(--border-soft);
          padding-top: 1rem;
        }

        .step-todo-item-custom {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.85rem;
        }

        .step-todo-link-custom {
          color: var(--ink-muted);
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          width: 100%;
        }

        .step-todo-link-custom:hover {
          color: var(--theme-color);
          padding-left: 3px;
        }

        .dot-indicator-custom {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--theme-color);
          opacity: 0.6;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .roadmap-grid-interactive {
            grid-template-columns: 1fr 1fr;
          }
          .step-goal-custom {
            min-height: 0;
          }
        }

        @media (max-width: 580px) {
          .roadmap-grid-interactive {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="roadmap-grid-interactive">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="roadmap-interactive-card"
            style={
              {
                "--theme-color": step.color,
                "--bg-light": step.bgLight,
                "--border-col": step.borderCol
              } as React.CSSProperties
            }
          >
            <div>
              <div className="step-badge-custom">{step.enTitle}</div>
              <div className="step-title-custom">
                <span style={{ flexShrink: 0 }}>{step.svgIcon}</span>
                <span>{step.title}</span>
              </div>
              <p className="step-goal-custom">{step.goal}</p>
            </div>

            <ul className="step-todo-list-custom">
              {step.todo.map((item, todoIdx) => (
                <li key={todoIdx} className="step-todo-item-custom">
                  <span className="dot-indicator-custom" />
                  <Link to={item.link} className="step-todo-link-custom">
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
