"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import IntroAnimation from "@/components/intro/IntroAnimation";
import Terminal from "@/components/terminal/Terminal";
import { isValidLocale, type AppLocale } from "@/lib/i18n";
import type { Phase } from "@/types/terminal";

const asciiWelcome = ` 
            ⋆｡ﾟ                                            ⋆                                  ⋆｡ﾟ
                                                                                            
            _/          _/  _/_/_/_/  _/          _/_/_/    _/_/    _/      _/  _/_/_/_/         ⋆｡ﾟ
            _/          _/  _/        _/        _/        _/    _/  _/_/  _/_/  _/          
    ⋆       _/    _/    _/  _/_/_/    _/        _/        _/    _/  _/  _/  _/  _/_/_/     ⋆｡ﾟ  
            _/  _/  _/    _/        _/        _/        _/    _/  _/      _/  _/            
        ⋆   _/  _/      _/_/_/_/  _/_/_/_/    _/_/_/    _/_/    _/      _/  _/_/_/_/           ☁︎｡⋆｡                                                                 
            ݁ ⊹ . ݁          ‧₊˚ ⋅.
                𖥔 ݁ ˖   ✦           ݁₊ ⊹ . ݁˖ . ݁༉‧₊˚..     . ݁˖ . ݁. ݁₊ ⊹ . ݁˖ . ݁༉‧₊˚..𖥔 ݁ ˖   ✦    ‧₊˚     ݁                                                                                           
                                                        ݁₊ ⊹                                      `;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default function HomePage({ params }: HomePageProps) {
  const { locale: routeLocale } = use(params);
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [locale, setLocale] = useState<AppLocale>(isValidLocale(routeLocale) ? routeLocale : "en");

  useEffect(() => {
    if (!isValidLocale(routeLocale)) {
      router.replace("/en");
      return;
    }

    setLocale(routeLocale);

    const preferred = localStorage.getItem("preferred-locale");
    if (preferred === "en" || preferred === "zh") {
      setLocale(preferred);
    }
  }, [routeLocale, router]);

  const welcomeLines = useMemo(
    () => [asciiWelcome, "Type 'help' to see available commands.", "────────────────────────────────────"],
    []
  );

  const switchLocale = (nextLocale: AppLocale) => {
    localStorage.setItem("preferred-locale", nextLocale);
    setLocale(nextLocale);
    router.push(`/${nextLocale}`);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <IntroAnimation
            key="intro"
            onComplete={(nextLocale) => {
              switchLocale(nextLocale);
              setPhase("terminal");
            }}
          />
        ) : null}
      </AnimatePresence>

      {phase === "terminal" ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.68 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 230, damping: 19, mass: 0.85 }}
        >
          <Terminal locale={locale} onLocaleChange={switchLocale} welcomeLines={welcomeLines} />
        </motion.div>
      ) : null}
    </div>
  );
}
