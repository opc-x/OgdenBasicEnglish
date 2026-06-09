import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type Scene = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
};

const SCENES: Scene[] = [
  {
    id: 0,
    title: "核心公式 (The Formula)",
    subtitle: "把复杂动词还原成物理动作与空间方向",
    description: "Ogden Basic English 的灵魂是：消除 4000+ 复杂动词。一切动作都是【身体位移/手势操作 (18 Operators)】与【物理空间方向 (20 Directions)】的乘法组合。"
  },
  {
    id: 1,
    title: "动作骨架 (The Skeleton)",
    subtitle: "18个物理手势与20个空间方位",
    description: "动作是一架机器。Operators (如 come, go, put, take) 是关节和齿轮，方向词 (如 in, out, up, down) 是滑轨和朝向。关节与滑轨卡合，就拼出了日常全部动作。"
  },
  {
    id: 2,
    title: "装载词根 (The Roots)",
    subtitle: "850词分层装配，绝非死记硬背",
    description: "850 词分成四大层级：最底层的 100个 Operations（语法骨架），200个 Picturable（可画图的实体词），400个 General（通用概念名词），和 150个 Qualities（修饰性质词）。"
  },
  {
    id: 3,
    title: "乘数倍增 (The Multiplier)",
    subtitle: "词缀与复合词的物理大爆发",
    description: "借助 6 个核心词缀 (-s, -er, -ing, -ed, -ly, un-) 和左右复合规则（如 sun + flower = sunflower），850 个词根可以瞬间自我繁殖，覆盖日常 90% 的表达需求。"
  }
];

