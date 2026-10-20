import type { ReactNode } from "react";

type ViewportProps = {
  title: string;
  citySrc: string;
  caption: string;
  credit: string;
  children: ReactNode;
};

export function Viewport({ title, citySrc, caption, credit, children }: ViewportProps) {
  return (
    <section className="screen-shell" id="main" tabIndex={-1} aria-labelledby="screen-title">
      <span className="screw screw-tl" aria-hidden="true" />
      <span className="screw screw-tr" aria-hidden="true" />
      <span className="screw screw-bl" aria-hidden="true" />
      <span className="screw screw-br" aria-hidden="true" />
      <div className="screen">
        <h2 id="screen-title" className="screen-title" aria-live="polite">
          {title}
        </h2>
        <div className="screen-view" style={{ backgroundImage: `url("${citySrc}")` }}>
          {children}
          {caption ? <p className="city-caption">{caption}</p> : null}
        </div>
        <p className="screen-credit">{credit}</p>
      </div>
    </section>
  );
}
