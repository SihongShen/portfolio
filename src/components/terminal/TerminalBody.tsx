"use client";

import { useEffect, useRef } from "react";
import type { TerminalLine } from "@/types/terminal";
import AsciiArt from "./AsciiArt";

interface TerminalBodyProps {
  lines: TerminalLine[];
  onTagClick?: (tag: string) => void;
}

export default function TerminalBody({ lines, onTagClick }: TerminalBodyProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines]);

  return (
    <div ref={scrollRef} className="terminal-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-4 py-3">
      <div className="space-y-1 whitespace-pre-wrap">
        {lines.map((line) => {
          if (line.type === "tags") {
            return (
              <div key={line.id} className="flex flex-wrap gap-2 py-1">
                {line.content
                  .split(",")
                  .filter(Boolean)
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagClick?.(tag)}
                      className="border border-[var(--terminal-secondary)]/40 px-2 py-0.5 text-sm text-[var(--terminal-secondary)] hover:border-[var(--terminal-primary)]/60 hover:bg-[var(--terminal-primary)]/10 hover:text-[var(--terminal-primary)] transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
              </div>
            );
          }

          const isAsciiArt = line.type === "system" && line.content.includes("\n");

          return (
            <div
              key={line.id}
              className={
                line.type === "input"
                  ? "text-[var(--terminal-primary)] opacity-80"
                  : line.type === "error"
                    ? "text-[var(--terminal-danger)]"
                    : "text-[var(--terminal-primary)]"
              }
            >
              {isAsciiArt ? <AsciiArt content={line.content} /> : line.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
