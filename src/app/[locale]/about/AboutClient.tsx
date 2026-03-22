"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import Terminal from "@/components/terminal/Terminal";
import type { AppLocale } from "@/lib/i18n";
import { motion } from "framer-motion";

interface AboutClientProps {
  children: ReactNode;
  locale: string;
}

export default function AboutClient({ children, locale }: AboutClientProps) {
  const router = useRouter();

  const onLocaleChange = (nextLocale: AppLocale) => {
    localStorage.setItem("preferred-locale", nextLocale);
    router.push(`/${nextLocale}/about`);
  };

  return (
    <div className="min-h-screen bg-black text-[var(--terminal-primary)]">
      <main className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      <canvas id="three-about-bg" className="hidden" />
      <Terminal locale={locale as AppLocale} onLocaleChange={onLocaleChange} floating />
    </div>
  );
}