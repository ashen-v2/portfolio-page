import { useEffect, useState, type ReactNode } from "react";

type SpriteProps = {
  size?: number;
  className?: string;
  title?: string;
};

export function CloudSprite({ size = 24, className, title }: SpriteProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <rect width="16" height="16" fill="none" />
      <rect x="4" y="5" width="8" height="2" fill="var(--cyan)" />
      <rect x="3" y="7" width="10" height="2" fill="var(--cyan)" />
      <rect x="2" y="9" width="12" height="2" fill="var(--cyan)" />
      <rect x="5" y="3" width="5" height="2" fill="var(--cyan)" />
      <rect x="6" y="11" width="2" height="2" fill="var(--gold)" />
      <rect x="9" y="11" width="2" height="2" fill="var(--gold)" />
    </svg>
  );
}

export function ServerSprite({ size = 24, className, title }: SpriteProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect x="3" y="2" width="10" height="12" fill="var(--panel)" stroke="var(--border)" strokeWidth="0" />
      <rect x="3" y="2" width="10" height="3" fill="var(--titlebar)" />
      <rect x="3" y="6" width="10" height="3" fill="var(--titlebar)" />
      <rect x="3" y="10" width="10" height="3" fill="var(--titlebar)" />
      <rect x="4" y="3" width="2" height="1" fill="var(--mint)" />
      <rect x="4" y="7" width="2" height="1" fill="var(--gold)" />
      <rect x="4" y="11" width="2" height="1" fill="var(--rose)" />
      <rect x="7" y="3" width="5" height="1" fill="var(--cyan)" />
      <rect x="7" y="7" width="5" height="1" fill="var(--cyan)" />
      <rect x="7" y="11" width="5" height="1" fill="var(--cyan)" />
    </svg>
  );
}

export function StarSprite({ size = 24, className, title }: SpriteProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect x="7" y="1" width="2" height="2" fill="var(--gold)" />
      <rect x="6" y="3" width="4" height="2" fill="var(--gold)" />
      <rect x="2" y="5" width="12" height="2" fill="var(--gold)" />
      <rect x="5" y="7" width="6" height="2" fill="var(--btn-hover)" />
      <rect x="6" y="9" width="4" height="2" fill="var(--gold)" />
      <rect x="4" y="11" width="2" height="3" fill="var(--gold)" />
      <rect x="10" y="11" width="2" height="3" fill="var(--gold)" />
      <rect x="7" y="11" width="2" height="2" fill="var(--gold-dim)" />
    </svg>
  );
}

export function PixelAvatar({ size = 128, decorative = false }: { size?: number; decorative?: boolean }) {
  return (
    <svg
      className="avatar"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "Pixel portrait of Ashen"}
    >
      <rect width="32" height="32" fill="var(--avatar-bg)" />
      <rect x="1" y="26" width="2" height="3" fill="var(--grass-dark)" />
      <rect x="5" y="27" width="2" height="2" fill="var(--grass-dark)" />
      <rect x="25" y="26" width="2" height="3" fill="var(--grass-dark)" />
      <rect x="29" y="27" width="2" height="2" fill="var(--grass-dark)" />
      <rect y="28" width="32" height="2" fill="var(--grass)" />
      <rect y="30" width="32" height="2" fill="var(--soil)" />
      <rect x="20" y="14" width="7" height="10" fill="#6b3a22" />
      <rect x="21" y="16" width="5" height="4" fill="#c47b3a" />
      <rect x="22" y="13" width="3" height="2" fill="#6b3a22" />
      <rect x="11" y="23" width="4" height="5" fill="#1e3a8a" />
      <rect x="16" y="23" width="4" height="5" fill="#1e3a8a" />
      <rect x="10" y="27" width="5" height="2" fill="#2b1d14" />
      <rect x="16" y="27" width="5" height="2" fill="#2b1d14" />
      <rect x="9" y="15" width="13" height="9" fill="var(--titlebar)" />
      <rect x="13" y="16" width="5" height="6" fill="var(--ink)" />
      <rect x="6" y="16" width="3" height="6" fill="var(--titlebar)" />
      <rect x="22" y="16" width="3" height="5" fill="var(--titlebar)" />
      <rect x="11" y="9" width="10" height="7" fill="#8d5528" />
      <rect x="13" y="11" width="2" height="2" fill="#1a120c" />
      <rect x="17" y="11" width="2" height="2" fill="#1a120c" />
      <rect x="14" y="14" width="4" height="1" fill="#5c3318" />
      <rect x="12" y="3" width="8" height="3" fill="#d4334a" />
      <rect x="10" y="6" width="12" height="3" fill="#d4334a" />
      <rect x="8" y="8" width="16" height="2" fill="#d4334a" />
      <rect x="18" y="6" width="2" height="2" fill="#fff8e8" />
    </svg>
  );
}

function SceneSvg({
  className,
  viewBox,
  children,
}: {
  className: string;
  viewBox: string;
  children: ReactNode;
}) {
  return (
    <svg className={className} viewBox={viewBox} shapeRendering="crispEdges" aria-hidden>
      {children}
    </svg>
  );
}

