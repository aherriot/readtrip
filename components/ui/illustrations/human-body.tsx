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
      {/* head + torso, one continuous silhouette (rounds smoothly into a head, no separate neck seam) */}
      <path
        d="M72 120C70 95 74 72 82 55C88 42 93 30 100 22C107 30 112 42 118 55C126 72 130 95 128 120C126 128 118 133 100 133C82 133 74 128 72 120Z"
        {...ink}
        strokeWidth="2.2"
      />

      {/* legs, one continuous path (four hand-varied strokes, not mirrored pairs) */}
      <path
        d="M84 133C81 149 78 164 74 177M91 134C90 150 91 165 93 177M109 134C110 150 109 165 107 177M116 133C119 149 122 164 126 177"
        {...ink}
        strokeWidth="2.1"
      />

      {/* arms — bowed, deliberately not mirrored */}
      <path d="M78 92C68 102 58 112 52 122" {...ink} strokeWidth="2.1" />
      <path d="M122 91C132 101 142 111 148 121" {...ink} strokeWidth="2.1" />

      {/* lungs */}
      <path
        d="M83 75c-6 3-8 11-4 19 3 6 9 5 10 0 1-8-1-15-6-19Z"
        fill="var(--sky)"
        opacity="0.4"
      />
      <path
        d="M117 75c6 3 8 11 4 19-3 6-9 5-10 0-1-8 1-15 6-19Z"
        fill="var(--sky)"
        opacity="0.4"
      />

      {/* heart */}
      <path
        d="M99 93c-6-10-19-6-19 3 0 8 10 16 19 23 9-7 19-15 19-23 0-9-13-13-19-3Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M99 93c-6-10-19-6-19 3 0 8 10 16 19 23 9-7 19-15 19-23 0-9-13-13-19-3Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* pulse line */}
      <path
        d="M50 97h19l7 -15 8 27 6 -19 5 7h56"
        {...ink}
        strokeWidth="1.6"
        opacity="0.7"
      />
    </svg>
  );
}
