import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionDividerProps {
  className?: string;
  /** 'thread' — a fine gold thread with a lotus knot; 'paisley' — thread with paisley curls */
  variant?: 'thread' | 'paisley';
}

/**
 * Decorative gold transition stitched between sections so the page reads as
 * one continuous piece of fabric. The thread "draws" itself in as it scrolls
 * into view (skipped under prefers-reduced-motion).
 */
export function SectionDivider({ className = '', variant = 'thread' }: SectionDividerProps) {
  const reduceMotion = useReducedMotion();

  const draw = reduceMotion
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, margin: '-40px' } as const,
        transition: { duration: 1.4, ease: 'easeInOut' as const },
      };

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.6 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: '-40px' } as const,
        transition: { duration: 0.8, delay: 0.9 },
      };

  return (
    <div className={`relative w-full flex justify-center py-6 md:py-8 pointer-events-none ${className}`} aria-hidden>
      <svg
        viewBox="0 0 400 40"
        className="w-full max-w-md px-6 text-accent overflow-visible"
        fill="none"
        stroke="currentColor"
      >
        {/* Gold thread, drawing outward from the center */}
        <motion.path d="M200 20 C160 20 140 12 100 20 C70 26 40 20 8 20" strokeWidth="1" opacity="0.55" {...draw} />
        <motion.path d="M200 20 C240 20 260 28 300 20 C330 14 360 20 392 20" strokeWidth="1" opacity="0.55" {...draw} />

        {variant === 'paisley' && (
          <>
            <motion.path d="M110 20 C104 12 94 12 92 18 C90 24 98 27 104 23" strokeWidth="0.9" opacity="0.5" {...draw} />
            <motion.path d="M290 20 C296 28 306 28 308 22 C310 16 302 13 296 17" strokeWidth="0.9" opacity="0.5" {...draw} />
          </>
        )}

        {/* Lotus knot at the center */}
        <motion.g {...fade}>
          <path d="M200 8 C197 13 197 18 200 21 C203 18 203 13 200 8 Z" fill="currentColor" stroke="none" opacity="0.8" />
          <path d="M200 21 C194 17 189 16.5 186 18.5 C191 21.5 196 22 200 21 Z" fill="currentColor" stroke="none" opacity="0.5" />
          <path d="M200 21 C206 17 211 16.5 214 18.5 C209 21.5 204 22 200 21 Z" fill="currentColor" stroke="none" opacity="0.5" />
          <circle cx="200" cy="26" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="188" cy="27.5" r="0.9" fill="currentColor" stroke="none" opacity="0.6" />
          <circle cx="212" cy="27.5" r="0.9" fill="currentColor" stroke="none" opacity="0.6" />
        </motion.g>
      </svg>
    </div>
  );
}
