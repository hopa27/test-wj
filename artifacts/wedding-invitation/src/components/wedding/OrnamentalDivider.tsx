import React from 'react';

interface OrnamentalDividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function OrnamentalDivider({ className = "", style = {} }: OrnamentalDividerProps) {
  return (
    <svg 
      className={`pointer-events-none ${className}`} 
      style={style} 
      viewBox="0 0 400 30" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg" 
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Center Motif (Diamond/Lotus) */}
      <path d="M 200,2 L 208,15 L 200,28 L 192,15 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M 200,6 L 204,15 L 200,24 L 196,15 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="200" cy="15" r="1.5" fill="currentColor"/>

      {/* Repeating scallops left */}
      <g stroke="currentColor" fill="none">
        <line x1="0" y1="15" x2="185" y2="15" strokeWidth="0.5"/>
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 185 - i * 20; 
          if (x < 10) return null;
          return (
            <g key={`l-${i}`}>
              <path d={`M ${x},15 Q ${x-10},5 ${x-20},15`} strokeWidth="1"/>
              <circle cx={x-10} cy="10" r="1.5" fill="currentColor" stroke="none"/>
            </g>
          );
        })}
      </g>
      
      {/* Repeating scallops right */}
      <g stroke="currentColor" fill="none">
        <line x1="215" y1="15" x2="400" y2="15" strokeWidth="0.5"/>
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 215 + i * 20; 
          if (x > 390) return null;
          return (
            <g key={`r-${i}`}>
              <path d={`M ${x},15 Q ${x+10},5 ${x+20},15`} strokeWidth="1"/>
              <circle cx={x+10} cy="10" r="1.5" fill="currentColor" stroke="none"/>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
