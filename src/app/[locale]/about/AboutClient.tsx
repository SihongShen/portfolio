"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import Terminal from "@/components/terminal/Terminal";
import MobileTerminalTrigger from "@/components/layout/MobileTerminalTrigger";
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
    <div className="w-full min-h-screen text-[var(--terminal-primary)] flex flex-col">
      {/* Global empty header placeholder for visual balance */}
      <header className="h-[72px] w-full shrink-0 flex justify-end items-center px-6">
        <MobileTerminalTrigger locale={locale as AppLocale} onLocaleChange={onLocaleChange} />
      </header>
      <main className="mx-auto max-w-5xl px-6 pb-16 w-full flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      <canvas id="three-about-bg" className="hidden" />
      <div className="hidden md:block">
        <Terminal locale={locale as AppLocale} onLocaleChange={onLocaleChange} floating />
      </div>
    </div>
  );
}