import { useEffect, useState } from "react";
import { toolKeys, type ToolId } from "./modules";
import type { ServiceApp, ServiceState } from "./services";

const base = import.meta.env.BASE_URL;
const city = `${base}console/city.png`;

function art(name: string) {
  return `${base}console/home/${name}.jpg`;
}

const tiles: { id: ServiceApp; tone: string }[] = [
  { id: "files", tone: "navy" },
  { id: "notes", tone: "navy" },
  { id: "canvas", tone: "purple" },
  { id: "calc", tone: "teal" },
];

function clockLabel(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function tileLabel(id: ToolId) {
  return toolKeys.find((item) => item.id === id)?.label ?? id;
}

function widgetClass(id: ServiceApp, services: ServiceState) {
  return services[id].enabled ? "" : " home-widget-off";
}

export function HomeScreen({
  handle,
  services,
  onOpen,
}: {
  handle: string;
  services: ServiceState;
  onOpen: (id: ToolId) => void;
}) {
  const [clock, setClock] = useState(() => clockLabel(new Date()));
  const [vaultHint, setVaultHint] = useState(false);
  const vaultReady = services.vault.installed && services.vault.enabled;

  useEffect(() => {
    const id = window.setInterval(() => setClock(clockLabel(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="home-screen" id="home-screen" style={{ backgroundImage: `url("${city}")` }}>
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
      <div className="home-desk">
        {services.quest.installed ? (
          <div className={`home-feature${widgetClass("quest", services)}`}>
            <p className="home-feature-title">Games</p>
            <button
              type="button"
              className="home-quest"
              disabled={!services.quest.enabled}
              onClick={() => onOpen("quest")}
            >
              <img src={art("quest")} alt="" />
              <span>Quest</span>
            </button>
          </div>
        ) : null}
        <div className="home-tiles" role="toolbar" aria-label="Home apps">
          {tiles.map((tile) =>
            services[tile.id].installed ? (
              <button
                key={tile.id}
                type="button"
                className={`home-tile home-tile-${tile.id} home-tile-${tile.tone}${widgetClass(tile.id, services)}`}
                disabled={!services[tile.id].enabled}
                onClick={() => onOpen(tile.id)}
              >
                <img src={art(tile.id)} alt="" />
                <span>{tileLabel(tile.id)}</span>
              </button>
            ) : null,
          )}
        </div>
        <div className="home-side">
          <button type="button" className="home-terminal" onClick={() => onOpen("terminal")}>
            <span className="home-side-title">Terminal</span>
            <span className="home-term-screen" aria-hidden="true">
              <span className="home-term-line">{(handle || "ashen").toLowerCase()}@portfolio:~$</span>
              <span className="home-term-line">help</span>
              <span className="home-term-cursor">█</span>
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
          <button
            type="button"
            className={`home-vault${vaultReady ? "" : " home-widget-off"}`}
            onClick={() => {
              if (vaultReady) onOpen("vault");
              else setVaultHint(true);
            }}
          >
            <img src={`${base}console/home/vault.png`} alt="" />
            <span>Vault</span>
          </button>
        </div>
      </div>
      {vaultHint ? (
        <div className="home-vault-hint" role="alertdialog" aria-label="Vault not installed">
          <p>application is not installed</p>
          <p>use the terminal to manage or install applications</p>
          <button type="button" onClick={() => setVaultHint(false)}>
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
