import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { START, TILE, VIEW_H, VIEW_W, bossSpots, camera, terrainWalkable } from "./map";
import { route, type Point } from "./path";
import { drawBattle, drawField, drawIntro, drawSelect, type AttackAnim } from "./sprites";
import {
  bossById,
  bosses,
  ending,
  heroById,
  heroes,
  isBossId,
  isHeroId,
  opening,
  type BossId,
  type Dir,
  type HeroId,
} from "./story";

const STORAGE_KEY = "console-quest";
const HERO_HP = 24;
const HERO_ATK = 10;
const BOSS_HP = 18;
const BOSS_ATK = 4;

type Mode = "intro" | "select" | "field" | "battle" | "story";
type Phase = "menu" | "busy";

type SaveData = {
  hero: HeroId;
  x: number;
  y: number;
  facing: Dir;
  defeated: BossId[];
};

type World = {
  mode: Mode;
  pages: string[];
  page: number;
  hero: HeroId | null;
  x: number;
  y: number;
  facing: Dir;
  bob: boolean;
  path: Point[];
  goal: Point | null;
  pendingBoss: BossId | null;
  defeated: BossId[];
  heroHp: number;
  bossHp: number;
  bossId: BossId | null;
  message: string;
  phase: Phase;
  anim: AttackAnim;
  animStart: number;
  animDur: number;
  stepAcc: number;
};

type Ui = {
  mode: Mode;
  pages: string[];
  page: number;
  hero: HeroId | null;
  heroHp: number;
  bossHp: number;
  bossId: BossId | null;
  message: string;
  phase: Phase;
};

function isDir(value: string): value is Dir {
  return value === "up" || value === "down" || value === "left" || value === "right";
}

function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<SaveData>;
    if (!data || typeof data.hero !== "string" || !isHeroId(data.hero)) return null;
    if (typeof data.x !== "number" || typeof data.y !== "number") return null;
    if (!Number.isInteger(data.x) || !Number.isInteger(data.y)) return null;
    if (!terrainWalkable(data.x, data.y)) return null;
    if (typeof data.facing !== "string" || !isDir(data.facing)) return null;
    const defeated = Array.isArray(data.defeated)
      ? data.defeated.filter((id): id is BossId => typeof id === "string" && isBossId(id))
      : [];
    return { hero: data.hero, x: data.x, y: data.y, facing: data.facing, defeated };
  } catch {
    return null;
  }
}

function saveWorld(world: World) {
  if (!world.hero) return;
  const data: SaveData = {
    hero: world.hero,
    x: world.x,
    y: world.y,
    facing: world.facing,
    defeated: world.defeated,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* keep progress for this visit */
  }
}

function clearSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* the visit can still start over */
  }
}

function freshWorld(): World {
  const saved = loadSave();
  if (saved) {
    return {
      mode: "field",
      pages: [],
      page: 0,
      hero: saved.hero,
      x: saved.x,
      y: saved.y,
      facing: saved.facing,
      bob: false,
      path: [],
      goal: null,
      pendingBoss: null,
      defeated: saved.defeated,
      heroHp: HERO_HP,
      bossHp: BOSS_HP,
      bossId: null,
      message: "",
      phase: "menu",
      anim: "none",
      animStart: 0,
      animDur: 1,
      stepAcc: 0,
    };
  }
  return {
    mode: "intro",
    pages: opening,
    page: 0,
    hero: null,
    x: START.x,
    y: START.y,
    facing: "up",
    bob: false,
    path: [],
    goal: null,
    pendingBoss: null,
    defeated: [],
    heroHp: HERO_HP,
    bossHp: BOSS_HP,
    bossId: null,
    message: "",
    phase: "menu",
    anim: "none",
    animStart: 0,
    animDur: 1,
    stepAcc: 0,
  };
}

