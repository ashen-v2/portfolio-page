import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { HudNav } from "./components/HudNav";
import { PixelWindow } from "./components/PixelWindow";
import { QuestArticle } from "./components/QuestArticle";
import { QuestCard } from "./components/QuestCard";
import { SkillTile } from "./components/SkillBar";
import { CloudSprite, PixelAvatar, ServerSprite, StarSprite } from "./components/Sprites";
import { linkLabel, loadContent, type SiteContent } from "./data/content";

const portraitFile = `${import.meta.env.BASE_URL}ashen-portrait.jpg?v=2`;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const PORTRAIT_CLICKS = 5;
const QUEST_PREVIEW = 3;

function readArticleId() {
  const match = /^#article\/([a-z0-9-]+)$/i.exec(window.location.hash);
  return match ? match[1].toLowerCase() : "";
}

function byPriority<T extends { priority: number }>(items: T[]) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.priority - b.item.priority || a.index - b.index)
    .map(({ item }) => item);
}

function Portfolio({
  content,
  tapPortrait,
}: {
  content: SiteContent;
  tapPortrait: () => void;
}) {
  const { profile, badges, education, certifications, skillGroups, quests, experience, saveData } =
    content;
  const [showAllQuests, setShowAllQuests] = useState(false);
  const [articleId, setArticleId] = useState(readArticleId);
  const orderedQuests = useMemo(() => byPriority(quests), [quests]);
  const visibleQuests = showAllQuests ? orderedQuests : orderedQuests.slice(0, QUEST_PREVIEW);
  const openQuest = orderedQuests.find((quest) => quest.id === articleId);

  useEffect(() => {
    function onHash() {
      setArticleId(readArticleId());
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!articleId) return;
    document.getElementById("quests")?.scrollIntoView();
  }, [articleId]);

  function openArticle(id: string) {
    window.location.hash = `article/${id}`;
  }

  function closeArticle() {
    window.location.hash = "quests";
  }

  return (
    <>
      <PixelWindow id="start" title="PARTY STATUS" plain="About" icon={<CloudSprite size={20} />}>
        <div className="hero-grid">
          <button
            type="button"
            className="avatar-btn"
            onClick={tapPortrait}
            aria-label="Trainer portrait of Ashen"
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
              {badges.map((badge) => (
                <span
                  className={badge.tone === "gold" ? "badge" : `badge ${badge.tone}`}
                  key={badge.label}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
          <div className="command-list">
            <p className="command-label">Command</p>
            <a className="btn" href={profile.cvFile} download>
              Download CV
            </a>
            <a className="btn secondary" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </PixelWindow>

      <div className="split split-certs">
        <PixelWindow id="education" title="JOURNEY" plain="Education" icon={<ServerSprite size={20} />}>
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

        <div className="certs-slot">
          <PixelWindow
            className="certs-window"
            title="BADGES"
            plain="Certificates"
            icon={<StarSprite size={20} />}
          >
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
      </div>

      <PixelWindow id="skills" title="BAG" plain="Tools and technologies">
        <div className="skill-groups">
          {skillGroups.map((group) => (
            <div className={`skill-group pocket-${group.id}`} key={group.id}>
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

      <PixelWindow id="quests" title="QUESTS" plain="Projects">
        {articleId ? (
          openQuest?.article ? (
            <QuestArticle file={openQuest.article} onBack={closeArticle} />
          ) : (
            <div className="article-view">
              <p>This article is not available.</p>
              <div className="quest-toolbar">
                <button type="button" className="btn secondary" onClick={closeArticle}>
                  Back
                </button>
              </div>
            </div>
          )
        ) : (
          <>
            <div className="quest-grid">
              {visibleQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  title={quest.title}
                  status={quest.status}
                  subtitle={quest.subtitle}
                  points={quest.points}
                  stack={quest.stack}
                  onReadMore={quest.article ? () => openArticle(quest.id) : undefined}
                />
              ))}
            </div>
            {orderedQuests.length > QUEST_PREVIEW ? (
              <div className="quest-toolbar">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowAllQuests((open) => !open)}
                >
                  {showAllQuests ? "Show less" : "See all"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </PixelWindow>

      <div className="split" id="log">
        <PixelWindow title="FIELD NOTES" plain="Experience">
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

        <PixelWindow title="TRAINER CARD" plain="Profile">
          <div className="log-list">
            {saveData.map((entry) => (
              <article className="log-item" key={entry.label}>
                <h3>{entry.label}</h3>
                <p>{entry.value}</p>
              </article>
            ))}
          </div>
        </PixelWindow>
      </div>

      <PixelWindow id="contact" title="MAIL" plain="Contact">
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
              {linkLabel(profile.linkedin)}
            </a>
          </p>
          <p>
            <strong>GITHUB</strong>
            <br />
            <a href={profile.github} target="_blank" rel="noreferrer">
              {linkLabel(profile.github)}
            </a>
          </p>
        </div>
        <div className="hero-actions">
          <a className="btn" href={`mailto:${profile.email}`}>
            Send mail
          </a>
          <a className="btn secondary" href={profile.cvFile} download>
            CV PDF
          </a>
        </div>
      </PixelWindow>
    </>
  );
}

export default function App() {
  const [booting, setBooting] = useState(() => !prefersReducedMotion());
  const [portraitOpen, setPortraitOpen] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [contentError, setContentError] = useState("");
  const portraitClicks = useRef(0);
  const finishBoot = useCallback(() => setBooting(false), []);
  const closePortrait = useCallback(() => {
    portraitClicks.current = 0;
    setPortraitOpen(false);
  }, []);

  useEffect(() => {
    loadContent().then(setContent).catch(() => setContentError("Could not read content.json"));
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
        Skip to content
      </a>
      {booting ? <BootScreen onDone={finishBoot} /> : null}
      <div className="sky" aria-hidden>
        <span className="cloud cloud-a" />
        <span className="cloud cloud-b" />
        <span className="cloud cloud-c" />
      </div>
      <HudNav profile={content?.profile ?? null} />

      <main id="main" className="layout">
        {contentError ? (
          <PixelWindow title="NO SAVE">
            <p>{contentError}</p>
          </PixelWindow>
        ) : null}
        {content ? <Portfolio content={content} tapPortrait={tapPortrait} /> : null}
      </main>

      <p className="pixel-footer">
        © 2026 {content?.profile.name ?? "Ashen Viduranga"} · Hoenn route
      </p>
      <p className="pixel-footer egg-hint">Tap the portrait five times.</p>
      <div className="ground" aria-hidden>
        <span className="ground-tuft" />
        <span className="ground-tuft ground-tuft-b" />
        <span className="ground-tuft ground-tuft-c" />
      </div>
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
                PORTRAIT
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
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
