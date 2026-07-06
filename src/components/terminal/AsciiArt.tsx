"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface AsciiArtProps {
  content: string;
}

// Renders ASCII art at its natural width, then scales it down with a CSS
// transform so it always fits the container without line wrapping.
export default function AsciiArt({ content }: AsciiArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  const normalized = useMemo(
    () =>
      content
        .split("\n")
        .map((line) => line.replace(/\s+$/, ""))
        .join("\n"),
    [content]
  );

  useEffect(() => {
    const container = containerRef.current;
    const pre = preRef.current;
    if (!container || !pre) {
      return;
    }

    const update = () => {
      const naturalWidth = pre.scrollWidth;
      const naturalHeight = pre.scrollHeight;
      if (!naturalWidth) {
        return;
      }

      const nextScale = Math.min(1, container.clientWidth / naturalWidth);
      setScale(nextScale);
      setScaledHeight(naturalHeight * nextScale);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [normalized]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden" style={{ height: scaledHeight }}>
      <pre
        ref={preRef}
        className="inline-block whitespace-pre font-mono"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {normalized}
      </pre>
    </div>
  );
}
