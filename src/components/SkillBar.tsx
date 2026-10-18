import type { ReactNode } from "react";

type SkillTileProps = {
  name: string;
  icon: string;
  learning?: boolean;
};

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg width={22} height={22} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
      {children}
    </svg>
  );
}

function SkillGlyph({ icon }: { icon: string }) {
  const brass = "var(--gold)";
  const cyan = "var(--cyan)";
  const magenta = "var(--rose)";

  switch (icon) {
    case "cloud":
      return (
        <Glyph>
          <rect x="4" y="5" width="8" height="2" fill={cyan} />
          <rect x="3" y="7" width="10" height="3" fill={cyan} />
          <rect x="6" y="10" width="2" height="2" fill={brass} />
          <rect x="9" y="10" width="2" height="2" fill={brass} />
        </Glyph>
      );
    case "crate":
      return (
        <Glyph>
          <rect x="3" y="4" width="10" height="9" fill={cyan} />
          <rect x="3" y="8" width="10" height="1" fill="var(--border)" />
          <rect x="7" y="4" width="2" height="9" fill="var(--border)" />
        </Glyph>
      );
    case "pipeline":
      return (
        <Glyph>
          <rect x="2" y="4" width="4" height="3" fill={brass} />
          <rect x="6" y="5" width="4" height="1" fill={cyan} />
          <rect x="10" y="4" width="4" height="3" fill={magenta} />
          <rect x="2" y="10" width="4" height="3" fill={magenta} />
          <rect x="6" y="11" width="4" height="1" fill={cyan} />
          <rect x="10" y="10" width="4" height="3" fill={brass} />
        </Glyph>
      );
    case "proxy":
      return (
        <Glyph>
          <rect x="2" y="3" width="3" height="10" fill={cyan} />
          <rect x="6" y="5" width="3" height="6" fill={brass} />
          <rect x="10" y="7" width="4" height="2" fill={magenta} />
        </Glyph>
      );
    case "terminal":
      return (
        <Glyph>
          <rect x="2" y="3" width="12" height="10" fill="var(--panel)" />
          <rect x="2" y="3" width="12" height="2" fill={brass} />
          <rect x="4" y="7" width="2" height="2" fill={cyan} />
          <rect x="7" y="7" width="5" height="2" fill={cyan} />
        </Glyph>
      );
    case "script":
      return (
        <Glyph>
          <rect x="4" y="2" width="8" height="12" fill={brass} />
          <rect x="6" y="5" width="5" height="1" fill="var(--border)" />
          <rect x="6" y="8" width="5" height="1" fill="var(--border)" />
          <rect x="6" y="11" width="3" height="1" fill="var(--border)" />
        </Glyph>
      );
    case "shell":
      return (
        <Glyph>
          <rect x="2" y="3" width="12" height="10" fill="var(--panel)" />
          <rect x="4" y="6" width="2" height="2" fill={magenta} />
          <rect x="7" y="6" width="2" height="2" fill={cyan} />
          <rect x="4" y="9" width="6" height="1" fill={brass} />
        </Glyph>
      );
    case "database":
      return (
        <Glyph>
          <rect x="3" y="3" width="10" height="3" fill={cyan} />
          <rect x="3" y="6" width="10" height="3" fill={brass} />
          <rect x="3" y="9" width="10" height="4" fill={magenta} />
        </Glyph>
      );
    case "cup":
      return (
        <Glyph>
          <rect x="4" y="3" width="7" height="2" fill={brass} />
          <rect x="5" y="5" width="5" height="6" fill={cyan} />
          <rect x="10" y="6" width="2" height="3" fill={brass} />
          <rect x="4" y="12" width="7" height="2" fill={brass} />
        </Glyph>
      );
    case "network":
      return (
        <Glyph>
          <rect x="2" y="2" width="3" height="3" fill={cyan} />
          <rect x="11" y="2" width="3" height="3" fill={brass} />
          <rect x="6" y="7" width="4" height="3" fill={magenta} />
          <rect x="2" y="11" width="3" height="3" fill={brass} />
          <rect x="11" y="11" width="3" height="3" fill={cyan} />
          <rect x="5" y="3" width="6" height="1" fill={cyan} />
          <rect x="7" y="5" width="2" height="2" fill={cyan} />
        </Glyph>
      );
    case "scale":
      return (
        <Glyph>
          <rect x="7" y="2" width="2" height="10" fill={brass} />
          <rect x="3" y="4" width="10" height="2" fill={brass} />
          <rect x="2" y="6" width="4" height="3" fill={cyan} />
          <rect x="10" y="6" width="4" height="3" fill={magenta} />
          <rect x="5" y="13" width="6" height="2" fill={brass} />
        </Glyph>
      );
    case "lock":
      return (
        <Glyph>
          <rect x="5" y="2" width="6" height="5" fill="none" stroke={cyan} strokeWidth="2" />
          <rect x="3" y="7" width="10" height="7" fill={brass} />
          <rect x="7" y="9" width="2" height="3" fill="var(--border)" />
        </Glyph>
      );
    case "key":
      return (
        <Glyph>
          <rect x="2" y="4" width="5" height="5" fill={brass} />
          <rect x="4" y="6" width="1" height="1" fill="var(--border)" />
          <rect x="7" y="6" width="7" height="2" fill={cyan} />
          <rect x="11" y="8" width="2" height="2" fill={cyan} />
          <rect x="13" y="8" width="2" height="3" fill={cyan} />
        </Glyph>
      );
    case "api":
      return (
        <Glyph>
          <rect x="7" y="1" width="2" height="4" fill={magenta} />
          <rect x="5" y="5" width="6" height="3" fill={cyan} />
          <rect x="7" y="8" width="2" height="6" fill={brass} />
          <rect x="4" y="11" width="3" height="2" fill={brass} />
          <rect x="9" y="11" width="3" height="2" fill={brass} />
        </Glyph>
      );
    case "test":
      return (
        <Glyph>
          <rect x="3" y="3" width="10" height="10" fill="var(--panel)" />
          <rect x="4" y="8" width="2" height="2" fill={cyan} />
          <rect x="6" y="6" width="2" height="2" fill={cyan} />
          <rect x="8" y="4" width="2" height="2" fill={cyan} />
          <rect x="10" y="4" width="2" height="2" fill={brass} />
        </Glyph>
      );
    case "gem":
      return (
        <Glyph>
          <rect x="4" y="3" width="8" height="2" fill={cyan} />
          <rect x="3" y="5" width="10" height="2" fill={magenta} />
          <rect x="5" y="7" width="6" height="2" fill={cyan} />
          <rect x="7" y="9" width="2" height="4" fill={brass} />
        </Glyph>
      );
    case "stack":
      return (
        <Glyph>
          <rect x="3" y="3" width="10" height="2" fill={brass} />
          <rect x="4" y="7" width="8" height="2" fill={cyan} />
          <rect x="5" y="11" width="6" height="2" fill={magenta} />
        </Glyph>
      );
    case "helm":
      return (
        <Glyph>
          <rect x="7" y="2" width="2" height="12" fill={cyan} />
          <rect x="2" y="7" width="12" height="2" fill={cyan} />
          <rect x="4" y="4" width="3" height="2" fill={brass} />
          <rect x="9" y="10" width="3" height="2" fill={magenta} />
          <rect x="6" y="6" width="4" height="4" fill={brass} />
        </Glyph>
      );
    default:
      return (
        <Glyph>
          <rect x="4" y="4" width="8" height="8" fill={brass} />
        </Glyph>
      );
  }
}

export function SkillTile({ name, icon, learning }: SkillTileProps) {
  return (
    <div className="skill-tile">
      <SkillGlyph icon={icon} />
      <span className="skill-name">{name}</span>
      {learning ? <span className="learn-mark">LEARN</span> : null}
    </div>
  );
}
