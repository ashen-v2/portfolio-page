import { useState } from "react";
import { navItems, type Profile } from "../data/content";
import { CloudSprite } from "./Sprites";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("ashen-theme", theme);
}

export function HudNav({ profile }: { profile: Profile | null }) {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <header className="hud-nav">
      <a className="hud-brand" href="#start">
        <CloudSprite size={28} />
        {profile?.handle ?? "ASHEN OS"}
      </a>
      <nav className="hud-links" aria-label="Section">
        {navItems.map((item) => (
          <a key={item.href} className="nav-link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="theme-toggle"
        aria-pressed={theme === "light"}
        onClick={toggleTheme}
      >
        {theme === "dark" ? "DAY" : "NIGHT"}
      </button>
      <div className="hud-stats" aria-hidden>
        <span className="stat-chip">
          <span className="stat-label">HP</span>
          <span className="hp-bar">
            <span />
          </span>
        </span>
        <span className="stat-chip">
          <span className="stat-label">CLASS</span>
          <span>{profile?.className ?? "—"}</span>
        </span>
      </div>
    </header>
  );
}
