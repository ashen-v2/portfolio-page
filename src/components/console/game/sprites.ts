import { TILE, VIEW_COLS, VIEW_H, VIEW_ROWS, VIEW_W, camera, landmarkAt, landmarks, tileAt } from "./map";
import type { BossId, Dir, HeroId } from "./story";

export type AttackAnim = "none" | HeroId | "hit";

type Facing = Dir;

type FieldBoss = { id: BossId; x: number; y: number };

export type FieldView = {
  hero: HeroId;
  x: number;
  y: number;
  facing: Dir;
  bob: boolean;
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

const SKIN = "#f3c7a2";
const INK = "#1a2140";
const GOLD = "#ffe14a";
const BLUE = "#3d66e6";
const CYAN = "#7ad0ff";
const RED = "#e23b4a";
const BROWN = "#8a5420";
const TAN = "#c99216";
const GREEN = "#2fbe4a";
const LEAF = "#1f7a32";
const MINT = "#7ad86a";
const WHITE = "#fff8e8";
const GRAY = "#8d97a8";
const STONE = "#5c6574";
const PURPLE = "#8d3ad6";
const HOOD = "#5a248f";

function box(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  scale: number,
  col: number,
  row: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(originX + col * scale, originY + row * scale, w * scale, h * scale);
}

function drawGrass(ctx: CanvasRenderingContext2D, x: number, y: number, gx: number, gy: number) {
  ctx.fillStyle = "#3cba52";
  ctx.fillRect(x, y, TILE, TILE);
  const n = Math.abs(gx * 13 + gy * 7);
  ctx.fillStyle = "#2d9440";
  ctx.fillRect(x + (n % 8), y + ((n * 3) % 10), 2, 2);
  ctx.fillStyle = n % 2 === 0 ? MINT : "#218038";
  ctx.fillRect(x + ((n * 5) % 13), y + 11, 1, 3);
}

function drawWater(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.fillStyle = "#1d4eb8";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#3d66e6";
  ctx.fillRect(x, y, TILE, 2);
  ctx.fillStyle = CYAN;
  const shift = frame ? 5 : 0;
  ctx.fillRect(x + ((2 + shift) % 14), y + 5, 6, 2);
  ctx.fillRect(x + ((8 + shift) % 12), y + 11, 5, 2);
}

function drawPath(ctx: CanvasRenderingContext2D, x: number, y: number, gx: number, gy: number) {
  ctx.fillStyle = "#d2a15a";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#b4833e";
  ctx.fillRect(x + (gx % 4) * 3, y + (gy % 3) * 4 + 2, 2, 2);
}

function drawBridge(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#1d4eb8";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = BROWN;
  ctx.fillRect(x, y + 2, TILE, 12);
  ctx.fillStyle = TAN;
  ctx.fillRect(x + 1, y + 3, 14, 10);
  ctx.fillStyle = "#5c3a16";
  for (let i = 0; i < 4; i += 1) ctx.fillRect(x, y + 3 + i * 3, TILE, 1);
  ctx.fillRect(x, y + 2, 2, 12);
  ctx.fillRect(x + 14, y + 2, 2, 12);
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#145c28";
  ctx.fillRect(x - 1, y - 11, 18, 13);
  ctx.fillStyle = LEAF;
  ctx.fillRect(x + 1, y - 9, 14, 10);
  ctx.fillStyle = GREEN;
  ctx.fillRect(x + 3, y - 7, 9, 6);
  ctx.fillStyle = MINT;
  ctx.fillRect(x + 4, y - 6, 3, 2);
  ctx.fillStyle = "#6b3a16";
  ctx.fillRect(x + 6, y + 1, 4, 14);
  ctx.fillStyle = BROWN;
  ctx.fillRect(x + 7, y + 2, 2, 12);
}

function drawHouse(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = RED;
  ctx.fillRect(x + 1, y - 5, 14, 5);
  ctx.fillStyle = "#b42332";
  ctx.fillRect(x + 1, y - 2, 14, 2);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + 2, y, 12, 14);
  ctx.fillStyle = CYAN;
  ctx.fillRect(x + 4, y + 3, 3, 3);
  ctx.fillRect(x + 9, y + 3, 3, 3);
  ctx.fillStyle = BROWN;
  ctx.fillRect(x + 6, y + 8, 4, 6);
  ctx.fillStyle = TAN;
  ctx.fillRect(x + 2, y + 13, 12, 1);
}

