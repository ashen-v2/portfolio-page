export const HUD_TONES = ["gold", "cyan", "mint", "red", "purple", "teal", "coral", "violet"] as const;

export type HudTone = (typeof HUD_TONES)[number];

export function hashSeed(seed: string) {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

function pickTone(seed: string, taken: Set<HudTone>): HudTone {
  const start = hashSeed(seed) % HUD_TONES.length;
  for (let step = 0; step < HUD_TONES.length; step += 1) {
    const tone = HUD_TONES[(start + step) % HUD_TONES.length];
    if (!taken.has(tone)) return tone;
  }
  return HUD_TONES[hashSeed(seed) % HUD_TONES.length];
}

export function assignHudTones(seeds: string[], locked: Array<HudTone | undefined> = []): HudTone[] {
  const tones: Array<HudTone | undefined> = seeds.map((_, index) => locked[index]);
  const taken = new Set(tones.filter((tone): tone is HudTone => Boolean(tone)));

  return seeds.map((seed, index) => {
    const lockedTone = tones[index];
    if (lockedTone) return lockedTone;
    const tone = pickTone(seed, taken);
    taken.add(tone);
    return tone;
  });
}

export function certKeywordTone(title: string, issuer: string): HudTone | undefined {
  const hay = `${issuer} ${title}`.toLowerCase();
  if (hay.includes("re/start") || hay.includes("restart")) return "purple";
  if (hay.includes("harvard") || hay.includes("cs50")) return "red";
  if (hay.includes("docker")) return "cyan";
  if (hay.includes("terraform")) return "mint";
  if (hay.includes("amazon") || hay.includes("aws")) return "gold";
  return undefined;
}
