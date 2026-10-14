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
      <rect x="4" y="5" width="8" height="2" fill="#3ee0ff" />
      <rect x="3" y="7" width="10" height="2" fill="#3ee0ff" />
      <rect x="2" y="9" width="12" height="2" fill="#7aeeff" />
      <rect x="5" y="3" width="5" height="2" fill="#7aeeff" />
      <rect x="6" y="11" width="2" height="2" fill="#ffcc33" />
      <rect x="9" y="11" width="2" height="2" fill="#ffcc33" />
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
      <rect x="3" y="2" width="10" height="12" fill="#1a2240" stroke="#050508" strokeWidth="0" />
      <rect x="3" y="2" width="10" height="3" fill="#2a3a78" />
      <rect x="3" y="6" width="10" height="3" fill="#2a3a78" />
      <rect x="3" y="10" width="10" height="3" fill="#2a3a78" />
      <rect x="4" y="3" width="2" height="1" fill="#4dff88" />
      <rect x="4" y="7" width="2" height="1" fill="#ffcc33" />
      <rect x="4" y="11" width="2" height="1" fill="#ff4d6d" />
      <rect x="7" y="3" width="5" height="1" fill="#3ee0ff" />
      <rect x="7" y="7" width="5" height="1" fill="#3ee0ff" />
      <rect x="7" y="11" width="5" height="1" fill="#3ee0ff" />
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
      <rect x="7" y="1" width="2" height="2" fill="#ffcc33" />
      <rect x="6" y="3" width="4" height="2" fill="#ffcc33" />
      <rect x="2" y="5" width="12" height="2" fill="#ffcc33" />
      <rect x="5" y="7" width="6" height="2" fill="#ffe066" />
      <rect x="6" y="9" width="4" height="2" fill="#ffcc33" />
      <rect x="4" y="11" width="2" height="3" fill="#ffcc33" />
      <rect x="10" y="11" width="2" height="3" fill="#ffcc33" />
      <rect x="7" y="11" width="2" height="2" fill="#c9a227" />
    </svg>
  );
}

export function PixelAvatar({ size = 128 }: { size?: number }) {
  return (
    <svg
      className="avatar"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel portrait of Ashen"
    >
      <rect width="32" height="32" fill="#0e1428" />
      <rect x="6" y="22" width="20" height="8" fill="#1a2240" />
      <rect x="8" y="20" width="16" height="6" fill="#2a3a78" />
      <rect x="10" y="18" width="12" height="4" fill="#3d52a8" />
      <rect x="11" y="8" width="10" height="10" fill="#e8c39a" />
      <rect x="10" y="6" width="12" height="4" fill="#2b1d14" />
      <rect x="9" y="8" width="3" height="5" fill="#2b1d14" />
      <rect x="20" y="8" width="3" height="5" fill="#2b1d14" />
      <rect x="11" y="5" width="10" height="2" fill="#1a120c" />
      <rect x="13" y="11" width="2" height="2" fill="#1a120c" />
      <rect x="17" y="11" width="2" height="2" fill="#1a120c" />
      <rect x="14" y="14" width="4" height="1" fill="#c47a6a" />
      <rect x="10" y="10" width="12" height="3" fill="#3ee0ff" opacity="0.35" />
      <rect x="12" y="24" width="8" height="2" fill="#ffcc33" />
      <rect x="4" y="23" width="4" height="3" fill="#3ee0ff" />
      <rect x="24" y="21" width="3" height="6" fill="#243056" />
      <rect x="25" y="20" width="2" height="2" fill="#4dff88" />
    </svg>
  );
}
