import type { Command } from "@/types/terminal";

interface HelpCommandProps {
  commands: Command[];
}

export default function HelpCommand({ commands }: HelpCommandProps) {
  return (
    <div className="space-y-1">
      {commands.map((command) => (
        <div key={command.name}>
          <span className="text-[var(--terminal-secondary)]">{command.name}</span>
          <span className="text-[var(--terminal-primary)]"> — {command.description}</span>
        </div>
      ))}
    </div>
  );
}
