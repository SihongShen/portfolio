import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { type ReactNode } from "react";
import { projects } from "@/data/projects";
import type { AppLocale } from "@/lib/i18n";
import { MdxH1, MdxH2, MdxH3, MdxH4, MdxP, MdxUl, MdxOl, MdxLi, MdxA, MdxBlockquote, MdxPre, MdxHr, MdxImg } from "@/components/mdx/MdxComponents";
import ProjectDetailClient from "./ProjectDetailClient";

const mdxComponents = {
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  h4: MdxH4,
  p: MdxP,
  ul: MdxUl,
  ol: MdxOl,
  li: MdxLi,
  a: MdxA,
  blockquote: MdxBlockquote,
  pre: MdxPre,
  hr: MdxHr,
  img: MdxImg,
  strong: ({ children }: { children: ReactNode }) => (
    <strong className="text-[var(--terminal-primary)] font-bold drop-shadow-[0_0_8px_rgba(81,204,220,0.5)]">{children}</strong>
  ),
  code: ({ children }: { children: ReactNode }) => (
    <code className="bg-[var(--terminal-primary)]/10 text-[var(--terminal-secondary)] px-1.5 py-0.5 rounded text-sm">
      {children}
    </code>
  ),
};

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

function readProjectMdx(id: string, locale: string): string | null {
  const base = path.join(process.cwd(), "src/content/projects");
  // Localized file first, then the English fallback.
  for (const candidate of [locale, "en"]) {
    const filePath = path.join(base, candidate, `${id}.mdx`);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  }
  return null;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, id } = await params;
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const source = project.hasContent ? readProjectMdx(id, locale) : null;

  return (
    <ProjectDetailClient locale={locale as AppLocale} id={id} mdxAvailable={source !== null}>
      {source !== null ? <MDXRemote source={source} components={mdxComponents} /> : null}
    </ProjectDetailClient>
  );
}
