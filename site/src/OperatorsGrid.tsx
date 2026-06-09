import { useState } from "react";

type Operator = {
  op: string;
  cn: string;
  vector: string;
  concept: string;
  equation: string;
  examples: string[];
  svgType: string;
};

type OpGroup = {
  name: string;
  desc: string;
  ops: Operator[];
};

const OP_GROUPS: OpGroup[] = [
  {
    name: "空间位移 (Movement)",
    desc: "人体的物理空间移动，是所有抽象动作的基础",
    ops: [
      {
        op: "come", cn: "来", vector: "朝向说话者 (→ ⬤)",
        concept: "身体向观察点或说话人靠近。动作重点在「终点在眼前」。",
        equation: "come + in = 进来 (enter)",
        examples: ["come back (回来)", "come out (发生/出版)", "come to (共计)"],
        svgType: "come"
      },
      {
        op: "go", cn: "去", vector: "背离说话者 (⬤ →)",
        concept: "身体离开当前位置。动作重点在「起点在眼前，终点在别处」。",
        equation: "go + on = 继续 (continue)",
        examples: ["go out (熄灭/出去)", "go through (经历/穿过)", "go off (离开/爆炸)"],
        svgType: "go"
      }
    ]
  },
  {
    name: "手部操作 (Hand Action)",
    desc: "手的放开与抓取，构成对物体最基础的控制",
    ops: [
      {
        op: "put", cn: "放", vector: "手部放开/向外推 (↓)",
        concept: "手持物体并使其在某处落下或安放。动作倾向为「向下、向外」。",
        equation: "put + off = 推迟 (postpone)",
        examples: ["put together (组装)", "put on (穿上)", "put out (熄灭)"],
        svgType: "put"
      },
      {
        op: "take", cn: "拿", vector: "手部抓取/向内拉 (↑)",
        concept: "伸手握住物体并使之脱离原位。动作倾向为「向上、向内」。",
        equation: "take + off = 脱掉/起飞 (remove)",
        examples: ["take in (吸收/欺骗)", "take up (占据/开始)", "take over (接管)"],
        svgType: "take"
      }
    ]
  },
  {
    name: "所有人际传递 (Transfer)",
    desc: "物品所有权的流转或远程发送",
    ops: [
      {
        op: "give", cn: "给", vector: "所有权移出 (→ ⎔)",
        concept: "将自己持有的东西交到他人手中，方向一定是指向「对方 (to)」。",
        equation: "give + up = 放弃 (surrender)",
        examples: ["give back (归还)", "give in (让步/屈服)", "give out (分发)"],
        svgType: "give"
      },
      {
        op: "get", cn: "得", vector: "所有权移入 (⎔ →)",
        concept: "通过各种方式获得、接收某物，或身体/状态转换到某处。",
        equation: "get + up = 起来 (rise)",
        examples: ["get back (收回)", "get out (出去)", "get off (下车)"],
        svgType: "get"
      },
      {
        op: "send", cn: "送", vector: "非手部的远程投递 (⤳)",
        concept: "不需要手部亲自递交，通过中介或推力将物体送往某处。",
        equation: "send + out = 发出 (emit)",
        examples: ["send off (邮寄/送别)", "send back (退回)", "send for (派人去请)"],
        svgType: "send"
      }
    ]
  },
  {
    name: "状态控制 (Control)",
    desc: "控制力的收放：维持原样或任其流转",
    ops: [
      {
        op: "keep", cn: "保持", vector: "画圈锁定/限制在内 (↺)",
        concept: "维持物体的当前位置或状态不改变，阻止其逃逸。",
        equation: "keep + off = 别碰 (stay away)",
        examples: ["keep back (阻挡)", "keep on (继续)", "keep up (维持/不落后)"],
        svgType: "keep"
      },
      {
        op: "let", cn: "允许/让", vector: "松开界限/流出 (⇢)",
        concept: "撤除屏障或控制，允许人或物移动或改变状态。",
        equation: "let + in = 允许进入 (admit)",
        examples: ["let off (放过/免除)", "let out (放出/泄露)", "let down (使失望/放下)"],
        svgType: "let"
      }
    ]
  },
  {
    name: "创制与执行 (Action)",
    desc: "对现实物理世界的改动和事务处理",
    ops: [
      {
        op: "make", cn: "制造", vector: "无中生有/塑造成型 (⚒)",
        concept: "动手改变原材料，生产或塑造出一个全新的事物。",
        equation: "make + up = 编造/和好 (invent)",
        examples: ["make out (看清/理解)", "make off (逃走)", "make ready (准备好)"],
        svgType: "make"
      },
      {
        op: "do", cn: "做", vector: "纯动作过程/空转 (⚙)",
        concept: "指代任何动作的执行过程。不强调结果产物，只强调「动起来」。",
        equation: "do + again = 重做 (repeat)",
        examples: ["do well (做得好)", "do without (没有...也行)", "do up (整理/系扣)"],
        svgType: "do"
      }
    ]
  },
  {
    name: "感知与交流 (Perception)",
    desc: "信息的接收和言语的输出",
    ops: [
      {
        op: "see", cn: "看", vector: "光线射入眼睛/洞察 (👁)",
        concept: "眼睛接收图像的物理感知，延伸为脑中「理解、看清真相」。",
        equation: "see + through = 看穿 (penetrate)",
        examples: ["see to (负责处理)", "see off (送行)", "see about (考虑/办理)"],
        svgType: "see"
      },
      {
        op: "say", cn: "说", vector: "声波流出 (🗣)",
        concept: "发出声音表达意图，将思维用语言表达出来的单向输出。",
        equation: "say + again = 重说 (repeat)",
        examples: ["say to himself (自言自语)", "say yes (同意)", "have a say (有发言权)"],
        svgType: "say"
      }
    ]
  },
  {
    name: "存在与所有 (State)",
    desc: "不包含动作的静态客观状态",
    ops: [
      {
        op: "be", cn: "是/在", vector: "静止不动的主体 (⬤)",
        concept: "纯粹的客观存在状态，或者位于某个特定的空间/时间里。",
        equation: "be + in = 在家/参与 (present)",
        examples: ["be off (走了)", "be up to (取决于/胜任)", "be out (不在家/熄灭)"],
        svgType: "be"
      },
      {
        op: "have", cn: "有", vector: "闭合线框包含主体 (⎔)",
        concept: "将某物视为自己所属，静态占有，或者身体经历某种体验。",
        equation: "have + on = 穿着 (wear)",
        examples: ["have to (不得不)", "have a talk (谈话)", "have a look (看一眼)"],
        svgType: "have"
      },
      {
        op: "seem", cn: "似乎", vector: "折射/虚线反射 (░)",
        concept: "感官呈现出的样子，不一定代表物理真实情况（“虚像”）。",
        equation: "seem + like = 看起来像 (resemble)",
        examples: ["seem good (看似不错)", "it seems that (似乎...)", "seem to be (好像是)"],
        svgType: "seem"
      }
    ]
  },
  {
    name: "时态与许可 (Auxiliary)",
    desc: "赋予主语动作时空维度的两只推手",
    ops: [
      {
        op: "may", cn: "可以", vector: "分支选择 (⤳)",
        concept: "表示许可（你可以做）或者可能性（也许会发生）。",
        equation: "may + do = 可以做",
        examples: ["may be (也许/可能)", "as you may see (正如你可能看到的)"],
        svgType: "may"
      },
      {
        op: "will", cn: "将", vector: "指向未来的箭头 (➔)",
        concept: "表示意志（一定要做）或者客观的未来时间线。",
        equation: "will + do = 将要做",
        examples: ["will go (将去)", "good will (善意/意志)"],
        svgType: "will"
      }
    ]
  }
];

