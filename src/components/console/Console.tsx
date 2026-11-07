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
import { Vault } from "./Vault";
import { Viewport } from "./Viewport";
import { homePortrait, moduleTitle, sectionPortrait, sectionScene, toolTitle, type SectionId, type ToolId } from "./modules";
import { freshServices, type ServiceApp, type ServiceState } from "./services";

type PhoneLayout = "stage" | "stack";

function bandLayout(defaultMobile: boolean): PhoneLayout {
  if (window.matchMedia("(max-width: 959px)").matches) {
    return defaultMobile ? "stack" : "stage";
  }
  return "stage";
}

const base = import.meta.env.BASE_URL;
const citySrc = `${base}console/city.png`;

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
  const chosen = useRef(false);
  const [layout, setLayout] = useState<PhoneLayout>(() => bandLayout(true));
  const [services, setServices] = useState<ServiceState>(freshServices);
  const [terminalBooted, setTerminalBooted] = useState(false);

  function installApp(id: ServiceApp, installed: boolean) {
    setServices((current) => ({
      ...current,
      [id]: { installed, enabled: installed && id !== "vault" },
    }));
  }

  function powerApp(id: ServiceApp, enabled: boolean) {
    setServices((current) => {
      if (!current[id].installed) return current;
      return { ...current, [id]: { ...current[id], enabled } };
    });
  }
  const articleQuest = content?.quests.find((quest) => quest.id === articleId);

  useEffect(() => {
    function applyBand() {
      if (chosen.current) return;
      if (!content) return;
      setLayout(bandLayout(content["default mobile view"] === true));
    }
    applyBand();
    window.addEventListener("resize", applyBand);
    return () => window.removeEventListener("resize", applyBand);
  }, [content]);

  function toggleLayout() {
    chosen.current = true;
    setLayout((current) => (current === "stage" ? "stack" : "stage"));
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
    panel = (
      <Terminal
        content={content}
        services={services}
        onOpenArticle={onOpenArticle}
        onOpenTool={onOpenTool}
        onInstall={installApp}
        onPower={powerApp}
        skipBoot={terminalBooted}
        onBooted={() => setTerminalBooted(true)}
      />
    );
  } else if (tool === "files") {
    panel = (
      <Files
        services={services}
        certifications={content?.certifications ?? []}
        defaultImage={content?.certDefaultImage ?? "default.svg"}
        onOpen={onSelect}
        onOpenTool={onOpenTool}
      />
    );
  } else if (tool === "notes") {
    panel = <Notes />;
  } else if (tool === "canvas") {
    panel = <CanvasPad />;
  } else if (tool === "calc") {
    panel = <Calculator />;
  } else if (tool === "quest") {
    panel = <Quest content={content} />;
  } else if (tool === "vault") {
    panel = <Vault />;
  } else if (home && content) {
    panel = <HomeScreen handle={content.profile.handle} services={services} onOpen={onOpenTool} />;
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
          previewCerts={layout === "stage"}
          onOpenArticle={onOpenArticle}
          onCloseArticle={onCloseArticle}
        />
      </div>
    );
  }

  return (
    <div className="desk" data-layout={layout} data-layout-override={chosen.current ? "true" : undefined}>
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
            portraitSrc={scene ? sectionPortrait[scene] : homePortrait}
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
