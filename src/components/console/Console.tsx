import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../../data/content";
import { Calculator } from "./Calculator";
import { CanvasPad } from "./CanvasPad";
import { Files } from "./Files";
import { Quest } from "./game/Quest";
import { HomeScreen } from "./HomeScreen";
import { Notes } from "./Notes";
import { SectionPanel } from "./SectionPanel";
import { SideColumn } from "./SideColumn";
import { Terminal } from "./Terminal";
import { ToolDock } from "./ToolDock";
import { Viewport } from "./Viewport";
import { moduleTitle, sectionScene, toolTitle, type SectionId, type ToolId } from "./modules";

type PhoneLayout = "stage" | "stack";

function storedLayout(): PhoneLayout | null {
  try {
    const saved = localStorage.getItem("console-layout");
    if (saved === "stack" || saved === "stage") return saved;
  } catch {
    /* use the content default */
  }
  return null;
}

const base = import.meta.env.BASE_URL;
const citySrc = `${base}console/city.png`;
const portraitSrc = `${base}console/portrait.png`;

type ConsoleProps = {
  content: SiteContent | null;
  error: string;
  section: SectionId | null;
  scene: SectionId | null;
  articleId: string;
  tool: ToolId | null;
  onSelect: (id: SectionId) => void;
  onHome: () => void;
  onOpenTool: (id: ToolId) => void;
  onOpenArticle: (id: string) => void;
  onCloseArticle: () => void;
};

export function Console({
  content,
  error,
  section,
  scene,
  articleId,
  tool,
  onSelect,
  onHome,
  onOpenTool,
  onOpenArticle,
  onCloseArticle,
}: ConsoleProps) {
  const chosen = useRef(storedLayout() !== null);
  const [layout, setLayout] = useState<PhoneLayout>(storedLayout() ?? "stage");
  const articleQuest = content?.quests.find((quest) => quest.id === articleId);

  useEffect(() => {
    if (chosen.current) return;
    if (window.matchMedia("(min-width: 1101px)").matches) return;
    setLayout(content?.["default mobile view"] === true ? "stack" : "stage");
  }, [content]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1101px)");
    function useConsoleLayout() {
      if (!wide.matches) return;
      setLayout("stage");
      chosen.current = true;
      try {
        localStorage.setItem("console-layout", "stage");
      } catch {
        /* keep the choice for this visit */
      }
    }
    useConsoleLayout();
    wide.addEventListener("change", useConsoleLayout);
    return () => wide.removeEventListener("change", useConsoleLayout);
  }, []);

  function toggleLayout() {
    setLayout((current) => {
      const next = current === "stage" ? "stack" : "stage";
      chosen.current = true;
      try {
        localStorage.setItem("console-layout", next);
      } catch {
        /* keep the choice for this visit */
      }
      return next;
    });
  }
  const home = !tool && !section && !scene && !error && Boolean(content);
  const title = tool
    ? toolTitle(tool)
    : home
      ? "HOME"
      : section === "projects" && articleId
        ? (articleQuest?.title ?? "PROJECTS").toUpperCase()
        : moduleTitle(section);
  const caption =
    tool || section || error || !content
      ? ""
      : `${content.profile.name} · ${content.profile.tagline}`;

  let panel = null;
  if (tool === "terminal" && content) {
    panel = <Terminal content={content} onOpenArticle={onOpenArticle} />;
  } else if (tool === "files") {
    panel = <Files onOpen={onSelect} />;
  } else if (tool === "notes") {
    panel = <Notes />;
  } else if (tool === "canvas") {
    panel = <CanvasPad />;
  } else if (tool === "calc") {
    panel = <Calculator />;
  } else if (tool === "quest") {
    panel = <Quest content={content} />;
  } else if (home && content) {
    panel = <HomeScreen handle={content.profile.handle} onOpen={onOpenTool} />;
  } else if (error) {
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
            citySrc={scene ? sectionScene[scene] : citySrc}
            caption={caption}
            credit={`© 2026 ${content?.profile.name ?? "Ashen Viduranga"}`}
            onClose={home ? undefined : onHome}
          >
            {panel}
          </Viewport>
          <SideColumn
            profile={content?.profile ?? null}
            badges={content?.badges ?? []}
            portraitSrc={portraitSrc}
            location={content?.profile.location ?? ""}
          />
          <ToolDock
            section={section}
            homeActive={home}
            enabled={Boolean(content)}
            onSelect={onSelect}
            onHome={onHome}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