function VectorGraphic({ type }: { type: string }) {
  const strokeColor = "var(--accent)";
  const mainColor = "var(--ink)";
  const faintColor = "var(--border)";
  
  switch (type) {
    case "come":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          <circle cx="70" cy="50" r="8" fill={mainColor} />
          <path d="M15 50 H60" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M50 40 L60 50 L50 60" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="70" cy="50" r="16" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 4" fill="none" />
        </svg>
      );
    case "go":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          <circle cx="30" cy="50" r="8" fill={mainColor} />
          <path d="M30 50 H85" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M75 40 L85 50 L75 60" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "put":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Box outline */}
          <path d="M30 65 H70 V85 H30 Z" stroke={faintColor} strokeWidth="3" fill="none" />
          {/* Arrow pointing down */}
          <path d="M50 20 V60" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M42 52 L50 60 L58 52" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Hand abstract */}
          <path d="M35 15 H50" stroke={mainColor} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "take":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Box outline */}
          <path d="M30 65 H70 V85 H30 Z" stroke={faintColor} strokeWidth="3" fill="none" />
          {/* Arrow pointing up */}
          <path d="M50 70 V30" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M42 38 L50 30 L58 38" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Hand grasping */}
          <path d="M40 20 C40 20, 50 15, 60 20" stroke={mainColor} strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "give":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Sender */}
          <circle cx="25" cy="55" r="8" fill={mainColor} />
          {/* Receiver */}
          <circle cx="75" cy="55" r="8" fill={faintColor} />
          {/* Transfer Arrow */}
          <path d="M35 50 C45 40, 55 40, 65 50" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M58 42 L65 50 L57 53" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "get":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Target */}
          <circle cx="75" cy="55" r="8" fill={mainColor} />
          {/* Source */}
          <circle cx="25" cy="55" r="8" fill={faintColor} />
          {/* Receiver Arrow */}
          <path d="M35 50 C45 40, 55 40, 65 50" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M42 42 L35 50 L43 53" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "send":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          <circle cx="30" cy="50" r="10" fill={mainColor} />
          {/* Multi-arrows pointing away */}
          <path d="M45 40 L75 25" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M68 23 L75 25 L72 32" stroke={strokeColor} strokeWidth="3" fill="none" />
          
          <path d="M48 50 L80 50" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M72 44 L80 50 L72 56" stroke={strokeColor} strokeWidth="4" fill="none" />
          
          <path d="M45 60 L75 75" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M72 68 L75 75 L68 77" stroke={strokeColor} strokeWidth="3" fill="none" />
        </svg>
      );
    case "keep":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          <circle cx="50" cy="50" r="12" fill={mainColor} />
          {/* Circular bounding arrow */}
          <path d="M50 25 A25 25 0 1 1 49.9 25" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeDasharray="140 20" fill="none" />
          <path d="M45 20 L55 25 L45 30" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "let":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Barrier with a gap */}
          <path d="M50 15 V40" stroke={mainColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M50 60 V85" stroke={mainColor} strokeWidth="4" strokeLinecap="round" />
          {/* Arrow passing through gap */}
          <path d="M20 50 H80" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeDasharray="8 4" />
          <path d="M70 42 L80 50 L70 58" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "make":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Blocks stacking up */}
          <rect x="25" y="65" width="50" height="15" rx="3" fill={faintColor} stroke={mainColor} strokeWidth="2" />
          <rect x="35" y="45" width="30" height="15" rx="3" fill="none" stroke={strokeColor} strokeWidth="3" />
          <path d="M50 15 V35" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M45 25 L50 35 L55 25" stroke={strokeColor} strokeWidth="3" fill="none" />
        </svg>
      );
    case "do":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Rotating gears concept */}
          <circle cx="40" cy="40" r="16" stroke={mainColor} strokeWidth="3" strokeDasharray="6 4" fill="none" />
          <circle cx="64" cy="64" r="12" stroke={strokeColor} strokeWidth="3" strokeDasharray="4 4" fill="none" />
          <circle cx="40" cy="40" r="4" fill={mainColor} />
          <circle cx="64" cy="64" r="3" fill={strokeColor} />
        </svg>
      );
    case "see":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Eye outline */}
          <path d="M15 50 C30 25, 70 25, 85 50 C70 75, 30 75, 15 50 Z" stroke={mainColor} strokeWidth="4" strokeLinejoin="round" fill="none" />
          <circle cx="50" cy="50" r="10" fill={strokeColor} />
          {/* Vision rays */}
          <path d="M65 35 L80 25" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M65 65 L80 75" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "say":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Speech bubble */}
          <path d="M20 25 H80 V65 H45 L25 80 V65 H20 Z" stroke={mainColor} strokeWidth="4" strokeLinejoin="round" fill="none" />
          {/* Audio lines */}
          <path d="M35 45 H65" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M40 37 H60" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "be":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Anchor solid state */}
          <circle cx="50" cy="50" r="20" fill="none" stroke={strokeColor} strokeWidth="5" />
          <circle cx="50" cy="50" r="8" fill={mainColor} />
          <path d="M20 50 H80" stroke={faintColor} strokeWidth="2" strokeDasharray="4 4" />
          <path d="M50 20 V80" stroke={faintColor} strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      );
    case "have":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Closed possession frame */}
          <rect x="25" y="25" width="50" height="50" rx="6" stroke={mainColor} strokeWidth="4" fill="none" />
          <circle cx="50" cy="50" r="10" fill={strokeColor} />
        </svg>
      );
    case "seem":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Mirror / refraction line */}
          <path d="M50 15 V85" stroke={mainColor} strokeWidth="3" strokeDasharray="6 4" />
          {/* Real object vs reflected */}
          <circle cx="28" cy="50" r="10" fill={mainColor} />
          <circle cx="72" cy="50" r="10" stroke={strokeColor} strokeWidth="3" fill="none" strokeDasharray="3 3" />
        </svg>
      );
    case "may":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Branching possibilities */}
          <path d="M15 50 H45" stroke={mainColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M45 50 C55 35, 65 30, 80 30" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M45 50 C55 65, 65 70, 80 70" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="4 2" />
          <path d="M72 23 L80 30 L72 35" stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "will":
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="vector-svg">
          {/* Arrow pointing forward/right with velocity lines */}
          <path d="M15 50 H80" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M70 40 L80 50 L70 60" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M20 40 L10 50 L20 60" stroke={faintColor} strokeWidth="2" fill="none" />
          <path d="M30 40 L20 50 L30 60" stroke={faintColor} strokeWidth="2" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function OperatorsGrid() {
  const [selectedOp, setSelectedOp] = useState<Operator>(OP_GROUPS[0].ops[0]);

  return (
    <div className="operators-visualizer">
      <div className="visualizer-header">
        <span className="machine-kicker">核心语法构件</span>
        <h3>18 个动作Operator：空间物理模型</h3>
        <p>
          Ogden 的核心理念是：<strong>用物理空间和手势位移来描述世界。</strong>
          英语中本没有复杂的动作动词（如 <i>enter</i>），所有动作都是身体移动（<i>come/go</i>）、手部抓放（<i>put/take</i>）或所有权转移（<i>give/get/send</i>）与方向介词的物理组合。
        </p>
      </div>

      <div className="visualizer-body">
        {/* 左侧：分类网格 */}
        <div className="operators-grid-panel">
          {OP_GROUPS.map((group) => (
            <div key={group.name} className="op-group-section">
              <div className="op-group-title">
                <h4>{group.name}</h4>
                <span className="op-group-subtitle">{group.desc}</span>
              </div>
              <div className="op-group-chips">
                {group.ops.map((item) => {
                  const isSelected = selectedOp.op === item.op;
                  return (
                    <button
                      key={item.op}
                      type="button"
                      className={`op-chip${isSelected ? " active" : ""}`}
                      onClick={() => setSelectedOp(item)}
                    >
                      <span className="op-chip-en">{item.op}</span>
                      <span className="op-chip-cn">{item.cn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：单词的物理矢量卡片 */}
        <div className="operator-vector-card" key={selectedOp.op}>
          <div className="vector-card-head">
            <div className="vector-card-title-row">
              <span className="card-op-en">{selectedOp.op}</span>
              <span className="card-op-cn">{selectedOp.cn}</span>
            </div>
            <div className="vector-card-tag">{selectedOp.vector}</div>
          </div>

          <div className="vector-card-graphic">
            <VectorGraphic type={selectedOp.svgType} />
          </div>

          <div className="vector-card-info">
            <div className="vector-info-section">
              <h5>物理手势模型 (Spatial Concept)</h5>
              <p>{selectedOp.concept}</p>
            </div>

            <div className="vector-info-section">
              <h5>组合乘积公式 (Basic Equation)</h5>
              <code className="vector-formula-code">{selectedOp.equation}</code>
            </div>

            <div className="vector-info-section">
              <h5>核心常用短语 (High Frequency Combinations)</h5>
              <ul className="vector-example-list">
                {selectedOp.examples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
