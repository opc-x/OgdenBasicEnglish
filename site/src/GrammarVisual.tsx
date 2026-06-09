import { useState } from "react";

type GrammarRule = {
  id: number;
  title: string;
  cn: string;
  concept: string;
  examples: { en: string; cn: string; desc?: string }[];
  svgType: string;
};

const RULES: GrammarRule[] = [
  {
    id: 1,
    title: "Plural: -S / -ES / -IES",
    cn: "复数变化规则",
    concept: "与普通英语完全一致。一般名词加 -s；以 s/sh/ch/x 结尾加 -es；辅音字母 + y 结尾变 y 为 -ies。",
    examples: [
      { en: "dog → dogs", cn: "狗 → 狗（复数）" },
      { en: "glass → glasses", cn: "玻璃杯 → 玻璃杯（复数）" },
      { en: "story → stories", cn: "故事 → 故事（复数）" }
    ],
    svgType: "plural"
  },
  {
    id: 2,
    title: "Noun Derivation: -ER / -ING / -ED",
    cn: "名词长尾巴（派生）",
    concept: "约 300 个核心名词可以通过添加 -er（人/工具）、-ing（正在进行/动名词）或 -ed（已完成/被动状态）来派生新词，而不需要背诵新词根。",
    examples: [
      { en: "work → worker", cn: "工作 → 工人 / 工作者" },
      { en: "work → working", cn: "工作 → 正在工作" },
      { en: "work → worked", cn: "工作 → 已工作过" }
    ],
    svgType: "derivation"
  },
  {
    id: 3,
    title: "Adverbs: + -LY",
    cn: "性质词变副词",
    concept: "在性质词（形容词）后面加上 -ly，即可以变成副词，表示做事的状态或方式。",
    examples: [
      { en: "quick → quickly", cn: "快的 → 快地" },
      { en: "slow → slowly", cn: "慢的 → 慢地" },
      { en: "clear → clearly", cn: "清晰的 → 清晰地" }
    ],
    svgType: "adverb"
  },
  {
    id: 4,
    title: "Comparison: MORE / MOST",
    cn: "比较级与最高级",
    concept: "BE850 默认不用 -er/-est 词尾（如 taller），而是统一使用 more (更...) 和 most (最...) 来表示比较，语法结构更稳定简单。",
    examples: [
      { en: "more complex", cn: "更复杂的 (比...更)" },
      { en: "most complex", cn: "最复杂的" },
      { en: "more sharp / most sharp", cn: "更锋利的 / 最锋利的" }
    ],
    svgType: "comparison"
  },
  {
    id: 5,
    title: "Opposite: UN- / Antonyms",
    cn: "反义词与 UN- 前缀",
    concept: "形容词前加上 un- 表示否定/相反；或者直接使用词表里成对出现的主力反义词（如 good/bad, big/little）。",
    examples: [
      { en: "happy → unhappy", cn: "快乐的 → 不快乐的" },
      { en: "clean → unclean", cn: "干净的 → 不干净的" },
      { en: "good / bad", cn: "好 / 坏 (使用对应词)" }
    ],
    svgType: "opposite"
  },
  {
    id: 6,
    title: "Questions & Negatives: DO",
    cn: "疑问与否定句式",
    concept: "采用标准英语句式：疑问句将助动词/动词提前，或使用 do 倒装引导；否定句使用 do not / did not 插入动作前。",
    examples: [
      { en: "Do you see it?", cn: "你看见它了吗？ (疑问句倒装)" },
      { en: "I do not see it.", cn: "我看不见它。 (否定句插入 do not)" }
    ],
    svgType: "questions"
  },
  {
    id: 7,
    title: "Operator Conjugation",
    cn: "18 个动作词与代词变位",
    concept: "18 个 Operator（如 be, have, do, go, come）随主语进行标准的人称和时态变位。助动词仅保留 may (可能) 和 will (将要)。",
    examples: [
      { en: "I go / He goes / They went", cn: "我往 / 他往 / 他们曾往 (go 变位)" },
      { en: "I am / He is / You are", cn: "我是 / 他是 / 你是 (be 变位)" }
    ],
    svgType: "conjugation"
  },
  {
    id: 8,
    title: "Compound Words",
    cn: "复合词组合规则",
    concept: "允许将两个 BE850 词拼接成一个复合词，如：名词+名词、名词+方向、代词结合。这极大地扩充了表达范围。",
    examples: [
      { en: "milk + man → milkman", cn: "牛奶 + 人 → 送奶工" },
      { en: "sun + down → sundown", cn: "太阳 + 向下 → 日落" },
      { en: "some + one → someone", cn: "一些 + 一 → 某人" }
    ],
    svgType: "compounds"
  },
  {
    id: 9,
    title: "Numbers, Dates & Measures",
    cn: "数字、度量与日期",
    concept: "数字、星期、月份、数学符号以及标准度量单位直接采用国际通用英语，不需要用 850 词去繁琐拼接。",
    examples: [
      { en: "One, Two, Three, 100", cn: "一、二、三、百" },
      { en: "Monday, June, 2026", cn: "星期一、六月、2026年" },
      { en: "Mile, Foot, Inch, Pound", cn: "英里、英尺、英寸、磅" }
    ],
    svgType: "measures"
  },
  {
    id: 10,
    title: "International Words",
    cn: "国际通用词与专有名词",
    concept: "约 50 个国际通用词（如 radio, taxi, hotel）、科学专业术语以及人名地名（如 London）直接使用，不占用 850 词限额。",
    examples: [
      { en: "hotel, taxi, telephone, radio", cn: "旅馆、出租车、电话、收音机" },
      { en: "London, George, China", cn: "伦敦、乔治、中国 (专有名词)" }
    ],
    svgType: "international"
  }
];

