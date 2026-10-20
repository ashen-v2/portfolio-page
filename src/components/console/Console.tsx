import { useState } from "react";
import type { SiteContent } from "../../data/content";
import { SectionPanel } from "./SectionPanel";
import { SideColumn } from "./SideColumn";
import { ToolDock } from "./ToolDock";
import { Viewport } from "./Viewport";
import { moduleTitle, type SectionId } from "./modules";

type PhoneLayout = "stage" | "stack";

function readLayout(): PhoneLayout {
  try {
    return localStorage.getItem("console-layout") === "stack" ? "stack" : "stage";
  } catch {
    return "stage";
  }
}

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
  scene: SectionId | null;
  articleId: string;
  onSelect: (id: SectionId) => void;
  onOpenArticle: (id: string) => void;
  onCloseArticle: () => void;
};

export function Console({
  content,
  error,
  section,
  scene,
  articleId,
  onSelect,
  onOpenArticle,
  onCloseArticle,
}: ConsoleProps) {
  const [layout, setLayout] = useState<PhoneLayout>(readLayout);
  const articleQuest = content?.quests.find((quest) => quest.id === articleId);

  function toggleLayout() {
    setLayout((current) => {
      const next = current === "stage" ? "stack" : "stage";
      try {
        localStorage.setItem("console-layout", next);
      } catch {
        /* keep the choice for this visit */
      }
      return next;
    });
  }
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
    <div className="desk" data-layout={layout}>
      <button type="button" className="layout-switch" onClick={toggleLayout}>
        {layout === "stage" ? "Phone layout" : "Console layout"}
      </button>
      <div className="stage-slot">
      <div className="console">
        <span className="console-stripe" aria-hidden="true" />
        <span className="screw screw-outer screw-tl" aria-hidden="true" />
        <span className="screw screw-outer screw-tr" aria-hidden="true" />
        <span className="screw screw-outer screw-bl" aria-hidden="true" />
        <span className="screw screw-outer screw-br" aria-hidden="true" />
        <div className="console-body">
          <Viewport
            title={title}
            citySrc={scene ? sceneSrc[scene] : citySrc}
            caption={caption}
            credit={`© 2026 ${content?.profile.name ?? "Ashen Viduranga"}`}
          >
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
      </div>
    </div>
  );
}
