import type { SectionId } from "../modules";
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
  "WGTTGGHHGGGHHGGGTTGW",
  "WGTGGPPPPPPPPPPGGGGW",
  "WTTGGPPGGGGGGPPGGTTW",
  "WWWWWPP====PPWWWWWWW",
  "WGGGPPGGGGGGPPGGGGGW",
  "WGGGPPGGGGGGPPGHHGGW",
  "WTTGPPGGHHGGPPGGGGGW",
  "WGGGGGGGGGGGGGGGGGGW",
  "WGGHHGGGGGGGGGGGGGGW",
  "WGGGGGGGGGGGGGGGGGGW",
  "WGGGGTTGHHGGGGTTGGGW",
  "WGGGGGGGGGGGGGGGGGGW",
  "WGGGGGGGGGGGGGGGGGGW",
  "WWWWWWWWWWWWWWWWWWWW",
];

export const START = { x: 11, y: 12 };
export const CHEST = { x: 14, y: 8 };

export const bossSpots: { id: BossId; x: number; y: number }[] = [
  { id: "drake", x: 9, y: 3 },
  { id: "wurm", x: 17, y: 9 },
  { id: "wraith", x: 3, y: 8 },
  { id: "golem", x: 17, y: 13 },
];

export type LandmarkKind = "guide" | "school" | "shrine" | "workshop" | "grove" | "shop";

export type Landmark = {
  id: SectionId;
  kind: LandmarkKind;
  tiles: { x: number; y: number }[];
};

export const landmarks: Landmark[] = [
  { id: "about", kind: "guide", tiles: [{ x: 8, y: 12 }, { x: 9, y: 12 }] },
  { id: "education", kind: "school", tiles: [{ x: 3, y: 10 }, { x: 4, y: 10 }] },
  { id: "certs", kind: "shrine", tiles: [{ x: 6, y: 2 }, { x: 7, y: 2 }] },
  { id: "projects", kind: "workshop", tiles: [{ x: 8, y: 8 }, { x: 9, y: 8 }] },
  { id: "skills", kind: "grove", tiles: [{ x: 11, y: 2 }, { x: 12, y: 2 }] },
  { id: "work", kind: "shop", tiles: [{ x: 15, y: 7 }, { x: 16, y: 7 }] },
];

export function landmarkAt(x: number, y: number) {
  return landmarks.find((place) => place.tiles.some((tile) => tile.x === x && tile.y === y)) ?? null;
}

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

for (const place of landmarks) {
  for (const tile of place.tiles) {
    if (tileAt(tile.x, tile.y) !== "H") {
      throw new Error(`${place.kind} is not on a building`);
    }
    if (bossSpots.some((boss) => boss.x === tile.x && boss.y === tile.y)) {
      throw new Error(`${place.kind} overlaps a boss`);
    }
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
