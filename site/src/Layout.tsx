import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { GROUPS, NAV } from "./content";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="shell">
      <button
        type="button"
        className="sidebar-toggle"
        aria-label="????"
        onClick={() => setOpen((v) => !v)}
      >
        ?
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">850</span>
          <span>
            Ogden
            <br />
            Basic English
          </span>
        </Link>

        <nav className="side-nav">
          {GROUPS.map((group) => (
            <div key={group} className="nav-group">
              <p className="nav-group-label">{group}</p>
              {NAV.filter((n) => n.group === group).map((item) => (
                <NavLink
                  key={item.slug}
                  to={`/doc/${item.slug}`}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <footer className="side-footer">
          <a
            href="https://github.com/opc-x/OgdenBasicEnglish"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ?
          </a>
        </footer>
      </aside>

      {open && (
        <button
          type="button"
          className="backdrop"
          aria-label="????"
          onClick={() => setOpen(false)}
        />
      )}

      <main className={`main ${isHome ? "main-home" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
