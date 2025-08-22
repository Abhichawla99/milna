import React from "react";

type EditorialCardProps = {
  title: string;
  subtitle?: string;
  bg: string; // e.g. "bg-[#EDE6FF]"
  accent?: string; // e.g. "text-[#A66900]"
  motif?: React.ReactNode;
  className?: string;
};

export default function EditorialCard({ 
  title, 
  subtitle, 
  bg, 
  accent = "text-[#2C1A10]", 
  motif,
  className = ""
}: EditorialCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] ${bg} shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] ${className}`}>
      {/* Background motif */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-[-8%] top-[-8%] h-[160px] w-[160px] md:h-[220px] md:w-[220px]">
          {motif}
        </div>
      </div>

      {/* Plus badge */}
      <div className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-white/80 text-[#8A5A3A] ring-1 ring-black/5">
        <span className="-mt-[1px] text-[18px] leading-none">+</span>
      </div>

      {/* Copy */}
      {subtitle && (
        <p className="text-xs uppercase tracking-wide text-black/50 font-medium">
          {subtitle}
        </p>
      )}
      <h3 
        className={`mt-2 font-black ${accent} text-2xl md:text-3xl leading-tight`} 
        style={{
          fontFamily: "'Recoleta', 'Cooper Black', 'Georgia', serif"
        }}
      >
        {title}
      </h3>
    </div>
  );
}
