/** 词缀 + 复合：BE850 的另外两种「倍增」方式。数据来自 03-composition/。 */

type AffixRoot = {
  root: string;
  forms: { word: string; affix: string; cn: string }[];
};

const AFFIX_ROOTS: AffixRoot[] = [
  {
    root: "work",
    forms: [
      { word: "works", affix: "-S", cn: "复数" },
      { word: "worker", affix: "-ER", cn: "工人" },
      { word: "working", affix: "-ING", cn: "进行" },
      { word: "worked", affix: "-ED", cn: "过去" },
    ],
  },
  {
    root: "quick",
    forms: [
      { word: "quickly", affix: "-LY", cn: "快地（副词）" },
    ],
  },
  {
    root: "happy",
    forms: [
      { word: "unhappy", affix: "UN-", cn: "不开心（反义）" },
    ],
  },
];

const COMPOUNDS: { a: string; b: string; result: string; cn: string }[] = [
  { a: "sun", b: "light", result: "sunlight", cn: "阳光" },
  { a: "bed", b: "room", result: "bedroom", cn: "卧室" },
  { a: "any", b: "thing", result: "anything", cn: "任何东西" },
  { a: "foot", b: "step", result: "footstep", cn: "脚步" },
];

export default function MultiplyMore() {
  return (
    <div className="multiply">
      <div className="multiply-head">
        <span className="multiply-kicker">再放大一层</span>
        <h3>同一批词，还能这样变出更多</h3>
        <p>除了 operator + 方向，还有两条规则——都不引入新词根。</p>
      </div>

      <div className="multiply-grid">
        {/* 词缀 */}
        <div className="mult-card">
          <div className="mult-card-label">
            <span className="mult-num">1</span> 词缀：一个词根，多个形态
          </div>
          <div className="affix-rows">
            {AFFIX_ROOTS.map((r) => (
              <div className="affix-row" key={r.root}>
                <span className="affix-root">{r.root}</span>
                <span className="affix-branch" aria-hidden>→</span>
                <div className="affix-forms">
                  {r.forms.map((f) => (
                    <span className="affix-form" key={f.word}>
                      <span className="affix-word">{f.word}</span>
                      <span className="affix-tag">{f.affix}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 复合 */}
        <div className="mult-card">
          <div className="mult-card-label">
            <span className="mult-num">2</span> 复合：两个词根，粘成新词
          </div>
          <div className="compound-rows">
            {COMPOUNDS.map((c) => (
              <div className="compound-row" key={c.result}>
                <span className="cmp-part">{c.a}</span>
                <span className="cmp-plus" aria-hidden>+</span>
                <span className="cmp-part">{c.b}</span>
                <span className="cmp-eq" aria-hidden>=</span>
                <span className="cmp-result">{c.result}</span>
                <span className="cmp-cn">{c.cn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
