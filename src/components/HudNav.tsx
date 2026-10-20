import { useState } from "react";
import { navItems, type Profile } from "../data/content";
import { CloudSprite } from "./Sprites";

type Theme = "day" | "dusk";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dusk" ? "dusk" : "day";
}

function applyTheme(theme: Theme) {
  if (theme === "dusk") {
    document.documentElement.dataset.theme = "dusk";
  } else {
    delete document.documentElement.dataset.theme;
  }
  localStorage.setItem("ashen-theme", theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dusk" ? "#ffb087" : "#7ec8ff");
}

export function HudNav({ profile }: { profile: Profile | null }) {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  function toggleTheme() {
    const next: Theme = theme === "day" ? "dusk" : "day";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <header className="hud-nav">
      <a className="hud-brand" href="#start">
        <CloudSprite size={28} />
        {profile?.handle ?? "ASHEN"}
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
        aria-pressed={theme === "dusk"}
        onClick={toggleTheme}
      >
        {theme === "day" ? "DUSK" : "DAY"}
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
