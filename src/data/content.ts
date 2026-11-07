export type BadgeTone = "gold" | "cyan" | "mint";
export type QuestStatus = "LIVE" | "DESIGN" | "TOOL";

export type Profile = {
  name: string;
  handle: string;
  role: string;
  className: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  community: string;
  cvFile: string;
  tagline: string;
};

export type Certification = {
  title: string;
  issuer: string;
  when: string;
  file?: string;
};

export const CERT_FOLDER = "certs";

export type SiteContent = {
  "default mobile view": boolean;
  certDefaultImage: string;
  profile: Profile;
  badges: { label: string; tone: BadgeTone }[];
  education: { title: string; note: string; org: string; when: string }[];
  certifications: Certification[];
  skillGroups: {
    id: string;
    title: string;
    skills: { name: string; icon: string }[];
  }[];
  quests: {
    id: string;
    title: string;
    status: QuestStatus;
    subtitle: string;
    points: string[];
    stack: string[];
    priority: number;
    article?: string;
  }[];
  experience: {
    title: string;
    org: string;
    when: string;
    where: string;
    points: string[];
  }[];
  saveData: { label: string; value: string }[];
};

export const navItems = [
  { href: "#start", label: "START" },
  { href: "#education", label: "JOURNEY" },
  { href: "#quests", label: "QUESTS" },
  { href: "#skills", label: "BAG" },
  { href: "#log", label: "NOTES" },
  { href: "#contact", label: "MAIL" },
];

export const bootLines = [
  "ROUTE 101",
  "Ashen Viduranga",
  "Cloud Ops",
  "A crystal flickers on the path.",
  "PRESS START",
];

export function linkLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function certFileName(value: string | undefined, fallback = "") {
  const name = (value ?? fallback).trim().replace(/^\/+/, "").replace(/^certs\//i, "");
  return name;
}

export function certAssetUrl(filename: string) {
  return `${import.meta.env.BASE_URL}${CERT_FOLDER}/${certFileName(filename)}`;
}

export function isCertPdf(filename: string) {
  return /\.pdf$/i.test(filename);
}

export async function loadContent(): Promise<SiteContent> {
  const response = await fetch(`${import.meta.env.BASE_URL}content.json`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not read content.json");
  }
  const data = (await response.json()) as SiteContent;
  data["default mobile view"] = data["default mobile view"] === true;
  data.certDefaultImage = certFileName(data.certDefaultImage, "default.svg") || "default.svg";
  data.certifications = data.certifications.map((cert) => ({
    ...cert,
    file: certFileName(cert.file) || undefined,
  }));
  const cv = data.profile.cvFile;
  if (cv && !cv.startsWith("http") && !cv.startsWith(import.meta.env.BASE_URL)) {
    data.profile.cvFile = `${import.meta.env.BASE_URL}${cv.replace(/^\//, "")}`;
  }
  return data;
}
