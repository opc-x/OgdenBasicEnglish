import { Link } from "react-router-dom";
import WordExplorer from "./WordExplorer";
import { OPERATOR_WORDS } from "./words850";
import { speak } from "./speak";

export default function WordsPage() {
  return (
    <div className="words-page">
      <section className="operators-hero">
        <div className="operators-hero-head">
          <span className="operators-hero-kicker">核心 · 必背</span>
          <h1>18 个 Operator</h1>
          <p>
            BE850 的全部动作靠这 18 个词根拼出来，没有 <code>read</code>、<code>decide</code> 这种普通动词。
            <Link to="/doc/operators"> 看讲解 →</Link>
          </p>
        </div>
        <div className="operators-pills">
          {OPERATOR_WORDS.map((w) => (
            <button key={w} type="button" className="operator-pill" onClick={() => void speak(w)} title="点击发音">
              {w}
            </button>
          ))}
        </div>
      </section>
      <WordExplorer defaultFilter="op18" />
    </div>
  );
}
