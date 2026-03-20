"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { use } from "react";
import Terminal from "@/components/terminal/Terminal";
import type { AppLocale } from "@/lib/i18n";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = use(params);
  const router = useRouter();

  const onLocaleChange = (nextLocale: AppLocale) => {
    localStorage.setItem("preferred-locale", nextLocale);
    router.push(`/${nextLocale}/about`);
  };

  return (
    <div className="min-h-screen bg-black text-[var(--terminal-primary)]">
      <main className="mx-auto max-w-5xl px-6 pb-16 pt-8 space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl tracking-wide"
        >
          About me
        </motion.h1>

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="mb-2 text-xl text-[var(--terminal-secondary)]">Profile</h2>
          <p>
            I build interactive digital products with a focus on frontend engineering, thoughtful motion, and
            terminal-inspired interfaces.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="mb-2 text-xl text-[var(--terminal-secondary)]">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "TypeScript",
              "Next.js",
              "Framer Motion",
              "React",
              "Node.js",
              "UI Engineering"
            ].map((skill) => (
              <span key={skill} className="border border-[var(--terminal-primary)]/40 px-2 py-1">
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="mb-2 text-xl text-[var(--terminal-secondary)]">Timeline</h2>
          <ul className="space-y-2 border-l border-[var(--terminal-primary)]/40 pl-4">
            <li>2026 — Building portfolio systems and interactive web experiments</li>
            <li>2025 — Frontend engineer, product and design collaboration</li>
            <li>2022 — Computer science education and startup projects</li>
          </ul>
        </motion.section>
      </main>

      <canvas id="three-about-bg" className="hidden" />
      <Terminal locale={locale as AppLocale} onLocaleChange={onLocaleChange} floating />
    </div>
  );
}
