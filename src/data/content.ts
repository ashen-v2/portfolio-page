export const profile = {
  name: "Ashen Viduranga",
  handle: "ASHEN OS v1.0",
  role: "DevOps Intern",
  className: "CLOUD OPS",
  location: "Seeduwa, Sri Lanka",
  phone: "+94 71 616 2668",
  email: "ashen240@gmail.com",
  linkedin: "https://linkedin.com/in/ashen-viduranga",
  github: "https://github.com/ashen-v2",
  community: "AWS Builder Community",
  cvFile: "/Ashen_Viduranga_DevOps_Intern.pdf",
  tagline:
    "AWS Certified Cloud Practitioner and first-class Computer Science graduate seeking a DevOps Trainee role.",
  summary:
    "Hands-on AWS from the AWS re/Start program and self-directed projects. Built a GitHub Actions CI/CD pipeline — tests, Docker builds, OIDC-authenticated deploys — for a multi-container app on a live EC2 instance behind Nginx. Comfortable with Linux, Git, Python and Bash, plus core cloud networking and security. Actively building Infrastructure-as-Code skills (Terraform, Kubernetes).",
};

export const skillGroups = [
  {
    id: "cloud",
    title: "Cloud & DevOps",
    skills: [
      { name: "AWS (EC2, S3, VPC, IAM, SSM)", level: 85 },
      { name: "Docker", level: 80 },
      { name: "GitHub Actions CI/CD", level: 82 },
      { name: "Nginx", level: 72 },
      { name: "Linux", level: 78 },
    ],
  },
  {
    id: "script",
    title: "Scripting & Automation",
    skills: [
      { name: "Python", level: 82 },
      { name: "Bash", level: 74 },
      { name: "SQL / PL/SQL", level: 68 },
      { name: "Java", level: 55 },
    ],
  },
  {
    id: "net",
    title: "Networking & Security",
    skills: [
      { name: "VPC, subnets, SGs, NACLs", level: 78 },
      { name: "Load balancers / TCP/IP", level: 72 },
      { name: "Least-privilege IAM", level: 80 },
      { name: "JWT auth", level: 65 },
    ],
  },
  {
    id: "dev",
    title: "Development",
    skills: [
      { name: "FastAPI + REST", level: 76 },
      { name: "PostgreSQL + Alembic", level: 70 },
      { name: "pytest", level: 72 },
      { name: "Vue 3", level: 64 },
    ],
  },
  {
    id: "learn",
    title: "Currently Learning",
    skills: [
      { name: "Terraform", level: 38 },
      { name: "Kubernetes", level: 32 },
    ],
  },
];

export const tags = {
  cloud: ["AWS", "EC2", "S3", "VPC", "IAM", "SSM", "Docker", "GitHub Actions", "Nginx", "Linux"],
  extra: ["Git", "GitHub", "REST APIs"],
};

export type QuestStatus = "LIVE" | "DESIGN" | "TOOL";

export const quests = [
  {
    id: "xala",
    title: "Xala",
    status: "LIVE" as QuestStatus,
    subtitle: "Containerized app on AWS EC2 with CI/CD",
    points: [
      "Three-container stack (Vue 3 SPA behind Nginx, FastAPI, PostgreSQL) on a live EC2 instance with Docker Compose, security groups, and Linux server access.",
      "GitHub Actions pipeline: pytest, Docker image build/push to Docker Hub, then EC2 redeploy via SSM Run Command using OIDC federation and a least-privilege IAM role — no static credentials.",
      "Nginx reverse-proxies API traffic; Alembic migrations and Gemini-powered sales analytics ship with the app.",
    ],
    stack: ["Vue 3", "FastAPI", "PostgreSQL", "Docker", "GitHub Actions", "OIDC", "EC2", "SSM"],
  },
  {
    id: "ha",
    title: "AWS Multi-AZ HA Architecture",
    status: "DESIGN" as QuestStatus,
    subtitle: "3-tier high-availability design + cost model",
    points: [
      "Custom VPC with public/private subnets, route tables, ALB, Auto Scaling Group, Aurora Multi-AZ, least-privilege IAM, and automated backups.",
      "Modeled a monthly cost breakdown (~$490) to weigh high availability against operating cost.",
    ],
    stack: ["VPC", "ALB", "ASG", "Aurora", "IAM", "Multi-AZ"],
  },
  {
    id: "tools",
    title: "Automation & API Projects",
    status: "TOOL" as QuestStatus,
    subtitle: "Python workflows and educational search",
    points: [
      "Diagram Exporter — Python workflow automation for manufacturing reports.",
      "CS50 Tools — FastAPI REST API plus a keyword search engine over educational video content.",
    ],
    stack: ["Python", "FastAPI", "REST"],
  },
];

export const certifications = [
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    when: "Issued Aug 2026 · Valid through Aug 2029",
  },
  {
    title: "AWS re/Start",
    issuer: "Amazon Web Services",
    when: "Aug 2026",
  },
  {
    title: "CS50: Introduction to Computer Science",
    issuer: "HarvardX",
    when: "Aug 2025",
  },
];

export const experience = [
  {
    title: "Information Technology Intern",
    org: "Noratel International",
    when: "Mar 2025 – Sep 2025",
    where: "Katunayake, Sri Lanka",
    points: [
      "Developed a Python desktop application to automate transformer design workflows, bridging manual data entry and database management.",
      "Automated generation of Excel-based manufacturing reports (design pages, timing sheets, BOMs), reducing manual data entry and processing time.",
    ],
  },
];

export const education = [
  {
    title: "BSc (Hons) Computer Science in Software Engineering",
    note: "First Class",
    org: "Kingston University, London (Top-Up via ESU, Colombo)",
    when: "2025 – 2026",
  },
  {
    title: "Pearson BTEC Higher National Diploma in Computing",
    note: "",
    org: "Esoft Metro Campus, Gampaha",
    when: "2022 – 2025",
  },
  {
    title: "Diploma in Information Technology",
    note: "",
    org: "BCI Campus, Negombo",
    when: "2020 – 2021",
  },
];

export const navItems = [
  { href: "#start", label: "START" },
  { href: "#about", label: "ABOUT" },
  { href: "#skills", label: "SKILLS" },
  { href: "#quests", label: "QUESTS" },
  { href: "#log", label: "LOG" },
  { href: "#contact", label: "CONTACT" },
];

export const bootLines = [
  "ASHEN OS v1.0",
  "> mounting /cloud",
  "> loading IAM roles ........ OK",
  "> docker compose up ........ OK",
  "> nginx reverse-proxy ...... OK",
  "> github actions OIDC ...... OK",
  "READY. PRESS START",
];
