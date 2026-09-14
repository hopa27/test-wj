import React from 'react';

/**
 * Ornamental gold double-line frame with corner flourishes and lotus accents,
 * matching the Hero section's frame. Absolutely positioned; parent must be relative.
 */
export function OrnateFrame({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-3 md:inset-5 pointer-events-none ${className}`}>
      {/* Outer and inner lines */}
      <div className="absolute inset-0 border border-accent/60 rounded-sm" />
      <div className="absolute inset-[6px] border border-accent/30 rounded-sm" />

      {/* Corner flourishes */}
      {[
        "top-0 left-0",
        "top-0 right-0 rotate-90",
        "bottom-0 right-0 rotate-180",
        "bottom-0 left-0 -rotate-90",
      ].map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 60 60"
          className={`absolute ${pos} w-10 h-10 md:w-14 md:h-14 text-accent`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M2 30 C2 14 14 2 30 2" />
          <path d="M8 30 C8 17.8 17.8 8 30 8" opacity="0.55" />
          <path d="M14 30 C14 21.2 21.2 14 30 14" opacity="0.35" />
          <circle cx="2" cy="30" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="30" cy="2" r="1.8" fill="currentColor" stroke="none" />
          <path d="M17 17 l3.2 3.2 M17 17 l4.5 -1 M17 17 l-1 4.5" opacity="0.6" />
          <circle cx="17" cy="17" r="2.4" opacity="0.8" />
          <circle cx="17" cy="17" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      ))}

      {/* Top and bottom center lotus accents */}
      {["top-[-1px] left-1/2 -translate-x-1/2", "bottom-[-1px] left-1/2 -translate-x-1/2 rotate-180"].map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 80 20"
          className={`absolute ${pos} w-20 h-5 text-accent`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M40 14 C36 8 36 4 40 1 C44 4 44 8 40 14 Z" opacity="0.8" />
          <path d="M40 14 C33 10 28 9 24 11 C30 14 35 15 40 14 Z" opacity="0.5" />
          <path d="M40 14 C47 10 52 9 56 11 C50 14 45 15 40 14 Z" opacity="0.5" />
          <circle cx="40" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      ))}
    </div>
  );
}
