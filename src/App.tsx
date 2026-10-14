import { useCallback, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { HudNav } from "./components/HudNav";
import { PixelWindow } from "./components/PixelWindow";
import { QuestCard } from "./components/QuestCard";
import { SkillBar } from "./components/SkillBar";
import { CloudSprite, PixelAvatar, ServerSprite, StarSprite } from "./components/Sprites";
import {
  certifications,
  education,
  experience,
  profile,
  quests,
  skillGroups,
  tags,
} from "./data/content";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const [booting, setBooting] = useState(() => !prefersReducedMotion());
  const finishBoot = useCallback(() => setBooting(false), []);

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
          title="PLAYER SELECT — DEVOPS INTERN"
          icon={<CloudSprite size={20} />}
        >
          <div className="hero-grid">
            <PixelAvatar />
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
          <PixelWindow id="about" title="ABOUT.TXT" icon={<ServerSprite size={20} />}>
            <p>{profile.summary}</p>
            <p className="muted">
              Seeking a DevOps Trainee role to grow into cloud automation and platform engineering.
            </p>
            <div className="chip-row">
              {tags.cloud.concat(tags.extra).map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
                </span>
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
                {group.skills.map((skill) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    learning={group.id === "learn"}
                  />
                ))}
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

          <PixelWindow title="EDUCATION">
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
        </div>

        <PixelWindow id="contact" title="CONTACT — SEND PACKET">
          <div className="contact-grid">
            <p>
              <strong>EMAIL</strong>
              <br />
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            <p>
              <strong>PHONE</strong>
              <br />
              <a href={`tel:${profile.phone.replace(/\s+/g, "")}`}>{profile.phone}</a>
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

      <p className="pixel-footer">© 2026 {profile.name} · PIXEL UI ART HUD · STATIC BUILD</p>
    </div>
  );
}
