import type { TerminalLine } from "@/types/terminal";

interface TerminalBodyProps {
  lines: TerminalLine[];
}

export default function TerminalBody({ lines }: TerminalBodyProps) {
  return (
    <div className="terminal-scrollbar flex-1 overflow-y-auto px-4 py-3">
      <div className="space-y-1 whitespace-pre-wrap">
        {lines.map((line) => (
          <div key={line.id} className={line.type === "input" ? "text-[var(--terminal-secondary)]" : "text-[var(--terminal-primary)]"}>
            {line.content}
          </div>
        ))}
      </div>
    </div>
  );
}
