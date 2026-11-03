import type { SiteContent } from "../../data/content";
import type { ToolId } from "./modules";
import { resolveApp, serviceLabel, type ServiceApp, type ServiceState } from "./services";

export type CommandEffect =
  | { kind: "print"; lines: string[] }
  | { kind: "clear" }
  | { kind: "open"; id: string }
  | { kind: "tool"; id: ToolId }
  | { kind: "install"; id: ServiceApp; installed: boolean; lines: string[] }
  | { kind: "power"; id: ServiceApp; enabled: boolean; lines: string[] };

const HELP = [
  "help        list commands",
  "whoami      name, role, tagline, location, badges",
  "about       same as whoami",
  "education   schools",
  "certs       certificates",
  "skills      skill groups",
  "work        experience",
  "projects    quest list",
  "ls          quest list",
  "cat <id>    one quest",
  "open <id>   open that quest's article",
  "contact     links and CV",
  "clear       clear the screen",
  "quest       open the quest",
  "files       open files",
  "notes       open notes",
  "canvas      open the canvas",
  "calculator  open the calculator",
  "ps          running services",
  "apt list     extra packages",
  "apt install|uninstall <app>",
  "systemctl enable|disable <app>",
];

const launch: Record<string, ToolId> = {
  quest: "quest",
  quests: "quest",
  files: "files",
  notes: "notes",
  canvas: "canvas",
  calculator: "calc",
  calc: "calc",
  vault: "vault",
};

function questsInOrder(content: SiteContent) {
  return content.quests
    .map((quest, index) => ({ quest, index }))
    .sort((a, b) => a.quest.priority - b.quest.priority || a.index - b.index)
    .map(({ quest }) => quest);
}

function findQuest(content: SiteContent, id: string) {
  const key = id.toLowerCase();
  return questsInOrder(content).find((quest) => quest.id.toLowerCase() === key);
}

function aboutLines(content: SiteContent) {
  const { profile, badges } = content;
  return [
    profile.name,
    `${profile.className} · ${profile.role}`,
    profile.location,
    profile.tagline,
    badges.map((badge) => badge.label).join(", "),
  ];
}

function listQuests(content: SiteContent) {
  return questsInOrder(content).map((quest) => `${quest.id}  ${quest.title}`);
}

function launchLines(name: string, services: ServiceState): CommandEffect {
  const id = launch[name];
  const app = resolveApp(name);
  if (!id || !app) return { kind: "print", lines: [`${name}: command not found`, "type help"] };
  const state = services[app];
  const label = serviceLabel(app);
  if (!state.installed) return { kind: "print", lines: [`${label}: package not installed`] };
  if (!state.enabled) return { kind: "print", lines: [`${label}: unit is disabled`] };
  return { kind: "tool", id };
}