function drawPlaceMark(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = CYAN;
  ctx.fillRect(x + 5, y - 5, 6, 2);
}

function drawSchool(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = BROWN;
  ctx.fillRect(x + 4, y - 14, 2, 8);
  ctx.fillStyle = RED;
  ctx.fillRect(x + 6, y - 14, 6, 3);
  ctx.fillStyle = BLUE;
  ctx.fillRect(x + 1, y - 6, 30, 6);
  ctx.fillStyle = "#1736a8";
  ctx.fillRect(x + 1, y - 2, 30, 2);
  ctx.fillStyle = WHITE;
  ctx.fillRect(x + 2, y, 28, 14);
  ctx.fillStyle = CYAN;
  ctx.fillRect(x + 5, y + 3, 4, 4);
  ctx.fillRect(x + 23, y + 3, 4, 4);
  ctx.fillStyle = BROWN;
  ctx.fillRect(x + 13, y + 6, 6, 8);
  drawPlaceMark(ctx, x + 12, y - 8);
}

function drawShop(ctx: CanvasRenderingContext2D, x: number, y: number) {
  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? RED : WHITE;
    ctx.fillRect(x + i * 4, y - 7, 4, 6);
  }
  ctx.fillStyle = TAN;
  ctx.fillRect(x + 2, y, 28, 14);
  ctx.fillStyle = "#14301c";
  ctx.fillRect(x + 4, y + 3, 12, 7);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + 6, y + 5, 8, 2);
  ctx.fillStyle = BROWN;
  ctx.fillRect(x + 20, y + 5, 6, 9);
  drawPlaceMark(ctx, x + 12, y - 10);
}

function drawWorkshop(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = STONE;
  ctx.fillRect(x + 1, y - 5, 30, 5);
  ctx.fillStyle = GRAY;
  ctx.fillRect(x + 2, y, 28, 14);
  ctx.fillStyle = INK;
  ctx.fillRect(x + 4, y + 4, 16, 10);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + 6, y + 6, 7, 2);
  ctx.fillStyle = RED;
  ctx.fillRect(x + 14, y + 8, 2, 4);
  ctx.fillStyle = BROWN;
  ctx.fillRect(x + 22, y + 6, 5, 8);
  drawPlaceMark(ctx, x + 12, y - 8);
}

function drawGuide(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = INK;
  ctx.fillRect(x + 5, y + 1, 6, 2);
  ctx.fillStyle = SKIN;
  ctx.fillRect(x + 5, y + 2, 6, 4);
  ctx.fillStyle = INK;
  ctx.fillRect(x + 6, y + 4, 1, 1);
  ctx.fillRect(x + 9, y + 4, 1, 1);
  ctx.fillStyle = WHITE;
  ctx.fillRect(x + 4, y + 6, 8, 6);
  ctx.fillStyle = CYAN;
  ctx.fillRect(x + 6, y + 7, 4, 2);
  ctx.fillStyle = INK;
  ctx.fillRect(x + 5, y + 12, 2, 3);
  ctx.fillRect(x + 9, y + 12, 2, 3);
  drawPlaceMark(ctx, x, y);
}

function drawShrine(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = GRAY;
  ctx.fillRect(x + 2, y + 1, 12, 3);
  ctx.fillRect(x + 3, y + 4, 10, 9);
  ctx.fillRect(x + 1, y + 13, 14, 2);
  ctx.fillStyle = STONE;
  ctx.fillRect(x + 4, y + 5, 8, 7);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + 6, y + 6, 4, 4);
  ctx.fillStyle = RED;
  ctx.fillRect(x + 7, y + 7, 2, 2);
  drawPlaceMark(ctx, x, y - 2);
}

function drawGroveSign(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = BROWN;
  ctx.fillRect(x + 7, y + 7, 2, 8);
  ctx.fillStyle = TAN;
  ctx.fillRect(x + 3, y + 2, 10, 7);
  ctx.fillStyle = MINT;
  ctx.fillRect(x + 5, y + 4, 6, 2);
  drawPlaceMark(ctx, x, y - 2);
}