function snapshot(world: World): Ui {
  return {
    mode: world.mode,
    pages: world.pages,
    page: world.page,
    hero: world.hero,
    heroHp: world.heroHp,
    bossHp: world.bossHp,
    bossId: world.bossId,
    message: world.message,
    phase: world.phase,
  };
}

function livingBossAt(world: World, camX: number, camY: number, px: number, py: number) {
  const pad = 5;
  for (const spot of bossSpots) {
    if (world.defeated.includes(spot.id)) continue;
    const left = (spot.x - camX) * TILE - pad;
    const top = (spot.y - camY) * TILE - pad;
    if (px >= left && px < left + TILE + pad * 2 && py >= top && py < top + TILE + pad * 2) return spot;
  }
  return null;
}

function canWalk(world: World, x: number, y: number) {
  if (!terrainWalkable(x, y)) return false;
  return !bossSpots.some((boss) => boss.x === x && boss.y === y && !world.defeated.includes(boss.id));
}

function facingOf(x: number, y: number, nx: number, ny: number): Dir {
  if (nx > x) return "right";
  if (nx < x) return "left";
  if (ny < y) return "up";
  return "down";
}

function advanceWalk(world: World, dt: number, reduce: boolean): BossId | null {
  if (!world.path.length) return null;
  world.stepAcc += dt;
  const stepMs = reduce ? 45 : 180;
  let guard = 0;
  while (world.path.length && world.stepAcc >= stepMs && guard < 4) {
    world.stepAcc -= stepMs;
    guard += 1;
    const next = world.path.shift();
    if (!next) return null;
    world.facing = facingOf(world.x, world.y, next.x, next.y);
    world.x = next.x;
    world.y = next.y;
    world.bob = !world.bob;
    if (!world.path.length && world.pendingBoss) {
      const id = world.pendingBoss;
      world.pendingBoss = null;
      world.goal = null;
      saveWorld(world);
      return id;
    }
  }
  if (guard > 0) saveWorld(world);
  return null;
}

function paint(ctx: CanvasRenderingContext2D, world: World, now: number) {
  ctx.imageSmoothingEnabled = false;
  const frame = Math.floor(now / 450) % 2;
  if (world.mode === "battle" && world.hero && world.bossId) {
    const t =
      world.anim === "none" ? 0 : Math.max(0, Math.min(1, (now - world.animStart) / world.animDur));
    drawBattle(ctx, { hero: world.hero, boss: world.bossId, anim: world.anim, t, frame });
    return;
  }
  if (world.mode === "select") {
    drawSelect(ctx, frame);
    return;
  }
  if (world.mode === "intro" || !world.hero) {
    drawIntro(ctx, frame);
    return;
  }
  drawField(ctx, {
    hero: world.hero,
    x: world.x,
    y: world.y,
    facing: world.facing,
    bob: world.bob,
    frame,
    bosses: bossSpots.filter((boss) => !world.defeated.includes(boss.id)),
    goal: world.path.length ? world.goal : null,
  });
}

