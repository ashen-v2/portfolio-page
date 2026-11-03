import type { BossId } from "./story";

export const TILE = 16;
export const VIEW_COLS = 15;
export const VIEW_ROWS = 11;
export const VIEW_W = TILE * VIEW_COLS;
export const VIEW_H = TILE * VIEW_ROWS;
export const MAP_W = 20;
export const MAP_H = 16;

export type Tile = "G" | "P" | "W" | "=" | "T" | "H";

export const MAP_ROWS = [
  "WWWWWWWWWWWWWWWWWWWW",
  "WTTGGGGGGGGGGGGGTTGW",
  "WGGGGGGGGGGGGGGGGGGW",
  "WGGGGPPPPPPPPPPGGGGW",
  "WTTGGPPGGGGGGPPGGTTW",
  "WWWWWPP====PPWWWWWWW",
  "WGGGPPGGGGGGPPGGGGGW",
  "WGGGPPGGGGGGPPGHHGGW",
  "WTTGPPGGGGGGPPGGTTGW",
  "WGGGGGGGGGGGGGGGGGGW",
  "WGGHHGGGGGGGGGGGGGGW",
  "WGGGGGGGGGGGGGGGGGGW",
  "WGGGGTTGGGGGGGTTGGGW",
  "WGGGGGGGGGGHHGGGGGGW",
  "WGGGGGGGGGGGGGGGGGGW",
  "WWWWWWWWWWWWWWWWWWWW",
];

export const START = { x: 10, y: 14 };

export const bossSpots: { id: BossId; x: number; y: number }[] = [
  { id: "drake", x: 9, y: 3 },
  { id: "wurm", x: 17, y: 9 },
  { id: "wraith", x: 3, y: 8 },
  { id: "golem", x: 14, y: 13 },
];

if (MAP_ROWS.length !== MAP_H || MAP_ROWS.some((row) => row.length !== MAP_W)) {
  throw new Error("Quest map is not 20 by 16");
}

export function tileAt(x: number, y: number): Tile | null {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return null;
  return MAP_ROWS[y][x] as Tile;
}

export function terrainWalkable(x: number, y: number) {
  const tile = tileAt(x, y);
  return tile === "G" || tile === "P" || tile === "=";
}

for (const boss of bossSpots) {
  if (!terrainWalkable(boss.x, boss.y)) {
    throw new Error(`Boss ${boss.id} is not on open ground`);
  }
}

if (!terrainWalkable(START.x, START.y)) {
  throw new Error("Quest start is not on open ground");
}

export function camera(px: number, py: number) {
  const maxX = Math.max(0, MAP_W - VIEW_COLS);
  const maxY = Math.max(0, MAP_H - VIEW_ROWS);
  return {
    x: Math.max(0, Math.min(maxX, px - Math.floor(VIEW_COLS / 2))),
    y: Math.max(0, Math.min(maxY, py - Math.floor(VIEW_ROWS / 2))),
  };
}
