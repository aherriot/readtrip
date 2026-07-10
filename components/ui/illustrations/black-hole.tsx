const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a black hole — a dark void ringed by a
 * glowing, swirling accretion disk, with lensed starlight bending near the
 * edge and ordinary stars further out. The void is drawn between the back
 * and front disk bands so the front band reads as passing in front of it.
 */
export function BlackHoleIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* deep space wash */}
      <path
        d="M6 40C40 20 90 10 130 18C162 12 186 24 196 38"
        fill="var(--violet)"
        opacity="0.14"
        stroke="none"
      />

      {/* ordinary stars, further out */}
      <path
        d="M24 30h.01M170 26h.01M180 150h.01M20 170h.01M100 12h.01"
        {...ink}
        strokeWidth="2.2"
        opacity="0.55"
      />

      {/* lensed starlight bending near the edge — curved streaks, not straight rays */}
      <path
        d="M20 92C34 84 44 88 52 96"
        {...ink}
        strokeWidth="1.3"
        opacity="0.55"
      />
      <path
        d="M176 108C164 118 154 116 146 106"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
      <path
        d="M60 42C70 56 74 68 72 80"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* accretion disk — back band, behind the void, dimmer */}
      <path
        d="M42 96C50 74 78 64 104 68 126 71 142 82 146 98"
        fill="none"
        stroke="var(--violet)"
        strokeWidth="6"
        opacity="0.3"
        strokeLinecap="round"
      />
      <path
        d="M42 96C50 74 78 64 104 68 126 71 142 82 146 98"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* wide back sweep of the disk, further out */}
      <path
        d="M24 104C30 68 68 46 112 50 148 53 174 72 182 100"
        fill="none"
        stroke="var(--orchid)"
        strokeWidth="4"
        opacity="0.22"
        strokeLinecap="round"
      />

      {/* the void — hand-drawn dark round shape, ~4 long curve segments */}
      <path
        d="M100 66c18-1 33 13 33 32 0 19-15 34-33 34-19 0-34-15-34-34 0-19 15-33 34-32Z"
        fill="var(--surface-ink)"
        opacity="0.92"
      />
      <path
        d="M100 66c18-1 33 13 33 32 0 19-15 34-33 34-19 0-34-15-34-34 0-19 15-33 34-32Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M102 68c17-1 31 12 31 30 0 18-14 32-31 32-18 0-32-14-32-32 0-18 14-31 32-30Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* accretion disk — front band, in front of the void, bright and dense */}
      <path
        d="M54 118C64 138 88 150 114 146 136 143 154 130 162 112"
        fill="none"
        stroke="var(--sun)"
        strokeWidth="7"
        opacity="0.85"
        strokeLinecap="round"
      />
      <path
        d="M54 118C64 138 88 150 114 146 136 143 154 130 162 112"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M62 128C74 142 94 148 112 144"
        fill="none"
        stroke="var(--coral)"
        strokeWidth="3.4"
        opacity="0.75"
        strokeLinecap="round"
      />

      {/* stray hot spark off the front disk */}
      <path
        d="M150 128 156 134M154 122 160 126"
        {...ink}
        strokeWidth="1.3"
        opacity="0.65"
      />
    </svg>
  );
}