export function Quest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const world = useRef<World | null>(null);
  if (world.current === null) world.current = freshWorld();
  const game = world.current;
  const [ui, setUi] = useState<Ui>(() => snapshot(game));
  const [showHint, setShowHint] = useState(() => game.mode === "intro" || game.mode === "select");
  const timers = useRef<number[]>([]);
  const reduceRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const arriveRef = useRef<(id: BossId) => void>(() => {});

  function publish() {
    if (!world.current) return;
    setUi(snapshot(world.current));
  }

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }

  function later(ms: number, fn: () => void) {
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((item) => item !== id);
      fn();
    }, ms);
    timers.current.push(id);
  }

  function startBattle(id: BossId) {
    const current = world.current;
    if (!current) return;
    clearTimers();
    current.mode = "battle";
    current.bossId = id;
    current.bossHp = BOSS_HP;
    current.heroHp = HERO_HP;
    current.phase = "menu";
    current.anim = "none";
    current.path = [];
    current.goal = null;
    current.pendingBoss = null;
    current.message = `${bossById(id).name} draws near.`;
    publish();
  }

  arriveRef.current = startBattle;

  function continueText() {
    const current = world.current;
    if (!current) return;
    if (current.mode !== "intro" && current.mode !== "story") return;
    if (current.page + 1 < current.pages.length) {
      current.page += 1;
      publish();
      return;
    }
    if (current.mode === "intro") {
      current.mode = "select";
      publish();
      return;
    }
    current.mode = "field";
    current.heroHp = HERO_HP;
    saveWorld(current);
    publish();
  }

  function choose(id: HeroId) {
    const current = world.current;
    if (!current) return;
    current.hero = id;
    current.x = START.x;
    current.y = START.y;
    current.facing = "up";
    current.defeated = [];
    current.path = [];
    current.goal = null;
    current.pendingBoss = null;
    current.bob = false;
    current.mode = "field";
    saveWorld(current);
    setShowHint(true);
    publish();
  }

  function reset() {
    clearTimers();
    clearSave();
    world.current = freshWorld();
    setShowHint(true);
    publish();
  }

  function fight() {
    const current = world.current;
    if (!current || current.mode !== "battle" || current.phase !== "menu" || !current.hero || !current.bossId) {
      return;
    }
    const hero = heroById(current.hero);
    const boss = bossById(current.bossId);
    const bossId = boss.id;
    const reduce = reduceRef.current;
    const strike = reduce ? 200 : 700;
    const hold = reduce ? 180 : 500;
    const bite = reduce ? 140 : 420;
    current.phase = "busy";
    current.anim = hero.id;
    current.animStart = performance.now();
    current.animDur = strike;
    current.message = `${hero.name} uses ${hero.attack}!`;
    publish();

    later(strike, () => {
      const struck = world.current;
      if (!struck || struck.mode !== "battle" || struck.bossId !== bossId) return;
      struck.anim = "none";
      struck.bossHp = Math.max(0, struck.bossHp - HERO_ATK);
      struck.message = `${boss.name} takes ${HERO_ATK}!`;
      publish();
      later(hold, () => {
        const after = world.current;
        if (!after || after.mode !== "battle" || after.bossId !== bossId) return;
        if (after.bossHp <= 0) {
          if (!after.defeated.includes(bossId)) after.defeated = [...after.defeated, bossId];
          saveWorld(after);
          after.message = `${boss.name} is defeated!`;
          publish();
          later(hold, () => {
            const done = world.current;
            if (!done || done.mode !== "battle" || done.bossId !== bossId) return;
            const pages = [boss.line];
            if (done.defeated.length >= bosses.length) pages.push(...ending);
            done.pages = pages;
            done.page = 0;
            done.mode = "story";
            done.anim = "none";
            publish();
          });
          return;
        }
        after.anim = "hit";
        after.animStart = performance.now();
        after.animDur = bite;
        after.message = `${boss.name} strikes!`;
        publish();
        later(bite, () => {
          const hit = world.current;
          if (!hit || hit.mode !== "battle" || hit.bossId !== bossId) return;
          hit.anim = "none";
          hit.heroHp = Math.max(0, hit.heroHp - BOSS_ATK);
          if (hit.heroHp <= 0) {
            hit.heroHp = HERO_HP;
            hit.bossHp = BOSS_HP;
            hit.phase = "menu";
            hit.message = "You steady yourself. Command?";
            publish();
            return;
          }
          hit.message = `${hero.name} takes ${BOSS_ATK}!`;
          publish();
          later(hold, () => {
            const back = world.current;
            if (!back || back.mode !== "battle" || back.bossId !== bossId) return;
            back.phase = "menu";
            back.message = "Command?";
            publish();
          });
        });
      });
    });
  }

  function viewPoint(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / VIEW_W, rect.height / VIEW_H);
    if (!scale) return null;
    const drawnW = VIEW_W * scale;
    const drawnH = VIEW_H * scale;
    const originX = rect.left + (rect.width - drawnW) / 2;
    const originY = rect.top + (rect.height - drawnH) / 2;
    const x = (event.clientX - originX) / scale;
    const y = (event.clientY - originY) / scale;
    if (x < 0 || y < 0 || x >= VIEW_W || y >= VIEW_H) return null;
    return { x, y };
  }

  function onPointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    const current = world.current;
    if (!current) return;
    if (current.mode === "intro" || current.mode === "story") {
      continueText();
      return;
    }
    if (current.mode !== "field") return;
    const point = viewPoint(event);
    if (!point) return;
    const cam = camera(current.x, current.y);
    const boss = livingBossAt(current, cam.x, cam.y, point.x, point.y);
    const tx = boss ? boss.x : cam.x + Math.floor(point.x / TILE);
    const ty = boss ? boss.y : cam.y + Math.floor(point.y / TILE);
    current.pendingBoss = boss ? boss.id : null;
    current.goal = { x: tx, y: ty };
    current.path = route((x, y) => canWalk(current, x, y), { x: current.x, y: current.y }, current.goal);
    current.stepAcc = 0;
    setShowHint(false);
    if (!current.path.length && current.pendingBoss) {
      const id = current.pendingBoss;
      current.pendingBoss = null;
      current.goal = null;
      startBattle(id);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(480, Math.max(0, now - last));
      last = now;
      const current = world.current;
      if (current) {
        if (current.mode === "field") {
          const arrived = advanceWalk(current, dt, reduceRef.current);
          if (arrived) arriveRef.current(arrived);
        }
        paint(context, current, now);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      reduceRef.current = media.matches;
    };
    onMotion();
    media.addEventListener("change", onMotion);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onMotion);
      clearTimers();
    };
  }, []);

  const page = ui.pages[ui.page] ?? "";
  const hero = ui.hero ? heroById(ui.hero) : null;
  const boss = ui.bossId ? bossById(ui.bossId) : null;
  const canvasLabel =
    ui.mode === "field"
      ? "Overworld. Tap a spot to walk there. Tap a boss to fight."
      : ui.mode === "battle"
        ? "Battle."
        : "Quest scene.";
  const playing = ui.mode === "field" || ui.mode === "battle" || ui.mode === "story";

  return (
    <div className="rpg tool-panel" id="quest-game">
      <canvas
        ref={canvasRef}
        className="rpg-canvas"
        width={VIEW_W}
        height={VIEW_H}
        aria-label={canvasLabel}
        onPointerDown={onPointerDown}
      />
      {playing ? (
        <button type="button" className="rpg-reset" onClick={reset}>
          Reset
        </button>
      ) : null}
      {ui.mode === "field" && showHint ? <p className="rpg-hint">Tap the ground to walk.</p> : null}
      {ui.mode === "intro" || ui.mode === "story" ? (
        <button type="button" className="rpg-box" onClick={continueText}>
          {page}
          <i>Tap</i>
        </button>
      ) : null}
      {ui.mode === "select" ? (
        <div className="rpg-select">
          <p className="rpg-pick">Choose an operator</p>
          {heroes.map((item) => (
            <button key={item.id} type="button" className="rpg-hero" onClick={() => choose(item.id)}>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
              <small>{item.blurb}</small>
            </button>
          ))}
        </div>
      ) : null}
      {ui.mode === "battle" && hero && boss ? (
        <div className="rpg-hud">
          <div className="rpg-stats">
            <p>
              {hero.name} HP {ui.heroHp}
            </p>
            <p>
              {boss.name} HP {ui.bossHp}
            </p>
            <p className="rpg-msg" aria-live="polite">
              {ui.message}
            </p>
          </div>
          {ui.phase === "menu" ? (
            <button type="button" className="rpg-fight" onClick={fight}>
              Fight
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
