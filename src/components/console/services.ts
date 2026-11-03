export const serviceApps = ["files", "notes", "canvas", "calc", "quest"] as const;

export type ServiceApp = (typeof serviceApps)[number];

export type ServiceFlag = { installed: boolean; enabled: boolean };

export type ServiceState = Record<ServiceApp, ServiceFlag>;

export function freshServices(): ServiceState {
  return {
    files: { installed: true, enabled: true },
    notes: { installed: true, enabled: true },
    canvas: { installed: true, enabled: true },
    calc: { installed: true, enabled: true },
    quest: { installed: true, enabled: true },
  };
}

export function resolveApp(name: string): ServiceApp | null {
  const key = name.toLowerCase();
  if (key === "calculator") return "calc";
  if (key === "quests" || key === "quest") return "quest";
  if (key === "files" || key === "notes" || key === "canvas" || key === "calc") return key;
  return null;
}

export function serviceLabel(id: ServiceApp) {
  if (id === "calc") return "calculator";
  if (id === "quest") return "quest";
  return id;
}
