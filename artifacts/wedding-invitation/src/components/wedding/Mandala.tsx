import React from 'react';

interface MandalaProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "full" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const mandalaSrc = `${import.meta.env.BASE_URL}images/mandala.webp`;

/**
 * Renders the uploaded gold mandala artwork.
 * Corner variants show the quadrant of the mandala facing into the layout
 * (e.g. "top-left" shows the artwork's bottom-right quadrant).
 */
export function Mandala({ className = "", style = {}, variant = "full" }: MandalaProps) {
  if (variant === "full") {
    return (
      <img
        src={mandalaSrc}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={`pointer-events-none select-none ${className}`}
        style={style}
      />
    );
  }

  // Position the 200%-sized image so the correct quadrant is visible.
  const quadrant: Record<string, React.CSSProperties> = {
    "top-left": { left: "-100%", top: "-100%" },     // artwork bottom-right
    "top-right": { left: "0", top: "-100%" },        // artwork bottom-left
    "bottom-left": { left: "-100%", top: "0" },      // artwork top-right
    "bottom-right": { left: "0", top: "0" },         // artwork top-left
  };

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={style}
      aria-hidden
    >
      <div className="relative w-full h-full">
        <img
          src={mandalaSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute max-w-none"
          style={{ width: "200%", height: "200%", ...quadrant[variant] }}
        />
      </div>
    </div>
  );
}
