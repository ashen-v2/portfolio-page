import { useState } from "react";
import { openVaultLink, vaultSecrets } from "./vaultSecrets";

export function Vault() {
  const cat = vaultSecrets.find((item) => item.id === "cat");
  const [showCat, setShowCat] = useState(false);

  return (
    <div className="tool-panel files-tool" id="vault">
      <div className="files-window">
        <h3>Vault</h3>
        {showCat && cat?.image ? (
          <div className="files-viewer">
            <button type="button" className="files-back" onClick={() => setShowCat(false)}>
              Back
            </button>
            <img src={cat.image} alt={cat.label} />
          </div>
        ) : (
          <ul className="files-list">
            {vaultSecrets.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="files-bin"
                  onClick={() => {
                    if (item.image) setShowCat(true);
                    else if (item.href) openVaultLink(item.href);
                  }}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
