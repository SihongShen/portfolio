"use client";

import { Suspense, use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Terminal from "@/components/terminal/Terminal";
import MobileTerminalTrigger from "@/components/layout/MobileTerminalTrigger";
import { projects } from "@/data/projects";
import { rememberLocale, type AppLocale } from "@/lib/i18n";

const ALL_TAGS = Array.from(new Set(projects.flatMap((project) => project.tags))).sort((a, b) =>
  a.localeCompare(b)
);

const SORTED_PROJECTS = [...projects].sort((a, b) => (a.date < b.date ? 1 : -1));

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

interface ProjectsViewProps {
  locale: AppLocale;
  selectedTags: string[];
  onTagsChange: (next: string[]) => void;
}

function ProjectsView({ locale, selectedTags, onTagsChange }: ProjectsViewProps) {
  const t = useTranslations("projects");
  const [query, setQuery] = useState("");

  const toggleTag = (tag: string) => {
    onTagsChange(
      selectedTags.includes(tag) ? selectedTags.filter((item) => item !== tag) : [...selectedTags, tag]
    );
  };

  const clearFilters = () => {
    setQuery("");
    onTagsChange([]);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const visible = SORTED_PROJECTS.filter((project) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => project.tags.includes(tag));
    if (!matchesTags) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [project.name.en, project.name.zh, ...project.tags, ...project.techStack]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const hasActiveFilters = selectedTags.length > 0 || normalizedQuery.length > 0;

  return (
    <>
      

      {visible.length === 0 ? (
        <p className="text-[var(--terminal-secondary)] opacity-70">{t("noResults")}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {visible.map((project) => (
            <Link
              key={project.id}
              href={`/${locale}/projects/${project.id}`}
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
                {project.name[locale]}
              </span>

              <div className="absolute right-0 top-0 bottom-0 w-4/5 md:w-3/5 flex items-center justify-end pr-8 pl-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-gradient-to-r from-transparent via-black to-black pointer-events-none">
                <span className="truncate text-[var(--terminal-secondary)] text-base md:text-lg opacity-90 group-hover:drop-shadow-[0_0_8px_var(--terminal-secondary)]">
                  {project.description[locale]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

// Reads ?tag= reactively so terminal-driven filters apply even when the page
// is already mounted (query-only navigation doesn't remount the component).
function ProjectsViewWithParams({ locale }: { locale: AppLocale }) {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");

  const selectedTags = useMemo(() => {
    if (!tagParam) {
      return [];
    }
    return tagParam.split(",").filter((tag) => ALL_TAGS.includes(tag));
  }, [tagParam]);

  const onTagsChange = (next: string[]) => {
    const params = new URLSearchParams(window.location.search);
    if (next.length) {
      params.set("tag", next.join(","));
    } else {
      params.delete("tag");
    }
    const qs = params.toString();
    // Native replaceState keeps useSearchParams in sync (Next shallow routing).
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };

  return <ProjectsView locale={locale} selectedTags={selectedTags} onTagsChange={onTagsChange} />;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale: routeLocale } = use(params);
  const locale = routeLocale as AppLocale;
  const router = useRouter();
  const t = useTranslations("projects");

  const onLocaleChange = (nextLocale: AppLocale) => {
    rememberLocale(nextLocale);
    router.push(`/${nextLocale}/projects`);
  };

  return (
    <div className="w-full min-h-screen text-[var(--terminal-primary)] flex flex-col relative">
      <header className="h-[72px] w-full shrink-0 flex items-center justify-between px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4" />
        <div className="flex items-center gap-6">
          <MobileTerminalTrigger locale={locale} onLocaleChange={onLocaleChange} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pb-16 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="mb-6 text-3xl">{t("title")}</h1>
          {/* The fallback renders the unfiltered list so static HTML still contains every project link. */}
          <Suspense fallback={<ProjectsView locale={locale} selectedTags={[]} onTagsChange={() => {}} />}>
            <ProjectsViewWithParams locale={locale} />
          </Suspense>
        </motion.div>
      </main>

      <canvas id="three-projects-bg" className="hidden" />
      <div className="hidden md:block">
        <Terminal locale={locale} onLocaleChange={onLocaleChange} floating />
      </div>
    </div>
  );
}