function paintHero(ctx: CanvasRenderingContext2D, id: HeroId, facing: "down" | "up" | "side", scale: number) {
  const cloth = id === "terra" ? CYAN : id === "pyth" ? GOLD : BLUE;
  const hair = id === "terra" ? GOLD : id === "helm" ? WHITE : INK;
  const side = facing === "side";
  const back = facing === "up";

  if (id === "terra") {
    box(ctx, 0, 0, scale, side ? 6 : 4, 0, side ? 6 : 8, 2, WHITE);
    box(ctx, 0, 0, scale, side ? 7 : 5, 0, side ? 4 : 6, 1, CYAN);
  }

  if (id === "helm" && !side) {
    box(ctx, 0, 0, scale, 5, 0, 6, 3, WHITE);
    box(ctx, 0, 0, scale, 6, 2, 4, 2, back ? WHITE : BLUE);
  } else if (id === "helm" && side) {
    box(ctx, 0, 0, scale, 7, 0, 6, 3, WHITE);
    box(ctx, 0, 0, scale, 10, 2, 3, 2, BLUE);
  }

  if (id !== "helm") {
    box(ctx, 0, 0, scale, side ? 7 : 5, 1, side ? 5 : 6, back ? 5 : 2, hair);
    if (!back) box(ctx, 0, 0, scale, side ? 8 : 5, 2, side ? 5 : 6, 4, SKIN);
  } else if (!back) {
    box(ctx, 0, 0, scale, side ? 8 : 5, 3, side ? 5 : 6, 3, SKIN);
  } else {
    box(ctx, 0, 0, scale, 5, 1, 6, 5, WHITE);
  }

  if (!back) {
    const eye = side ? 11 : 6;
    box(ctx, 0, 0, scale, eye, 4, 1, 1, INK);
    if (!side) box(ctx, 0, 0, scale, 9, 4, 1, 1, INK);
  }

  box(ctx, 0, 0, scale, side ? 6 : 4, 6, side ? 6 : 8, 5, cloth);

  if (id === "dock") {
    const crateCol = side ? 3 : back ? 6 : 1;
    box(ctx, 0, 0, scale, crateCol, 5, 3, 4, BROWN);
    box(ctx, 0, 0, scale, crateCol + 1, 6, 1, 2, TAN);
  }

  if (id === "pyth") {
    const snakeCol = side ? 12 : 0;
    box(ctx, 0, 0, scale, snakeCol, 5, side ? 4 : 4, 2, LEAF);
    box(ctx, 0, 0, scale, side ? 14 : 0, 4, 2, 2, GREEN);
    box(ctx, 0, 0, scale, side ? 15 : 0, 4, 1, 1, RED);
  }

  if (id === "helm") {
    box(ctx, 0, 0, scale, side ? 8 : 6, 7, 4, 1, GOLD);
    box(ctx, 0, 0, scale, side ? 9 : 7, 6, 2, 3, GOLD);
  }

  if (id === "terra") box(ctx, 0, 0, scale, side ? 7 : 6, 8, side ? 3 : 4, 1, GOLD);

  const leg = back ? hair : INK;
  if (side) {
    box(ctx, 0, 0, scale, 7, 11, 2, 3, leg);
    box(ctx, 0, 0, scale, 10, 11, 2, 3, leg);
  } else {
    box(ctx, 0, 0, scale, 5, 11, 2, 3, leg);
    box(ctx, 0, 0, scale, 9, 11, 2, 3, leg);
  }
}

export function drawHero(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  id: HeroId,
  facing: Facing,
  scale: number,
) {
  ctx.save();
  ctx.translate(x, y);
  if (facing === "left") {
    ctx.translate(16 * scale, 0);
    ctx.scale(-1, 1);
    paintHero(ctx, id, "side", scale);
  } else if (facing === "right") {
    paintHero(ctx, id, "side", scale);
  } else {
    paintHero(ctx, id, facing, scale);
  }
  ctx.restore();
}

