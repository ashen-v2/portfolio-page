import { useMemo } from "react";
import { QuestArticle } from "../QuestArticle";
import { QuestCard } from "../QuestCard";
import type { SiteContent } from "../../data/content";
import type { SectionId } from "./modules";
import { AboutStatus } from "./sections/AboutStatus";
import { CertCabinet } from "./sections/CertCabinet";
import { EducationRoute } from "./sections/EducationRoute";
import { SkillBag } from "./sections/SkillBag";
import { WorkLog } from "./sections/WorkLog";

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
  const { profile, education, certifications, certDefaultImage, skillGroups, quests, experience, saveData } =
    content;
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
    return <AboutStatus profile={profile} saveData={saveData} />;
  }

  if (section === "education") {
    return <EducationRoute education={education} />;
  }

  if (section === "certs") {
    return <CertCabinet certifications={certifications} defaultImage={certDefaultImage} />;
  }

  if (section === "projects") {
    return (
      <div className="hud-section hud-projects">
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
    return <SkillBag skillGroups={skillGroups} />;
  }

  return <WorkLog experience={experience} />;
}
