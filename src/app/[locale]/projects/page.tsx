"use client";

import { motion } from "framer-motion";
import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Terminal from "@/components/terminal/Terminal";
import { projects } from "@/data/projects";
import type { AppLocale } from "@/lib/i18n";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...projects].sort((a, b) => (a.date < b.date ? 1 : -1)),
    []
  );

  const selectedIndex = sorted.findIndex((item) => item.id === selectedId);
  const selected = selectedIndex >= 0 ? sorted[selectedIndex] : null;

  const onLocaleChange = (nextLocale: AppLocale) => {
    localStorage.setItem("preferred-locale", nextLocale);
    router.push(`/${nextLocale}/projects`);
  };

  return (
    <div className="min-h-screen bg-black text-[var(--terminal-primary)]">
      {!selected ? (
        <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
          <h1 className="mb-6 text-3xl">Projects</h1>
          <div className="grid gap-3 md:grid-cols-2">
            {sorted.map((project) => (
              <motion.button
                key={project.id}
                whileHover={{ borderColor: "var(--terminal-secondary)", x: 4 }}
                onClick={() => setSelectedId(project.id)}
                className="border border-[var(--terminal-primary)]/40 px-4 py-4 text-left"
              >
                {project.name}
              </motion.button>
            ))}
          </div>
        </main>
      ) : (
        <section className="relative min-h-screen px-6 pb-16 pt-8">
          <button className="mb-4 border border-[var(--terminal-primary)]/40 px-3 py-1" onClick={() => setSelectedId(null)}>
            ← Back
          </button>
          <div className="mx-auto max-w-4xl space-y-4">
            <h2 className="text-3xl">{selected.name}</h2>
            <p>{selected.date}</p>
            <div className="flex flex-wrap gap-2">
              {selected.techStack.map((item) => (
                <span key={item} className="border border-[var(--terminal-primary)]/40 px-2 py-1">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span key={tag} className="border border-[var(--terminal-secondary)]/40 px-2 py-1 text-[var(--terminal-secondary)]">
                  #{tag}
                </span>
              ))}
            </div>
            <p>{selected.description}</p>
            <p>Documentation video: {selected.documentationVideo}</p>
          </div>
          <div className="pointer-events-none fixed inset-y-0 left-0 flex items-center pl-3">
            {selectedIndex > 0 ? (
              <button className="pointer-events-auto border border-[var(--terminal-primary)]/40 px-3 py-2" onClick={() => setSelectedId(sorted[selectedIndex - 1].id)}>
                ←
              </button>
            ) : null}
          </div>
          <div className="pointer-events-none fixed inset-y-0 right-0 flex items-center pr-3">
            {selectedIndex < sorted.length - 1 ? (
              <button className="pointer-events-auto border border-[var(--terminal-primary)]/40 px-3 py-2" onClick={() => setSelectedId(sorted[selectedIndex + 1].id)}>
                →
              </button>
            ) : null}
          </div>
        </section>
      )}

      <canvas id="three-projects-bg" className="hidden" />
      <Terminal locale={locale as AppLocale} onLocaleChange={onLocaleChange} floating />
    </div>
  );
}
