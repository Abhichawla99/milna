import React from "react";

export const MotifLeaf = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" fill="currentColor">
    <path 
      className="text-black" 
      d="M60 10c20 10 35 32 35 50S80 95 60 100 20 90 20 60 40 0 60 10z" 
    />
  </svg>
);

export const MotifCircle = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
    <circle 
      cx="60" 
      cy="60" 
      r="40" 
      className="stroke-black" 
      strokeWidth="10" 
    />
  </svg>
);

export const MotifBurst = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" fill="currentColor">
    {[...Array(12)].map((_, i) => (
      <rect 
        key={i} 
        x="58" 
        y="12" 
        width="4" 
        height="28" 
        transform={`rotate(${i * 30} 60 60)`} 
        className="text-black"
      />
    ))}
  </svg>
);

export const MotifFrond = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
    <path 
      d="M30 95c30-20 45-40 55-70" 
      stroke="currentColor" 
      strokeWidth="8" 
      className="text-black" 
      strokeLinecap="round"
    />
    {[...Array(5)].map((_, i) => (
      <path 
        key={i} 
        d={`M${40 + i * 12} ${84 - i * 10} q10 -6 18 -14`} 
        stroke="currentColor" 
        strokeWidth="6" 
        className="text-black" 
        strokeLinecap="round" 
        fill="none"
      />
    ))}
  </svg>
);

export const MotifArch = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
    <path 
      d="M30 100c0-30 20-55 30-55s30 25 30 55" 
      stroke="currentColor" 
      strokeWidth="12" 
      className="text-black" 
      strokeLinecap="round"
    />
  </svg>
);

export const MotifWave = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
    <path 
      d="M20 80c20-15 40-15 60-15s40 0 60 15" 
      stroke="currentColor" 
      strokeWidth="8" 
      className="text-black" 
      strokeLinecap="round"
    />
    <path 
      d="M20 60c20-15 40-15 60-15s40 0 60 15" 
      stroke="currentColor" 
      strokeWidth="8" 
      className="text-black" 
      strokeLinecap="round"
    />
  </svg>
);