function RuleGraphic({ type }: { type: string }) {
  const strokeColor = "var(--accent)";
  const strokeWarm = "var(--accent-warm)";
  const mainColor = "var(--ink)";
  const faintColor = "var(--border)";
  const fillAccentSoft = "var(--accent-soft)";

  const styleTag = `
    .stroke-main { stroke: ${mainColor}; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .stroke-accent { stroke: ${strokeColor}; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .stroke-warm { stroke: ${strokeWarm}; fill: none; stroke-width: 2; }
    .fill-accent { fill: ${strokeColor}; }
    .fill-soft { fill: ${fillAccentSoft}; fill-opacity: 0.35; }

    /* 1. Plural animation */
    @keyframes plural-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    .ani-plural-s {
      transform-origin: 75px 45px;
      animation: plural-pulse 2.2s infinite ease-in-out;
    }

    /* 2. Derivation arrows */
    @keyframes arrow-grow {
      0% { stroke-dashoffset: 40; opacity: 0; }
      20% { opacity: 1; }
      80% { stroke-dashoffset: 0; opacity: 1; }
      100% { stroke-dashoffset: 0; opacity: 0; }
    }
    .ani-arrow {
      stroke-dasharray: 40;
      stroke-dashoffset: 40;
      animation: arrow-grow 3s infinite ease-in-out;
    }

    /* 3. Adverb ly drop */
    @keyframes ly-drop {
      0% { transform: translateY(-30px); opacity: 0; }
      20% { opacity: 1; }
      50%, 80% { transform: translateY(0); opacity: 1; }
      100% { opacity: 0; }
    }
    .ani-ly {
      animation: ly-drop 2.5s infinite ease-in-out;
    }

    /* 4. Comparison scale */
    @keyframes bar-grow {
      0% { transform: scaleY(0.1); }
      70%, 100% { transform: scaleY(1); }
    }
    .ani-bar {
      transform-origin: bottom;
      animation: bar-grow 2.5s infinite cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* 5. Opposite morph */
    @keyframes un-slide {
      0% { transform: translateX(-25px); opacity: 0; }
      20% { opacity: 1; }
      70%, 100% { transform: translateX(0); opacity: 1; }
    }
    .ani-un {
      animation: un-slide 2.8s infinite ease-in-out;
    }

    /* 6. Do helper jump */
    @keyframes do-jump {
      0% { transform: translateY(25px) scale(0.7); opacity: 0; }
      20% { opacity: 1; }
      50%, 80% { transform: translateY(0) scale(1); opacity: 1; }
      100% { opacity: 0; }
    }
    .ani-do {
      animation: do-jump 3s infinite cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* 7. Conjugation link */
    @keyframes link-dash {
      0% { stroke-dashoffset: 24; }
      100% { stroke-dashoffset: 0; }
    }
    .ani-link {
      stroke-dasharray: 6 3;
      animation: link-dash 1.5s infinite linear;
    }

    /* 8. Compound merge */
    @keyframes merge-left {
      0% { transform: translateX(-15px); }
      50%, 100% { transform: translateX(10px); }
    }
    @keyframes merge-right {
      0% { transform: translateX(15px); }
      50%, 100% { transform: translateX(-10px); }
    }
    .ani-merge-l { animation: merge-left 3s infinite ease-in-out; }
    .ani-merge-r { animation: merge-right 3s infinite ease-in-out; }

    /* 9. Measures spin */
    @keyframes clock-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .ani-clock-hand {
      transform-origin: 75px 50px;
      animation: clock-spin 10s infinite linear;
    }

    /* 10. Globe float */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .ani-float {
      animation: float 4s infinite ease-in-out;
    }
  `;

  const baseSvgProps = {
    viewBox: "0 0 100 100",
    width: "100%",
    height: "100%",
    className: "vector-svg"
  };

  switch (type) {
    case "plural":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Left: One Box (dog) */}
          <rect x="12" y="38" width="22" height="22" rx="4" className="stroke-main fill-soft" />
          <circle cx="23" cy="49" r="3" fill={mainColor} />
          <text x="18" y="74" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>dog</text>

          {/* Arrow */}
          <path d="M42 49 H52" stroke={faintColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M48 45 L53 49 L48 53" stroke={faintColor} strokeWidth="2" fill="none" />

          {/* Right: Three Boxes (dogs) */}
          <g className="ani-plural-s">
            <rect x="58" y="32" width="20" height="20" rx="3" stroke={faintColor} strokeWidth="1.5" fill="none" />
            <rect x="64" y="38" width="20" height="20" rx="3" stroke={faintColor} strokeWidth="1.5" fill="none" />
            <rect x="70" y="44" width="20" height="20" rx="3" className="stroke-accent fill-soft" />
            {/* Plural marker bubble */}
            <circle cx="86" cy="38" r="8" fill={strokeWarm} />
            <text x="83" y="41" fontSize="9" fontFamily="var(--mono)" fontWeight="bold" fill="#fff">s</text>
          </g>
          <text x="66" y="74" fontSize="7" fontFamily="var(--mono)" fill={strokeColor} fontWeight="bold">dogs</text>
        </svg>
      );

    case "derivation":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Central Root: work */}
          <rect x="12" y="38" width="24" height="24" rx="6" className="stroke-main fill-soft" />
          <text x="17" y="52" fontSize="7" fontFamily="var(--mono)" fill={mainColor} fontWeight="bold">work</text>

          {/* Branch 1 to -ER */}
          <path d="M36 44 C45 35, 52 30, 62 30" className="stroke-warm ani-arrow" />
          <rect x="64" y="18" width="26" height="18" rx="4" className="stroke-accent" />
          <text x="68" y="29" fontSize="7" fontFamily="var(--mono)" fill={strokeColor}>-er</text>

          {/* Branch 2 to -ING */}
          <path d="M36 50 H60" className="stroke-warm ani-arrow" style={{ animationDelay: "0.5s" }} />
          <rect x="64" y="41" width="26" height="18" rx="4" className="stroke-accent" />
          <text x="68" y="52" fontSize="7" fontFamily="var(--mono)" fill={strokeColor}>-ing</text>

          {/* Branch 3 to -ED */}
          <path d="M36 56 C45 65, 52 70, 62 70" className="stroke-warm ani-arrow" style={{ animationDelay: "1s" }} />
          <rect x="64" y="61" width="26" height="18" rx="4" className="stroke-accent" />
          <text x="70" y="72" fontSize="7" fontFamily="var(--mono)" fill={strokeColor}>-ed</text>
        </svg>
      );

    case "adverb":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Adjective: quick */}
          <rect x="10" y="40" width="30" height="22" rx="4" className="stroke-main fill-soft" />
          <text x="15" y="53" fontSize="8" fontFamily="var(--mono)" fill={mainColor}>quick</text>

          {/* Add sign */}
          <text x="45" y="54" fontSize="12" fontFamily="var(--mono)" fill={faintColor} fontWeight="bold">+</text>

          {/* Falling -LY */}
          <g className="ani-ly">
            <rect x="54" y="40" width="22" height="22" rx="4" className="stroke-accent" />
            <text x="61" y="54" fontSize="9" fontFamily="var(--mono)" fontWeight="bold" fill={strokeColor}>ly</text>
          </g>

          {/* Speed line vectors */}
          <path d="M12 74 H88" stroke={strokeWarm} strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      );

    case "comparison":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Bar 1: Base */}
          <g className="ani-bar">
            <rect x="15" y="65" width="16" height="15" rx="2" className="stroke-main fill-soft" />
            <text x="13" y="90" fontSize="6" fontFamily="var(--mono)" fill={mainColor}>base</text>
          </g>

          {/* Bar 2: More */}
          <g className="ani-bar" style={{ animationDelay: "0.3s" }}>
            <rect x="42" y="45" width="16" height="35" rx="2" className="stroke-accent" />
            <text x="38" y="90" fontSize="6" fontFamily="var(--mono)" fill={strokeColor} fontWeight="bold">MORE</text>
          </g>

          {/* Bar 3: Most */}
          <g className="ani-bar" style={{ animationDelay: "0.6s" }}>
            <rect x="69" y="20" width="16" height="60" rx="2" stroke={strokeWarm} strokeWidth="2" fill="none" />
            <text x="65" y="90" fontSize="6" fontFamily="var(--mono)" fill={strokeWarm} fontWeight="bold">MOST</text>
          </g>

          {/* Crown/Star above most */}
          <polygon points="77,5 80,11 87,11 81,15 83,21 77,17 71,21 73,15 67,11 74,11" fill={strokeWarm} className="ani-plural-s" />
        </svg>
      );

    case "opposite":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Smiley happy face on left */}
          <circle cx="28" cy="50" r="14" className="stroke-main fill-soft" />
          <circle cx="24" cy="46" r="2" fill={mainColor} />
          <circle cx="32" cy="46" r="2" fill={mainColor} />
          <path d="M22 53 Q28 60 34 53" stroke={mainColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          <text x="18" y="78" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>happy</text>

          {/* Sliding UN- puzzle piece */}
          <g className="ani-un">
            <rect x="50" y="36" width="16" height="28" rx="4" className="stroke-accent" />
            <text x="53" y="53" fontSize="8" fontFamily="var(--mono)" fontWeight="bold" fill={strokeColor}>un-</text>
          </g>

          {/* Sad face on right */}
          <circle cx="78" cy="50" r="14" className="stroke-main" />
          <circle cx="74" cy="46" r="2" fill={mainColor} />
          <circle cx="82" cy="46" r="2" fill={mainColor} />
          <path d="M74 57 Q78 50 82 57" stroke={mainColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          <text x="68" y="78" fontSize="7" fontFamily="var(--mono)" fill={strokeColor} fontWeight="bold">unhappy</text>
        </svg>
      );

    case "questions":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Question structure illustration */}
          {/* DO block jumping to front */}
          <g className="ani-do">
            <rect x="12" y="38" width="18" height="24" rx="4" className="stroke-accent" />
            <text x="17" y="53" fontSize="8" fontFamily="var(--mono)" fontWeight="bold" fill={strokeColor}>Do</text>
          </g>

          {/* Main sentence blocks */}
          <rect x="34" y="38" width="18" height="24" rx="4" className="stroke-main fill-soft" />
          <text x="39" y="52" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>you</text>

          <rect x="56" y="38" width="18" height="24" rx="4" className="stroke-main fill-soft" />
          <text x="61" y="52" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>see</text>

          <rect x="78" y="38" width="14" height="24" rx="4" className="stroke-main fill-soft" />
          <text x="81" y="52" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>it?</text>

          {/* Question mark bubble */}
          <circle cx="88" cy="26" r="5" fill={strokeWarm} />
          <text x="86" y="29" fontSize="8" fontFamily="var(--serif)" fontWeight="bold" fill="#fff">?</text>
        </svg>
      );

    case "conjugation":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Pronouns list */}
          <text x="12" y="32" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>I / You</text>
          <text x="12" y="68" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>He / She</text>

          {/* Connector links */}
          <path d="M40 30 H60" stroke={faintColor} strokeWidth="1.5" className="ani-link" />
          <path d="M40 66 H60" stroke={strokeWarm} strokeWidth="1.5" className="ani-link" />

          {/* Verbs */}
          <rect x="63" y="18" width="25" height="20" rx="4" className="stroke-main fill-soft" />
          <text x="70" y="31" fontSize="8" fontFamily="var(--mono)" fill={mainColor}>go</text>

          <rect x="63" y="54" width="25" height="20" rx="4" className="stroke-accent" />
          <text x="66" y="67" fontSize="8" fontFamily="var(--mono)" fill={strokeColor} fontWeight="bold">goes</text>
        </svg>
      );

    case "compounds":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Word A */}
          <g className="ani-merge-l">
            <rect x="8" y="38" width="22" height="24" rx="4" className="stroke-main fill-soft" />
            <text x="13" y="53" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>milk</text>
          </g>

          {/* Plus */}
          <text x="38" y="54" fontSize="10" fontFamily="var(--mono)" fill={faintColor}>+</text>

          {/* Word B */}
          <g className="ani-merge-r">
            <rect x="48" y="38" width="20" height="24" rx="4" className="stroke-main fill-soft" />
            <text x="53" y="53" fontSize="7" fontFamily="var(--mono)" fill={mainColor}>man</text>
          </g>

          {/* Equal */}
          <text x="73" y="54" fontSize="10" fontFamily="var(--mono)" fill={faintColor}>=</text>

          {/* Merged Word */}
          <rect x="70" y="38" width="28" height="24" rx="4" className="stroke-accent" style={{ opacity: 0.85 }} />
          <text x="71" y="52" fontSize="5.5" fontFamily="var(--mono)" fill={strokeColor} fontWeight="bold">milkman</text>
        </svg>
      );

    case "measures":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Ruler on bottom */}
          <path d="M15 75 H85 V85 H15 Z" stroke={mainColor} strokeWidth="2" fill="none" />
          <path d="M25 75 V80 M35 75 V80 M45 75 V80 M55 75 V80 M65 75 V80 M75 75 V80" stroke={mainColor} strokeWidth="1.5" />
          <text x="44" y="70" fontSize="6" fontFamily="var(--mono)" fill={mainColor}>1 inch</text>

          {/* Calendar page on left */}
          <rect x="15" y="20" width="24" height="28" rx="2" stroke={faintColor} strokeWidth="1.5" fill="none" />
          <path d="M15 28 H39" stroke={faintColor} strokeWidth="1.5" />
          <rect x="15" y="20" width="24" height="8" fill={strokeWarm} />
          <text x="21" y="42" fontSize="10" fontFamily="var(--serif)" fill={strokeColor} fontWeight="bold">7</text>

          {/* Clock on right */}
          <circle cx="75" cy="34" r="14" stroke={faintColor} strokeWidth="2" fill="none" />
          <line x1="75" y1="34" x2="75" y2="24" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" className="ani-clock-hand" />
          <line x1="75" y1="34" x2="83" y2="34" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "international":
      return (
        <svg {...baseSvgProps}>
          <style>{styleTag}</style>
          {/* Central Globe */}
          <g className="ani-float">
            <circle cx="50" cy="50" r="20" className="stroke-main fill-soft" />
            <path d="M50 30 C42 35, 42 65, 50 70 C58 65, 58 35, 50 30" stroke={mainColor} strokeWidth="1.5" fill="none" />
            <path d="M30 50 H70" stroke={mainColor} strokeWidth="1.5" fill="none" />
          </g>

          {/* Surrounding word bubbles */}
          <g className="ani-plural-s">
            <rect x="8" y="15" width="24" height="14" rx="4" stroke={strokeWarm} strokeWidth="1.5" fill="none" />
            <text x="13" y="24" fontSize="6.5" fontFamily="var(--mono)" fill={strokeColor}>taxi</text>
          </g>

          <g className="ani-plural-s" style={{ animationDelay: "0.5s" }}>
            <rect x="68" y="12" width="24" height="14" rx="4" stroke={strokeWarm} strokeWidth="1.5" fill="none" />
            <text x="71" y="21" fontSize="6.5" fontFamily="var(--mono)" fill={strokeColor}>hotel</text>
          </g>

          <g className="ani-plural-s" style={{ animationDelay: "1s" }}>
            <rect x="68" y="72" width="26" height="14" rx="4" stroke={strokeWarm} strokeWidth="1.5" fill="none" />
            <text x="71" y="81" fontSize="6.5" fontFamily="var(--mono)" fill={strokeColor}>radio</text>
          </g>

          <g className="ani-plural-s" style={{ animationDelay: "1.5s" }}>
            <rect x="8" y="72" width="28" height="14" rx="4" stroke={strokeWarm} strokeWidth="1.5" fill="none" />
            <text x="10" y="81" fontSize="6.5" fontFamily="var(--mono)" fill={strokeColor}>London</text>
          </g>
        </svg>
      );

    default:
      return null;
  }
}

