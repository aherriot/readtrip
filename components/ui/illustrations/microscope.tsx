const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function MicroscopeIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* discovery sparkles */}
      <path
        d="M150 40c.4 2.2 1.2 3 3.4 3.4-2.2.4-3 1.2-3.4 3.4-.4-2.2-1.2-3-3.4-3.4 2.2-.4 3-1.2 3.4-3.4Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.7"
      />
      <path
        d="M160 60c.3 1.8 1 2.4 2.8 2.8-1.8.4-2.5 1-2.8 2.8-.4-1.8-1-2.4-2.8-2.8 1.8-.4 2.4-1 2.8-2.8Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.6"
      />

      {/* solid base — a filled foot reads unambiguously as "a stand" */}
      <path
        d="M68 175c0-5 14-8 32-8s32 3 32 8-14 6-32 6-32-1-32-6Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />

      {/* pillar — mostly vertical, only the top leans toward the eyepiece */}
      <path d="M100 167C99 148 100 129 99 108" {...ink} strokeWidth="2.8" />
      <path
        d="M99 108C97 92 90 76 82 66C79 62 76 60 74 58"
        {...ink}
        strokeWidth="2.8"
      />
      <path d="M66 53C70 56 74 58 78 60" {...ink} strokeWidth="2.2" />

      {/* focus knob, a small blob against the pillar */}
      <path
        d="M105 126c1-2 4-3 6-1.5 1.5 1.5.8 4.5-1.5 5.2-3 .8-5.3-1.5-4.5-3.7Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />

      {/* objective, hanging down to the stage */}
      <path d="M97 92C96 96 96 99 97 103" {...ink} strokeWidth="2.4" />

      {/* stage — a solid filled plate */}
      <path
        d="M99 103c11-1 22-1 33 1 .5 2 .5 4 0 6-11 1-22 1-33 0-.5-2-.5-4 0-7Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />
      <path
        d="M106 105c7-1 13-1 19 0"
        stroke="var(--aqua)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M89 110c2-2 6-2 8 0 1 2-1.5 4.5-4 4.5s-5.5-2.5-4-4.5Z"
        fill="var(--leaf)"
        opacity="0.55"
      />

      {/* desk line */}
      <path
        d="M20 178C60 174 100 182 140 178 160 176 175 179 188 176"
        {...ink}
        strokeWidth="2"
        opacity="0.7"
      />
    </svg>
  );
}
