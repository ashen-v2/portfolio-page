import { moduleKeys, type SectionId } from "./modules";
import { PixelIcon } from "./pixelIcons";

type ToolDockProps = {
  section: SectionId | null;
  terminalOpen: boolean;
  enabled: boolean;
  onSelect: (id: SectionId) => void;
  onToggleTerminal: () => void;
};

export function ToolDock({ section, terminalOpen, enabled, onSelect, onToggleTerminal }: ToolDockProps) {
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
        <button
          type="button"
          className="console-key"
          aria-pressed={terminalOpen}
          aria-controls="terminal"
          disabled={!enabled}
          onClick={onToggleTerminal}
        >
          <PixelIcon className="key-icon" name="terminal" />
          <span>Terminal</span>
        </button>
      </div>
    </div>
  );
}
