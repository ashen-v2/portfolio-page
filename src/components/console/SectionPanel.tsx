import { useMemo } from "react";
import { QuestArticle } from "../QuestArticle";
import { QuestCard } from "../QuestCard";
import type { SiteContent } from "../../data/content";
import type { SectionId } from "./modules";

type SectionPanelProps = {
  content: SiteContent;
  section: SectionId;
  articleId: string;
  onOpenArticle: (id: string) => void;
  onCloseArticle: () => void;
};

function byPriority<T extends { priority: number }>(items: T[]) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.priority - b.item.priority || a.index - b.index)
    .map(({ item }) => item);
}

export function SectionPanel({
  content,
  section,
  articleId,
  onOpenArticle,
  onCloseArticle,
}: SectionPanelProps) {
  const { profile, education, certifications, skillGroups, quests, experience, saveData } = content;
  const orderedQuests = useMemo(() => byPriority(quests), [quests]);

  if (section === "projects" && articleId) {
    const openQuest = orderedQuests.find((quest) => quest.id === articleId);
    if (openQuest?.article) {
      return <QuestArticle file={openQuest.article} onBack={onCloseArticle} />;
    }
    return (
      <div className="article-view jrpg-card">
        <p>This article is not available.</p>
        <div className="quest-toolbar">
          <button type="button" className="btn secondary" onClick={onCloseArticle}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (section === "about") {
    return (
      <div className="module-copy jrpg-card">
        <h3>{profile.name}</h3>
        <p className="role-line">
          {profile.className} · {profile.role}
        </p>
        <p>
          {profile.location} · {profile.community}
        </p>
        <p>{profile.tagline}</p>
        <dl className="save-list">
          {saveData.map((entry) => (
            <div key={entry.label}>
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (section === "education") {
    return (
      <div className="log-list">
        {education.map((item) => (
          <article className="log-item jrpg-card" key={item.title}>
            <h3>{item.title}</h3>
            {item.note ? <p className="note">{item.note}</p> : null}
            <p>{item.org}</p>
            <p className="when">{item.when}</p>
          </article>
        ))}
      </div>
    );
  }

  if (section === "certs") {
    return (
      <div className="log-list">
        {certifications.map((cert) => (
          <article className="log-item jrpg-card" key={cert.title}>
            <h3>{cert.title}</h3>
            <p>{cert.issuer}</p>
            <p className="when">{cert.when}</p>
          </article>
        ))}
      </div>
    );
  }

  if (section === "projects") {
    return (
      <div className="quest-list">
        {orderedQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            title={quest.title}
            status={quest.status}
            subtitle={quest.subtitle}
            points={quest.points}
            stack={quest.stack}
            onReadMore={quest.article ? () => onOpenArticle(quest.id) : undefined}
          />
        ))}
      </div>
    );
  }

  if (section === "skills") {
    return (
      <div className="skill-groups">
        {skillGroups.map((group) => (
          <section className="skill-group jrpg-card" key={group.id}>
            <h3>{group.title}</h3>
            <ul>
              {group.skills.map((skill) => (
                <li key={skill.name}>{skill.name}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="log-list">
      {experience.map((job) => (
        <article className="log-item jrpg-card" key={job.title}>
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
  );
}
