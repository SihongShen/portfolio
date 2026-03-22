"use client";

import { motion } from "framer-motion";
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
  return <p className="mb-4 leading-relaxed">{children}</p>;
}