export default function GrammarVisual() {
  const [selectedRule, setSelectedRule] = useState<GrammarRule>(RULES[0]);

  return (
    <div className="operators-visualizer directions-visualizer">
      <div className="visualizer-header">
        <span className="machine-kicker">规则卡可视化</span>
        <h3>BE850 语法规则卡：图解 10 条核心语法</h3>
        <p>
          Ogden 设计的基本英语，<strong>其语法和普通英语完全一样</strong>，只是通过消除普通动词简化了结构。
          以下是这 10 条基本语法规则的图解说明。
        </p>
      </div>

      <div className="visualizer-body">
        {/* 左侧：10条规则列表 */}
        <div className="operators-grid-panel" style={{ gap: "0.6rem" }}>
          <div className="op-group-section" style={{ background: "transparent", border: "none", padding: 0 }}>
            <div className="op-group-chips">
              {RULES.map((rule) => {
                const isSelected = selectedRule.id === rule.id;
                return (
                  <button
                    key={rule.id}
                    type="button"
                    className={`op-chip${isSelected ? " active" : ""}`}
                    onClick={() => setSelectedRule(rule)}
                    style={{ width: "100%", justifyContent: "flex-start", padding: "0.45rem 0.75rem" }}
                  >
                    <span className="op-chip-en" style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                      {rule.id}. {rule.title}
                    </span>
                    <span className="op-chip-cn" style={{ opacity: isSelected ? 0.9 : 0.65 }}>
                      ({rule.cn})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧：图解细节展示卡片 */}
        <div className="operator-vector-card" key={selectedRule.id}>
          <div className="vector-card-head">
            <div className="vector-card-title-row">
              <span className="card-op-en" style={{ fontSize: "1.6rem", fontFamily: "var(--sans)", fontWeight: "bold" }}>
                {selectedRule.title}
              </span>
            </div>
            <div className="vector-card-tag" style={{ background: "var(--accent-soft)", color: "var(--accent-deep)", fontWeight: "bold" }}>
              {selectedRule.cn}
            </div>
          </div>

          {/* SVG 图解区域 */}
          <div className="vector-card-graphic" style={{ background: "linear-gradient(135deg, var(--bg) 0%, rgba(254,243,199,0.06) 100%)", minHeight: "160px" }}>
            <RuleGraphic type={selectedRule.svgType} />
          </div>

          {/* 规则文本说明 */}
          <div className="vector-card-info">
            <div className="vector-info-section">
              <h5 style={{ fontSize: "0.75rem", color: "var(--ink-faint)", fontWeight: "600", letterSpacing: "0.06em", margin: "0 0 0.25rem 0" }}>
                规则定义说明 (Rule Concept)
              </h5>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: "1.6", margin: "0" }}>
                {selectedRule.concept}
              </p>
            </div>

            <div className="vector-info-section">
              <h5 style={{ fontSize: "0.75rem", color: "var(--ink-faint)", fontWeight: "600", letterSpacing: "0.06em", margin: "0 0 0.25rem 0" }}>
                规则应用实例 (Examples)
              </h5>
              <ul className="vector-example-list" style={{ fontSize: "0.85rem", color: "var(--ink-muted)", margin: "0", paddingLeft: "1.1rem" }}>
                {selectedRule.examples.map((ex, i) => (
                  <li key={i} style={{ marginBottom: "0.35rem" }}>
                    <strong style={{ fontFamily: "var(--mono)", color: "var(--ink)" }}>{ex.en}</strong>
                    <span style={{ margin: "0 0.35rem", color: "var(--ink-faint)" }}>—</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-secondary)" }}>{ex.cn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
