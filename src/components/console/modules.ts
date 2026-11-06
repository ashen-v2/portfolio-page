export const moduleKeys = [
  { id: "about", label: "About", title: "ABOUT" },
  { id: "education", label: "Education", title: "EDUCATION" },
  { id: "certs", label: "Certificates", title: "CERTIFICATES" },
  { id: "projects", label: "Projects", title: "PROJECTS" },
  { id: "skills", label: "Skills", title: "SKILLS" },
  { id: "work", label: "Work", title: "WORK" },
] as const;

export type SectionId = (typeof moduleKeys)[number]["id"];

export const toolKeys = [
  { id: "files", label: "Files", title: "FILES" },
  { id: "terminal", label: "Terminal", title: "TERMINAL" },
  { id: "notes", label: "Notes", title: "NOTES" },
  { id: "canvas", label: "Canvas", title: "CANVAS" },
  { id: "calc", label: "Calculator", title: "CALCULATOR" },
  { id: "quest", label: "Quest", title: "QUEST" },
  { id: "vault", label: "Vault", title: "VAULT" },
] as const;

export type ToolId = (typeof toolKeys)[number]["id"];

const sceneBase = import.meta.env.BASE_URL;

export const sectionScene: Record<SectionId, string> = {
  about: `${sceneBase}console/scene-about.png`,
  education: `${sceneBase}console/scene-education.png`,
  certs: `${sceneBase}console/scene-education.png`,
  projects: `${sceneBase}console/scene-projects.png`,
  skills: `${sceneBase}console/scene-projects.png`,
  work: `${sceneBase}console/scene-work.png`,
};

export const sectionPortrait: Record<SectionId, string> = {
  about: `${sceneBase}console/portrait-about.png`,
  education: `${sceneBase}console/portrait-education.png`,
  certs: `${sceneBase}console/portrait-certs.png`,
  projects: `${sceneBase}console/portrait-projects.png`,
  skills: `${sceneBase}console/portrait-skills.png`,
  work: `${sceneBase}console/portrait-work.png`,
};

export const homePortrait = `${sceneBase}console/portrait.png`;

export function moduleTitle(section: SectionId | null) {
  if (!section) return "SELECT A MODULE";
  return moduleKeys.find((item) => item.id === section)?.title ?? "SELECT A MODULE";
}

export function toolTitle(tool: ToolId) {
  return toolKeys.find((item) => item.id === tool)?.title ?? "HOME";
}
