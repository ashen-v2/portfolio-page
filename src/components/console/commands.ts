import type { SiteContent } from "../../data/content";

export type CommandEffect =
  | { kind: "print"; lines: string[] }
  | { kind: "clear" }
  | { kind: "open"; id: string };

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
];

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

export function runCommand(raw: string, content: SiteContent): CommandEffect {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { kind: "print", lines: [] };
  const [name, arg] = [parts[0].toLowerCase(), parts.slice(1).join(" ")];

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
