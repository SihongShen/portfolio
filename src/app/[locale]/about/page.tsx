import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { type ReactNode } from "react";
import AboutClient from "./AboutClient";
import { MdxH1, MdxH2, MdxP, MdxUl, MdxLi } from "@/components/mdx/MdxComponents";

const mdxComponents = {
  h1: MdxH1,
  h2: MdxH2,
  p: MdxP,
  ul: MdxUl,
  li: MdxLi,
  // Make strong tags slightly brighter or use secondary color
  strong: ({ children }: { children: ReactNode }) => (
    <strong className="text-[var(--terminal-secondary)] font-normal">{children}</strong>
  ),
  // Style inline code blocks for terminal feel
  code: ({ children }: { children: ReactNode }) => (
    <code className="bg-[var(--terminal-primary)]/10 text-[var(--terminal-secondary)] px-1.5 py-0.5 rounded text-sm">
      {children}
    </code>
  ),
};

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Path to the current locale's MDX file
  const filePath = path.join(process.cwd(), "src/content/about", `${locale}.mdx`);
  
  // Fallback to English if file not found locally
  const finalPath = fs.existsSync(filePath) 
    ? filePath 
    : path.join(process.cwd(), "src/content/about", "en.mdx");
    
  const source = fs.readFileSync(finalPath, "utf-8");

  return (
    <AboutClient locale={locale}>
      <div className="space-y-6">
        <MDXRemote source={source} components={mdxComponents} />
      </div>
    </AboutClient>
  );
}
