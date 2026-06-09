import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import DocPage from "./DocPage";
import Home from "./Home";
import WordsPage from "./WordsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="words" element={<WordsPage />} />
        <Route path="doc/:slug" element={<DocPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
