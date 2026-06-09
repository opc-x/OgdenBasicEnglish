import { useState } from "react";

type DirectionWord = {
  word: string;
  cn: string;
  category: string;
  concept: string;
  equation: string;
  examples: string[];
  svgType: string;
};

type Group = {
  name: string;
  desc: string;
  words: DirectionWord[];
};

const GROUPS: Group[] = [
  {
    name: "空间静态位置 (Static Places)",
    desc: "描述物体在物理空间中的静止相对坐标",
    words: [
      {
        word: "at", cn: "在某点", category: "static",
        concept: "确定一个精确的、无空间大小的静止标志点。在时空坐标轴上仅作为定位标记。",
        equation: "be + at = 在……处 (present at)",
        examples: ["be at the door (在门口)", "get at the truth (搞清真相)"],
        svgType: "at"
      },
      {
        word: "in", cn: "在……里", category: "static",
        concept: "物体处于三维或二维闭合边界内部，被容器或空间范围包络。",
        equation: "go + in = 进去 (enter)",
        examples: ["go in (进去)", "keep in mind (记住)", "be in the room (在房间里)"],
        svgType: "in"
      },
      {
        word: "on", cn: "在……上/接触", category: "static",
        concept: "物体与另一个物理表面发生支撑性接触，依靠物理重力和摩擦力停留在表面上。",
        equation: "put + on = 穿上/放上 (wear/place)",
        examples: ["put on the coat (穿上外套)", "go on (继续)", "on the table (在桌上)"],
        svgType: "on"
      },
      {
        word: "under", cn: "在……下方", category: "static",
        concept: "物体处于另一个物体的正下方或被其覆盖的低位空间中。",
        equation: "keep + under = 控制住/压制 (repress)",
        examples: ["be under the bed (在床下)", "keep under control (控制住)"],
        svgType: "under"
      },
      {
        word: "over", cn: "在……上方", category: "static",
        concept: "悬空处于参照物的正上方，越过且不与其表面发生物理接触。",
        equation: "go + over = 越过/翻阅 (examine/cross)",
        examples: ["go over the wall (越过墙壁)", "be over the table (在桌子上方)"],
        svgType: "over"
      },
      {
        word: "by", cn: "在旁/沿着", category: "static",
        concept: "物体处于参照物的邻近切线或贴近的侧旁范围内。",
        equation: "go + by = 路过 (pass)",
        examples: ["go by the window (路过窗户)", "be by his side (在他身旁)"],
        svgType: "by"
      },
      {
        word: "between", cn: "在两者之间", category: "static",
        concept: "物体处于由两个参照物（两点）所隔开的中间缝隙或区域内。",
        equation: "be + between = 夹在中间 (intermediate)",
        examples: ["be between two houses (在两房之间)", "put between (夹在中间)"],
        svgType: "between"
      },
      {
        word: "among", cn: "在……群中", category: "static",
        concept: "物体处于三个及以上的多点（群体）围绕或分布的内部缝隙中。",
        equation: "go + among = 走进……中 (mingle)",
        examples: ["go among the people (走进人群)", "be among friends (在朋友中间)"],
        svgType: "among"
      }
    ]
  },
  {
    name: "空间动态位移 (Movement / Vector)",
    desc: "描述物体在空间中的运动矢量和位移滑轨",
    words: [
      {
        word: "to", cn: "向/到终点", category: "movement",
        concept: "指向终点或目标点，表示带有确定目的地的方向运动矢量。",
        equation: "go + to = 去往 (approach)",
        examples: ["go to school (去学校)", "give it to him (递给他)"],
        svgType: "to"
      },
      {
        word: "from", cn: "从……起点", category: "movement",
        concept: "指向动作或位置的始发源头，表示背离原点的发射矢量。",
        equation: "take + from = 从……拿走 (remove)",
        examples: ["come from (来自)", "take from the shelf (从架子上拿走)"],
        svgType: "from"
      },
      {
        word: "up", cn: "向上", category: "movement",
        concept: "物体逆引力轴指向上方高度攀升的垂直或倾斜位移。",
        equation: "get + up = 起来/站起 (arise)",
        examples: ["go up (上去)", "get up (起来)", "put up (举起/建造)"],
        svgType: "up"
      },
      {
        word: "down", cn: "向下", category: "movement",
        concept: "物体顺引力轴指向下方高度降低的垂直或倾斜位移。",
        equation: "put + down = 放下/写下 (deposit/record)",
        examples: ["go down (下去)", "put down (放下)", "take down (拿下/记录)"],
        svgType: "down"
      },
      {
        word: "through", cn: "穿过", category: "movement",
        concept: "物体从一端进入三维容器或管道内部，穿行一段距离后从另一端穿出。",
        equation: "go + through = 穿过/经历 (experience/penetrate)",
        examples: ["go through the pipe (穿过管道)", "see through it (看穿它)"],
        svgType: "through"
      },
      {
        word: "across", cn: "横过", category: "movement",
        concept: "从一侧到另一侧，横向跨越一个二维平面或线段边界。",
        equation: "go + across = 横渡/穿过 (cross)",
        examples: ["go across the street (过马路)", "put across (跨置/解释清楚)"],
        svgType: "across"
      },
      {
        word: "off", cn: "脱离/断开", category: "movement",
        concept: "物体脱离原有的物理支撑表面，断开物理接触并移走。",
        equation: "take + off = 脱下/起飞 (remove/launch)",
        examples: ["get off the bus (下车)", "take off the coat (脱外套)"],
        svgType: "off"
      },
      {
        word: "about", cn: "围绕/到处", category: "movement",
        concept: "以某一中心物为坐标原点，在其周围做多向分布或环绕轨迹运行。",
        equation: "go + about = 到处走动 (wander)",
        examples: ["go about (到处走动)", "put a cloth about him (围上布)"],
        svgType: "about"
      }
    ]
  },
  {
    name: "相对与伴随关系 (Relationship)",
    desc: "描述物体之间力学、相对位置及时间上的相互关系",
    words: [
      {
        word: "against", cn: "靠着/对抗", category: "relation",
        concept: "物体逆向或贴紧另一个物理表面，产生力学上的相反受力、对抗或支撑接触。",
        equation: "go + against = 反对/逆行 (oppose)",
        examples: ["put against the wall (靠着墙放)", "go against rules (违反规则)"],
        svgType: "against"
      },
      {
        word: "after", cn: "在……之后", category: "relation",
        concept: "物体在时空坐标轴的后方移动或排列，呈现跟随或滞后的坐标。",
        equation: "go + after = 追随/追求 (pursue)",
        examples: ["come after (跟在……后面)", "go after details (追寻细节)"],
        svgType: "after"
      },
      {
        word: "before", cn: "在……前面", category: "relation",
        concept: "物体在时空坐标轴的前方移动或排列，处于引领或超前的位置。",
        equation: "go + before = 走在前面 (precede)",
        examples: ["go before (走在前面)", "come before the judge (呈现在面前)"],
        svgType: "before"
      },
      {
        word: "with", cn: "伴随/协同", category: "relation",
        concept: "物体与另一物体处于同一运动坐标系或包络范围内，并列并行或充当工具附属。",
        equation: "go + with = 伴随/相配 (accompany/match)",
        examples: ["go with me (跟我走)", "cut with a knife (用刀切)"],
        svgType: "with"
      }
    ]
  },
  {
    name: "逻辑与抽象关系 (Logical Relations)",
    desc: "描述事物间的归属、目标、角色等逻辑连接词",
    words: [
      {
        word: "of", cn: "关联/属于", category: "logical",
        concept: "表达整体与部分、归属权、关联性或物质来源，通常是部分的提取。",
        equation: "part + of = ……的一部分",
        examples: ["the top of the box (箱子顶部)", "a cup of water (一杯水)"],
        svgType: "of"
      },
      {
        word: "for", cn: "目标/换取", category: "logical",
        concept: "标明动作的目的、受益人或交换价值的对应性。",
        equation: "do + for = 为……服务 (serve)",
        examples: ["for you (给你/为了你)", "make for (走向/有助于)"],
        svgType: "for"
      },
      {
        word: "as", cn: "作为/等同", category: "logical",
        concept: "将某一物理形态等同于另一角色，表达身份的映射与化身。",
        equation: "go + as = 化装成/扮演",
        examples: ["as a teacher (作为老师)", "do as I do (照我做的做)"],
        svgType: "as"
      },
      {
        word: "till", cn: "直到(边界点)", category: "logical",
        concept: "在时间轴或物理进程中，动作向终点延伸至特定阻挡边界处为止。",
        equation: "keep + till = 保持直到",
        examples: ["till tomorrow (直到明天)", "till the end (直到结束)"],
        svgType: "till"
      },
      {
        word: "than", cn: "相对比较", category: "logical",
        concept: "在两个事物之间建立大小、程度或性质差异的逻辑天平。",
        equation: "more + than = 多于/比……更",
        examples: ["more than (多于/超过)", "greater than this (比这个大)"],
        svgType: "than"
      }
    ]
  }
];

