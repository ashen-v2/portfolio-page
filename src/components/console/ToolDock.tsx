import { moduleKeys, type SectionId } from "./modules";
import { PixelIcon } from "./pixelIcons";

type ToolDockProps = {
  section: SectionId | null;
  homeActive: boolean;
  enabled: boolean;
  onSelect: (id: SectionId) => void;
  onHome: () => void;
};

export function ToolDock({ section, homeActive, enabled, onSelect, onHome }: ToolDockProps) {
  const leading = moduleKeys.slice(0, 3);
  const trailing = moduleKeys.slice(3);
  return (
    <div className="dock">
      <div className="keys" role="toolbar" aria-label="Portfolio modules">
        {leading.map((item) => (
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
          className="console-key console-key-home"
          aria-pressed={homeActive}
          aria-controls="home-screen"
          disabled={!enabled}
          onClick={onHome}
        >
          <PixelIcon className="key-icon" name="home" />
          <span>Home</span>
        </button>
        {trailing.map((item) => (
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
