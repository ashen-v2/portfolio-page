export type HeroId = "dock" | "terra" | "pyth" | "helm";
export type BossId = "drake" | "wurm" | "wraith" | "golem";
export type Dir = "up" | "down" | "left" | "right";

export type HeroDef = {
  id: HeroId;
  name: string;
  role: string;
  blurb: string;
  attack: string;
};

export type BossDef = {
  id: BossId;
  name: string;
  line: string;
};

export const heroes: HeroDef[] = [
  {
    id: "dock",
    name: "Dock",
    role: "Crate",
    blurb: "A crate in hand. Seal drops another.",
    attack: "Seal",
  },
  {
    id: "terra",
    name: "Terra",
    role: "Hammer",
    blurb: "A hammer in hand. Provision raises an anvil.",
    attack: "Provision",
  },
  {
    id: "pyth",
    name: "Pyth",
    role: "Stick",
    blurb: "A stick in hand. Strike sends a snake.",
    attack: "Strike",
  },
  {
    id: "helm",
    name: "Helm",
    role: "Katana",
    blurb: "A katana in hand. Rollout spins three books.",
    attack: "Rollout",
  },
];

export const bosses: BossDef[] = [
  {
    id: "drake",
    name: "Lag Drake",
    line: "The drake sinks. Packets cross the bridge again.",
  },
  {
    id: "wurm",
    name: "Yaml Wurm",
    line: "The wurm unspools. The manifests lie flat.",
  },
  {
    id: "wraith",
    name: "Cert Wraith",
    line: "The wraith's seal breaks. Trust returns to the grove.",
  },
  {
    id: "golem",
    name: "Crash Golem",
    line: "The golem stills. The south dock ships once more.",
  },
];

export const opening = [
  "Year 1987 of the deploy calendar. The Pipeline Kingdom has gone dark.",
  "Four keeps have fallen to outages. One operator can still walk the green.",
  "Pick your class. Tap the land. Defeat all four bosses.",
  "Quiet the four keeps and a treasure chest will open.",
  "The guide, the houses, the shrine, and the grove open the kingdom's records.",
];

export const ending = [
  "The four keeps are quiet. The Pipeline Kingdom is saved.",
  "The outages fade. Packets cross the bridge again.",
  "A chest now stands between the project house and the workshop.",
];

const heroIds = new Set<string>(heroes.map((hero) => hero.id));
const bossIds = new Set<string>(bosses.map((boss) => boss.id));

export function isHeroId(value: string): value is HeroId {
  return heroIds.has(value);
}

export function isBossId(value: string): value is BossId {
  return bossIds.has(value);
}

export function heroById(id: HeroId) {
  return heroes.find((hero) => hero.id === id) ?? heroes[0];
}

export function bossById(id: BossId) {
  return bosses.find((boss) => boss.id === id) ?? bosses[0];
}
