interface TerminalHeaderProps {
  onDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onClose?: () => void;
}

export default function TerminalHeader({ onDragStart, onClose }: TerminalHeaderProps) {
  return (
    <div
      className="flex items-center justify-between border-b border-[var(--terminal-primary)]/40 px-3 py-2 cursor-grab active:cursor-grabbing"
      onPointerDown={onDragStart}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[var(--terminal-primary)]">~ &gt; terminal</span>
      </div>
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-[var(--terminal-primary)] hover:text-white transition-colors px-2 text-xs md:hidden"
          aria-label="Close terminal"
          onPointerDown={(e) => e.stopPropagation()}
        >
          [X]
        </button>
      )}
    </div>
  );
}