function DirectionGraphic({ type }: { type: string }) {
  const strokeColor = "var(--accent)";
  const strokeWarm = "var(--accent-warm)";
  const mainColor = "var(--ink)";
  const faintColor = "var(--border)";
  const fillAccentSoft = "var(--accent-soft)";

  // Self-contained animations using an inline SVG <style> tag
  const inlineStyles = `
    .ani-ball {
      fill: ${strokeColor};
    }
    .ani-ball-secondary {
      fill: ${mainColor};
    }
    
    /* 1. to: left to right target */
    @keyframes to-move {
      0% { cx: 20; opacity: 0; }
      15% { opacity: 1; }
      80% { cx: 70; opacity: 1; }
      90%, 100% { cx: 70; opacity: 0; }
    }
    .ball-to { animation: to-move 2.2s infinite ease-in-out; }

    /* 2. from: leaving source */
    @keyframes from-move {
      0% { cx: 30; opacity: 0; }
      15% { opacity: 1; }
      80% { cx: 80; opacity: 1; }
      90%, 100% { cx: 80; opacity: 0; }
    }
    .ball-from { animation: from-move 2.2s infinite ease-in-out; }

    /* 3. up */
    @keyframes up-move {
      0% { cy: 80; opacity: 0; }
      15% { opacity: 1; }
      80% { cy: 25; opacity: 1; }
      90%, 100% { cy: 25; opacity: 0; }
    }
    .ball-up { animation: up-move 2.2s infinite ease-in-out; }

    /* 4. down */
    @keyframes down-move {
      0% { cy: 20; opacity: 0; }
      15% { opacity: 1; }
      80% { cy: 75; opacity: 1; }
      90%, 100% { cy: 75; opacity: 0; }
    }
    .ball-down { animation: down-move 2.2s infinite ease-in-out; }

    /* 5. through */
    @keyframes through-move {
      0% { cx: 15; opacity: 0; }
      15% { opacity: 1; }
      80% { cx: 85; opacity: 1; }
      90%, 100% { cx: 85; opacity: 0; }
    }
    .ball-through { animation: through-move 2.4s infinite linear; }

    /* 6. across */
    @keyframes across-move {
      0% { cx: 15; opacity: 0; }
      15% { opacity: 1; }
      80% { cx: 85; opacity: 1; }
      90%, 100% { cx: 85; opacity: 0; }
    }
    .ball-across { animation: across-move 2.4s infinite ease-in-out; }

    /* 7. off */
    @keyframes off-move {
      0% { cx: 25; cy: 45; opacity: 0; }
      10% { opacity: 1; }
      45% { cx: 60; cy: 45; }
      75% { cx: 75; cy: 75; opacity: 1; }
      85%, 100% { cx: 75; cy: 75; opacity: 0; }
    }
    .ball-off { animation: off-move 2.6s infinite ease-in-out; }

    /* 8. about (orbit) */
    @keyframes orbit {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .g-orbit {
      transform-origin: 50px 50px;
      animation: orbit 4s infinite linear;
    }

    /* 9. against (force push) */
    @keyframes against-push {
      0% { cx: 20; }
      35% { cx: 52; }
      80% { cx: 52; }
      90%, 100% { cx: 20; }
    }
    .ball-against { animation: against-push 3s infinite cubic-bezier(0.25, 1, 0.5, 1); }
    
    @keyframes force-pulse {
      0%, 35% { opacity: 0; transform: scale(0.6); }
      45%, 75% { opacity: 1; transform: scale(1.1); }
      85%, 100% { opacity: 0; transform: scale(0.8); }
    }
    .force-arrow {
      transform-origin: 65px 50px;
      animation: force-pulse 3s infinite ease-in-out;
    }

    /* 10. after: follower */
    @keyframes after-lead {
      0% { cx: 40; opacity: 0; }
      15% { opacity: 1; }
      80% { cx: 80; opacity: 1; }
      90%, 100% { cx: 80; opacity: 0; }
    }
    @keyframes after-follow {
      0% { cx: 20; opacity: 0; }
      15% { opacity: 1; }
      80% { cx: 60; opacity: 1; }
      90%, 100% { cx: 60; opacity: 0; }
    }
    .ball-after-lead { animation: after-lead 2.5s infinite ease-in-out; }
    .ball-after-follow { animation: after-follow 2.5s infinite ease-in-out; }

    /* 11. before: leader */
    @keyframes before-lead {
      0% { cx: 45; opacity: 0; }
      15% { opacity: 1; }
      80% { cx: 82; opacity: 1; }
      90%, 100% { cx: 82; opacity: 0; }
    }
    @keyframes before-follow {
      0% { cx: 20; opacity: 0; }
      15% { opacity: 1; }
      80% { cx: 57; opacity: 1; }
      90%, 100% { cx: 57; opacity: 0; }
    }
    .ball-before-lead { animation: before-lead 2.5s infinite ease-in-out; }
    .ball-before-follow { animation: before-follow 2.5s infinite ease-in-out; }

    /* 12. with */
    @keyframes with-group {
      0% { transform: translate(0, 0); opacity: 0; }
      15% { opacity: 1; }
      80% { transform: translate(45px, 0); opacity: 1; }
      90%, 100% { transform: translate(45px, 0); opacity: 0; }
    }
    .group-with { animation: with-group 2.5s infinite ease-in-out; }

    /* 13. in/at pulse */
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.12); }
    }
    .ball-pulse {
      transform-origin: 50px 50px;
      animation: pulse 2s infinite ease-in-out;
    }
    .ball-pulse-at {
      transform-origin: 50px 50px;
      animation: pulse 2s infinite ease-in-out;
    }

    /* 14. till: progress timeline */
    @keyframes till-prog {
      0% { stroke-dashoffset: 60; }
      80% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 0; }
    }
    .path-till {
      stroke-dasharray: 60;
      stroke-dashoffset: 60;
      animation: till-prog 2.8s infinite ease-in-out;
    }

    /* 15. scale-tilt for than */
    @keyframes scale-seesaw {
      0%, 100% { transform: rotate(-8deg); }
      50% { transform: rotate(8deg); }
    }
    .g-seesaw {
      transform-origin: 50px 65px;
      animation: scale-seesaw 4s infinite ease-in-out;
    }
  `;

  const baseSvgProps = {
    viewBox: "0 0 100 100",
    width: "100%",
    height: "100%",
    className: "vector-svg"
  };

  switch (type) {
    // === STATIC PLACE PREPOSITIONS ===
    case "at":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Target grid crosshair */}
          <path d="M50 20 V80 M20 50 H80" stroke={faintColor} strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="14" stroke={strokeWarm} strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          {/* Location marker pin/dot */}
          <circle cx="50" cy="50" r="8" className="ani-ball ball-pulse-at" />
          <circle cx="50" cy="50" r="2" fill="#fff" />
        </svg>
      );
    case "in":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Box Container (Semi-transparent) */}
          <rect x="25" y="25" width="50" height="50" rx="10" stroke={mainColor} strokeWidth="3" fill={fillAccentSoft} fillOpacity="0.25" />
          <rect x="28" y="28" width="44" height="44" rx="8" stroke={faintColor} strokeWidth="1" strokeDasharray="2 2" fill="none" />
          {/* Inside Ball */}
          <circle cx="50" cy="50" r="8.5" className="ani-ball ball-pulse" />
        </svg>
      );
    case "on":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Surface */}
          <path d="M20 60 H80" stroke={mainColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M25 65 L20 70 M40 65 L35 70 M55 65 L50 70 M70 65 L65 70" stroke={faintColor} strokeWidth="2" />
          {/* Ball Resting on Top */}
          <circle cx="50" cy="48" r="10" className="ani-ball" />
          {/* Contact force lines */}
          <path d="M44 59 H56" stroke={strokeWarm} strokeWidth="2" />
        </svg>
      );
    case "under":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Surface */}
          <path d="M20 40 H80" stroke={mainColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M25 35 L28 30 M45 35 L48 30 M65 35 L68 30" stroke={faintColor} strokeWidth="2" />
          {/* Ball Underneath */}
          <circle cx="50" cy="53" r="10" className="ani-ball" />
          {/* Shadow indicator */}
          <ellipse cx="50" cy="67" rx="8" ry="2" fill={faintColor} />
        </svg>
      );
    case "over":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Surface */}
          <path d="M20 65 H80" stroke={mainColor} strokeWidth="3" strokeLinecap="round" />
          {/* Suspended Ball (No Contact) */}
          <circle cx="50" cy="32" r="10" className="ani-ball" />
          {/* Arrow indicating gap */}
          <path d="M50 46 V58" stroke={strokeWarm} strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M46 54 L50 58 L54 54" stroke={strokeWarm} strokeWidth="1.5" fill="none" />
          <path d="M46 50 L50 46 L54 50" stroke={strokeWarm} strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "by":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Pillar reference */}
          <rect x="25" y="25" width="22" height="50" rx="4" stroke={mainColor} strokeWidth="3" fill="none" />
          {/* Ball by the side */}
          <circle cx="67" cy="50" r="10" className="ani-ball" />
          {/* Closeness indicator */}
          <path d="M52 50 H60" stroke={strokeWarm} strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );
    case "between":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Two pillars */}
          <rect x="15" y="25" width="16" height="50" rx="3" stroke={faintColor} strokeWidth="2" fill="none" />
          <rect x="69" y="25" width="16" height="50" rx="3" stroke={faintColor} strokeWidth="2" fill="none" />
          {/* Ball in intermediate gap */}
          <circle cx="50" cy="50" r="10.5" className="ani-ball ball-pulse" />
        </svg>
      );
    case "among":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Surrounding elements */}
          <circle cx="25" cy="30" r="6" className="ani-ball-secondary" />
          <circle cx="75" cy="28" r="6" className="ani-ball-secondary" />
          <circle cx="20" cy="70" r="6" className="ani-ball-secondary" />
          <circle cx="70" cy="72" r="6" className="ani-ball-secondary" />
          <circle cx="45" cy="22" r="6" className="ani-ball-secondary" />
          <circle cx="52" cy="78" r="6" className="ani-ball-secondary" />
          {/* Main ball nested in the middle */}
          <circle cx="48" cy="50" r="11" className="ani-ball ball-pulse" />
        </svg>
      );

    // === MOVEMENT / VECTOR PREPOSITIONS ===
    case "to":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Target Box on right */}
          <rect x="65" y="35" width="22" height="30" rx="4" stroke={faintColor} strokeWidth="2" fill="none" />
          {/* Vector Arrow pointing right */}
          <path d="M15 50 H60" stroke={strokeWarm} strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M53 45 L60 50 L53 55" stroke={strokeWarm} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Animated Ball */}
          <circle cx="20" cy="50" r="8" className="ani-ball ball-to" />
        </svg>
      );
    case "from":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Source Box on left */}
          <rect x="12" y="35" width="22" height="30" rx="4" stroke={faintColor} strokeWidth="2" fill="none" />
          {/* Vector Arrow pointing away */}
          <path d="M36 50 H80" stroke={strokeWarm} strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M73 45 L80 50 L73 55" stroke={strokeWarm} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Animated Ball */}
          <circle cx="30" cy="50" r="8" className="ani-ball ball-from" />
        </svg>
      );
    case "up":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Vector Arrow pointing up */}
          <path d="M50 85 V25" stroke={strokeWarm} strokeWidth="3" strokeDasharray="4 3" />
          <path d="M44 32 L50 25 L56 32" stroke={strokeWarm} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Ground reference line */}
          <path d="M30 85 H70" stroke={mainColor} strokeWidth="2" />
          {/* Animated Ball climbing up */}
          <circle cx="50" cy="80" r="8.5" className="ani-ball ball-up" />
        </svg>
      );
    case "down":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Vector Arrow pointing down */}
          <path d="M50 15 V75" stroke={strokeWarm} strokeWidth="3" strokeDasharray="4 3" />
          <path d="M44 68 L50 75 L56 68" stroke={strokeWarm} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Ground reference line */}
          <path d="M30 80 H70" stroke={mainColor} strokeWidth="2" />
          {/* Animated Ball dropping down */}
          <circle cx="50" cy="20" r="8.5" className="ani-ball ball-down" />
        </svg>
      );
    case "through":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Tube sleeve representing hollow interior */}
          <rect x="35" y="32" width="30" height="36" rx="4" fill={fillAccentSoft} fillOpacity="0.1" stroke={faintColor} strokeWidth="2" strokeDasharray="4 2" />
          {/* Solid entrance/exit pipes */}
          <path d="M35 32 H65 M35 68 H65" stroke={mainColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Vector Line passing through */}
          <path d="M10 50 H90" stroke={strokeWarm} strokeWidth="2" strokeDasharray="4 4" />
          <path d="M82 45 L90 50 L82 55" stroke={strokeWarm} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Animated Ball travelling all the way through */}
          <circle cx="15" cy="50" r="7.5" className="ani-ball ball-through" />
        </svg>
      );
    case "across":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Flat crosswalk/river boundary in the middle */}
          <rect x="42" y="15" width="16" height="70" fill={fillAccentSoft} fillOpacity="0.3" stroke={faintColor} strokeWidth="1.5" />
          <path d="M42 15 V85 M58 15 V85" stroke={mainColor} strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Vector arrow moving across */}
          <path d="M10 50 H90" stroke={strokeWarm} strokeWidth="2.5" strokeDasharray="4 4" />
          <path d="M82 45 L90 50 L82 55" stroke={strokeWarm} strokeWidth="2.5" fill="none" />
          {/* Animated Ball */}
          <circle cx="15" cy="50" r="7.5" className="ani-ball ball-across" />
        </svg>
      );
    case "off":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Platform table structure */}
          <path d="M15 45 H60 V80" stroke={mainColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Vector falling trajectory */}
          <path d="M25 45 H60 C65 45, 75 55, 75 75" stroke={strokeWarm} strokeWidth="2" strokeDasharray="3 3" fill="none" />
          {/* Animated Ball falling off surface */}
          <circle cx="25" cy="45" r="7.5" className="ani-ball ball-off" />
        </svg>
      );
    case "about":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Center Box */}
          <rect x="40" y="40" width="20" height="20" rx="3" stroke={mainColor} strokeWidth="3.5" fill="none" />
          {/* Circular vector path */}
          <circle cx="50" cy="50" r="28" stroke={strokeWarm} strokeWidth="2" strokeDasharray="4 3" fill="none" />
          {/* Animated Ball orbiting around center */}
          <g className="g-orbit">
            <circle cx="50" cy="22" r="7.5" className="ani-ball" />
          </g>
        </svg>
      );

    // === RELATIONSHIP PREPOSITIONS ===
    case "against":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Solid Wall */}
          <rect x="62" y="15" width="16" height="70" rx="2" stroke={mainColor} strokeWidth="3.5" fill={faintColor} />
          {/* Force vector arrows showing counter-pressure */}
          <g className="force-arrow">
            <path d="M60 50 H42" stroke={strokeWarm} strokeWidth="3" strokeLinecap="round" />
            <path d="M49 44 L42 50 L49 56" stroke={strokeWarm} strokeWidth="3" strokeLinejoin="round" fill="none" />
          </g>
          {/* Ball pushing against wall */}
          <circle cx="20" cy="50" r="10" className="ani-ball ball-against" />
        </svg>
      );
    case "after":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Linear tracking path */}
          <path d="M10 50 H90" stroke={faintColor} strokeWidth="2" strokeDasharray="5 5" />
          {/* Leader Ball (dark) */}
          <circle cx="40" cy="50" r="8.5" className="ani-ball-secondary ball-after-lead" />
          {/* Follower Ball (accent) - Chase coordinate */}
          <circle cx="20" cy="50" r="8.5" className="ani-ball ball-after-follow" />
          {/* Follow indicator link */}
          <path d="M22 58 C30 65, 45 65, 53 58" stroke={strokeWarm} strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        </svg>
      );
    case "before":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Linear tracking path */}
          <path d="M10 50 H90" stroke={faintColor} strokeWidth="2" strokeDasharray="5 5" />
          {/* Leader Ball (accent) - Preceding position */}
          <circle cx="45" cy="50" r="8.5" className="ani-ball ball-before-lead" />
          {/* Follower Ball (dark) */}
          <circle cx="20" cy="50" r="8.5" className="ani-ball-secondary ball-before-follow" />
          {/* Lead indicator link */}
          <path d="M22 42 C30 35, 45 35, 53 42" stroke={strokeWarm} strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        </svg>
      );
    case "with":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Tracking path */}
          <path d="M10 38 H90 M10 62 H90" stroke={faintColor} strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Two balls moving in parallel inside a bounding box */}
          <g className="group-with">
            <rect x="10" y="24" width="28" height="52" rx="6" stroke={strokeWarm} strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <circle cx="24" cy="38" r="7.5" className="ani-ball" />
            <circle cx="24" cy="62" r="7.5" className="ani-ball-secondary" />
          </g>
        </svg>
      );

    // === LOGICAL RELATION WORDS ===
    case "of":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Circular whole pie */}
          <circle cx="50" cy="50" r="28" stroke={mainColor} strokeWidth="3" fill="none" />
          {/* Dotted lines split into parts */}
          <path d="M50 50 L50 22 M50 50 L75 62 M50 50 L25 62" stroke={faintColor} strokeWidth="2" strokeDasharray="3 2" />
          {/* Highlighted sector slice (Part of Whole) */}
          <path d="M50 50 L50 22 A28 28 0 0 1 74.2 64 Z" fill={strokeColor} fillOpacity="0.4" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
          {/* Connector arrow from part to whole */}
          <path d="M68 32 C78 28, 80 18, 70 12" stroke={strokeWarm} strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          <text x="75" y="10" fontSize="7" fontFamily="var(--mono)" fill={strokeWarm} fontWeight="bold">OF</text>
        </svg>
      );
    case "for":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Sender on left, Target Box (benefit/objective) on right */}
          <circle cx="25" cy="50" r="9" className="ani-ball-secondary" />
          <rect x="62" y="36" width="24" height="28" rx="4" stroke={strokeColor} strokeWidth="3.5" fill={fillAccentSoft} fillOpacity="0.2" />
          {/* Purpose vector pointing to recipient */}
          <path d="M38 50 H56" stroke={strokeWarm} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M49 43 L56 50 L49 57" stroke={strokeWarm} strokeWidth="3.5" strokeLinejoin="round" fill="none" />
          <text x="38" y="38" fontSize="8" fontFamily="var(--mono)" fill={strokeWarm} fontWeight="bold">FOR</text>
        </svg>
      );
    case "as":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Original Shape (Circle) and its Role Projection (Star/Square) */}
          <circle cx="28" cy="50" r="12" stroke={mainColor} strokeWidth="3" fill="none" />
          {/* Equivalence morphing lens / window */}
          <path d="M46 25 V75" stroke={strokeWarm} strokeWidth="3" strokeDasharray="5 4" />
          {/* Projected identity role */}
          <polygon points="72,35 76,46 87,46 78,53 82,65 72,58 62,65 66,53 57,46 68,46" stroke={strokeColor} strokeWidth="3" fill="none" />
          <text x="40" y="18" fontSize="8" fontFamily="var(--mono)" fill={strokeWarm} fontWeight="bold">AS</text>
        </svg>
      );
    case "till":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Timeline slider */}
          <path d="M15 50 H68" stroke={faintColor} strokeWidth="4" strokeLinecap="round" />
          {/* Limit Stop Wall (Boundary limit) */}
          <path d="M72 25 V75" stroke={mainColor} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M68 25 L72 25 M68 75 L72 75" stroke={mainColor} strokeWidth="2" />
          {/* Progress fill path animating up to the wall */}
          <path d="M15 50 H68" stroke={strokeColor} strokeWidth="4.5" strokeLinecap="round" className="path-till" />
          <text x="64" y="18" fontSize="8" fontFamily="var(--mono)" fill={strokeColor} fontWeight="bold">TILL</text>
        </svg>
      );
    case "than":
      return (
        <svg {...baseSvgProps}>
          <style>{inlineStyles}</style>
          {/* Pivot triangle */}
          <polygon points="50,65 44,80 56,80" fill={mainColor} />
          {/* Balancing seesaw scale beam */}
          <g className="g-seesaw">
            <path d="M15 65 H85" stroke={mainColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Sphere A (larger/heavy) vs Sphere B (smaller/light) */}
            <circle cx="20" cy="53" r="11" stroke={strokeColor} strokeWidth="3" fill={fillAccentSoft} />
            <circle cx="80" cy="58" r="6" stroke={strokeColor} strokeWidth="3" fill="none" />
            <text x="17" y="55" fontSize="8" fontFamily="var(--serif)" fontWeight="bold" fill={strokeColor}>A</text>
            <text x="78" y="60" fontSize="8" fontFamily="var(--serif)" fontWeight="bold" fill={strokeColor}>B</text>
          </g>
          <text x="44" y="25" fontSize="8" fontFamily="var(--mono)" fill={strokeWarm} fontWeight="bold">THAN</text>
        </svg>
      );

    default:
      return null;
  }
}

