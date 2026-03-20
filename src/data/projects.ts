export interface ProjectItem {
  id: string;
  name: string;
  date: string;
  techStack: string[];
  tags: string[];
  description: string;
  documentationVideo: string;
}

export const projects: ProjectItem[] = [
  {
    id: "studio-vision",
    name: "Studio Vision",
    date: "2026-02",
    techStack: ["Next.js", "TypeScript", "Tailwind"],
    tags: ["web", "creative", "ui"],
    description: "Interactive showcase for visual experiments and design systems.",
    documentationVideo: "https://example.com/studio-vision-video"
  },
  {
    id: "signal-ops",
    name: "Signal Ops",
    date: "2025-11",
    techStack: ["React", "Node.js", "PostgreSQL"],
    tags: ["dashboard", "data", "ops"],
    description: "Operations dashboard for monitoring real-time service health and events.",
    documentationVideo: "https://example.com/signal-ops-video"
  },
  {
    id: "memo-space",
    name: "Memo Space",
    date: "2025-06",
    techStack: ["Next.js", "Framer Motion", "Prisma"],
    tags: ["productivity", "notes", "mobile"],
    description: "Knowledge capture app with timeline browsing and semantic search.",
    documentationVideo: "https://example.com/memo-space-video"
  }
];
