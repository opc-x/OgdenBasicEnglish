import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { speakText } from "../speak";
import PracticeShell from "./PracticeShell";
import { checkAnswer } from "./checkAnswer";
import { isDone, markDone } from "./progress";
import { STEP_BY_STEP_LESSONS } from "./stepByStepData";

export default function StepByStepPage() {
  const { lessonId } = useParams();
  const activeId = lessonId ?? STEP_BY_STEP_LESSONS[0].id;
  const lesson = STEP_BY_STEP_LESSONS.find((l) => l.id === activeId);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, "correct" | "close" | "wrong" | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const lessonNav = useMemo(
    () =>
      STEP_BY_STEP_LESSONS.map((l) => ({
        id: l.id,
        label: `${l.number}`,
        sub: l.titleZh,
        done: isDone("sbs", l.id),
      })),
    [activeId],
  );

  if (!lesson) {
    return <Navigate to={`/practice/step-by-step/${STEP_BY_STEP_LESSONS[0].id}`} replace />;
  }

  const checkOne = (qid: string, expected: string[]) => {
    const r = checkAnswer(answers[qid] ?? "", expected);
    setResults((prev) => ({ ...prev, [qid]: r }));
    if (r !== "wrong") markDone("sbs", lesson.id);
  };

  const reveal = (qid: string) => setRevealed((p) => ({ ...p, [qid]: true }));

  const allChecked = lesson.questions.every((q) => results[q.id] === "correct" || results[q.id] === "close");
  const nextIdx = STEP_BY_STEP_LESSONS.findIndex((l) => l.id === lesson.id) + 1;
  const next = STEP_BY_STEP_LESSONS[nextIdx];

  return (
    <PracticeShell
      moduleId="sbs"
      title="示范句跟读 · Basic Step by Step"
      subtitle="先跟读官方示范句，再用完整句回答问答——Ogden 1935 原课顺序"
      source={lesson.source}
      lessons={lessonNav}
      activeId={lesson.id}
      basePath="/practice/step-by-step"
    >
      <section className="practice-section">
        <h2>
          {lesson.number}. {lesson.title}
          <span className="practice-zh">{lesson.titleZh}</span>
        </h2>
        <div className="practice-vocab">
          {lesson.vocab.map((w) => (
            <button key={w} type="button" className="practice-vocab-chip" onClick={() => speakText(w)}>
              {w}
            </button>
          ))}
        </div>
      </section>

      <section className="practice-section">
        <h3>示范句 · 跟读</h3>
        <p className="practice-hint">大声朗读；点句子听英式发音。合上页面凭记忆复述。</p>
        <ol className="practice-sentences">
          {lesson.modelSentences.map((s, i) => (
            <li key={s}>
              <span className="practice-sent-idx">{i + 1}</span>
              <button type="button" className="practice-sent-btn" onClick={() => speakText(s)}>
                {s}
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="practice-section">
        <h3>问答 · 完整句作答</h3>
        <p className="practice-hint">用 Basic English 写完整句，不是单词。答不上可点「看答案」。</p>
        <ul className="practice-qa-list">
          {lesson.questions.map((q, i) => {
            const r = results[q.id];
            return (
              <li key={q.id} className={`practice-qa${r ? ` practice-qa--${r}` : ""}`}>
                <p className="practice-q">
                  <span className="practice-q-num">{i + 1}.</span> {q.prompt}
                </p>
                <div className="practice-qa-row">
                  <input
                    type="text"
                    className="practice-input"
                    placeholder="Type your answer in Basic English…"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && checkOne(q.id, q.answers)}
                  />
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => checkOne(q.id, q.answers)}>
                    检查
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => reveal(q.id)}>
                    看答案
                  </button>
                </div>
                {r === "correct" && <p className="practice-feedback practice-feedback--ok">✓ 对了</p>}
                {r === "close" && <p className="practice-feedback practice-feedback--ok">≈ 接近，可对照官方表述</p>}
                {r === "wrong" && <p className="practice-feedback practice-feedback--no">再试一次，或看答案</p>}
                {revealed[q.id] && (
                  <p className="practice-official">
                    官方：{q.answers[0]}
                    <button type="button" className="practice-speak-inline" onClick={() => speakText(q.answers[0])}>
                      听
                    </button>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {allChecked && next && (
        <footer className="practice-footer">
          <Link className="btn btn-primary" to={`/practice/step-by-step/${next.id}`}>
            下一课：{next.titleZh} →
          </Link>
        </footer>
      )}
    </PracticeShell>
  );
}
