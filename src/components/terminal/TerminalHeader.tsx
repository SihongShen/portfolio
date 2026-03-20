interface TerminalHeaderProps {
  onDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
}

export default function TerminalHeader({ onDragStart }: TerminalHeaderProps) {
  return (
    <div
      className="flex items-center gap-2 border-b border-[var(--terminal-primary)]/40 px-3 py-2 cursor-grab active:cursor-grabbing"
      onPointerDown={onDragStart}
    >
      <span className="h-3 w-3 bg-[var(--terminal-danger)]" />
      <span className="h-3 w-3 bg-[var(--terminal-secondary)]" />
      <span className="h-3 w-3 bg-[var(--terminal-accent)]" />
      <span className="ml-2 text-xs text-[var(--terminal-primary)]/80">~ &gt; terminal</span>
    </div>
  );
}
