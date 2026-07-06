"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type ReactNode } from "react";

export function MdxSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-8"
    >
      {children}
    </motion.section>
  );
}

export function MdxH1({ children }: { children: ReactNode }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 text-3xl tracking-wide"
    >
      {children}
    </motion.h1>
  );
}

export function MdxH2({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 mt-8 text-xl text-[var(--terminal-secondary)]">{children}</h2>;
}

export function MdxH3({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 mt-6 text-lg font-regular">{children}</h3>;
}

export function MdxUl({ children }: { children: ReactNode }) {
  return <ul className="space-y-2 border-l border-[var(--terminal-primary)]/40 pl-4 mb-4">{children}</ul>;
}

export function MdxLi({ children }: { children: ReactNode }) {
  return <li className="pl-2">{children}</li>;
}

export function MdxP({ children }: { children: ReactNode }) {
  return <p className="mb-4 leading-relaxed text-lg">{children}</p>;
}

export function MdxH4({ children }: { children: ReactNode }) {
  return <h4 className="mb-2 mt-4 text-base text-[var(--terminal-secondary)]">{children}</h4>;
}

export function MdxOl({ children }: { children: ReactNode }) {
  return <ol className="list-decimal space-y-2 border-l border-[var(--terminal-primary)]/40 pl-8 mb-4 marker:text-[var(--terminal-secondary)]">{children}</ol>;
}

export function MdxBlockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-[var(--terminal-secondary)]/60 pl-4 mb-4 text-[var(--terminal-secondary)] italic">
      {children}
    </blockquote>
  );
}

export function MdxPre({ children }: { children: ReactNode }) {
  return (
    <pre className="mb-4 overflow-x-auto border border-[var(--terminal-primary)]/20 bg-[var(--terminal-primary)]/5 p-4 text-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[var(--terminal-primary)]">
      {children}
    </pre>
  );
}

export function MdxHr() {
  return <hr className="my-8 border-[var(--terminal-primary)]/20" />;
}

export function MdxImg({ src = "", alt = "" }: { src?: string; alt?: string }) {
  // MDX images come from authored content with arbitrary dimensions — plain img keeps it simple.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="max-w-full border border-[var(--terminal-primary)]/20 my-6" />;
}

const linkClassName =
  "text-[var(--terminal-secondary)] underline decoration-dashed underline-offset-4 hover:text-[var(--terminal-primary)] hover:decoration-solid transition-all";

export function MdxA({ children, href = "" }: { children: ReactNode; href?: string }) {
  const isAbsolute = /^https?:\/\//i.test(href);
  // Bare domains like "cloudie.work" get an https:// prefix; relative paths stay internal.
  const isBareDomain = /^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(href);

  if (isAbsolute || isBareDomain || href.startsWith("mailto:")) {
    return (
      <a
        href={isBareDomain ? `https://${href}` : href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  );
}