function paintBoss(ctx: CanvasRenderingContext2D, id: BossId, scale: number) {
  if (id === "drake") {
    box(ctx, 0, 0, scale, 0, 4, 4, 6, RED);
    box(ctx, 0, 0, scale, 12, 4, 4, 6, "#b42332");
    box(ctx, 0, 0, scale, 3, 3, 10, 8, RED);
    box(ctx, 0, 0, scale, 5, 6, 6, 4, GOLD);
    box(ctx, 0, 0, scale, 6, 1, 4, 3, GOLD);
    box(ctx, 0, 0, scale, 5, 5, 2, 2, WHITE);
    box(ctx, 0, 0, scale, 9, 5, 2, 2, WHITE);
    box(ctx, 0, 0, scale, 6, 6, 1, 1, INK);
    box(ctx, 0, 0, scale, 10, 6, 1, 1, INK);
    box(ctx, 0, 0, scale, 7, 11, 2, 4, RED);
    return;
  }

  if (id === "wurm") {
    box(ctx, 0, 0, scale, 4, 0, 8, 3, LEAF);
    box(ctx, 0, 0, scale, 3, 3, 10, 3, GREEN);
    box(ctx, 0, 0, scale, 5, 6, 6, 3, LEAF);
    box(ctx, 0, 0, scale, 3, 9, 10, 3, GREEN);
    box(ctx, 0, 0, scale, 5, 12, 6, 3, LEAF);
    box(ctx, 0, 0, scale, 5, 1, 2, 2, GOLD);
    box(ctx, 0, 0, scale, 9, 1, 2, 2, GOLD);
    box(ctx, 0, 0, scale, 6, 2, 1, 1, INK);
    box(ctx, 0, 0, scale, 10, 2, 1, 1, INK);
    return;
  }

  if (id === "wraith") {
    box(ctx, 0, 0, scale, 4, 0, 8, 5, HOOD);
    box(ctx, 0, 0, scale, 2, 4, 12, 8, PURPLE);
    box(ctx, 0, 0, scale, 1, 8, 3, 6, HOOD);
    box(ctx, 0, 0, scale, 12, 8, 3, 6, HOOD);
    box(ctx, 0, 0, scale, 4, 13, 3, 3, PURPLE);
    box(ctx, 0, 0, scale, 9, 13, 3, 3, PURPLE);
    box(ctx, 0, 0, scale, 5, 5, 2, 2, CYAN);
    box(ctx, 0, 0, scale, 9, 5, 2, 2, CYAN);
    box(ctx, 0, 0, scale, 5, 6, 1, 1, WHITE);
    box(ctx, 0, 0, scale, 9, 6, 1, 1, WHITE);
    return;
  }

  box(ctx, 0, 0, scale, 4, 1, 8, 4, GRAY);
  box(ctx, 0, 0, scale, 5, 2, 2, 2, GOLD);
  box(ctx, 0, 0, scale, 9, 2, 2, 2, GOLD);
  box(ctx, 0, 0, scale, 2, 6, 12, 6, STONE);
  box(ctx, 0, 0, scale, 7, 7, 2, 4, GOLD);
  box(ctx, 0, 0, scale, 0, 7, 2, 5, GRAY);
  box(ctx, 0, 0, scale, 14, 7, 2, 5, GRAY);
  box(ctx, 0, 0, scale, 4, 12, 3, 3, STONE);
  box(ctx, 0, 0, scale, 9, 12, 3, 3, STONE);
}

function drawBoss(ctx: CanvasRenderingContext2D, x: number, y: number, id: BossId, scale: number, flip: boolean) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) {
    ctx.translate(16 * scale, 0);
    ctx.scale(-1, 1);
  }
  paintBoss(ctx, id, scale);
  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, frame: number) {
  for (let y = 0; y < VIEW_ROWS; y += 1) {
    for (let x = 0; x < VIEW_COLS; x += 1) {
      const px = x * TILE;
      const py = y * TILE;
      if (y === 6) {
        if (x >= 6 && x <= 8) drawBridge(ctx, px, py);
        else drawWater(ctx, px, py, frame);
      } else {
        drawGrass(ctx, px, py, x, y);
      }
    }
  }
  drawTree(ctx, 2 * TILE, 2 * TILE);
  drawTree(ctx, 12 * TILE, 3 * TILE);
  drawHouse(ctx, 9 * TILE, 8 * TILE);
}

