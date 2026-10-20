import { moduleKeys, type SectionId } from "./modules";
import { PixelIcon } from "./pixelIcons";

type ToolDockProps = {
  section: SectionId | null;
  enabled: boolean;
  onSelect: (id: SectionId) => void;
};

export function ToolDock({ section, enabled, onSelect }: ToolDockProps) {
  return (
    <div className="dock">
      <div className="keys" role="toolbar" aria-label="Portfolio modules">
        {moduleKeys.map((item) => (
          <button
            key={item.id}
            type="button"
            className="console-key"
            aria-pressed={section === item.id}
            aria-controls="module-panel"
            disabled={!enabled}
            onClick={() => onSelect(item.id)}
          >
            <PixelIcon className="key-icon" name={item.id} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
