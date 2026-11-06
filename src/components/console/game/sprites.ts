import type { SectionId } from "../modules";
import { TILE, VIEW_COLS, VIEW_H, VIEW_ROWS, VIEW_W, camera, landmarkAt, tileAt } from "./map";
import type { BossId, Dir, HeroId } from "./story";

export type AttackAnim = "none" | HeroId | "hit";

type FieldBoss = { id: BossId; x: number; y: number };

export type FieldView = {
  hero: HeroId;
  x: number;
  y: number;
  facing: Dir;
  bob: boolean;
  walking: boolean;
  frame: number;
  bosses: FieldBoss[];
  goal: { x: number; y: number } | null;
};

export type BattleView = {
  hero: HeroId;
  boss: BossId;
  anim: AttackAnim;
  t: number;
  frame: number;
};

type Slice = { src: string; sx: number; sy: number; sw: number; sh: number };

const COL: Record<Dir, number> = { down: 0, up: 1, left: 2, right: 3 };

const NINJA = {
  idle: "/console/quest/ninja/idle.png",
  walk: "/console/quest/ninja/walk.png",
  attack: "/console/quest/ninja/attack.png",
  hit: "/console/quest/ninja/hit.png",
};

const HAND: Record<HeroId, Slice> = {
  dock: { src: "/console/quest/items/crate-empty.png", sx: 0, sy: 0, sw: 16, sh: 15 },
  terra: { src: "/console/quest/items/hammer-hand.png", sx: 0, sy: 0, sw: 9, sh: 9 },
  pyth: { src: "/console/quest/items/stick-hand.png", sx: 0, sy: 0, sw: 3, sh: 12 },
  helm: { src: "/console/quest/items/katana-hand.png", sx: 0, sy: 0, sw: 6, sh: 10 },
};

const GRASS: Array<[number, number]> = [
  [16, 64],
  [16, 112],
];
const PATH: Array<[number, number]> = [[16, 16]];

const sheets = new Map<string, HTMLImageElement>();

function sheet(src: string) {
  let image = sheets.get(src);
  if (!image) {
    image = new Image();
    image.src = src;
    sheets.set(src, image);
  }
  return image;
}

function blit(
  ctx: CanvasRenderingContext2D,
  src: string,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  scale = 1,
) {
  const image = sheet(src);
  if (!image.complete || image.naturalWidth === 0) return false;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, sx, sy, sw, sh, Math.round(dx), Math.round(dy), sw * scale, sh * scale);
  return true;
}

function cell(ctx: CanvasRenderingContext2D, slice: Slice, dx: number, dy: number, scale = 1) {
  return blit(ctx, slice.src, slice.sx, slice.sy, slice.sw, slice.sh, dx, dy, scale);
}

function ninjaCell(file: string, facing: Dir, row: number): Slice {
  return { src: file, sx: COL[facing] * 32 + 8, sy: row * 32 + 8, sw: 16, sh: 16 };
}

function drawNinja(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  kit: HeroId,
  facing: Dir,
  pose: "idle" | "walk" | "attack" | "hit",
  frame: number,
  scale: number,
) {
  const file = NINJA[pose === "walk" ? "walk" : pose === "attack" ? "attack" : pose === "hit" ? "hit" : "idle"];
  const row = pose === "walk" ? (frame ? 1 : 0) : 0;
  cell(ctx, ninjaCell(file, facing, row), x, y, scale);
  const hand = HAND[kit];
  const body = 16 * scale;
  let hx = x + body - 2 * scale;
  let hy = y + 6 * scale;
  if (facing === "left") hx = x - hand.sw * scale + 2 * scale;
  if (facing === "up") {
    hx = x - 1 * scale;
    hy = y + 4 * scale;
  }
  if (facing === "down") hx = x + body - hand.sw * scale + 2 * scale;
  cell(ctx, hand, hx, hy, scale);
}

function tile16(ctx: CanvasRenderingContext2D, src: string, sx: number, sy: number, dx: number, dy: number) {
  if (!blit(ctx, src, sx, sy, 16, 16, dx, dy, 1)) {
    ctx.fillStyle = "#3cba52";
    ctx.fillRect(dx, dy, TILE, TILE);
  }
}

function drawGrass(ctx: CanvasRenderingContext2D, x: number, y: number, gx: number, gy: number) {
  const n = Math.abs(gx * 13 + gy * 7);
  const [sx, sy] = GRASS[n % GRASS.length];
  tile16(ctx, "/console/quest/tiles/field.png", sx, sy, x, y);
}

