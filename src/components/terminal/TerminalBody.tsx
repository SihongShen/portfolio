"use client";

import { useEffect, useRef } from "react";
import type { TerminalLine } from "@/types/terminal";
import AsciiArt from "./AsciiArt";

interface TerminalBodyProps {
  lines: TerminalLine[];
}

export default function TerminalBody({ lines }: TerminalBodyProps) {
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
