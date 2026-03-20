"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { AppLocale } from "@/lib/i18n";

interface LanguageSelectProps {
  onSelect: (locale: AppLocale) => void;
}

export default function LanguageSelect({ onSelect }: LanguageSelectProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const normalized = value.trim().toLowerCase();
    if (normalized === "en") {
      onSelect("en");
      return;
    }

    if (normalized === "中文" || normalized === "zh") {
      onSelect("zh");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen w-full items-start justify-start bg-black p-6"
    >
      <div className="space-y-4 text-[var(--terminal-primary)]">
        <p>&gt; Select language / 选择语言</p>
        <div className="flex items-center gap-4">
          <button className="border border-[var(--terminal-primary)] px-3 py-1 hover:bg-[var(--terminal-primary)]/10" onClick={() => onSelect("en")}>
            EN
          </button>
          <button className="border border-[var(--terminal-primary)] px-3 py-1 hover:bg-[var(--terminal-primary)]/10" onClick={() => onSelect("zh")}>
            中文
          </button>
        </div>
        <p>Type in EN or 中文 to continue...</p>
        <div className="flex items-center gap-2">
          <span>&gt;</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            className="w-56 bg-transparent outline-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
