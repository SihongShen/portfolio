"use client";

import { use, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Terminal from "@/components/terminal/Terminal";
import MobileTerminalTrigger from "@/components/layout/MobileTerminalTrigger";
import { projects } from "@/data/projects";
import type { AppLocale } from "@/lib/i18n";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { getProjectMdxSerialized } from "@/app/actions/project";
import { MdxH1, MdxH2, MdxH3, MdxP, MdxUl, MdxLi, MdxA } from "@/components/mdx/MdxComponents";

const mdxComponents = {
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  p: MdxP,
  ul: MdxUl,
  li: MdxLi,
  a: MdxA,
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-[var(--terminal-primary)] font-bold font-medium drop-shadow-[0_0_8px_rgba(81,204,220,0.5)]">{children}</strong>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-[var(--terminal-primary)]/10 text-[var(--terminal-secondary)] px-1.5 py-0.5 rounded text-sm">
      {children}
    </code>
  ),
};

function useProjectContent(projectId: string | null, locale: string) {
  const [content, setContent] = useState<MDXRemoteSerializeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setContent(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    getProjectMdxSerialized(projectId, locale).then((res) => {
      if (isMounted) {
        if (res.success && res.compiled) {
          setContent(res.compiled);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [projectId, locale]);

  return { content, isLoading };
}

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, id } = use(params);
  const router = useRouter();
  const t = useTranslations("projects");

  const sorted = useMemo(
    () => [...projects].sort((a, b) => (a.date < b.date ? 1 : -1)),
    []
  );

  const selected = sorted.find((item) => item.id === id) || null;
  const selectedIndex = sorted.findIndex((item) => item.id === id);

  const { content: mdxContent, isLoading: isMdxLoading } = useProjectContent(selected?.hasContent ? selected.id : null, locale);

  const onLocaleChange = (nextLocale: AppLocale) => {
    localStorage.setItem("preferred-locale", nextLocale);
    router.push(`/${nextLocale}/projects/${id}`);
  };

  if (!selected) {
    return (
      <div className="w-full min-h-screen text-[var(--terminal-primary)] flex flex-col items-center justify-center relative">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Project not found</h1>
          <button 
            onClick={() => router.push(`/${locale}/projects`)}
            className="border border-[var(--terminal-primary)]/40 px-4 py-2 hover:bg-[var(--terminal-primary)]/10 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-[var(--terminal-primary)] flex flex-col relative">
      <header className="h-[72px] w-full shrink-0 flex items-center justify-between px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4">
          <button 
            className="pointer-events-auto border border-[var(--terminal-primary)]/40 px-4 py-2 hover:bg-[var(--terminal-primary)]/10 transition-colors" 
            onClick={() => router.push(`/${locale}/projects`)}
          >
            ← Back
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-[var(--terminal-secondary)]">
            {locale === "zh" ? "项目档案" : "Project Archive"}
          </div>
          <MobileTerminalTrigger locale={locale as AppLocale} onLocaleChange={onLocaleChange} />
        </div>
      </header>

      <main className="relative w-full flex-1 px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-3xl">{selected.name[locale as "en" | "zh"]}</h2>
            <p>{selected.date}</p>
            
            <div className="flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span key={tag} className="px-1 py-1 text-[var(--terminal-secondary)]">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {selected.techStack.map((item) => (
                <span key={item} className="border border-[var(--terminal-secondary)]/40 px-2 py-1 text-[var(--terminal-secondary)] text-sm">
                  {item}
                </span>
              ))}
            </div>

            {selected.featuredImage && (
              <div className="w-full aspect-video border border-[var(--terminal-primary)]/20 my-8 flex items-center justify-center relative overflow-hidden group cursor-crosshair">
                {/* 虚构的静止底图占位 */}
                <Image 
                  src={selected.featuredImage} 
                  alt={selected.name[locale as "en" | "zh"]}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* 2. Hover 后浮现的终端覆盖层 (扫描线 + 发光变色底色) */}
                <div className="absolute inset-0 bg-[var(--terminal-primary)]/20 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-20 mix-blend-screen pointer-events-none" />
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-20"
                  style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--terminal-primary) 2px, var(--terminal-primary) 4px)' }}
                />
                
                {/* Hover 唤醒的内边框高亮 */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--terminal-primary)]/60 transition-colors duration-300 z-30 pointer-events-none" />
              </div>
            )}

            <p className="leading-relaxed text-lg pt-4">{selected.description[locale as "en" | "zh"]}</p>
            
            {(selected.documentationVideo || selected.repoLink) && (
              <div className="flex flex-wrap gap-4 pt-4 pb-4">
                {selected.documentationVideo && (
                  <p className="text-sm text-[var(--terminal-secondary)] opacity-70">
                    <a 
                      href={selected.documentationVideo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-[var(--terminal-primary)] transition-colors underline decoration-dashed underline-offset-4"
                    >
                      [ Live Here ]
                    </a>
                  </p>
                )}
                {selected.repoLink && (
                  <p className="text-sm text-[var(--terminal-secondary)] opacity-70">
                    <a 
                      href={selected.repoLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-[var(--terminal-primary)] transition-colors underline decoration-dashed underline-offset-4"
                    >
                      [ Code Here ]
                    </a>
                  </p>
                )}
              </div>
            )}

            {/* MDX Content Area */}
            {selected.hasContent && (
              <div className="pt-6 border-t border-[var(--terminal-primary)]/20">
                <div className="space-y-6">
                  {isMdxLoading ? (
                    <div className="animate-pulse flex items-center gap-4 text-[var(--terminal-secondary)] pb-12">
                      <div className="w-2 h-4 bg-[var(--terminal-primary)]/60" />
                      Accessing project records...
                    </div>
                  ) : mdxContent ? (
                    <div className="pb-16">
                      <MDXRemote {...mdxContent} components={mdxComponents} />
                    </div>
                  ) : (
                    <div className="text-[var(--terminal-secondary)] opacity-50 pb-12">
                      [ ERROR: RECORDS_UNAVAILABLE ]
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="pointer-events-none fixed inset-y-0 left-0 w-full max-w-[calc(50vw-448px)] flex justify-center hidden md:flex">
            <div className="relative h-full w-[120px]">
              {selectedIndex > 0 ? (
                <div className="absolute top-1/2 -translate-y-1/2 left-0">
                  <button 
                    className="pointer-events-auto border border-[var(--terminal-primary)]/40 px-4 py-3 text-lg hover:bg-[var(--terminal-primary)]/10 transition-colors" 
                    onClick={() => router.push(`/${locale}/projects/${sorted[selectedIndex - 1].id}`)}
                  >
                    ←
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="pointer-events-none fixed inset-y-0 right-0 w-full max-w-[calc(50vw-448px)] justify-center hidden md:flex">
            <div className="relative h-full w-[120px]">
              {selectedIndex < sorted.length - 1 ? (
                <div className="absolute top-1/2 -translate-y-1/2 right-0">
                  <button 
                    className="pointer-events-auto border border-[var(--terminal-primary)]/40 px-4 py-3 text-lg hover:bg-[var(--terminal-primary)]/10 transition-colors" 
                    onClick={() => router.push(`/${locale}/projects/${sorted[selectedIndex + 1].id}`)}
                  >
                    →
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <canvas id="three-projects-bg" className="hidden" />
      <div className="hidden md:block">
        <Terminal locale={locale as AppLocale} onLocaleChange={onLocaleChange} floating />
      </div>
    </div>
  );
}
