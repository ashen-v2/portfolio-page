import type { ReactNode } from "react";

type ViewportProps = {
  title: string;
  citySrc: string;
  caption: string;
  credit: string;
  onClose?: () => void;
  children: ReactNode;
};

export function Viewport({ title, citySrc, caption, credit, onClose, children }: ViewportProps) {
  return (
    <section className="screen-shell" id="main" tabIndex={-1} aria-labelledby="screen-title">
      <span className="screw screw-tl" aria-hidden="true" />
      <span className="screw screw-tr" aria-hidden="true" />
      <span className="screw screw-bl" aria-hidden="true" />
      <span className="screw screw-br" aria-hidden="true" />
      <div className="screen">
        <div className="screen-title-bar">
          <h2 id="screen-title" className="screen-title" aria-live="polite">
            {title}
          </h2>
          {onClose ? (
            <button type="button" className="screen-close" aria-label="Close" onClick={onClose}>
              <svg viewBox="0 0 8 8" aria-hidden="true">
                <rect x="0" y="0" width="2" height="2" />
                <rect x="6" y="0" width="2" height="2" />
                <rect x="2" y="2" width="2" height="2" />
                <rect x="4" y="2" width="2" height="2" />
                <rect x="2" y="4" width="2" height="2" />
                <rect x="4" y="4" width="2" height="2" />
                <rect x="0" y="6" width="2" height="2" />
                <rect x="6" y="6" width="2" height="2" />
              </svg>
            </button>
          ) : null}
        </div>
        <div className="screen-view" style={{ backgroundImage: `url("${citySrc}")` }}>
          {children}
          {caption ? <p className="city-caption">{caption}</p> : null}
        </div>
        <p className="screen-credit">{credit}</p>
      </div>
    </section>
  );
}
