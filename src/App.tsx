import { useCallback, useEffect, useRef, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { HudNav } from "./components/HudNav";
import { PixelWindow } from "./components/PixelWindow";
import { QuestCard } from "./components/QuestCard";
import { SkillTile } from "./components/SkillBar";
import { CloudSprite, PixelAvatar, ServerSprite, StarSprite } from "./components/Sprites";
import {
  certifications,
  education,
  experience,
  profile,
  quests,
  skillGroups,
} from "./data/content";

const portraitFile = `${import.meta.env.BASE_URL}ashen-portrait.jpg?v=2`;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const PORTRAIT_CLICKS = 5;

export default function App() {
  const [booting, setBooting] = useState(() => !prefersReducedMotion());
  const [portraitOpen, setPortraitOpen] = useState(false);
  const portraitClicks = useRef(0);
  const finishBoot = useCallback(() => setBooting(false), []);
  const closePortrait = useCallback(() => {
    portraitClicks.current = 0;
    setPortraitOpen(false);
  }, []);

  useEffect(() => {
    if (!portraitOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closePortrait();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [portraitOpen, closePortrait]);

  function tapPortrait() {
    if (portraitOpen) return;
    portraitClicks.current += 1;
    if (portraitClicks.current >= PORTRAIT_CLICKS) {
      portraitClicks.current = 0;
      setPortraitOpen(true);
    }
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        SKIP TO HUD
      </a>
      {booting ? <BootScreen onDone={finishBoot} /> : null}
      <div className="scanlines" aria-hidden />
      <div className="vignette" aria-hidden />
      <HudNav />

      <main id="main" className="layout">
        <PixelWindow
          id="start"
          title="PLAYER SELECT — ENTHUSIAST"
          icon={<CloudSprite size={20} />}
        >
          <div className="hero-grid">
            <button
              type="button"
              className="avatar-btn"
              onClick={tapPortrait}
              aria-label="Pixel portrait of Ashen"
            >
              <PixelAvatar decorative />
            </button>
            <div className="hero-copy">
              <h1>{profile.name}</h1>
              <p className="hero-role">
                {profile.className} · {profile.role}
              </p>
              <p className="hero-meta">
                {profile.location} · {profile.community}
              </p>
              <p>{profile.tagline}</p>
              <div className="badge-row">
                <span className="badge">AWS CCP</span>
                <span className="badge cyan">FIRST CLASS</span>
                <span className="badge mint">RE/START</span>
              </div>
              <div className="hero-actions">
                <a className="btn" href={profile.cvFile} download>
                  DOWNLOAD CV
                </a>
                <a className="btn secondary" href={profile.github} target="_blank" rel="noreferrer">
                  GITHUB
                </a>
                <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                  LINKEDIN
                </a>
              </div>
            </div>
          </div>
        </PixelWindow>

        <div className="split">
          <PixelWindow id="education" title="EDUCATION" icon={<ServerSprite size={20} />}>
            <div className="log-list">
              {education.map((item) => (
                <article className="log-item" key={item.title}>
                  <h3>{item.title}</h3>
                  {item.note ? <p className="badge mint">{item.note}</p> : null}
                  <p>{item.org}</p>
                  <p className="when">{item.when}</p>
                </article>
              ))}
            </div>
          </PixelWindow>

          <PixelWindow title="CERTS & TRAINING" icon={<StarSprite size={20} />}>
            <div className="cert-list">
              {certifications.map((cert) => (
                <article className="cert" key={cert.title}>
                  <StarSprite size={22} />
                  <div>
                    <h3>{cert.title}</h3>
                    <p className="muted">{cert.issuer}</p>
                    <p className="when">{cert.when}</p>
                  </div>
                </article>
              ))}
            </div>
          </PixelWindow>
        </div>

        <PixelWindow id="skills" title="SKILL XP — INVENTORY">
          <div className="skill-groups">
            {skillGroups.map((group) => (
              <div className="skill-group" key={group.id}>
                <h3>{group.title}</h3>
                <div className="skill-tiles">
                  {group.skills.map((skill) => (
                    <SkillTile
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      learning={group.id === "learn"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PixelWindow>

        <PixelWindow id="quests" title="QUEST LOG — PROJECTS">
          <div className="quest-grid">
            {quests.map((quest) => (
              <QuestCard key={quest.id} {...quest} />
            ))}
          </div>
        </PixelWindow>

        <div className="split" id="log">
          <PixelWindow title="WORK LOG">
            <div className="log-list">
              {experience.map((job) => (
                <article className="log-item" key={job.title}>
                  <h3>{job.title}</h3>
                  <p>
                    {job.org} · {job.where}
                  </p>
                  <p className="when">{job.when}</p>
                  <ul>
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </PixelWindow>

          <PixelWindow title="SAVE DATA">
            <div className="log-list">
              <article className="log-item">
                <h3>CLASS</h3>
                <p>
                  {profile.className} · {profile.role}
                </p>
              </article>
              <article className="log-item">
                <h3>LOCATION</h3>
                <p>{profile.location}</p>
              </article>
              <article className="log-item">
                <h3>GUILD</h3>
                <p>{profile.community}</p>
              </article>
            </div>
          </PixelWindow>
        </div>

        <PixelWindow id="contact" title="CONTACT — SEND PACKET">
          <div className="contact-grid">
            <p>
              <strong>EMAIL</strong>
              <br />
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            <p>
              <strong>LINKEDIN</strong>
              <br />
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                linkedin.com/in/ashen-viduranga
              </a>
            </p>
            <p>
              <strong>GITHUB</strong>
              <br />
              <a href={profile.github} target="_blank" rel="noreferrer">
                github.com/ashen-v2
              </a>
            </p>
          </div>
          <div className="hero-actions">
            <a className="btn" href={`mailto:${profile.email}`}>
              SEND MAIL
            </a>
            <a className="btn secondary" href={profile.cvFile} download>
              CV PDF
            </a>
          </div>
        </PixelWindow>
      </main>

      <p className="pixel-footer">© 2026 {profile.name} · JRPG // RETROFUTURE HUD · STATIC BUILD</p>
      <p className="pixel-footer egg-hint">The portrait remembers a touch. Five times, and the veil lifts.</p>
      {portraitOpen ? (
        <div className="portrait-overlay" onClick={closePortrait}>
          <div
            className="pixel-window portrait-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portrait-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="pixel-titlebar">
              <span className="pixel-titlebar__icon" aria-hidden>
                <StarSprite size={20} />
              </span>
              <h2 id="portrait-title" className="pixel-titlebar__title">
                TRUE FORM
              </h2>
              <span className="pixel-titlebar__controls" aria-hidden>
                <i className="ctrl close" />
              </span>
            </header>
            <div className="pixel-window__body">
              <img
                className="portrait-photo"
                src={portraitFile}
                alt="A comic JRPG prince in futuristic mercenary armor striking a silly pose. Replace public/ashen-portrait.jpg with a photo."
              />
              <p className="portrait-note">
                Secret portrait. Swap <code>public/ashen-portrait.jpg</code> for a photo.
              </p>
              <div className="hero-actions">
                <button type="button" className="btn" onClick={closePortrait}>
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
