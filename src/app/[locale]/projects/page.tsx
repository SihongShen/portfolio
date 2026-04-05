"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Terminal from "@/components/terminal/Terminal";
import MobileTerminalTrigger from "@/components/layout/MobileTerminalTrigger";
import { projects } from "@/data/projects";
import type { AppLocale } from "@/lib/i18n";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const t = useTranslations("projects");

  const sorted = useMemo(
    () => [...projects].sort((a, b) => (a.date < b.date ? 1 : -1)),
    []
  );

  const onLocaleChange = (nextLocale: AppLocale) => {
    localStorage.setItem("preferred-locale", nextLocale);
    router.push(`/${nextLocale}/projects`);
  };

  return (
    <div className="w-full min-h-screen text-[var(--terminal-primary)] flex flex-col relative">
      <header className="h-[72px] w-full shrink-0 flex items-center justify-between px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4" />
        <div className="flex items-center gap-6">
          <MobileTerminalTrigger locale={locale as AppLocale} onLocaleChange={onLocaleChange} />
        </div>
      </header>

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
                onClick={() => router.push(`/${locale}/projects/${project.id}`)}
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

      <canvas id="three-projects-bg" className="hidden" />
      <div className="hidden md:block">
        <Terminal locale={locale as AppLocale} onLocaleChange={onLocaleChange} floating />
      </div>
    </div>
  );
}
