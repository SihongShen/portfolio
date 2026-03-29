"use client";

import { use, useEffect, useMemo, useState, type ReactNode } from "react";
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

// --- MDX fetch 调用 ---
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
        } else {
          setContent(null);
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

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const t = useTranslations("projects");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...projects].sort((a, b) => (a.date < b.date ? 1 : -1)),
    []
  );

  const selectedIndex = sorted.findIndex((item) => item.id === selectedId);
  const selected = selectedIndex >= 0 ? sorted[selectedIndex] : null;

  const { content: mdxContent, isLoading: isMdxLoading } = useProjectContent(selected?.hasContent ? selected.id : null, locale);

  const onLocaleChange = (nextLocale: AppLocale) => {
    localStorage.setItem("preferred-locale", nextLocale);
    router.push(`/${nextLocale}/projects`);
  };

  return (
    <div className="w-full min-h-screen text-[var(--terminal-primary)] flex flex-col relative">
      <header className="h-[72px] w-full shrink-0 flex items-center justify-between px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4">
          {selected && (
            <button 
              className="md:hidden pointer-events-auto border border-[var(--terminal-primary)]/40 px-4 py-2 hover:bg-[var(--terminal-primary)]/10 transition-colors" 
              onClick={() => setSelectedId(null)}
            >
              ← Back
            </button>
          )}
        </div>
        <div className="flex items-center gap-6">
          {selected && (
            <div className="text-[var(--terminal-secondary)]">
              {locale === "zh" ? "项目档案" : "Project Archive"}
            </div>
          )}
          <MobileTerminalTrigger locale={locale as AppLocale} onLocaleChange={onLocaleChange} />
        </div>
      </header>
      
      {!selected ? (
        <main className="mx-auto w-full max-w-5xl px-6 pb-16 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="mb-6 text-3xl">{t("title")}</h1>
            <div className="flex flex-col gap-5">
              {sorted.map((project) => (
                <button
                key={project.id}
                onClick={() => setSelectedId(project.id)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                }}
                className="group relative w-full h-[88px] bg-black flex items-center cursor-pointer transition-all duration-500 hover:shadow-[inset_0_0_25px_var(--terminal-primary),_0_0_15px_var(--terminal-primary),_0_0_30px_var(--terminal-primary),_0_0_50px_var(--terminal-primary)] border border-transparent hover:border-transparent outline-none overflow-hidden"
              >
                {/* 1. 初始状态端点角，hover时平滑拉长闭合 */}
                <div className="absolute top-0 left-0 h-[2px] w-[15px] bg-[var(--terminal-primary)] transition-all duration-500 group-hover:w-full z-30" />
                <div className="absolute bottom-0 right-0 h-[2px] w-[15px] bg-[var(--terminal-primary)] transition-all duration-500 group-hover:w-full z-30" />
                <div className="absolute top-0 left-0 w-[2px] h-[15px] bg-[var(--terminal-primary)] transition-all duration-500 group-hover:h-full z-30" />
                <div className="absolute bottom-0 right-0 w-[2px] h-[15px] bg-[var(--terminal-primary)] transition-all duration-500 group-hover:h-full z-30" />

                {/* 2. 动态鼠标光斑渲染 (照亮区域) */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  style={{
                    background: "radial-gradient(280px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(81,204,220,0.15) 0%, transparent 100%)",
                  }}
                />

                <span className="absolute left-1/2 -translate-x-1/2 group-hover:left-8 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] whitespace-nowrap text-2xl font-medium tracking-wide z-20 text-[var(--terminal-primary)] group-hover:text-[var(--terminal-primary)] group-hover:drop-shadow-[0_0_8px_var(--terminal-primary)]">
                  {project.name[locale as "en" | "zh"]}
                </span>

                <div className="absolute right-0 top-0 bottom-0 w-4/5 md:w-3/5 flex items-center justify-end pr-8 pl-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-gradient-to-r from-transparent via-black to-black pointer-events-none">
                  <span className="truncate text-[var(--terminal-secondary)] text-base md:text-lg opacity-90 group-hover:drop-shadow-[0_0_8px_var(--terminal-secondary)]">
                    {project.description[locale as "en" | "zh"]}
                  </span>
                </div>
              </button>
            ))}
            </div>
          </motion.div>
        </main>
      ) : (
        <section className="relative w-full flex-1 px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
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

              <div className="w-full aspect-video border border-[var(--terminal-primary)]/20 my-8 flex items-center justify-center relative overflow-hidden group cursor-crosshair">
                {/* 1. 虚构的静止底图占位 (如果在 TS 数据里配了 featuredImage，则渲染 Image 图片) */}
                {selected.featuredImage ? (
                  <Image 
                    src={selected.featuredImage} 
                    alt={selected.name[locale as "en" | "zh"]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div 
                    className="absolute inset-0 bg-[#050505] transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* 文字占位仅在没有图片时显示 */}
                {!selected.featuredImage && (
                  <span className="text-[var(--terminal-primary)]/40 font-mono z-10 transition-opacity duration-300 group-hover:opacity-0 relative">
                    [ MEDIA_FRAME_PLACEHOLDER ]
                  </span>
                )}

                {/* 2. Hover 后浮现的终端覆盖层 (扫描线 + 发光变色底色) */}
                <div className="absolute inset-0 bg-[var(--terminal-primary)]/20 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-20 mix-blend-screen pointer-events-none" />
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-20"
                  style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--terminal-primary) 2px, var(--terminal-primary) 4px)' }}
                />
                
                {/* Hover 唤醒的内边框高亮 */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--terminal-primary)]/60 transition-colors duration-300 z-30 pointer-events-none" />
              </div>

              <p className="leading-relaxed text-lg pt-4">{selected.description[locale as "en" | "zh"]}</p>
              
              {selected.documentationVideo && (
                <p className="text-sm text-[var(--terminal-secondary)] pb-8 opacity-70">
                  <a 
                    href={selected.documentationVideo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-[var(--terminal-primary)] transition-colors underline decoration-dashed underline-offset-4"
                  >
                    [ Watch Documentation Video ]
                  </a>
                </p>
              )}

              {/* MDX Content Area */}
              {selected.hasContent && (
                <div className="mt-6 border-t border-[var(--terminal-primary)]/20">
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
            </div>
          </div>
          <div className="pointer-events-none fixed inset-y-0 left-0 w-full max-w-[calc(50vw-448px)] flex justify-center hidden md:flex">
            <div className="relative h-full w-[120px]">
              <div className="absolute top-[72px] left-0">
                <button 
                  className="pointer-events-auto border border-[var(--terminal-primary)]/40 px-4 py-2 hover:bg-[var(--terminal-primary)]/10 transition-colors" 
                  onClick={() => setSelectedId(null)}
                >
                  ← Back
                </button>
              </div>
              {selectedIndex > 0 ? (
                <div className="absolute top-1/2 -translate-y-1/2 left-0">
                  <button 
                    className="pointer-events-auto border border-[var(--terminal-primary)]/40 px-4 py-3 text-lg hover:bg-[var(--terminal-primary)]/10 transition-colors" 
                    onClick={() => setSelectedId(sorted[selectedIndex - 1].id)}
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
                    onClick={() => setSelectedId(sorted[selectedIndex + 1].id)}
                  >
                    →
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      <canvas id="three-projects-bg" className="hidden" />
      <div className="hidden md:block">
        <Terminal locale={locale as AppLocale} onLocaleChange={onLocaleChange} floating />
      </div>
    </div>
  );
}
