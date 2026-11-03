import { useEffect, useState } from "react";
import { toolKeys, type ToolId } from "./modules";

const base = import.meta.env.BASE_URL;

function art(name: string) {
  return `${base}console/home/${name}.jpg`;
}

const tiles: { id: ToolId; tone: string }[] = [
  { id: "files", tone: "navy" },
  { id: "notes", tone: "navy" },
  { id: "canvas", tone: "purple" },
  { id: "calc", tone: "teal" },
];

const scriptSeed = [
  { id: "compilation", label: "compilation", on: true },
  { id: "launch_server", label: "launch_server", on: true },
  { id: "update_package", label: "update_package", on: false },
];

function clockLabel(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function tileLabel(id: ToolId) {
  return toolKeys.find((item) => item.id === id)?.label ?? id;
}

export function HomeScreen({ handle, onOpen }: { handle: string; onOpen: (id: ToolId) => void }) {
  const [clock, setClock] = useState(() => clockLabel(new Date()));
  const [scripts, setScripts] = useState(scriptSeed);

  useEffect(() => {
    const id = window.setInterval(() => setClock(clockLabel(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  function toggleScript(id: string) {
    setScripts((current) => current.map((item) => (item.id === id ? { ...item, on: !item.on } : item)));
  }

  return (
    <div className="home-screen" id="home-screen" style={{ backgroundImage: `url("${art("neon")}")` }}>
      <div className="home-board">
      <div className="home-desk">
        <div className="home-status">
          <svg className="home-mark" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1" y="5" width="14" height="7" rx="2" fill="#d7e8ff" />
            <rect x="3" y="7" width="4" height="1" fill="#1a2140" />
            <rect x="4" y="6" width="1" height="3" fill="#1a2140" />
            <rect x="10" y="6" width="2" height="2" fill="#1a2140" />
            <rect x="12" y="8" width="2" height="2" fill="#1a2140" />
          </svg>
          <span className="home-handle">{handle || "ASHEN"}</span>
          <span className="home-level" aria-hidden="true">
            <span>Lv. 4</span>
            <span className="home-level-track">
              <span />
            </span>
          </span>
          <span className="home-status-gap" />
          <svg className="home-mark" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="7" y="11" width="2" height="3" fill="#d7e8ff" />
            <rect x="5" y="8" width="6" height="2" fill="#d7e8ff" />
            <rect x="3" y="5" width="10" height="2" fill="#d7e8ff" />
            <rect x="1" y="2" width="14" height="2" fill="#d7e8ff" />
          </svg>
          <svg className="home-mark" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="6" y="1" width="4" height="2" fill="#d7e8ff" />
            <rect x="6" y="13" width="4" height="2" fill="#d7e8ff" />
            <rect x="1" y="6" width="2" height="4" fill="#d7e8ff" />
            <rect x="13" y="6" width="2" height="4" fill="#d7e8ff" />
            <rect x="4" y="4" width="8" height="8" fill="#d7e8ff" />
            <rect x="6" y="6" width="4" height="4" fill="#1a2140" />
          </svg>
          <time className="home-clock" dateTime={clock}>
            {clock}
          </time>
        </div>
        <div className="home-feature">
          <p className="home-feature-title">Quest</p>
          <button type="button" className="home-quest" onClick={() => onOpen("quest")}>
            <img src={art("quest")} alt="" />
            <span>Quest</span>
          </button>
        </div>
        <div className="home-tiles" role="toolbar" aria-label="Home apps">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className={`home-tile home-tile-${tile.tone}`}
              onClick={() => onOpen(tile.id)}
            >
              <img src={art(tile.id)} alt="" />
              <span>{tileLabel(tile.id)}</span>
            </button>
          ))}
        </div>
        <div className="home-side">
          <button type="button" className="home-terminal" onClick={() => onOpen("terminal")}>
            <span className="home-side-title">Terminal</span>
            <span className="home-term-screen" aria-hidden="true">
              <span className="home-term-prompt">&gt;_</span>
              <span className="home-term-line">{(handle || "ashen").toLowerCase()}@portfolio:~$</span>
              <span className="home-term-bar home-term-bar-a" />
              <span className="home-term-bar home-term-bar-b" />
              <span className="home-term-bar home-term-bar-c" />
            </span>
          </button>
          <section className="home-system" aria-label="System">
            <h3>System</h3>
            <p>
              <span>CPU</span>
              <span className="home-meter">
                <span style={{ width: "72%" }} />
              </span>
            </p>
            <p>
              <span>Load</span>
              <span className="home-meter">
                <span style={{ width: "46%" }} />
              </span>
            </p>
            <p>
              <span>Network</span>
              <span className="home-meter home-meter-wide">
                <span style={{ width: "100%" }} />
              </span>
              <strong>ONLINE</strong>
            </p>
          </section>
          <section className="home-scripts" aria-label="Scripts">
            <h3>Scripts</h3>
            {scripts.map((item) => (
              <button
                key={item.id}
                type="button"
                className="home-script"
                aria-pressed={item.on}
                onClick={() => toggleScript(item.id)}
              >
                <span className="home-check" aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
