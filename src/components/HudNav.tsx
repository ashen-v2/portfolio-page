import { navItems, profile } from "../data/content";
import { CloudSprite } from "./Sprites";

export function HudNav() {
  return (
    <header className="hud-nav">
      <a className="hud-brand" href="#start">
        <CloudSprite size={28} />
        {profile.handle}
      </a>
      <nav className="hud-links" aria-label="Section">
        {navItems.map((item) => (
          <a key={item.href} className="nav-link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="hud-stats" aria-hidden>
        <span className="stat-chip">
          <span className="stat-label">HP</span>
          <span className="hp-bar">
            <span />
          </span>
        </span>
        <span className="stat-chip">
          <span className="stat-label">CLASS</span>
          <span>{profile.className}</span>
        </span>
      </div>
    </header>
  );
}