export function drawIntro(ctx: CanvasRenderingContext2D, frame: number) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  drawGround(ctx, frame);
}

export function drawSelect(ctx: CanvasRenderingContext2D, frame: number) {
  drawIntro(ctx, frame);
  const ids: HeroId[] = ["dock", "terra", "pyth", "helm"];
  ids.forEach((id, index) => {
    drawHero(ctx, 22 + index * 56, 28, id, "down", 2);
  });
}

function drawMarker(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.fillStyle = frame ? WHITE : GOLD;
  ctx.fillRect(x + 2, y + 2, 3, 3);
  ctx.fillRect(x + 11, y + 2, 3, 3);
  ctx.fillRect(x + 2, y + 11, 3, 3);
  ctx.fillRect(x + 11, y + 11, 3, 3);
}

export function drawField(ctx: CanvasRenderingContext2D, view: FieldView) {
  const cam = camera(view.x, view.y);
  ctx.fillStyle = "#14386a";
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  for (let ty = 0; ty < VIEW_ROWS; ty += 1) {
    for (let tx = 0; tx < VIEW_COLS; tx += 1) {
      const gx = cam.x + tx;
      const gy = cam.y + ty;
      const tile = tileAt(gx, gy);
      const px = tx * TILE;
      const py = ty * TILE;
      if (tile === "W") drawWater(ctx, px, py, view.frame);
      else if (tile === "=") drawBridge(ctx, px, py);
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
      if (tile === "T") stamps.push({ y: gy, draw: () => drawTree(ctx, px, py) });
      if (tile === "H") {
        const place = landmarkAt(gx, gy);
        const door = place?.tiles[0];
        if (place && door && door.x === gx && door.y === gy) {
          stamps.push({
            y: gy,
            draw: () => {
              if (place.kind === "school") drawSchool(ctx, px, py);
              else if (place.kind === "shop") drawShop(ctx, px, py);
              else drawWorkshop(ctx, px, py);
            },
          });
        } else if (!place) {
          stamps.push({ y: gy, draw: () => drawHouse(ctx, px, py) });
        }
      }
    }
  }

  for (const place of landmarks) {
    if (place.kind !== "guide" && place.kind !== "shrine" && place.kind !== "grove") continue;
    const tile = place.tiles[0];
    const px = (tile.x - cam.x) * TILE;
    const py = (tile.y - cam.y) * TILE;
    stamps.push({
      y: tile.y,
      draw: () => {
        if (place.kind === "guide") drawGuide(ctx, px, py);
        else if (place.kind === "shrine") drawShrine(ctx, px, py);
        else drawGroveSign(ctx, px, py);
      },
    });
  }

  for (const boss of view.bosses) {
    const px = (boss.x - cam.x) * TILE;
    const py = (boss.y - cam.y) * TILE;
    stamps.push({
      y: boss.y,
      draw: () => {
        ctx.fillStyle = RED;
        ctx.fillRect(px + 5, py - 4, 6, 2);
        drawBoss(ctx, px, py, boss.id, 1, false);
      },
    });
  }

  stamps.push({
    y: view.y + 0.1,
    draw: () => {
      const hy = (view.y - cam.y) * TILE + (view.bob ? -1 : 0);
      drawHero(ctx, (view.x - cam.x) * TILE, hy, view.hero, view.facing, 1);
    },
  });

  stamps.sort((a, b) => a.y - b.y);
  for (const stamp of stamps) stamp.draw();
}

function drawCrate(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = BROWN;
  ctx.fillRect(x, y, 14, 12);
  ctx.fillStyle = TAN;
  ctx.fillRect(x + 2, y + 2, 10, 8);
  ctx.fillStyle = "#5c3a16";
  ctx.fillRect(x, y + 5, 14, 2);
  ctx.fillRect(x + 6, y, 2, 12);
}