export default function DirectionsVisual() {
  const [selectedWord, setSelectedWord] = useState<DirectionWord>(GROUPS[0].words[0]);

  return (
    <div className="operators-visualizer directions-visualizer">
      <div className="visualizer-header">
        <span className="machine-kicker">物理矢量骨架</span>
        <h3>20 个空间方向词与 5 个逻辑介词：几何滑轨</h3>
        <p>
          Ogden 认为，空间介词是句子的<strong>几何图解</strong>。
          Basic English 不使用复杂的动作词，而是用极其精简的 18 个 Operator（基础动作）配合这 20 个物理方向词，把动作在三维空间中的<strong>方向矢量、位移始末、接触状态</strong>拼接出来。
        </p>
      </div>

      <div className="visualizer-body">
        {/* 左侧：分类单词卡网格 */}
        <div className="operators-grid-panel">
          {GROUPS.map((group) => (
            <div key={group.name} className="op-group-section">
              <div className="op-group-title">
                <h4>{group.name}</h4>
                <span className="op-group-subtitle">{group.desc}</span>
              </div>
              <div className="op-group-chips">
                {group.words.map((item) => {
                  const isSelected = selectedWord.word === item.word;
                  return (
                    <button
                      key={item.word}
                      type="button"
                      className={`op-chip${isSelected ? " active" : ""}`}
                      onClick={() => setSelectedWord(item)}
                    >
                      <span className="op-chip-en">{item.word}</span>
                      <span className="op-chip-cn">{item.cn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：方向物理矢量展示卡片 */}
        <div className="operator-vector-card" key={selectedWord.word}>
          <div className="vector-card-head">
            <div className="vector-card-title-row">
              <span className="card-op-en" style={{ fontSize: "2.4rem", fontFamily: "var(--serif)" }}>
                {selectedWord.word}
              </span>
              <span className="card-op-cn" style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--accent)" }}>
                {selectedWord.cn}
              </span>
            </div>
            <div className="vector-card-tag">
              {selectedWord.category === "static" && "静态位置 (Static Place)"}
              {selectedWord.category === "movement" && "动态位移 (Movement/Vector)"}
              {selectedWord.category === "relation" && "相对关系 (Relationship)"}
              {selectedWord.category === "logical" && "逻辑抽象 (Logical Relation)"}
            </div>
          </div>

          {/* 交互矢量动画区域 */}
          <div className="vector-card-graphic" style={{ background: "linear-gradient(135deg, var(--bg) 0%, rgba(254,243,199,0.06) 100%)", minHeight: "150px" }}>
            <DirectionGraphic type={selectedWord.svgType} />
          </div>

          <div className="vector-card-info">
            <div className="vector-info-section">
              <h5 style={{ fontSize: "0.75rem", color: "var(--ink-faint)", fontWeight: "600", letterSpacing: "0.06em", margin: "0 0 0.25rem 0" }}>
                空间物理/逻辑模型 (Spatial/Logical Concept)
              </h5>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", lineHeight: "1.6", margin: "0" }}>
                {selectedWord.concept}
              </p>
            </div>

            <div className="vector-info-section">
              <h5 style={{ fontSize: "0.75rem", color: "var(--ink-faint)", fontWeight: "600", letterSpacing: "0.06em", margin: "0 0 0.25rem 0" }}>
                倍增组合应用 (BE850 Equation)
              </h5>
              <code className="vector-formula-code">
                {selectedWord.equation}
              </code>
            </div>

            <div className="vector-info-section">
              <h5 style={{ fontSize: "0.75rem", color: "var(--ink-faint)", fontWeight: "600", letterSpacing: "0.06em", margin: "0 0 0.25rem 0" }}>
                核心搭配示例 (Example Phrases)
              </h5>
              <ul className="vector-example-list" style={{ fontSize: "0.85rem", color: "var(--ink-muted)", margin: "0", paddingLeft: "1.1rem" }}>
                {selectedWord.examples.map((ex) => (
                  <li key={ex} style={{ marginBottom: "0.25rem" }}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