function drawPath(ctx: CanvasRenderingContext2D, x: number, y: number, gx: number, gy: number) {
  const n = Math.abs(gx * 3 + gy * 5);
  const [sx, sy] = PATH[n % PATH.length];
  tile16(ctx, "/console/quest/tiles/field.png", sx, sy, x, y);
}

function drawWater(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  tile16(ctx, "/console/quest/tiles/ripples.png", frame ? 16 : 0, 0, x, y);
}

function drawBridge(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  drawWater(ctx, x, y, frame);
  blit(ctx, "/console/quest/tiles/house.png", 128, 80, 16, 16, x, y, 1);
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  blit(ctx, "/console/quest/tiles/nature.png", 0, 0, 32, 32, x - 8, y - 16, 1);
}

const HOUSE = "/console/quest/tiles/house.png";

const PLACES: Record<SectionId, { sx: number; sy: number; sw: number; sh: number; label: string }> = {
  about: { sx: 4, sy: 0, sw: 56, sh: 48, label: "ABOUT" },
  education: { sx: 197, sy: 0, sw: 54, sh: 48, label: "EDUCATION" },
  certs: { sx: 372, sy: 0, sw: 40, sh: 52, label: "CERTS" },
  projects: { sx: 65, sy: 4, sw: 60, sh: 44, label: "PROJECTS" },
  skills: { sx: 132, sy: 0, sw: 56, sh: 52, label: "SKILLS" },
  work: { sx: 257, sy: 0, sw: 46, sh: 48, label: "WORK" },
};

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.font = 'bold 8px "Pixelify Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const width = Math.ceil(ctx.measureText(text).width);
  const half = width / 2 + 2;
  const cx = Math.min(VIEW_W - half, Math.max(half, x));
  const left = Math.round(cx - half);
  ctx.fillStyle = "#1a2140";
  ctx.fillRect(left, y, width + 4, 10);
  ctx.fillStyle = "#ffe14a";
  ctx.fillText(text, Math.round(cx), y + 1);
}

function drawPlace(ctx: CanvasRenderingContext2D, x: number, y: number, id: SectionId) {
  const place = PLACES[id];
  const top = y + TILE - place.sh;
  blit(ctx, HOUSE, place.sx, place.sy, place.sw, place.sh, x, top, 1);
  drawLabel(ctx, place.label, x + place.sw / 2, y + 2);
}

function grassExtra(ctx: CanvasRenderingContext2D, x: number, y: number, gx: number, gy: number) {
  const n = Math.abs(gx * 13 + gy * 7);
  if (n % 11 === 0) blit(ctx, "/console/quest/tiles/flower.png", 0, 0, 10, 8, x + 3, y + 6, 1);
  else if (n % 11 === 1) blit(ctx, "/console/quest/tiles/nature.png", 64, 0, 16, 16, x, y, 1);
}

type BossSlice = { idle: Slice; hit: Slice; scale: number };

function bossArt(id: BossId, hurt: boolean): { slice: Slice; scale: number } {
  const art: Record<BossId, BossSlice> = {
    drake: {
      idle: { src: "/console/quest/bosses/dragon.png", sx: 0, sy: 0, sw: 16, sh: 16 },
      hit: { src: "/console/quest/bosses/dragon.png", sx: 16, sy: 0, sw: 16, sh: 16 },
      scale: 1,
    },
    wurm: {
      idle: { src: "/console/quest/bosses/snake.png", sx: 0, sy: 0, sw: 16, sh: 16 },
      hit: { src: "/console/quest/bosses/snake2.png", sx: 0, sy: 0, sw: 16, sh: 16 },
      scale: 1,
    },
    wraith: {
      idle: { src: "/console/quest/bosses/spirit-idle.png", sx: 0, sy: 0, sw: 50, sh: 50 },
      hit: { src: "/console/quest/bosses/spirit-hit.png", sx: 0, sy: 0, sw: 50, sh: 50 },
      scale: 1,
    },
    golem: {
      idle: { src: "/console/quest/bosses/slime-idle.png", sx: 0, sy: 0, sw: 62, sh: 52 },
      hit: { src: "/console/quest/bosses/slime-hit.png", sx: 62, sy: 0, sw: 62, sh: 52 },
      scale: 1,
    },
  };
  const picked = art[id];
  return { slice: hurt ? picked.hit : picked.idle, scale: picked.scale };
}

