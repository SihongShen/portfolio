interface TerminalHeaderProps {
  onDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
}

export default function TerminalHeader({ onDragStart }: TerminalHeaderProps) {
  return (
    <div
      className="flex items-center gap-2 border-b border-[var(--terminal-primary)]/40 px-3 py-2 cursor-grab active:cursor-grabbing"
      onPointerDown={onDragStart}
    >
      <span className="text-sm font-bold text-[var(--terminal-primary)]">~ &gt; terminal</span>
    </div>
  );
}