export function RouteScene() {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const hint = document.querySelector(".egg-hint");
    if (!hint) return;
    const observer = new IntersectionObserver(([entry]) => {
      setSettled(entry.isIntersecting);
    });
    observer.observe(hint);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={settled ? "ground scene-settled" : "ground"} aria-hidden>
      <div className="scene-cast scene-left">
        <SceneSvg className="scene-gym" viewBox="0 0 64 80">
          <rect x="0" y="19" width="24" height="61" fill="var(--panel)" />
          <rect x="0" y="19" width="24" height="4" fill="var(--titlebar)" />
          <rect x="0" y="14" width="6" height="5" fill="var(--panel)" />
          <rect x="10" y="14" width="6" height="5" fill="var(--panel)" />
          <rect x="18" y="14" width="6" height="5" fill="var(--panel)" />
          <rect x="4" y="10" width="16" height="4" fill="var(--rose)" />
          <rect x="8" y="6" width="8" height="4" fill="var(--rose)" />
          <rect x="10" y="0" width="4" height="6" fill="var(--rose)" />
          <rect x="14" y="1" width="6" height="3" fill="var(--gold)" />
          <rect x="4" y="28" width="4" height="8" fill="var(--cyan)" />
          <rect x="14" y="28" width="4" height="8" fill="var(--cyan)" />
          <rect x="4" y="44" width="4" height="8" fill="var(--cyan)" />
          <rect x="14" y="44" width="4" height="8" fill="var(--cyan)" />
          <rect x="8" y="62" width="8" height="18" fill="#6b3a22" />
          <rect x="20" y="44" width="28" height="36" fill="var(--panel)" />
          <rect x="20" y="44" width="28" height="3" fill="var(--titlebar)" />
          <rect x="20" y="40" width="6" height="4" fill="var(--panel)" />
          <rect x="30" y="40" width="6" height="4" fill="var(--panel)" />
          <rect x="40" y="40" width="6" height="4" fill="var(--panel)" />
          <rect x="22" y="36" width="24" height="4" fill="var(--rose)" />
          <rect x="26" y="52" width="5" height="6" fill="var(--cyan)" />
          <rect x="36" y="50" width="8" height="4" fill="var(--gold)" />
          <rect x="34" y="64" width="8" height="16" fill="#6b3a22" />
          <rect x="44" y="34" width="20" height="46" fill="var(--panel)" />
          <rect x="44" y="34" width="20" height="3" fill="var(--titlebar)" />
          <rect x="44" y="30" width="5" height="4" fill="var(--panel)" />
          <rect x="52" y="30" width="5" height="4" fill="var(--panel)" />
          <rect x="59" y="30" width="5" height="4" fill="var(--panel)" />
          <rect x="46" y="26" width="16" height="4" fill="var(--rose)" />
          <rect x="50" y="22" width="8" height="4" fill="var(--rose)" />
          <rect x="52" y="18" width="4" height="4" fill="var(--rose)" />
          <rect x="48" y="44" width="4" height="8" fill="var(--cyan)" />
          <rect x="56" y="44" width="4" height="8" fill="var(--cyan)" />
          <rect x="50" y="64" width="8" height="16" fill="#6b3a22" />
        </SceneSvg>
        <SceneSvg className="scene-tree" viewBox="0 0 28 40">
          <rect x="12" y="18" width="4" height="22" fill="#6b3a22" />
          <rect x="8" y="2" width="12" height="8" fill="var(--grass-dark)" />
          <rect x="4" y="8" width="20" height="8" fill="var(--grass)" />
          <rect x="6" y="14" width="16" height="8" fill="var(--grass-dark)" />
        </SceneSvg>
      </div>
      <div className="scene-cast scene-right">
        <SceneSvg className="scene-pal" viewBox="0 0 20 24">
          <rect x="4" y="4" width="3" height="5" fill="var(--mint)" />
          <rect x="13" y="4" width="3" height="5" fill="var(--mint)" />
          <rect x="5" y="5" width="1" height="2" fill="var(--rose)" />
          <rect x="14" y="5" width="1" height="2" fill="var(--rose)" />
          <rect x="3" y="10" width="14" height="11" fill="var(--mint)" />
          <rect x="4" y="8" width="12" height="13" fill="var(--mint)" />
          <rect x="6" y="11" width="2" height="2" fill="#1a120c" />
          <rect x="12" y="11" width="2" height="2" fill="#1a120c" />
          <rect x="16" y="12" width="3" height="2" fill="var(--gold)" />
          <rect x="5" y="21" width="3" height="3" fill="#2b1d14" />
          <rect x="12" y="21" width="3" height="3" fill="#2b1d14" />
        </SceneSvg>
        <SceneSvg className="scene-walker" viewBox="0 0 32 40">
          <rect x="18" y="14" width="8" height="12" fill="#6b3a22" />
          <rect x="20" y="16" width="4" height="5" fill="#c47b3a" />
          <rect x="10" y="26" width="4" height="12" fill="#1e3a8a" />
          <rect x="16" y="26" width="4" height="12" fill="#1e3a8a" />
          <rect x="9" y="37" width="5" height="3" fill="#2b1d14" />
          <rect x="16" y="37" width="5" height="3" fill="#2b1d14" />
          <rect x="10" y="16" width="12" height="13" fill="var(--titlebar)" />
          <rect x="6" y="18" width="4" height="6" fill="var(--titlebar)" />
          <rect x="11" y="9" width="10" height="8" fill="#8d5528" />
          <rect x="12" y="12" width="2" height="2" fill="#1a120c" />
          <rect x="12" y="4" width="10" height="5" fill="#d4334a" />
          <rect x="6" y="8" width="16" height="3" fill="#d4334a" />
        </SceneSvg>
      </div>
    </div>
  );
}
