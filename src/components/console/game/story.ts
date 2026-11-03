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
    role: "Containers",
    blurb: "Drops a crate that seals the foe.",
    attack: "Seal",
  },
  {
    id: "terra",
    name: "Terra",
    role: "Infra",
    blurb: "Summons a rack of servers.",
    attack: "Provision",
  },
  {
    id: "pyth",
    name: "Pyth",
    role: "Pythons",
    blurb: "A snake lunges across the field.",
    attack: "Strike",
  },
  {
    id: "helm",
    name: "Helm",
    role: "Kubernetes",
    blurb: "Pods roll out and strike.",
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
  "Pick your class. Tap the land. Quiet the four bosses.",
  "The guide, the houses, the shrine, and the grove open the kingdom's records.",
];

export const ending = [
  "Four keeps quiet. The pipeline kingdom deploys.",
  "Wander if you like. The grass will keep your steps.",
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
