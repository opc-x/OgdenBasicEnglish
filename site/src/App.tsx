import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import DocPage from "./DocPage";
import Home from "./Home";
import WordDetailPage from "./WordDetailPage";
import StepByStepPage from "./practice/StepByStepPage";
import BasicTeacherPage from "./practice/BasicTeacherPage";
import OutputLabPage from "./practice/OutputLabPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="words" element={<Navigate to="/doc/words" replace />} />
        <Route path="word/:word" element={<WordDetailPage />} />
        <Route path="practice" element={<Navigate to="/practice/lab" replace />} />
        <Route path="practice/lab" element={<OutputLabPage />} />
        <Route path="practice/step-by-step" element={<Navigate to="/practice/step-by-step/body" replace />} />
        <Route path="practice/step-by-step/:lessonId" element={<StepByStepPage />} />
        <Route path="practice/basic-teacher" element={<Navigate to="/practice/basic-teacher/bt1" replace />} />
        <Route path="practice/basic-teacher/:stepId" element={<BasicTeacherPage />} />
        <Route path="doc/:slug" element={<DocPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
