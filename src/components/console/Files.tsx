import { useState } from "react";
import { PixelIcon } from "./pixelIcons";
import { moduleKeys, sectionScene, type SectionId, type ToolId } from "./modules";
import { serviceLabel, type ServiceApp, type ServiceState } from "./services";

const base = import.meta.env.BASE_URL;

const pictures = [
  { id: "about", label: "about", src: sectionScene.about },
  { id: "education", label: "education", src: sectionScene.education },
  { id: "certificate", label: "certificate", src: sectionScene.certs },
  { id: "home", label: "home", src: `${base}console/city.png` },
  { id: "projects", label: "projects", src: sectionScene.projects },
  { id: "skills", label: "skills", src: sectionScene.skills },
  { id: "work", label: "work", src: sectionScene.work },
];

const bins: { id: ServiceApp; tool: "quest" | "files" | "canvas" | "calc"; file: string }[] = [
  { id: "quest", tool: "quest", file: "quest.bin" },
  { id: "files", tool: "files", file: "files.bin" },
  { id: "canvas", tool: "canvas", file: "canvas.bin" },
  { id: "calc", tool: "calc", file: "calculator.bin" },
];

type FilesProps = {
  services: ServiceState;
  onOpen: (id: SectionId) => void;
  onOpenTool: (id: ToolId) => void;
};

export function Files({ services, onOpen, onOpenTool }: FilesProps) {
  const [denied, setDenied] = useState(false);
  const [folder, setFolder] = useState<"images" | "apps" | null>(null);
  const [picture, setPicture] = useState<(typeof pictures)[number] | null>(null);
  const [refusal, setRefusal] = useState("");

  function launch(id: ServiceApp, tool: ToolId) {
    const state = services[id];
    const label = serviceLabel(id);
    if (!state.installed) {
      setRefusal(`${label}.bin: package not installed`);
      return;
    }
    if (!state.enabled) {
      setRefusal(`${label}.bin: unit is disabled`);
      return;
    }
    setRefusal("");
    onOpenTool(tool);
  }

  let body = (
    <ul className="files-list">
      <li>
        <button type="button" className="files-folder" onClick={() => setDenied(true)}>
          <PixelIcon className="files-folder-icon" name="folderBlue" />
          <span>system_files</span>
        </button>
      </li>
      <li>
        <button type="button" className="files-folder" onClick={() => setFolder("images")}>
          <PixelIcon className="files-folder-icon" name="folderBlue" />
          <span>images</span>
        </button>
      </li>
      <li>
        <button type="button" className="files-folder" onClick={() => setFolder("apps")}>
          <PixelIcon className="files-folder-icon" name="folderBlue" />
          <span>installed_apps</span>
        </button>
      </li>
      {moduleKeys.map((item) => (
        <li key={item.id}>
          <button type="button" className="files-folder" onClick={() => onOpen(item.id)}>
            <PixelIcon className="files-folder-icon" name="folder" />
            <span>{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  if (picture) {
    body = (
      <div className="files-viewer">
        <button type="button" className="files-back" onClick={() => setPicture(null)}>
          Back
        </button>
        <img src={picture.src} alt={picture.label} />
      </div>
    );
  } else if (folder === "images") {
    body = (
      <div className="files-browser">
        <button type="button" className="files-back" onClick={() => setFolder(null)}>
          Back
        </button>
        <ul className="files-photos">
          {pictures.map((item) => (
            <li key={item.id}>
              <button type="button" className="files-photo" onClick={() => setPicture(item)}>
                <img src={item.src} alt="" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (folder === "apps") {
    body = (
      <div className="files-browser">
        <button type="button" className="files-back" onClick={() => { setFolder(null); setRefusal(""); }}>
          Back
        </button>
        {refusal ? <p className="files-refusal">{refusal}</p> : null}
        <ul className="files-list">
          {bins.map((item) => (
            <li key={item.id}>
              <button type="button" className="files-bin" onClick={() => launch(item.id, item.tool)}>
                <PixelIcon className="files-folder-icon" name={item.tool} />
                <span>{item.file}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="tool-panel files-tool" id="files">
      <div className="files-window">
        <h3>Files</h3>
        {body}
        {denied ? (
          <div className="files-deny" role="alertdialog" aria-label="Access denied">
            <p>Access denied</p>
            <button type="button" onClick={() => setDenied(false)}>
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