export function runCommand(raw: string, content: SiteContent, services: ServiceState): CommandEffect {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { kind: "print", lines: [] };
  const [name, arg] = [parts[0].toLowerCase(), parts.slice(1).join(" ")];

  if (parts.length === 1 && launch[name]) return launchLines(name, services);

  if (name === "ps") {
    const rows = ["  PID TTY          CMD", "  112 ?            nginx", "  148 ?            sshd"];
    let pid = 201;
    for (const app of ["files", "notes", "canvas", "calc", "quest", "vault"] as const) {
      const state = services[app];
      if (!state.installed || !state.enabled) continue;
      rows.push(`  ${pid} ?            ${serviceLabel(app)}.service`);
      pid += 17;
    }
    return { kind: "print", lines: rows };
  }

  if (name === "apt") {
    const verb = parts[1]?.toLowerCase();
    if (verb === "list" && parts.length === 2) {
      const vault = services.vault;
      const status = !vault.installed
        ? "available"
        : vault.enabled
          ? "installed, enabled"
          : "installed, disabled";
      return { kind: "print", lines: ["Additional packages:", `vault    ${status}`] };
    }
    const pkg = resolveApp(parts[2] ?? "");
    if ((verb !== "install" && verb !== "uninstall") || !pkg || parts.length !== 3) {
      return { kind: "print", lines: ["usage: apt list", "       apt install|uninstall <app>"] };
    }
    const label = serviceLabel(pkg);
    const state = services[pkg];
    if (verb === "install") {
      if (state.installed) return { kind: "print", lines: [`${label} is already the newest version`] };
      if (pkg === "vault") {
        const free = (["files", "notes", "canvas", "calc", "quest"] as const).some((id) => !services[id].installed);
        if (!free) {
          return {
            kind: "print",
            lines: ["E: No space left on device.", "Uninstall an existing app, then apt install vault"],
          };
        }
        return {
          kind: "install",
          id: pkg,
          installed: true,
          lines: ["installed: vault", "vault.service is disabled", "run: systemctl enable vault"],
        };
      }
      return { kind: "install", id: pkg, installed: true, lines: [`installed: ${label}`] };
    }
    if (!state.installed) return { kind: "print", lines: [`Package ${label} is not installed`] };
    return { kind: "install", id: pkg, installed: false, lines: [`removed: ${label}`] };
  }

  if (name === "systemctl") {
    const verb = parts[1]?.toLowerCase();
    const pkg = resolveApp(parts[2] ?? "");
    if ((verb !== "enable" && verb !== "disable") || !pkg || parts.length !== 3) {
      return { kind: "print", lines: ["usage: systemctl enable|disable <app>"] };
    }
    const label = serviceLabel(pkg);
    const state = services[pkg];
    if (!state.installed) {
      return { kind: "print", lines: [`Failed to ${verb} unit: Unit ${label}.service not found`] };
    }
    if (verb === "enable") {
      if (state.enabled) return { kind: "print", lines: [`${label}.service is already enabled`] };
      return { kind: "power", id: pkg, enabled: true, lines: [`enabled: ${label}.service`] };
    }
    if (!state.enabled) return { kind: "print", lines: [`${label}.service is already disabled`] };
    return { kind: "power", id: pkg, enabled: false, lines: [`disabled: ${label}.service`] };
  }

  if (name === "help") return { kind: "print", lines: HELP };
  if (name === "whoami" || name === "about") return { kind: "print", lines: aboutLines(content) };
  if (name === "clear") return { kind: "clear" };

  if (name === "education") {
    return {
      kind: "print",
      lines: content.education.flatMap((item) => [
        item.title,
        [item.note, item.org, item.when].filter(Boolean).join(" · "),
        "",
      ]),
    };
  }

  if (name === "certs") {
    return {
      kind: "print",
      lines: content.certifications.flatMap((cert) => [
        cert.title,
        `${cert.issuer} · ${cert.when}`,
        "",
      ]),
    };
  }

  if (name === "skills") {
    return {
      kind: "print",
      lines: content.skillGroups.flatMap((group) => [
        group.title,
        ...group.skills.map((skill) => `  ${skill.name}`),
        "",
      ]),
    };
  }

  if (name === "work") {
    return {
      kind: "print",
      lines: content.experience.flatMap((job) => [
        job.title,
        `${job.org} · ${job.where} · ${job.when}`,
        ...job.points.map((point) => `  ${point}`),
        "",
      ]),
    };
  }

  if (name === "projects" || (name === "ls" && (!arg || arg.toLowerCase() === "projects"))) {
    return { kind: "print", lines: listQuests(content) };
  }

  if (name === "cat" || name === "open") {
    if (!arg) return { kind: "print", lines: [`${name}: missing project id`] };
    const quest = findQuest(content, arg);
    if (!quest) return { kind: "print", lines: [`${name}: ${arg}: No such project`] };
    if (name === "open") {
      if (!quest.article) return { kind: "print", lines: [`open: ${quest.id}: no article`] };
      return { kind: "open", id: quest.id };
    }
    return {
      kind: "print",
      lines: [
        `${quest.title}  [${quest.status}]`,
        quest.subtitle,
        ...quest.points.map((point) => `  ${point}`),
        quest.stack.join(", "),
      ],
    };
  }

  if (name === "contact") {
    const { profile } = content;
    return {
      kind: "print",
      lines: [
        `github    ${profile.github}`,
        `linkedin  ${profile.linkedin}`,
        `email     ${profile.email}`,
        `cv        ${profile.cvFile}`,
      ],
    };
  }

  return { kind: "print", lines: [`${parts[0]}: command not found`, "type help"] };
}
