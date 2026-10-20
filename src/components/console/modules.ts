export const moduleKeys = [
  { id: "about", label: "About", title: "ABOUT" },
  { id: "education", label: "Education", title: "EDUCATION" },
  { id: "certs", label: "Certificates", title: "CERTIFICATES" },
  { id: "projects", label: "Projects", title: "PROJECTS" },
  { id: "skills", label: "Skills", title: "SKILLS" },
  { id: "work", label: "Work", title: "WORK" },
] as const;

export type SectionId = (typeof moduleKeys)[number]["id"];

export function moduleTitle(section: SectionId | null) {
  if (!section) return "SELECT A MODULE";
  return moduleKeys.find((item) => item.id === section)?.title ?? "SELECT A MODULE";
}
