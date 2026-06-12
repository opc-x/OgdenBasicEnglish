import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

export default function SidebarWordSearch() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const isWordsPage = pathname === "/doc/words";
  const [focusSearch, setFocusSearch] = useState(false);

  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);

  useEffect(() => {
    setDraft(q);
  }, [q]);

  useEffect(() => {
    if (isWordsPage && focusSearch) {
      inputRef.current?.focus();
      setFocusSearch(false);
    }
  }, [isWordsPage, focusSearch]);

  const openWords = (opts?: { focus?: boolean }) => {
    navigate("/doc/words");
    if (opts?.focus) setFocusSearch(true);
  };

  const syncQuery = (value: string) => {
    const next = new URLSearchParams(params);
    const query = value.trim();
    if (query) next.set("q", query);
    else next.delete("q");
    setParams(next, { replace: true });
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const query = draft.trim();
    if (!isWordsPage) {
      navigate(query ? `/doc/words?q=${encodeURIComponent(query)}` : "/doc/words");
      return;
    }
    syncQuery(draft);
  };

  const onDraftChange = (value: string) => {
    setDraft(value);
    if (isWordsPage) syncQuery(value);
  };

  if (!isWordsPage) {
    return (
      <div className="sidebar-word-bar">
        <button type="button" className="sidebar-word-bar__list" onClick={() => openWords()}>
          词表
        </button>
        <button
          type="button"
          className="sidebar-word-bar__search"
          aria-label="搜索 850 词"
          onClick={() => openWords({ focus: true })}
        >
          <SearchIcon />
        </button>
      </div>
    );
  }

  return (
    <form className="sidebar-word-bar sidebar-word-bar--active" onSubmit={submit}>
      <input
        ref={inputRef}
        type="search"
        className="sidebar-word-bar__input"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        placeholder="搜单词或中文…"
        aria-label="搜索 850 词"
      />
      <button type="submit" className="sidebar-word-bar__search" aria-label="搜索">
        <SearchIcon />
      </button>
    </form>
  );
}
