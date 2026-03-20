"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalInputProps {
  disabled?: boolean;
  onSubmit: (value: string) => void;
  onHistory: (direction: "up" | "down") => string;
  onCancel: () => void;
  prompt?: string;
}

export default function TerminalInput({
  disabled,
  onSubmit,
  onHistory,
  onCancel,
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
            if (event.ctrlKey && event.key.toLowerCase() === "c") {
              event.preventDefault();
              setValue("");
              onCancel();
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
