import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import SidebarWordSearch from "./SidebarWordSearch";
import SiteBrand from "./SiteBrand";
import { PHASE_COLORS, PhaseIcon, SlugIcon } from "./navIcons";
import {
  LEARNING_PHASES,
  getPhaseItems,
  type NavPhase,
} from "./content";

function phaseContainsSlug(phase: NavPhase, slug: string | null): boolean {
  if (!slug) return false;
  return getPhaseItems(phase.id).some((n) => n.slug === slug);
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const activeSlug = pathname.startsWith("/doc/")
    ? pathname.replace("/doc/", "")
    : pathname === "/words"
      ? "words-search"
      : null;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const p of LEARNING_PHASES) {
      if (p.collapsed) init[p.id] = true;
    }
    return init;
  });

  useEffect(() => {
    for (const p of LEARNING_PHASES) {
      if (p.collapsed && phaseContainsSlug(p, activeSlug)) {
        setCollapsed((prev) => ({ ...prev, [p.id]: false }));
      }
    }
  }, [activeSlug]);

  const close = () => setOpen(false);

  return (
    <div className="shell">
      <button
        type="button"
        className={`sidebar-toggle${open ? " is-open" : ""}`}
        aria-label={open ? "关闭导航" : "打开导航"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ham-line" />
        <span className="ham-line" />
        <span className="ham-line" />
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link className="sidebar-brand-link" to="/" onClick={close} title="返回首页">
            <SiteBrand compact />
          </Link>
          <SidebarWordSearch />
        </div>

        <nav className="side-nav" aria-label="学习路径">
          {LEARNING_PHASES.map((phase) => {
            const items = getPhaseItems(phase.id);
            if (items.length === 0) return null;

            const isActivePhase = phaseContainsSlug(phase, activeSlug);
            const isCollapsed = collapsed[phase.id] ?? false;
            const isExtra = !!phase.collapsed;
            const color = PHASE_COLORS[phase.id] ?? PHASE_COLORS.map;

            return (
              <section
                key={phase.id}
                className={`nav-phase${isActivePhase ? " nav-phase--active" : ""}${isExtra ? " nav-phase--extra" : ""}`}
                style={{ ["--phase-color" as string]: color }}
              >
                {isExtra ? (
                  <button
                    type="button"
                    className="nav-phase-head nav-phase-head--toggle"
                    onClick={() => setCollapsed((p) => ({ ...p, [phase.id]: !isCollapsed }))}
                    aria-expanded={!isCollapsed}
                  >
                    <span className="nav-phase-badge">
                      <PhaseIcon id={phase.id} />
                    </span>
                    <span className="nav-phase-title">{phase.title}</span>
                    <span className="nav-phase-chevron" aria-hidden>
                      {isCollapsed ? "+" : "−"}
                    </span>
                  </button>
                ) : (
                  <div className="nav-phase-head">
                    <span className="nav-phase-badge">
                      <PhaseIcon id={phase.id} />
                    </span>
                    <div className="nav-phase-copy">
                      <span className="nav-phase-step">
                        {phase.step === "★" ? "核心" : `第 ${phase.step} 步`}
                      </span>
                      <span className="nav-phase-title">{phase.title}</span>
                    </div>
                  </div>
                )}

                {(!isExtra || !isCollapsed) && (
                  <ul className="nav-phase-links">
                    {items.map((item) => (
                      <li key={item.slug}>
                        <NavLink
                          to={item.href ?? `/doc/${item.slug}`}
                          className={({ isActive }) =>
                            `nav-phase-link${isActive ? " nav-phase-link--active" : ""}${item.badge === "重点" ? " nav-phase-link--hot" : ""}`
                          }
                          onClick={close}
                        >
                          <SlugIcon slug={item.slug} />
                          <span className="nav-phase-link-label">{item.title}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </nav>

        <footer className="side-footer">
          <a
            className="side-footer-link"
            href="https://github.com/opc-x/OgdenBasicEnglish"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden fill="currentColor">
              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.12-1.5-1.12-1.5-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.74 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 6.84c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.48.1 2.74.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .28.18.6.69.5A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
            </svg>
            GitHub
          </a>
        </footer>
      </aside>

      {open && (
        <button type="button" className="backdrop" aria-label="关闭导航" onClick={close} />
      )}

      <main className={`main ${isHome ? "main-home" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
