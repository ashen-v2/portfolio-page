import { PixelIcon } from "./pixelIcons";
import { moduleKeys, type SectionId } from "./modules";

export function Files({ onOpen }: { onOpen: (id: SectionId) => void }) {
  return (
    <div className="tool-panel files-tool" id="files">
      <div className="files-window">
        <h3>Files</h3>
        <ul className="files-list">
          {moduleKeys.map((item) => (
            <li key={item.id}>
              <button type="button" className="files-folder" onClick={() => onOpen(item.id)}>
                <PixelIcon className="files-folder-icon" name="folder" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
