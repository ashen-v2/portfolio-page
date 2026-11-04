import { useState } from "react";

const base = import.meta.env.BASE_URL;
const INSTAGRAM = "https://www.instagram.com/ashen.f__/";
const CAT = `${base}my_cat.jpeg`;
const RICK = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

function openTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function Vault() {
  const [cat, setCat] = useState(false);

  return (
    <div className="tool-panel files-tool" id="vault">
      <div className="files-window">
        <h3>Vault</h3>
        {cat ? (
          <div className="files-viewer">
            <button type="button" className="files-back" onClick={() => setCat(false)}>
              Back
            </button>
            <img src={CAT} alt="my_cat" />
          </div>
        ) : (
          <ul className="files-list">
            <li>
              <button type="button" className="files-bin" onClick={() => openTab(INSTAGRAM)}>
                <span>my_instagram</span>
              </button>
            </li>
            <li>
              <button type="button" className="files-bin" onClick={() => setCat(true)}>
                <span>my_cat</span>
              </button>
            </li>
            <li>
              <button type="button" className="files-bin" onClick={() => openTab(RICK)}>
                <span>MY_SUPER_SUPER_RARE_SECRET</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
