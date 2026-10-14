import type { ReactNode } from "react";

type PixelWindowProps = {
  id?: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PixelWindow({ id, title, icon, children, className }: PixelWindowProps) {
  return (
    <section id={id} className={`pixel-window ${className ?? ""}`}>
      <header className="pixel-titlebar">
        <span className="pixel-titlebar__icon" aria-hidden>
          {icon}
        </span>
        <h2 className="pixel-titlebar__title">{title}</h2>
        <span className="pixel-titlebar__controls" aria-hidden>
          <i className="ctrl min" />
          <i className="ctrl max" />
          <i className="ctrl close" />
        </span>
      </header>
      <div className="pixel-window__body">{children}</div>
    </section>
  );
}
