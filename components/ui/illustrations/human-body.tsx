const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function HumanBodyIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* head + torso, one continuous silhouette built from a handful of
          long sweeps that map to real proportions — head narrower than the
          shoulders below it, a taper down to the waist — not a smooth egg */}
      <path
        d="M100 22C114 24 120 34 118 48C122 54 130 60 134 70C130 95 126 115 118 130C110 138 90 138 82 130C74 115 70 95 66 70C70 60 78 54 82 48C80 34 86 24 100 22Z"
        {...ink}
        strokeWidth="2.2"
      />

      {/* legs, one continuous path (four hand-varied strokes, not mirrored pairs) */}
      <path
        d="M85 132C82 149 78 164 74 177M92 133C91 150 92 165 94 177M108 133C109 150 108 165 106 177M115 132C118 149 121 164 125 177"
        {...ink}
        strokeWidth="2.1"
      />

      {/* arms — bowed, deliberately not mirrored */}
      <path d="M70 74C60 86 52 98 46 112" {...ink} strokeWidth="2.1" />
      <path d="M130 73C140 85 148 97 154 111" {...ink} strokeWidth="2.1" />

      {/* lungs */}
      <path
        d="M83 78c-6 3-8 11-4 19 3 6 9 5 10 0 1-8-1-15-6-19Z"
        fill="var(--sky)"
        opacity="0.4"
      />
      <path
        d="M117 78c6 3 8 11 4 19-3 6-9 5-10 0-1-8 1-15 6-19Z"
        fill="var(--sky)"
        opacity="0.4"
      />

      {/* heart */}
      <path
        d="M99 96c-6-10-19-6-19 3 0 8 10 16 19 23 9-7 19-15 19-23 0-9-13-13-19-3Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M99 96c-6-10-19-6-19 3 0 8 10 16 19 23 9-7 19-15 19-23 0-9-13-13-19-3Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* pulse line */}
      <path
        d="M44 100h19l7 -15 8 27 6 -19 5 7h56"
        {...ink}
        strokeWidth="1.6"
        opacity="0.7"
      />
    </svg>
  );
}