function drawBoss(ctx: CanvasRenderingContext2D, x: number, y: number, id: BossId, hurt: boolean, battle: boolean) {
  const art = bossArt(id, hurt);
  const small = art.slice.sw <= 16;
  const scale = battle && small ? 2 : 1;
  const dw = art.slice.sw * scale;
  const dh = art.slice.sh * scale;
  cell(ctx, art.slice, x + Math.floor((16 - dw) / 2), y + 16 - dh, scale);
}

function drawMarker(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.fillStyle = frame ? "#fff8e8" : "#ffe14a";
  ctx.fillRect(x + 2, y + 2, 3, 3);
  ctx.fillRect(x + 11, y + 2, 3, 3);
  ctx.fillRect(x + 2, y + 11, 3, 3);
  ctx.fillRect(x + 11, y + 11, 3, 3);
}

export function drawChest(ctx: CanvasRenderingContext2D, open: boolean) {
  const size = 32;
  blit(ctx, "/console/quest/items/chest.png", open ? 16 : 0, 0, 16, 16, (VIEW_W - size) / 2, 24, 2);
}

export function drawIntro(ctx: CanvasRenderingContext2D, frame: number) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  for (let y = 0; y < VIEW_ROWS; y += 1) {
    for (let x = 0; x < VIEW_COLS; x += 1) {
      const px = x * TILE;
      const py = y * TILE;
      if (y === 6 && x >= 6 && x <= 8) drawBridge(ctx, px, py, frame);
      else if (y === 6) drawWater(ctx, px, py, frame);
      else drawGrass(ctx, px, py, x, y);
    }
  }
  drawTree(ctx, 2 * TILE, 2 * TILE);
  drawTree(ctx, 12 * TILE, 3 * TILE);
  drawPlace(ctx, 9 * TILE, 8 * TILE, "about");
}

export function drawSelect(ctx: CanvasRenderingContext2D, frame: number) {
  drawIntro(ctx, frame);
  const ids: HeroId[] = ["dock", "terra", "pyth", "helm"];
  ids.forEach((id, index) => {
    drawNinja(ctx, 22 + index * 56, 28, id, "down", "idle", 0, 2);
  });
}

export function drawField(ctx: CanvasRenderingContext2D, view: FieldView) {
  const cam = camera(view.x, view.y);
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = "#14386a";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  for (let ty = 0; ty < VIEW_ROWS; ty += 1) {
    for (let tx = 0; tx < VIEW_COLS; tx += 1) {
      const gx = cam.x + tx;
      const gy = cam.y + ty;
      const tile = tileAt(gx, gy);
      const px = tx * TILE;
      const py = ty * TILE;
      if (tile === "W") drawWater(ctx, px, py, view.frame);
      else if (tile === "=") drawBridge(ctx, px, py, view.frame);
      else if (tile === "P") drawPath(ctx, px, py, gx, gy);
      else drawGrass(ctx, px, py, gx, gy);
    }
  }

  if (view.goal) {
    drawMarker(ctx, (view.goal.x - cam.x) * TILE, (view.goal.y - cam.y) * TILE, view.frame);
  }

  type Stamp = { y: number; draw: () => void };
  const stamps: Stamp[] = [];

  for (let ty = 0; ty < VIEW_ROWS; ty += 1) {
    for (let tx = 0; tx < VIEW_COLS; tx += 1) {
      const gx = cam.x + tx;
      const gy = cam.y + ty;
      const tile = tileAt(gx, gy);
      const px = tx * TILE;
      const py = ty * TILE;
      if (tile === "G" && !landmarkAt(gx, gy)) {
        stamps.push({ y: gy, draw: () => grassExtra(ctx, px, py, gx, gy) });
      }
      if (tile === "T") stamps.push({ y: gy, draw: () => drawTree(ctx, px, py) });
      if (tile === "H") {
        const place = landmarkAt(gx, gy);
        const door = place?.tiles[0];
        if (place && door && door.x === gx && door.y === gy) {
          stamps.push({
            y: gy,
            draw: () => drawPlace(ctx, px, py, place.id),
          });
        } else if (!place) {
          stamps.push({ y: gy, draw: () => drawPlace(ctx, px, py, "about") });
        }
      }
    }
  }

  for (const boss of view.bosses) {
    const px = (boss.x - cam.x) * TILE;
    const py = (boss.y - cam.y) * TILE;
    stamps.push({
      y: boss.y,
      draw: () => drawBoss(ctx, px, py, boss.id, false, false),
    });
  }

  stamps.push({
    y: view.y + 0.1,
    draw: () => {
      const hy = (view.y - cam.y) * TILE;
      drawNinja(
        ctx,
        (view.x - cam.x) * TILE,
        hy,
        view.hero,
        view.facing,
        view.walking ? "walk" : "idle",
        view.bob ? 1 : 0,
        1,
      );
    },
  });

  stamps.sort((a, b) => a.y - b.y);
  for (const stamp of stamps) stamp.draw();
}

