import type { SiteContent } from "../../../data/content";
import type { SectionId } from "../modules";

export type VisitPage = {
  text: string;
  article?: string;
};

function lines(parts: Array<string | undefined>) {
  const text = parts
    .map((part) => part?.trim() ?? "")
    .filter((part) => part.length > 0)
    .join("\n");
  return text || "Nothing is written here.";
}

function pagesOrEmpty(pages: VisitPage[]) {
  return pages.length > 0 ? pages : [{ text: "Nothing is written here." }];
}

export function visitPages(content: SiteContent | null, section: SectionId): VisitPage[] {
  if (!content) return [{ text: "The records are still shut." }];

  if (section === "about") {
    const { profile, saveData } = content;
    const pages: VisitPage[] = [
      { text: lines([profile.name, `${profile.className} · ${profile.role}`]) },
      { text: lines([`${profile.location} · ${profile.community}`, profile.tagline]) },
    ];
    if (saveData.length > 0) {
      pages.push({
        text: lines(saveData.map((entry) => `${entry.label}: ${entry.value}`)),
      });
    }
    return pages;
  }

  if (section === "education") {
    return pagesOrEmpty(
      content.education.map((item) => ({
        text: lines([item.title, item.note, item.org, item.when]),
      })),
    );
  }

  if (section === "certs") {
    return pagesOrEmpty(
      content.certifications.map((cert) => ({
        text: lines([cert.title, cert.issuer, cert.when]),
      })),
    );
  }

  if (section === "skills") {
    return pagesOrEmpty(
      content.skillGroups.map((group) => ({
        text: lines([group.title, group.skills.map((skill) => skill.name).join(", ")]),
      })),
    );
  }

  if (section === "work") {
    return pagesOrEmpty(
      content.experience.map((job) => ({
        text: lines([job.title, `${job.org} · ${job.where}`, job.when, ...job.points]),
      })),
    );
  }

  const quests = content.quests
    .map((quest, index) => ({ quest, index }))
    .sort((a, b) => a.quest.priority - b.quest.priority || a.index - b.index)
    .map(({ quest }) => quest);
  return pagesOrEmpty(
    quests.map((quest) => ({
      text: lines([
        `${quest.title} · ${quest.status}`,
        quest.subtitle,
        ...quest.points,
        quest.stack.join(" · "),
      ]),
      article: quest.article,
    })),
  );
}
