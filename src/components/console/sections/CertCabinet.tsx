import { assignHudTones, certKeywordTone, type HudTone } from "../hudTone";

type Cert = {
  title: string;
  issuer: string;
  when: string;
};

const palettes: Record<HudTone, { ribbon: string; medal: string; shine: string; core: string; tag: string }> = {
  gold: { ribbon: "#e23b4a", medal: "#ffe14a", shine: "#fff6b0", core: "#c99216", tag: "#3d66e6" },
  cyan: { ribbon: "#1d4fa8", medal: "#7ad0ff", shine: "#d7ecff", core: "#163a9a", tag: "#1a2140" },
  mint: { ribbon: "#1d7a32", medal: "#8ef0a0", shine: "#d8ffd4", core: "#147a2c", tag: "#1a2140" },
  red: { ribbon: "#ffe14a", medal: "#e23b4a", shine: "#ff8a90", core: "#fff6b0", tag: "#1a2140" },
  purple: { ribbon: "#ffe14a", medal: "#c026ff", shine: "#e7b6ff", core: "#7a12c9", tag: "#1a2140" },
  teal: { ribbon: "#0b6b5c", medal: "#5ee0c0", shine: "#d4fff4", core: "#147a6a", tag: "#1a2140" },
  coral: { ribbon: "#c45c52", medal: "#ffb4a8", shine: "#ffe4de", core: "#e07a6a", tag: "#1a2140" },
  violet: { ribbon: "#6a4cbe", medal: "#c8b4ff", shine: "#ece4ff", core: "#8a6ad4", tag: "#1a2140" },
};

const edge: Record<HudTone, string> = {
  gold: "#e2b423",
  cyan: "#3d9be0",
  mint: "#2a8a62",
  red: "#e23b4a",
  purple: "#7a12c9",
  teal: "#0b6b5c",
  coral: "#c45c52",
  violet: "#6a4cbe",
};

function MedalIcon({ tone }: { tone: HudTone }) {
  const c = palettes[tone];
  return (
    <svg className="medal-icon" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="6" y="1" width="4" height="3" fill={c.ribbon} />
      <rect x="5" y="3" width="2" height="4" fill={c.ribbon} />
      <rect x="9" y="3" width="2" height="4" fill={c.ribbon} />
      <rect x="4" y="5" width="8" height="8" fill={c.medal} />
      <rect x="6" y="7" width="4" height="4" fill={c.shine} />
      <rect x="7" y="8" width="2" height="2" fill={c.core} />
      <rect x="5" y="13" width="2" height="2" fill={c.tag} />
      <rect x="9" y="13" width="2" height="2" fill={c.tag} />
    </svg>
  );
}

export function CertCabinet({ certifications }: { certifications: Cert[] }) {
  const tones = assignHudTones(
    certifications.map((cert) => `${cert.title}\0${cert.issuer}`),
    certifications.map((cert) => certKeywordTone(cert.title, cert.issuer)),
  );

  return (
    <div className="hud-section hud-certs">
      <div className="medal-case">
        <p className="medal-case__kicker">Hall of badges</p>
        <ul className="medal-roster">
          {certifications.map((cert, index) => {
            const tone = tones[index] ?? "gold";
            return (
              <li className="medal-row" key={cert.title} style={{ borderLeftColor: edge[tone] }}>
                <MedalIcon tone={tone} />
                <div>
                  <h3>{cert.title}</h3>
                  <p>
                    {cert.issuer}
                    <span className="medal-row__when">{cert.when}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