export function drawBattle(ctx: CanvasRenderingContext2D, view: BattleView) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = "#79c8f2";
  ctx.fillRect(0, 0, VIEW_W, 78);
  ctx.fillStyle = "#c9e8ff";
  ctx.fillRect(0, 70, VIEW_W, 8);
  for (let x = 0; x < VIEW_W; x += TILE) {
    blit(ctx, "/console/quest/tiles/field.png", 16, 64, 16, 16, x, 78, 1);
    blit(ctx, "/console/quest/tiles/field.png", 16, 112, 16, 16, x, 94, 1);
    blit(ctx, "/console/quest/tiles/field.png", 16, 64, 16, 16, x, 110, 1);
    blit(ctx, "/console/quest/tiles/field.png", 16, 112, 16, 16, x, 126, 1);
    blit(ctx, "/console/quest/tiles/field.png", 16, 64, 16, 16, x, 142, 1);
    blit(ctx, "/console/quest/tiles/field.png", 16, 112, 16, 16, x, 158, 1);
  }

  const striking = view.anim === "dock" || view.anim === "terra" || view.anim === "pyth" || view.anim === "helm";
  const hurt = striking && view.t > 0.72;
  const shake = hurt && Math.floor(view.t * 28) % 2 === 0 ? 2 : 0;
  const lunge = view.anim === "hit" ? Math.sin(view.t * Math.PI) * 16 : 0;

  if (view.anim === "terra") {
    const rise = Math.min(1, view.t / 0.62);
    blit(ctx, "/console/quest/items/anvil.png", 0, 0, 16, 16, 176, 88 - rise * 36, 2);
  }

  drawBoss(ctx, 150 - lunge + shake, 80, view.boss, hurt, true);

  if (view.anim === "dock") {
    if (view.t < 0.8) {
      const drop = view.t / 0.8;
      blit(ctx, "/console/quest/items/crate-dynamite.png", 0, 0, 16, 16, 176, 4 + drop * drop * 46, 2);
    } else {
      const burst = (view.t - 0.8) / 0.2;
      const bits = [
        [-10, -8],
        [8, -6],
        [-6, 8],
        [12, 6],
        [0, -12],
        [7, 2],
      ];
      for (const [dx, dy] of bits) {
        blit(ctx, "/console/quest/items/crate-empty.png", 0, 0, 8, 8, 184 + dx * burst, 52 + dy * burst, 1);
      }
    }
  }

  if (view.anim === "helm") {
    for (let i = 0; i < 3; i += 1) {
      const ang = (Math.PI * 2 * i) / 3 + view.t * Math.PI * 4;
      const rad = 32 * (1 - view.t * 0.84);
      blit(
        ctx,
        "/console/quest/items/book.png",
        0,
        0,
        9,
        9,
        186 + Math.cos(ang) * rad,
        62 + Math.sin(ang) * rad * 0.66,
        2,
      );
    }
  }

  if (striking && view.t > 0.45 && view.t < 0.85) {
    blit(ctx, "/console/quest/fx/slash.png", 0, 0, 32, 32, 150, 48, 1);
  }

  const blink = view.anim === "hit" && view.t > 0.12 && view.t < 0.72 && Math.floor(view.t * 12) % 2 === 0;
  if (!blink) {
    const pose = view.anim === "hit" ? "hit" : striking ? "attack" : "idle";
    drawNinja(ctx, 28, 42, view.hero, "right", pose, 0, 2);
  }

  if (view.anim === "pyth") {
    const segments = 9;
    const headIndex = Math.min(segments, Math.floor(view.t * (segments + 1)));
    const p = headIndex / segments;
    const x = 62 + (168 - 62) * p;
    const y = 88 + (58 - 88) * p + Math.sin(p * 7 + view.t * 8) * 4;
    blit(ctx, "/console/quest/bosses/snake.png", 48, 0, 16, 16, x, y, 2);
  }
}
