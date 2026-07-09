const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a brass compass over a torn map corner. One
 * generic entry in the "no specific art yet" fallback pool (see
 * `lib/illustrations/resolve.ts`) — the housing is a genuinely round object,
 * so it uses the `pyramid.tsx` sun / `telescope.tsx` moon treatment (one
 * closed path, a handful of long sweeps) instead of a chain of small bumps,
 * which reads as a cloud rather than a compass.
 */
export function CompassIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* map corner peeking out behind */}
      <path
        d="M20 120C50 108 90 116 130 106C150 100 170 108 184 122C186 148 184 172 180 190C140 182 96 190 56 182C36 178 22 168 16 152C14 140 16 128 20 120Z"
        fill="var(--sun)"
        opacity="0.12"
      />
      <path
        d="M24 122C52 112 88 118 126 110M30 140C60 132 100 138 140 130M26 158C56 150 92 156 130 150"
        {...ink}
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M60 116c8-2 14 4 10 12-8-2-14-6-10-12ZM100 172c6-4 14 0 12 8-8 0-16-2-12-8Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.4"
      />

      {/* compass housing — a round object, drawn as a handful of long
          sweeps, not a chain of small scallops */}
      <path
        d="M100 42C132 40 158 65 160 98C162 131 137 157 104 158C71 160 46 135 44 102C42 69 68 44 100 42Z"
        fill="var(--sun)"
        opacity="0.22"
      />
      <path
        d="M100 42C132 40 158 65 160 98C162 131 137 157 104 158C71 160 46 135 44 102C42 69 68 44 100 42Z"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M99 44C129 43 154 66 156 97C158 128 135 154 105 156C74 158 50 134 48 103C46 72 70 46 99 44Z"
        {...ink}
        strokeWidth="1"
        opacity="0.35"
      />

      {/* inner rim, same round technique at a smaller radius */}
      <path
        d="M100 58C122 57 140 74 141 98C142 122 125 141 102 142C79 143 60 126 59 102C58 78 76 59 100 58Z"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* tick marks */}
      <path
        d="M100 44 100 55M156 100 145 100M100 156 100 145M44 100 55 100M129 58 122 66M142 76 133 81M142 124 133 119M129 142 122 134M71 142 78 134M58 124 67 119M58 76 67 81M71 58 78 66"
        {...ink}
        strokeWidth="1.3"
        opacity="0.55"
      />

      {/* needle */}
      <path
        d="M100 66 108 98 100 94 92 98Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path d="M100 66 108 98 100 94 92 98Z" {...ink} strokeWidth="1.4" />
      <path
        d="M100 94 108 98 100 130 92 98Z"
        fill="var(--surface-ink)"
        opacity="0.15"
      />
      <path d="M100 94 108 98 100 130 92 98Z" {...ink} strokeWidth="1.4" />
      <path
        d="M100 94c2-2 5-2 6.5.5 1.4 2.4-1 5.5-6.5 5.5s-8-3.1-6.5-5.5C94.9 92 98 92 100 94Z"
        fill="var(--surface-ink)"
      />

      {/* N marking */}
      <path d="M96 50 96 42 102 50 102 42" {...ink} strokeWidth="1.5" />

      {/* lanyard loop */}
      <path
        d="M92 40c1-6 6-10 12-9 6 1 9 6 8 12"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />
    </svg>
  );
}
