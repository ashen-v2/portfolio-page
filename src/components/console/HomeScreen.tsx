import { PixelIcon } from "./pixelIcons";
import { toolKeys, type ToolId } from "./modules";

export function HomeScreen({ onOpen }: { onOpen: (id: ToolId) => void }) {
  return (
    <div className="home-screen" id="home-screen">
      <div className="home-apps" role="toolbar" aria-label="Home apps">
        {toolKeys.map((item) => (
          <button key={item.id} type="button" className="home-app" onClick={() => onOpen(item.id)}>
            <PixelIcon className="home-app-icon" name={item.id} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
