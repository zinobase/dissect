import React from "react";

interface DissectLogoMarkProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function DissectLogoMark({ className = "w-6 h-6", ...props }: DissectLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 94 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Dissect Logo"
      {...props}
    >
      {/* Left Muted Grey Lens Ring */}
      <circle
        cx="35"
        cy="37"
        r="23"
        stroke="#52525b"
        strokeWidth="1.8"
      />

      {/* Right Active Neon Lime Cadence Shutter Arc */}
      <path
        d="M 78.9 49.5 A 23 23 0 1 1 78.9 24.5"
        stroke="#84cc16"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Intersecting Focal Reticle Ring */}
      <circle
        cx="47"
        cy="37"
        r="5.4"
        stroke="#84cc16"
        strokeWidth="1.8"
      />

      {/* Center Target Bullseye */}
      <circle
        cx="47"
        cy="37"
        r="2.2"
        fill="#84cc16"
      />
    </svg>
  );
}
