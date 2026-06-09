import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { speakText } from "../speak";
import PracticeShell from "./PracticeShell";
import { BASIC_TEACHER_STEPS } from "./basicTeacherData";
import { checkAnswer } from "./checkAnswer";
import { isDone, markDone } from "./progress";

export default function BasicTeacherPage() {
  const { stepId } = useParams();
  const activeId = stepId ?? BASIC_TEACHER_STEPS[0].id;
  const step = BASIC_TEACHER_STEPS.find((s) => s.id === activeId);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [blankInputs, setBlankInputs] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<Record<string, "correct" | "close" | "wrong" | null>>({});
  const [blankResults, setBlankResults] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const lessonNav = useMemo(
    () =>
      BASIC_TEACHER_STEPS.map((s) => ({
        id: s.id,
        label: `${s.number}`,
        sub: s.titleZh,
        done: isDone("bt", s.id),
      })),
    [activeId],
  );

  if (!step) {
    return <Navigate to={`/practice/basic-teacher/${BASIC_TEACHER_STEPS[0].id}`} replace />;
  }

  const checkQ = (qid: string, expected: string[]) => {
    const r = checkAnswer(answers[qid] ?? "", expected);
    setResults((prev) => ({ ...prev, [qid]: r }));
    if (r !== "wrong") markDone("bt", step.id);
  };

  const checkBlank = (fid: string, expected: string[]) => {
    const vals = blankInputs[fid] ?? [];
    const ok = expected.every((e, i) => checkAnswer(vals[i] ?? "", [e]) !== "wrong");
    setBlankResults((p) => ({ ...p, [fid]: ok }));
    if (ok) markDone("bt", step.id);
  };

  const sentences = step.kind === "structure" ? step.structureSentences ?? [] : [];
  const nextIdx = BASIC_TEACHER_STEPS.findIndex((s) => s.id === step.id) + 1;
  const next = BASIC_TEACHER_STEPS[nextIdx];

  return (
    <PracticeShell
      moduleId="bt"
      title="Basic Teacher 系统课"
      subtitle="Lockhart 1950 官方课程：Structure（造句规则）与 Reading（场景短文）交替推进"
      source={step.source}
      lessons={lessonNav}
      activeId={step.id}
      basePath="/practice/basic-teacher"
    >
      <section className="practice-section">
        <h2>
          {step.title}
          <span className="practice-zh">{step.titleZh}</span>
          <span className={`practice-kind practice-kind--${step.kind}`}>
            {step.kind === "structure" ? "Structure" : "Reading"}
          </span>
        </h2>
        <div className="practice-vocab">
          {step.vocab.map((w) => (
            <button key={w} type="button" className="practice-vocab-chip" onClick={() => speakText(w)}>
              {w}
            </button>
          ))}
        </div>
      </section>

      {step.kind === "structure" && sentences.length > 0 && (
        <section className="practice-section">
          <h3>Structure · 官方例句</h3>
          <p className="practice-hint">照抄例句，改一两个词造新句（仍限 850 词 + operator）。</p>
          <ol className="practice-sentences">
            {sentences.map((s, i) => (
              <li key={s}>
                <span className="practice-sent-idx">{i + 1}</span>
                <button type="button" className="practice-sent-btn" onClick={() => speakText(s)}>
                  {s}
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {step.kind === "reading" && step.readingParagraphs && (
        <section className="practice-section">
          <h3>Reading · {step.readingTitle}</h3>
          <p className="practice-hint">大声朗读全文；划出不认识的词回查 850 词表。</p>
          <div className="practice-reading">
            {step.readingParagraphs.map((p) => (
              <p key={p}>
                <button type="button" className="practice-read-para" onClick={() => speakText(p)}>
                  {p}
                </button>
              </p>
            ))}
          </div>
        </section>
      )}

      {step.fillBlanks && step.fillBlanks.length > 0 && (
        <section className="practice-section">
          <h3>填空 · 官方练习</h3>
          <ul className="practice-blank-list">
            {step.fillBlanks.map((fb) => {
              const parts = fb.template.split("___");
              const ok = blankResults[fb.id];
              return (
                <li key={fb.id} className={`practice-blank${ok ? " practice-blank--ok" : ""}`}>
                  <div className="practice-blank-line">
                    {parts.map((part, i) => (
                      <span key={`${fb.id}-${i}`}>
                        {part}
                        {i < fb.blanks.length && (
                          <input
                            type="text"
                            className="practice-blank-input"
                            size={8}
                            value={blankInputs[fb.id]?.[i] ?? ""}
                            onChange={(e) => {
                              const next = [...(blankInputs[fb.id] ?? [])];
                              next[i] = e.target.value;
                              setBlankInputs((p) => ({ ...p, [fb.id]: next }));
                            }}
                          />
                        )}
                      </span>
                    ))}
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => checkBlank(fb.id, fb.blanks)}>
                    检查
                  </button>
                  {ok && <span className="practice-feedback practice-feedback--ok">✓</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="practice-section">
        <h3>Exercises · 问答</h3>
        <ul className="practice-qa-list">
          {step.questions.map((q, i) => {
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
                    placeholder="Answer in Basic English…"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && checkQ(q.id, q.answers)}
                  />
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => checkQ(q.id, q.answers)}>
                    检查
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRevealed((p) => ({ ...p, [q.id]: true }))}>
                    看答案
                  </button>
                </div>
                {r === "correct" && <p className="practice-feedback practice-feedback--ok">✓</p>}
                {r === "close" && <p className="practice-feedback practice-feedback--ok">≈ 接近</p>}
                {r === "wrong" && <p className="practice-feedback practice-feedback--no">再试</p>}
                {revealed[q.id] && <p className="practice-official">官方：{q.answers[0]}</p>}
              </li>
            );
          })}
        </ul>
      </section>

      {next && (
        <footer className="practice-footer">
          <Link className="btn btn-primary" to={`/practice/basic-teacher/${next.id}`}>
            下一课：{next.titleZh} →
          </Link>
        </footer>
      )}
    </PracticeShell>
  );
}
