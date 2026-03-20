"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AppLocale } from "@/lib/i18n";

interface IntroAnimationProps {
  onComplete: (locale: AppLocale) => void;
}

const baseText = "initializing...";

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typedCount, setTypedCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canSelectLanguage, setCanSelectLanguage] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedLocale, setSelectedLocale] = useState<AppLocale | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const loadingDoneTimeoutRef = useRef<number | null>(null);
  const maxProgress = useMemo(() => Math.floor(Math.random() * 11) + 80, []);

  useEffect(() => {
    const cursorTimer = window.setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    const startTyping = window.setTimeout(() => {
      let index = 0;
      const typingTimer = window.setInterval(() => {
        index += 1;
        setTypedCount(index);
        if (index >= baseText.length) {
          window.clearInterval(typingTimer);
        }
      }, 80);
    }, 1000);

    return () => {
      window.clearInterval(cursorTimer);
      window.clearTimeout(startTyping);
    };
  }, []);

  useEffect(() => {
    if (typedCount < baseText.length || isFinishing || canSelectLanguage) {
      return;
    }

    if (loadingTimerRef.current !== null) {
      return;
    }

    loadingTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= maxProgress) {
          if (loadingTimerRef.current !== null) {
            window.clearInterval(loadingTimerRef.current);
            loadingTimerRef.current = null;
          }

          if (loadingDoneTimeoutRef.current !== null) {
            window.clearTimeout(loadingDoneTimeoutRef.current);
          }

          loadingDoneTimeoutRef.current = window.setTimeout(() => setCanSelectLanguage(true), 220);
          return maxProgress;
        }

        return Math.min(maxProgress, prev + Math.max(1, Math.floor(Math.random() * 5)));
      });
    }, 120);

    return () => {
      if (loadingTimerRef.current !== null) {
        window.clearInterval(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }

      if (loadingDoneTimeoutRef.current !== null) {
        window.clearTimeout(loadingDoneTimeoutRef.current);
        loadingDoneTimeoutRef.current = null;
      }
    };
  }, [canSelectLanguage, isFinishing, maxProgress, typedCount]);

  useEffect(() => {
    if (!canSelectLanguage) {
      return;
    }

    inputRef.current?.focus();
  }, [canSelectLanguage]);

  useEffect(() => {
    if (!selectedLocale) {
      return;
    }

    setTypedCount(baseText.length);
    setCanSelectLanguage(false);
    setIsFinishing(true);

    const fillTimer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(fillTimer);

          const waitMs = Math.floor(Math.random() * 1001) + 1000;
          window.setTimeout(() => {
            onComplete(selectedLocale);
          }, waitMs);

          return 100;
        }

        return Math.min(100, prev + Math.max(1, Math.floor(Math.random() * 6)));
      });
    }, 90);

    return () => {
      window.clearInterval(fillTimer);
    };
  }, [onComplete, selectedLocale]);

  const handleSelect = (locale: AppLocale) => {
    if (selectedLocale || isFinishing) {
      return;
    }

    setSelectedLocale(locale);
  };

  const handleSubmit = () => {
    const normalized = inputValue.trim().toLowerCase();
    if (normalized === "en") {
      handleSelect("en");
      return;
    }

    if (normalized === "中文" || normalized === "zh") {
      handleSelect("zh");
    }
  };

  const shownProgress = isFinishing ? progress : Math.min(progress, maxProgress);

  return (
    <div className="crt-overlay relative flex min-h-screen w-full items-start justify-start bg-black p-6 text-[var(--terminal-primary)]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 leading-[1.25]">
        <div className="whitespace-pre">
          {baseText.slice(0, typedCount)}
          <span className="inline-block w-2">{cursorVisible ? "_" : " "}</span>
        </div>

        {canSelectLanguage ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 leading-[1.25]">
            <p>&gt; Select language / 选择语言</p>
            <div className="flex items-center gap-3">
              <button className="hover:text-[var(--terminal-secondary)]" onClick={() => handleSelect("en")}>
                EN
              </button>
              <span>/</span>
              <button className="hover:text-[var(--terminal-secondary)]" onClick={() => handleSelect("zh")}>
                中文
              </button>
            </div>
            <p>Type in EN or 中文 to continue...</p>
            <label className="flex items-center gap-2">
              <span>&gt;</span>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSubmit();
                  }
                }}
                className="w-56 bg-transparent outline-none"
              />
            </label>
          </motion.div>
        ) : null}

        {isFinishing ? <p>Finalizing...</p> : null}

        {typedCount >= baseText.length ? (
          <>
            <div className="h-2 w-72 border border-[var(--terminal-primary)]/80">
              <motion.div
                className="h-full bg-[var(--terminal-primary)]"
                animate={{ width: `${shownProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div>{shownProgress}%</div>
          </>
        ) : null}
      </motion.div>
    </div>
  );
}
