import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SiteContent } from "../../../data/content";
import { landmarkAt, landmarks, START, TILE, VIEW_H, VIEW_W, bossSpots, camera, terrainWalkable } from "./map";
import { sectionScene, type SectionId } from "../modules";
import { route, type Point } from "./path";
import { drawBattle, drawField, drawIntro, drawSelect, type AttackAnim } from "./sprites";
import { visitPages } from "./visit";
import { QuestArticle } from "../../QuestArticle";
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

type Mode = "intro" | "select" | "field" | "battle" | "story" | "visit";
type Arrival = { kind: "boss"; id: BossId } | { kind: "place"; id: SectionId };
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
  pendingPlace: SectionId | null;
  visitSection: SectionId | null;
  visitPage: number;
  visitArticle: string;
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
  visitSection: SectionId | null;
  visitPage: number;
  visitArticle: string;
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
    const spot = openSpot(saved.x, saved.y, saved.defeated);
    return {
      mode: "field",
      pages: [],
      page: 0,
      hero: saved.hero,
      x: spot.x,
      y: spot.y,
      facing: saved.facing,
      bob: false,
      path: [],
      goal: null,
      pendingBoss: null,
      pendingPlace: null,
      visitSection: null,
      visitPage: 0,
      visitArticle: "",
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
    pendingPlace: null,
    visitSection: null,
    visitPage: 0,
    visitArticle: "",
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
    visitSection: world.visitSection,
    visitPage: world.visitPage,
    visitArticle: world.visitArticle,
  };
}

function openSpot(x: number, y: number, defeated: BossId[]) {
  const open = (tx: number, ty: number) =>
    terrainWalkable(tx, ty) &&
    !landmarkAt(tx, ty) &&
    !bossSpots.some((boss) => boss.x === tx && boss.y === ty && !defeated.includes(boss.id));
  if (open(x, y)) return { x, y };
  const dirs = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];
  for (const dir of dirs) {
    if (open(x + dir.x, y + dir.y)) return { x: x + dir.x, y: y + dir.y };
  }
  return START;
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

function landmarkTileAt(camX: number, camY: number, px: number, py: number) {
  const pad = 5;
  for (const place of landmarks) {
    for (const tile of place.tiles) {
      const left = (tile.x - camX) * TILE - pad;
      const top = (tile.y - camY) * TILE - pad;
      if (px >= left && px < left + TILE + pad * 2 && py >= top && py < top + TILE + pad * 2) {
        return { place, x: tile.x, y: tile.y };
      }
    }
  }
  return null;
}

function canWalk(world: World, x: number, y: number) {
  if (!terrainWalkable(x, y)) return false;
  if (landmarkAt(x, y)) return false;
  return !bossSpots.some((boss) => boss.x === x && boss.y === y && !world.defeated.includes(boss.id));
}

function facingOf(x: number, y: number, nx: number, ny: number): Dir {
  if (nx > x) return "right";
  if (nx < x) return "left";
  if (ny < y) return "up";
  return "down";
}

function advanceWalk(world: World, dt: number, reduce: boolean): Arrival | null {
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
    if (!world.path.length && (world.pendingBoss || world.pendingPlace)) {
      world.goal = null;
      saveWorld(world);
      if (world.pendingBoss) {
        const id = world.pendingBoss;
        world.pendingBoss = null;
        world.pendingPlace = null;
        return { kind: "boss", id };
      }
      const id = world.pendingPlace;
      world.pendingPlace = null;
      if (!id) return null;
      return { kind: "place", id };
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

export function Quest({ content }: { content: SiteContent | null }) {
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
  const arriveRef = useRef<(arrival: Arrival) => void>(() => {});

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
    current.pendingPlace = null;
    current.message = `${bossById(id).name} draws near.`;
    publish();
  }

  function openPlace(id: SectionId) {
    const current = world.current;
    if (!current) return;
    current.pendingPlace = null;
    current.pendingBoss = null;
    current.path = [];
    current.goal = null;
    current.visitSection = id;
    current.visitPage = 0;
    current.visitArticle = "";
    current.mode = "visit";
    saveWorld(current);
    publish();
  }

  function closeVisit() {
    const current = world.current;
    if (!current || current.mode !== "visit") return;
    current.mode = "field";
    current.visitSection = null;
    current.visitPage = 0;
    current.visitArticle = "";
    publish();
  }

  function advanceVisit() {
    const current = world.current;
    if (!current || current.mode !== "visit" || !current.visitSection || current.visitArticle) return;
    const pages = visitPages(content, current.visitSection);
    if (current.visitPage + 1 < pages.length) {
      current.visitPage += 1;
      publish();
      return;
    }
    closeVisit();
  }

  function openArticle(file: string) {
    const current = world.current;
    if (!current || current.mode !== "visit") return;
    current.visitArticle = file;
    publish();
  }

  function closeArticle() {
    const current = world.current;
    if (!current) return;
    current.visitArticle = "";
    publish();
  }

  arriveRef.current = (arrival) => {
    if (arrival.kind === "boss") startBattle(arrival.id);
    else openPlace(arrival.id);
  };

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
    current.pendingPlace = null;
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
    const place = boss ? null : landmarkTileAt(cam.x, cam.y, point.x, point.y);
    const tx = boss ? boss.x : place ? place.x : cam.x + Math.floor(point.x / TILE);
    const ty = boss ? boss.y : place ? place.y : cam.y + Math.floor(point.y / TILE);
    current.pendingBoss = boss ? boss.id : null;
    current.pendingPlace = place ? place.place.id : null;
    current.goal = { x: tx, y: ty };
    current.path = route((x, y) => canWalk(current, x, y), { x: current.x, y: current.y }, current.goal);
    current.stepAcc = 0;
    setShowHint(false);
    if (current.path.length) return;
    if (current.pendingBoss) {
      const id = current.pendingBoss;
      current.pendingBoss = null;
      current.pendingPlace = null;
      current.goal = null;
      startBattle(id);
      return;
    }
    if (current.pendingPlace) {
      const id = current.pendingPlace;
      openPlace(id);
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
      ? "Overworld. Tap a spot to walk there. Tap a boss to fight. Tap a marked place to open a record."
      : ui.mode === "battle"
        ? "Battle."
        : ui.mode === "visit"
          ? "Record scene."
          : "Quest scene.";
  const playing = ui.mode === "field" || ui.mode === "battle" || ui.mode === "story";
  const recordPages = ui.visitSection ? visitPages(content, ui.visitSection) : [];
  const record = recordPages[ui.visitPage] ?? recordPages[0];

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
      {ui.mode === "field" && showHint ? <p className="rpg-hint">Tap the ground to walk. Marked places open records.</p> : null}
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
      {ui.mode === "visit" && ui.visitSection ? (
        <div
          className="rpg-visit"
          style={{ backgroundImage: `url("${sectionScene[ui.visitSection]}")` }}
        >
          <button type="button" className="rpg-close" onClick={closeVisit}>
            Close
          </button>
          {ui.visitArticle ? (
            <div className="rpg-scroll">
              <QuestArticle file={ui.visitArticle} onBack={closeArticle} />
            </div>
          ) : (
            <div className="rpg-dialogue">
              {record?.article ? (
                <button type="button" className="rpg-read" onClick={() => openArticle(record.article ?? "")}>
                  Read
                </button>
              ) : null}
              <button type="button" className="rpg-box" onClick={advanceVisit}>
                {record?.text}
                <i>Tap</i>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