function drawRack(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  ctx.fillStyle = INK;
  ctx.fillRect(x, y, 18, h);
  ctx.fillStyle = CYAN;
  for (let i = 2; i < h - 2; i += 4) ctx.fillRect(x + 2, y + i, 14, 2);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + 14, y + 2, 2, 2);
}

function drawPod(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#d7ecff";
  ctx.fillRect(x, y, 8, 6);
  ctx.fillStyle = BLUE;
  ctx.fillRect(x + 1, y + 1, 6, 2);
  ctx.fillStyle = GOLD;
  ctx.fillRect(x + 3, y + 3, 2, 2);
}

export function drawBattle(ctx: CanvasRenderingContext2D, view: BattleView) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = "#79c8f2";
  ctx.fillRect(0, 0, VIEW_W, 78);
  ctx.fillStyle = "#c9e8ff";
  ctx.fillRect(0, 70, VIEW_W, 8);
  ctx.fillStyle = "#3cba52";
  ctx.fillRect(0, 78, VIEW_W, VIEW_H - 78);
  ctx.fillStyle = LEAF;
  for (let x = 0; x < VIEW_W; x += 10) ctx.fillRect(x, 96, 4, 2);

  const heroScale = 2;
  const bossScale = 3;
  const bossHit = view.anim !== "none" && view.anim !== "hit" && view.t > 0.72;
  const shake = bossHit && Math.floor(view.t * 28) % 2 === 0 ? 2 : 0;
  const lunge = view.anim === "hit" ? Math.sin(view.t * Math.PI) * 16 : 0;
  const bossX = 150 - lunge + shake;
  const bossY = 34;
  const heroX = 28;
  const heroY = 62;

  if (view.anim === "terra") {
    const grow = Math.min(1, view.t / 0.62);
    const rackH = 6 + Math.floor(grow * 40);
    drawRack(ctx, 158, 96 - rackH, rackH);
  }

  drawBoss(ctx, bossX, bossY, view.boss, bossScale, true);

  if (view.anim === "dock") {
    if (view.t < 0.8) {
      const drop = view.t / 0.8;
      drawCrate(ctx, 176, 4 + drop * drop * 46);
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
      ctx.fillStyle = TAN;
      for (const [dx, dy] of bits) {
        ctx.fillRect(184 + dx * burst, 52 + dy * burst, 3, 3);
      }
    }
  }

  if (view.anim === "terra" && view.t > 0.4) {
    for (let i = 0; i < 7; i += 1) {
      const ang = i * 0.9 + view.t * 9;
      const rad = 6 + (view.t - 0.4) * 36;
      ctx.fillStyle = i % 2 === 0 ? GOLD : CYAN;
      ctx.fillRect(184 + Math.cos(ang) * rad, 58 + Math.sin(ang) * rad, 2, 2);
    }
  }

  if (view.anim === "helm") {
    for (let i = 0; i < 3; i += 1) {
      const ang = (Math.PI * 2 * i) / 3 + view.t * Math.PI * 4;
      const rad = 32 * (1 - view.t * 0.84);
      drawPod(ctx, 186 + Math.cos(ang) * rad, 62 + Math.sin(ang) * rad * 0.66);
    }
  }

  const blink = view.anim === "hit" && view.t > 0.12 && view.t < 0.72 && Math.floor(view.t * 12) % 2 === 0;
  if (!blink) drawHero(ctx, heroX, heroY, view.hero, "right", heroScale);

  if (view.anim === "pyth") {
    const segments = 9;
    const headIndex = Math.min(segments, Math.floor(view.t * (segments + 1)));
    for (let i = 0; i <= headIndex; i += 1) {
      const p = i / segments;
      const x = 62 + (168 - 62) * p;
      const y = 88 + (58 - 88) * p + Math.sin(p * 7 + view.t * 8) * 4;
      const head = i === headIndex;
      ctx.fillStyle = head ? RED : LEAF;
      ctx.fillRect(x, y, head ? 8 : 6, head ? 5 : 4);
      if (head) {
        ctx.fillStyle = GOLD;
        ctx.fillRect(x + 5, y, 2, 2);
        ctx.fillStyle = RED;
        ctx.fillRect(x + 7, y + 2, 3, 1);
      }
    }
  }
}
