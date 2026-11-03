export type Point = { x: number; y: number };

const DIRS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function key(point: Point) {
  return `${point.x},${point.y}`;
}

function dist2(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function route(walkable: (x: number, y: number) => boolean, start: Point, goal: Point): Point[] {
  if (!walkable(start.x, start.y)) return [];

  const queue: Point[] = [start];
  const prev = new Map<string, Point | null>();
  prev.set(key(start), null);
  let best = start;
  let bestDist = dist2(start, goal);

  while (queue.length) {
    const current = queue.shift();
    if (!current) break;
    const distance = dist2(current, goal);
    if (distance < bestDist) {
      best = current;
      bestDist = distance;
    }
    if (current.x === goal.x && current.y === goal.y) break;

    for (const dir of DIRS) {
      const next = { x: current.x + dir.x, y: current.y + dir.y };
      const id = key(next);
      if (prev.has(id) || !walkable(next.x, next.y)) continue;
      prev.set(id, current);
      queue.push(next);
    }
  }

  if (best.x === start.x && best.y === start.y) return [];

  const path: Point[] = [];
  let cursor: Point | null = best;
  while (cursor && !(cursor.x === start.x && cursor.y === start.y)) {
    path.push(cursor);
    cursor = prev.get(key(cursor)) ?? null;
  }
  path.reverse();
  return path;
}
