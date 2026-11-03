const RICK = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export function Vault() {
  return (
    <div className="tool-panel files-tool" id="vault">
      <div className="files-window">
        <h3>Vault</h3>
        <ul className="files-list">
          <li>
            <button
              type="button"
              className="files-bin"
              onClick={() => window.open(RICK, "_blank", "noopener,noreferrer")}
            >
              <span>MY_SSR_SECRET</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
