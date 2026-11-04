import type { BadgeTone, Profile } from "../../data/content";
import { PixelIcon, type PixelIconName } from "./pixelIcons";

type SideColumnProps = {
  profile: Profile | null;
  badges: { label: string; tone: BadgeTone }[];
  portraitSrc: string;
  location: string;
};

const linkLamps = ["red", "blue", "green", "gold"] as const;

export function SideColumn({ profile, badges, portraitSrc, location }: SideColumnProps) {
  const name = profile?.handle ?? "ASHEN";
  const role = profile?.className ?? "CLOUD OPS";

  return (
    <aside className="side" aria-label="Operator">
      <div className="side-stack">
        <div className="logo-plate">
          <div className="logo-badge">
            <span className="starfield" aria-hidden="true" />
            <div className="logo-copy">
              <p className="logo-kicker">{role}</p>
              <h1>{name}</h1>
            </div>
          </div>
          <div className="logo-btns" aria-hidden="true">
            <span className="star-btn" />
            <span className="star-btn" />
          </div>
        </div>
        <div className="side-housing">
          <span className="screw screw-tl" aria-hidden="true" />
          <span className="screw screw-tr" aria-hidden="true" />
          <span className="screw screw-bl" aria-hidden="true" />
          <span className="screw screw-br" aria-hidden="true" />
          <div className="slot">
            {badges.length ? (
              <ul className="badge-row side-badges">
                {badges.map((badge) => (
                  <li key={badge.label}>
                    <span className={`badge badge-${badge.tone}`}>{badge.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="slot-blank" aria-hidden="true" />
            )}
          </div>
          <div className="portrait-block">
            <div className="portrait-row">
              <div className="portrait-fit">
                <figure className="portrait-frame">
                  <img
                    src={portraitSrc}
                    alt={`Pixel portrait of ${profile?.name ?? "Ashen Viduranga"}.`}
                  />
                </figure>
              </div>
              <div className="side-pads" aria-hidden="true">
                <i />
                <i className="pad-face" />
                <i />
                <i className="pad-face" />
                <i />
              </div>
            </div>
            {profile ? (
              <nav className="link-keys" aria-label="Contact links">
                {(
                  [
                    { name: "github", label: "GitHub", href: profile.github, external: true },
                    { name: "linkedin", label: "LinkedIn", href: profile.linkedin, external: true },
                    { name: "mail", label: "Email", href: `mailto:${profile.email}`, external: false },
                    { name: "cv", label: "Download CV", href: profile.cvFile, external: false },
                  ] as const
                ).map((item, index) => (
                  <div className="link-row" key={item.name}>
                    <a
                      className="link-key"
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      download={item.name === "cv" ? "" : undefined}
                    >
                      <PixelIcon name={item.name as PixelIconName} />
                      <span>{item.label}</span>
                    </a>
                    <span className={`link-lamp lamp-${linkLamps[index]}`} aria-hidden="true" />
                  </div>
                ))}
              </nav>
            ) : null}
          </div>
          <span className="knob" aria-hidden="true" />
        </div>
      </div>
      <div className="radar">
        <div className="radar-screen" aria-hidden="true">
          <span className="radar-pip" />
        </div>
        <div className="radar-dial" aria-hidden="true" />
        <span className="radar-tab" aria-hidden="true" />
        <p className="radar-label">{location || "—"}</p>
      </div>
    </aside>
  );
}
