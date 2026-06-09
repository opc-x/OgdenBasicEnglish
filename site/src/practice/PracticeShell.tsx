import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { countDone } from "./progress";

type LessonItem = {
  id: string;
  label: string;
  sub?: string;
  done?: boolean;
};

type Props = {
  moduleId: string;
  title: string;
  subtitle: string;
  source: string;
  lessons: LessonItem[];
  activeId: string;
  basePath: string;
  children: ReactNode;
};

export default function PracticeShell({
  moduleId,
  title,
  subtitle,
  source,
  lessons,
  activeId,
  basePath,
  children,
}: Props) {
  const doneCount = countDone(
    moduleId,
    lessons.map((l) => l.id),
  );

  return (
    <div className="practice-page">
      <header className="practice-header">
        <p className="practice-kicker">第 4 步 · 练输出</p>
        <h1>{title}</h1>
        <p className="practice-sub">{subtitle}</p>
        <p className="practice-source">
          原文：{source} · 进度 {doneCount}/{lessons.length}
        </p>
      </header>

      <div className="practice-layout">
        <nav className="practice-lesson-nav" aria-label="课程列表">
          <p className="practice-nav-label">课程</p>
          <ul>
            {lessons.map((l) => (
              <li key={l.id}>
                <Link
                  to={`${basePath}/${l.id}`}
                  className={`practice-lesson-link${l.id === activeId ? " practice-lesson-link--active" : ""}${l.done ? " practice-lesson-link--done" : ""}`}
                >
                  <span className="practice-lesson-num">{l.label}</span>
                  {l.sub && <span className="practice-lesson-sub">{l.sub}</span>}
                  {l.done && <span className="practice-done-mark">✓</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="practice-main">{children}</div>
      </div>
    </div>
  );
}
