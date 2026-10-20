import type { ReactNode } from "react";
import type { SectionId } from "./modules";

export type PixelIconName = SectionId | "github" | "linkedin" | "mail" | "cv";

function r(x: number, y: number, w: number, h: number, fill: string) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

const icons: Record<PixelIconName, ReactNode> = {
  github: (
    <>
      {r(4, 1, 2, 2, "#f4f4f8")}
      {r(10, 1, 2, 2, "#f4f4f8")}
      {r(3, 3, 10, 6, "#e4e4ee")}
      {r(5, 5, 2, 2, "#241c38")}
      {r(9, 5, 2, 2, "#241c38")}
      {r(6, 5, 1, 1, "#7af0ff")}
      {r(10, 5, 1, 1, "#7af0ff")}
      {r(5, 9, 6, 4, "#d0d0e0")}
      {r(2, 9, 3, 2, "#b8b8cc")}
      {r(11, 9, 3, 2, "#b8b8cc")}
      {r(4, 13, 2, 2, "#2a2440")}
      {r(10, 13, 2, 2, "#2a2440")}
    </>
  ),
  linkedin: (
    <>
      {r(1, 1, 14, 14, "#0a66c2")}
      {r(3, 3, 3, 3, "#fff")}
      {r(3, 7, 3, 6, "#fff")}
      {r(7, 7, 6, 2, "#fff")}
      {r(10, 9, 3, 4, "#fff")}
    </>
  ),
  mail: (
    <>
      {r(1, 3, 14, 10, "#ffe14a")}
      {r(1, 3, 7, 2, "#fff6b0")}
      {r(8, 3, 7, 2, "#e2b423")}
      {r(1, 5, 2, 2, "#e2b423")}
      {r(13, 5, 2, 2, "#c99216")}
      {r(6, 7, 4, 3, "#e23b4a")}
      {r(7, 8, 2, 1, "#fff")}
    </>
  ),
  cv: (
    <>
      {r(3, 1, 8, 13, "#fff8e8")}
      {r(11, 1, 2, 2, "#e7d7a4")}
      {r(5, 4, 5, 1, "#3d66e6")}
      {r(5, 6, 5, 1, "#3d66e6")}
      {r(5, 8, 3, 1, "#3d66e6")}
      {r(7, 10, 2, 3, "#2fbe4a")}
      {r(5, 12, 6, 1, "#2fbe4a")}
    </>
  ),
  about: (
    <>
      {r(6, 1, 4, 2, "#2a241c")}
      {r(5, 3, 6, 4, "#f3c7a2")}
      {r(6, 4, 1, 1, "#1a2140")}
      {r(9, 4, 1, 1, "#1a2140")}
      {r(7, 6, 2, 1, "#e23b4a")}
      {r(4, 8, 8, 5, "#3d66e6")}
      {r(6, 8, 4, 2, "#f3c7a2")}
      {r(3, 10, 2, 3, "#f3c7a2")}
      {r(11, 10, 2, 3, "#f3c7a2")}
    </>
  ),
  education: (
    <>
      {r(1, 6, 14, 2, "#1a2140")}
      {r(7, 2, 2, 4, "#ffe14a")}
      {r(6, 1, 4, 2, "#ffe14a")}
      {r(11, 3, 2, 3, "#e23b4a")}
      {r(3, 8, 10, 5, "#3d66e6")}
      {r(3, 12, 10, 1, "#ffe14a")}
      {r(7, 8, 2, 5, "#fff8e8")}
    </>
  ),
  certs: (
    <>
      {r(6, 1, 4, 3, "#e23b4a")}
      {r(5, 3, 2, 4, "#e23b4a")}
      {r(9, 3, 2, 4, "#e23b4a")}
      {r(4, 5, 8, 8, "#ffe14a")}
      {r(6, 7, 4, 4, "#fff6b0")}
      {r(7, 8, 2, 2, "#e23b4a")}
      {r(5, 13, 2, 2, "#3d66e6")}
      {r(9, 13, 2, 2, "#3d66e6")}
    </>
  ),
  projects: (
    <>
      {r(2, 4, 5, 2, "#f0a03c")}
      {r(1, 6, 14, 8, "#f0a03c")}
      {r(3, 8, 10, 4, "#fff8e8")}
      {r(4, 9, 6, 1, "#3d66e6")}
      {r(4, 11, 4, 1, "#7ad0ff")}
    </>
  ),
  skills: (
    <>
      {r(2, 9, 6, 2, "#7ad0ff")}
      {r(3, 8, 2, 4, "#7ad0ff")}
      {r(7, 10, 2, 2, "#3d8ec4")}
      {r(8, 3, 3, 8, "#ffe14a")}
      {r(7, 2, 5, 2, "#ffe14a")}
      {r(11, 4, 2, 2, "#e23b4a")}
      {r(9, 11, 2, 2, "#e2b423")}
    </>
  ),
  work: (
    <>
      {r(5, 2, 6, 2, "#8a5420")}
      {r(6, 1, 4, 2, "#c99216")}
      {r(2, 4, 12, 9, "#c97820")}
      {r(2, 7, 12, 2, "#ffe14a")}
      {r(7, 6, 2, 4, "#fff8e8")}
      {r(4, 11, 3, 1, "#8a5420")}
      {r(9, 11, 3, 1, "#8a5420")}
    </>
  ),
};

export function PixelIcon({ name, className }: { name: PixelIconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      {icons[name]}
    </svg>
  );
}
