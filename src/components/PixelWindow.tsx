import type { ReactNode } from "react";

type PixelWindowProps = {
  id?: string;
  title: string;
  plain?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PixelWindow({ id, title, plain, icon, children, className }: PixelWindowProps) {
  return (
    <section id={id} className={`pixel-window ${className ?? ""}`}>
      <header className="pixel-titlebar">
        <span className="pixel-titlebar__icon" aria-hidden>
          {icon}
        </span>
        <h2 className="pixel-titlebar__title" aria-label={plain ? `${title} ${plain}` : undefined}>
          <span className="title-kicker">{title}</span>
          {plain ? <span className="title-plain">{plain}</span> : null}
        </h2>
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
