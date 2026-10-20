import type { SiteContent } from "../../data/content";
import { SectionPanel } from "./SectionPanel";
import { SideColumn } from "./SideColumn";
import { ToolDock } from "./ToolDock";
import { Viewport } from "./Viewport";
import { moduleTitle, type SectionId } from "./modules";

const base = import.meta.env.BASE_URL;
const citySrc = `${base}console/city.png`;
const portraitSrc = `${base}console/portrait.png`;

const sceneSrc: Record<SectionId, string> = {
  about: `${base}console/scene-about.png`,
  education: `${base}console/scene-education.png`,
  certs: `${base}console/scene-certs.png`,
  projects: `${base}console/scene-projects.png`,
  skills: `${base}console/scene-skills.png`,
  work: `${base}console/scene-work.png`,
};

type ConsoleProps = {
  content: SiteContent | null;
  error: string;
  section: SectionId | null;
  articleId: string;
  onSelect: (id: SectionId) => void;
  onOpenArticle: (id: string) => void;
  onCloseArticle: () => void;
};

export function Console({
  content,
  error,
  section,
  articleId,
  onSelect,
  onOpenArticle,
  onCloseArticle,
}: ConsoleProps) {
  const articleQuest = content?.quests.find((quest) => quest.id === articleId);
  const title =
    section === "projects" && articleId
      ? (articleQuest?.title ?? "PROJECTS").toUpperCase()
      : moduleTitle(section);
  const caption =
    !section && !error && content ? `${content.profile.name} · ${content.profile.tagline}` : "";

  let panel = null;
  if (error) {
    panel = (
      <div className="panel" id="module-panel" role="alert">
        <p>{error}</p>
      </div>
    );
  } else if (section && content) {
    panel = (
      <div className="panel" id="module-panel">
        <SectionPanel
          content={content}
          section={section}
          articleId={articleId}
          onOpenArticle={onOpenArticle}
          onCloseArticle={onCloseArticle}
        />
      </div>
    );
  }

  return (
    <div className="desk">
      <div className="console">
        <span className="console-stripe" aria-hidden="true" />
        <span className="screw screw-outer screw-tl" aria-hidden="true" />
        <span className="screw screw-outer screw-tr" aria-hidden="true" />
        <span className="screw screw-outer screw-bl" aria-hidden="true" />
        <span className="screw screw-outer screw-br" aria-hidden="true" />
        <div className="console-body">
          <Viewport title={title} citySrc={section ? sceneSrc[section] : citySrc} caption={caption}>
            {panel}
          </Viewport>
          <SideColumn
            profile={content?.profile ?? null}
            badges={content?.badges ?? []}
            portraitSrc={portraitSrc}
            location={content?.profile.location ?? ""}
          />
          <ToolDock section={section} enabled={Boolean(content)} onSelect={onSelect} />
        </div>
      </div>
      <p className="desk-credit">© 2026 {content?.profile.name ?? "Ashen Viduranga"}</p>
    </div>
  );
}