export default function PlaybookPlay() {
  const [activeScene, setActiveScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<any>(null);

  const duration = 6000; // 每个场景播放 6 秒
  const stepTime = 30; // 30ms 更新一次进度

  useEffect(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
    }

    if (isPlaying) {
      const increment = (stepTime / duration) * 100;
      progressTimer.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveScene((curr) => (curr + 1) % SCENES.length);
            return 0;
          }
          return prev + increment;
        });
      }, stepTime);
    }

    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, [isPlaying, activeScene]);

  const handleTabClick = (index: number) => {
    setActiveScene(index);
    setProgress(0);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setActiveScene((curr) => (curr + 1) % SCENES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveScene((curr) => (curr - 1 + SCENES.length) % SCENES.length);
    setProgress(0);
  };

  return (
    <div className="playbook-visualizer">
      {/* 顶部标题 */}
      <div className="visualizer-header">
        <span className="machine-kicker">新手入门指南</span>
        <h3>Ogden 850 学习法：视觉通关 Playbook</h3>
        <p>
          不用死记硬背。点击下方播放器，花两分钟看懂 Basic English 的<strong>物理乘积逻辑</strong>，然后按照攻略路线开始通关。
        </p>
      </div>

      {/* 视频型播放器 */}
      <div className="playbook-player">
        {/* 顶部场景切换标签 */}
        <div className="player-tabs">
          {SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              type="button"
              className={`player-tab-btn${activeScene === idx ? " active" : ""}`}
              onClick={() => handleTabClick(idx)}
            >
              <span className="tab-idx">0{idx + 1}</span>
              <span className="tab-title">{scene.title.split(" ")[0]}</span>
              {activeScene === idx && isPlaying && (
                <span className="tab-progress-indicator" style={{ width: `${progress}%` }} />
              )}
            </button>
          ))}
        </div>

        {/* 核心动画屏幕 */}
        <div className="player-screen">
          {/* 场景 1: 核心公式 */}
          {activeScene === 0 && (
            <div className="scene-content scene-formula">
              <div className="formula-box-row">
                <div className="formula-node glow-card">
                  <span className="node-num">850</span>
                  <span className="node-label">词根 (Roots)</span>
                </div>
                <div className="formula-operator">×</div>
                <div className="formula-node glow-card active-node">
                  <span className="node-num">18</span>
                  <span className="node-label">动作 (Operators)</span>
                </div>
                <div className="formula-operator">×</div>
                <div className="formula-node glow-card">
                  <span className="node-num">20</span>
                  <span className="node-label">物理方向 (Dirs)</span>
                </div>
                <div className="formula-operator">=</div>
                <div className="formula-node result-node">
                  <span className="node-text">日常表达 90%</span>
                  <span className="node-label">代替 4000+ 普通动词</span>
                </div>
              </div>

              <div className="animation-demo-box">
                <div className="demo-phrase-line">
                  <span className="phrase-word cross-through">enter the room</span>
                  <span className="phrase-arrow">➔</span>
                  <span className="phrase-word bold-word green">go</span>
                  <span className="phrase-word bold-word orange">in</span>
                  <span className="phrase-word">the room</span>
                </div>
                <div className="demo-phrase-caption">
                  物理化拆解：消灭普通动词 <i>enter</i>，拼装为动作 <i>go</i> 与方向 <i>in</i>
                </div>
              </div>
            </div>
          )}

          {/* 场景 2: 动作骨架 */}
          {activeScene === 1 && (
            <div className="scene-content scene-skeleton">
              <div className="skeleton-visual-row">
                <div className="skeleton-verbs-panel">
                  <h5>18 个动作 Operator (关节齿轮)</h5>
                  <div className="skeleton-chips">
                    <span className="sk-chip verb-chip">come / go</span>
                    <span className="sk-chip verb-chip">put / take</span>
                    <span className="sk-chip verb-chip">give / get</span>
                    <span className="sk-chip verb-chip">keep / let</span>
                    <span className="sk-chip verb-chip">make / do</span>
                  </div>
                </div>
                <div className="skeleton-connector-line">
                  <div className="arrow-pulse">➔</div>
                </div>
                <div className="skeleton-dirs-panel">
                  <h5>20 个方向介词 (物理轨道)</h5>
                  <div className="skeleton-chips">
                    <span className="sk-chip dir-chip">in / out</span>
                    <span className="sk-chip dir-chip">up / down</span>
                    <span className="sk-chip dir-chip">over / under</span>
                    <span className="sk-chip dir-chip">before / after</span>
                  </div>
                </div>
              </div>
              <div className="animation-demo-box">
                <div className="physics-assembly">
                  <span className="assembly-item">take (拿)</span>
                  <span className="assembly-plus">+</span>
                  <span className="assembly-item">down (向下)</span>
                  <span className="assembly-equal">=</span>
                  <span className="assembly-result">take down (拿下来 = remove)</span>
                </div>
              </div>
            </div>
          )}

          {/* 场景 3: 分层装词 */}
          {activeScene === 2 && (
            <div className="scene-content scene-roots">
              <div className="pyramid-container">
                <div className="pyramid-tier tier-qualities">
                  <span className="tier-tag">150 Qualities</span>
                  <span className="tier-desc">修饰世界：性质形容词 (good, red, cold)</span>
                </div>
                <div className="pyramid-tier tier-general">
                  <span className="tier-tag">400 General</span>
                  <span className="tier-desc">抽象世界：名词概念 (agreement, business)</span>
                </div>
                <div className="pyramid-tier tier-picturable">
                  <span className="tier-tag">200 Picturable</span>
                  <span className="tier-desc">物理实体：可画图名词 (table, box, cat)</span>
                </div>
                <div className="pyramid-tier tier-ops">
                  <span className="tier-tag">100 Operations</span>
                  <span className="tier-desc">语法底座：连词/介词/代词 (and, but, to)</span>
                </div>
              </div>
            </div>
          )}

          {/* 场景 4: 乘数倍增 */}
          {activeScene === 3 && (
            <div className="scene-content scene-multiplier">
              <div className="multiplier-showcase">
                <div className="showcase-card">
                  <h6>① 复合词乘法 (Compounding)</h6>
                  <div className="showcase-formula">
                    <span>sun (太阳)</span>
                    <span>+</span>
                    <span>flower (花)</span>
                    <span>➔</span>
                    <span className="result-bold">sunflower (向日葵)</span>
                  </div>
                </div>
                <div className="showcase-card">
                  <h6>② 派生词缀 (-s, -er, -ing, -ed, -ly, un-)</h6>
                  <div className="showcase-formula">
                    <span>un-</span>
                    <span>+</span>
                    <span>work (工作)</span>
                    <span>+</span>
                    <span>-able</span>
                    <span>➔</span>
                    <span className="result-bold">unworkable (行不通的)</span>
                  </div>
                </div>
              </div>
              <div className="demo-phrase-caption" style={{ marginTop: "1rem" }}>
                仅需 850 词根，通过词缀与拼合，瞬间增殖出数千个日常可用词汇
              </div>
            </div>
          )}
        </div>

        {/* 播放器控制器 */}
        <div className="player-controls">
          <div className="controls-row">
            <button type="button" className="control-btn" onClick={handlePrev} title="上一步">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
              </svg>
            </button>
            <button type="button" className="control-btn play-pause-btn" onClick={handlePlayPause} title={isPlaying ? "暂停" : "播放"}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button type="button" className="control-btn" onClick={handleNext} title="下一步">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z" />
              </svg>
            </button>
          </div>

          {/* 进度条轨道 */}
          <div className="player-timeline">
            <div className="timeline-track">
              <div className="timeline-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="time-code">
              {activeScene + 1} / {SCENES.length}
            </span>
          </div>
        </div>

        {/* 场景文字旁白说明 */}
        <div className="player-caption">
          <h5>{SCENES[activeScene].subtitle}</h5>
          <p>{SCENES[activeScene].description}</p>
        </div>
      </div>

      {/* 攻略图标题 */}
      <div className="roadmap-header" style={{ marginTop: "3.5rem" }}>
        <span className="machine-kicker">学习攻略卡</span>
        <h3>四周通关 Playbook (Action Steps)</h3>
        <p>跟着攻略路线，一步一步吃透 Basic English。点击对应章节可以直接跳转学习。</p>
      </div>

      {/* 四周通关路线卡片 */}
      <div className="roadmap-grid">
        <div className="roadmap-card week-1">
          <div className="card-badge">WEEK 1</div>
          <h4>搭好物理骨架</h4>
          <p className="card-goal">目标：抛弃所有普通动词，学会用身体/手势动作组装句子。</p>
          <ul className="card-todo">
            <li>
              背熟 <Link to="/doc/operators" className="link-hover">18个 Operator</Link>，搞懂它们对应的物理空间运动方向。
            </li>
            <li>
              学习 <Link to="/doc/directions" className="link-hover">20个方向词与介词</Link>，这是运动的物理滑轨。
            </li>
            <li>
              速读一遍 <Link to="/doc/grammar" className="link-hover">3张语法规则卡</Link>（BE850的语法只是在普通英语中扣掉了繁复动词）。
            </li>
          </ul>
        </div>

        <div className="roadmap-card week-2">
          <div className="card-badge">WEEK 2</div>
          <h4>分类装入词根</h4>
          <p className="card-goal">目标：把 850 词分层塞进骨架里，不要按字母表死背。</p>
          <ul className="card-todo">
            <li>
              阅读 <Link to="/doc/tier-guide" className="link-hover">分层学习指南</Link>，认清名词、形容词、代词的轻重缓急。
            </li>
            <li>
              利用 <Link to="/words" className="link-hover">850词随时查</Link>，优先看可画图词（Picturable 200词），结合图像建立物理映射。
            </li>
          </ul>
        </div>

        <div className="roadmap-card week-3">
          <div className="card-badge">WEEK 3</div>
          <h4>启动乘数倍增</h4>
          <p className="card-goal">目标：理解组合规则，让 850 词发挥出 5000 词的表达力。</p>
          <ul className="card-todo">
            <li>
              重点练习 <Link to="/doc/phrasal" className="link-hover">100组常用短语动词</Link>（Operator + 方向，如 put off, get back）。
            </li>
            <li>
              掌握 <Link to="/doc/affixes" className="link-hover">词缀扩展规则</Link>（如 un-, -er, -ly）及 <Link to="/doc/compounds" className="link-hover">复合词拼合逻辑</Link>。
            </li>
          </ul>
        </div>

        <div className="roadmap-card week-4">
          <div className="card-badge">WEEK 4</div>
          <h4>在限制内输出</h4>
          <p className="card-goal">目标：自我约束，开始流利地进行英文阅读、听力与写作。</p>
          <ul className="card-todo">
            <li>
              精读一遍 <Link to="/doc/practice" className="link-hover">阅读与练习推荐</Link>，下载配套的 <i>English Through Pictures</i> 绘本。
            </li>
            <li>
              尝试用 Basic English 限制集写日记、和 Agent 对话，摆脱对生僻动词的依赖。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
