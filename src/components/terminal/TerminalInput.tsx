"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalInputProps {
  disabled?: boolean;
  onSubmit: (value: string) => void;
  onHistory: (direction: "up" | "down") => string;
  onCancel: () => void;
  canCancel?: boolean;
  completions?: string[];
  // Per-command argument completions, e.g. { lang: ["en", "zh"] }.
  argCompletions?: Record<string, string[]>;
  prompt?: string;
}

function longestCommonPrefix(values: string[]): string {
  let prefix = values[0] ?? "";
  for (const value of values) {
    while (!value.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

export default function TerminalInput({
  disabled,
  onSubmit,
  onHistory,
  onCancel,
  canCancel = false,
  completions = [],
  argCompletions = {},
  prompt = "$"
}: TerminalInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div className="border-t border-[var(--terminal-primary)]/40 px-4 py-3">
      <label className="flex items-center gap-2">
        <span className="text-[var(--terminal-secondary)]">{prompt}</span>
        <input
          ref={inputRef}
          value={value}
          disabled={disabled}
          className="flex-1 bg-transparent text-[var(--terminal-primary)] outline-none"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            // While an IME composition is active (e.g. pinyin input), Enter commits
            // the composition and arrows navigate candidates — leave them alone.
            if (event.nativeEvent.isComposing) {
              return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "c") {
              const target = event.currentTarget;
              const hasSelection = target.selectionStart !== target.selectionEnd;
              // Let Ctrl+C copy selected text, and do nothing outside the contact flow.
              if (hasSelection || !canCancel) {
                return;
              }

              event.preventDefault();
              setValue("");
              onCancel();
              return;
            }

            if (event.key === "Tab") {
              event.preventDefault();
              const current = value;

              // Argument completion, e.g. "lang z" -> "lang zh", "projects vid" -> "projects video".
              const argMatch = current.match(/^(\S+)\s+(.*)$/);
              if (argMatch) {
                const options = argCompletions[argMatch[1].toLowerCase()] ?? [];
                const rest = argMatch[2];
                const matches = options.filter((option) => option.toLowerCase().startsWith(rest.toLowerCase()));
                if (matches.length === 1) {
                  setValue(`${argMatch[1]} ${matches[0]}`);
                } else if (matches.length > 1) {
                  const prefix = longestCommonPrefix(matches);
                  if (prefix.length > rest.length) {
                    setValue(`${argMatch[1]} ${prefix}`);
                  }
                }
                return;
              }

              if (!current || current.includes(" ")) {
                return;
              }

              const matches = completions.filter((name) => name.startsWith(current.toLowerCase()));
              if (matches.length === 1) {
                setValue(`${matches[0]} `);
              } else if (matches.length > 1) {
                const prefix = longestCommonPrefix(matches);
                if (prefix.length > current.length) {
                  setValue(prefix);
                }
              }
              return;
            }

            if (event.key === "Enter") {
              event.preventDefault();
              const next = value;
              setValue("");
              onSubmit(next);
              return;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setValue(onHistory("up"));
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setValue(onHistory("down"));
            }
          }}
        />
      </label>
    </div>
  );
}
