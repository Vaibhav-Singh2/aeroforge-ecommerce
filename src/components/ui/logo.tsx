import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export function AeroForgeIcon({ size = 28, className, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-300 group-hover:scale-105", className)}
      {...props}
    >
      <defs>
        <linearGradient id="aero-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="aero-grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="aero-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Aerodynamic Wing Chevron */}
      <path
        d="M24 4L42 16L37 24L24 15L11 24L6 16L24 4Z"
        fill="url(#aero-grad-primary)"
        filter="url(#aero-glow)"
      />

      {/* Internal High-Speed Jet Delta Blade */}
      <path
        d="M24 14L36 34L24 28L12 34L24 14Z"
        fill="url(#aero-grad-primary)"
        fillOpacity="0.85"
      />

      {/* Thrust Core Jet Flame Diamond */}
      <path
        d="M24 26L28 36L24 44L20 36L24 26Z"
        fill="url(#aero-grad-amber)"
      />

      {/* Rotor Arm Cross Indicators */}
      <circle cx="6" cy="16" r="2.5" fill="#38bdf8" />
      <circle cx="42" cy="16" r="2.5" fill="#38bdf8" />
      <circle cx="24" cy="4" r="2" fill="#bae6fd" />
    </svg>
  );
}

export function AeroForgeLogo({ className }: { className?: string }) {
  return (
    <div className={cn("group flex items-center gap-2 select-none shrink-0", className)}>
      <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-500/20 via-sky-600/10 to-transparent border border-sky-500/30 p-1 shadow-sm backdrop-blur-xs transition-all duration-300 group-hover:border-sky-400/60 group-hover:shadow-sky-500/20 group-hover:shadow-md">
        <AeroForgeIcon size={20} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-foreground font-heading">
            AeroForge
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-sky-500">
            Labs
          </span>
        </div>
        <span className="text-[8px] sm:text-[9px] font-mono font-medium tracking-wider text-muted-foreground uppercase hidden sm:block">
          Aeronautics & FPV
        </span>
      </div>
    </div>
  );
}
