import { useState } from "react";
import { certAssetUrl, isCertPdf, type Certification } from "../../data/content";
import { PixelIcon } from "./pixelIcons";
import { homePortrait, moduleKeys, sectionPortrait, sectionScene, toolPortrait, type SectionId, type ToolId } from "./modules";
import { serviceLabel, type ServiceApp, type ServiceState } from "./services";

const base = import.meta.env.BASE_URL;

type FilePic = { id: string; label: string; src: string; pdf?: boolean };

const pictures: FilePic[] = [
  { id: "about", label: "about", src: sectionScene.about },
  { id: "education", label: "education", src: sectionScene.education },
  { id: "certificate", label: "certificate", src: sectionScene.certs },
  { id: "home", label: "home", src: `${base}console/city.png` },
  { id: "projects", label: "projects", src: sectionScene.projects },
  { id: "skills", label: "skills", src: sectionScene.skills },
  { id: "work", label: "work", src: sectionScene.work },
  { id: "portrait-home", label: "portrait-home", src: homePortrait },
  { id: "portrait-about", label: "portrait-about", src: sectionPortrait.about },
  { id: "portrait-education", label: "portrait-education", src: sectionPortrait.education },
  { id: "portrait-certs", label: "portrait-certs", src: sectionPortrait.certs },
  { id: "portrait-projects", label: "portrait-projects", src: sectionPortrait.projects },
  { id: "portrait-skills", label: "portrait-skills", src: sectionPortrait.skills },
  { id: "portrait-work", label: "portrait-work", src: sectionPortrait.work },
  { id: "portrait-files", label: "portrait-files", src: toolPortrait.files },
  { id: "portrait-terminal", label: "portrait-terminal", src: toolPortrait.terminal },
  { id: "portrait-notes", label: "portrait-notes", src: toolPortrait.notes },
  { id: "portrait-canvas", label: "portrait-canvas", src: toolPortrait.canvas },
  { id: "portrait-calc", label: "portrait-calc", src: toolPortrait.calc },
  { id: "portrait-quest", label: "portrait-quest", src: toolPortrait.quest },
  { id: "portrait-vault", label: "portrait-vault", src: toolPortrait.vault },
];

const bins: { id: ServiceApp; tool: "quest" | "files" | "canvas" | "calc"; file: string }[] = [
  { id: "quest", tool: "quest", file: "quest.bin" },
  { id: "files", tool: "files", file: "files.bin" },
  { id: "canvas", tool: "canvas", file: "canvas.bin" },
  { id: "calc", tool: "calc", file: "calculator.bin" },
];

type Folder = "images" | "apps" | "certs" | null;

type FilesProps = {
  services: ServiceState;
  certifications: Certification[];
  defaultImage: string;
  onOpen: (id: SectionId) => void;
  onOpenTool: (id: ToolId) => void;
};

function certPictures(certifications: Certification[], defaultImage: string): FilePic[] {
  const fallback = certAssetUrl(defaultImage);
  return certifications.map((cert) => {
    const file = cert.file || defaultImage;
    const pdf = isCertPdf(file);
    return {
      id: cert.title,
      label: cert.title,
      src: cert.file ? certAssetUrl(cert.file) : fallback,
      pdf,
    };
  });
}

export function Files({ services, certifications, defaultImage, onOpen, onOpenTool }: FilesProps) {
  const [denied, setDenied] = useState(false);
  const [folder, setFolder] = useState<Folder>(null);
  const [picture, setPicture] = useState<FilePic | null>(null);
  const [refusal, setRefusal] = useState("");
  const scans = certPictures(certifications, defaultImage);

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

  function openFolder(next: Folder) {
    setPicture(null);
    setRefusal("");
    setFolder(next);
  }

  let body = (
    <ul className="files-list">
      <li>
        <button type="button" className="files-folder files-folder--locked" onClick={() => setDenied(true)}>
          <PixelIcon className="files-folder-icon" name="folderLocked" />
          <span>system_files</span>
        </button>
      </li>
      <li>
        <button type="button" className="files-folder" onClick={() => openFolder("images")}>
          <PixelIcon className="files-folder-icon" name="folderBlue" />
          <span>images</span>
        </button>
      </li>
      <li>
        <button type="button" className="files-folder" onClick={() => openFolder("certs")}>
          <PixelIcon className="files-folder-icon" name="folderBlue" />
          <span>certificates</span>
        </button>
      </li>
      <li>
        <button type="button" className="files-folder" onClick={() => openFolder("apps")}>
          <PixelIcon className="files-folder-icon" name="folderBlue" />
          <span>installed_apps</span>
        </button>
      </li>
      {moduleKeys
        .filter((item) => item.id !== "certs")
        .map((item) => (
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
        {picture.pdf ? (
          <object className="files-viewer-pdf" data={picture.src} type="application/pdf" title={picture.label}>
            <p>{picture.label}</p>
          </object>
        ) : (
          <img src={picture.src} alt={picture.label} />
        )}
      </div>
    );
  } else if (folder === "images" || folder === "certs") {
    const items = folder === "certs" ? scans : pictures;
    body = (
      <div className="files-browser">
        <button type="button" className="files-back" onClick={() => openFolder(null)}>
          Back
        </button>
        <ul className={folder === "certs" ? "files-photos files-photos--certs" : "files-photos"}>
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className="files-photo" onClick={() => setPicture(item)}>
                <img src={item.pdf ? certAssetUrl(defaultImage) : item.src} alt="" />
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
        <button type="button" className="files-back" onClick={() => openFolder(null)}>
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
