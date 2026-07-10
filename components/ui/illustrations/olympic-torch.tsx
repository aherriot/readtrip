const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an Olympic torch. The torch body — a
 * tapered handle that widens into a cup — is one continuous silhouette
 * path, not a stack of stitched rectangles. The flame above it is the one
 * deliberately organic/wavy shape in the piece (per the illustrations
 * skill, flames are the exception to "no small scallops"); everything else,
 * including the five interlocking background rings, is built from a
 * handful of long hand-authored curves rather than many small bumps.
 */
export function OlympicTorchIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M8 30C40 18 84 16 122 22C154 27 178 22 194 32C196 68 194 112 190 150C148 158 92 154 48 148C22 144 8 132 8 112Z"
        fill="var(--sky)"
        opacity="0.14"
      />

      {/* five interlocking rings — background accent, each a hand-drawn
          round shape via ~4 long curve segments, not a chain of scallops */}
      <path
        d="M48 156c-9-1-16 5-16 12 0 8 8 13 17 12 9-1 15-8 14-15-1-7-7-9-15-9Z"
        {...ink}
        stroke="var(--sky)"
        strokeWidth="4"
        opacity="0.8"
      />
      <path
        d="M92 152c-9-1-17 4-17 12 0 7 8 13 17 12 9 -1 16-7 15-14-1-7-7-10-15-10Z"
        {...ink}
        strokeWidth="4"
        opacity="0.75"
      />
      <path
        d="M136 155c-9-2-17 3-18 10-1 8 7 14 16 14 9 0 16-6 16-13 0-7-6-10-14-11Z"
        {...ink}
        stroke="var(--coral)"
        strokeWidth="4"
        opacity="0.8"
      />
      <path
        d="M69 168c-8-1-15 5-15 11 0 7 7 12 15 11 8-1 14-6 14-13 0-6-6-9-14-9Z"
        {...ink}
        stroke="var(--sun)"
        strokeWidth="4"
        opacity="0.8"
      />
      <path
        d="M113 167c-8-1-16 4-16 11 0 7 7 12 15 11 8 0 14-6 14-13 0-6-6-9-13-9Z"
        {...ink}
        stroke="var(--leaf)"
        strokeWidth="4"
        opacity="0.8"
      />

      {/* torch body — one continuous silhouette, tapered handle to cup */}
      <path
        d="M94 178C92 150 90 122 90 100C89 84 82 74 78 66C90 62 110 62 122 66C118 74 111 84 110 100C110 122 108 150 106 178C102 180 98 180 94 178Z"
        fill="var(--surface-ink)"
        opacity="0.06"
      />
      <path
        d="M94 178C92 150 90 122 90 100C89 84 82 74 78 66C90 62 110 62 122 66C118 74 111 84 110 100C110 122 108 150 106 178C102 180 98 180 94 178Z"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M95 178C93 150 91 122 91 100C90 85 84 75 80 67"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* cup opening + grip bands, hand-drawn texture */}
      <path
        d="M78 66C88 70 112 70 122 66"
        {...ink}
        strokeWidth="1.6"
        opacity="0.75"
      />
      <path
        d="M92 120c5 2 11 2 16 0M91 140c6 2 12 2 18 0M92 160c5 2 11 2 15 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />

      {/* flame — the deliberate organic exception: overlapping tapered licks */}
      <path
        d="M100 62c-4-8-9-13-15-16 2 7 1 12-2 15-5 5-5 13 1 18 2-9 8-13 12-11 3 2 2 8-1 12 6 2 12-3 12-10 0-4-2-6-7-8Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M100 62c-4-8-9-13-15-16 2 7 1 12-2 15-5 5-5 13 1 18 2-9 8-13 12-11 3 2 2 8-1 12 6 2 12-3 12-10 0-4-2-6-7-8Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M100 62c3-9 3-17-1-24 5 3 10 9 11 16 1 6-2 12-6 16 1-3 0-6-4-8Z"
        fill="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M100 62c3-9 3-17-1-24 5 3 10 9 11 16 1 6-2 12-6 16 1-3 0-6-4-8Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* sparks/embers drifting off the flame — small character touches */}
      <path d="M124 30h.01" {...ink} strokeWidth="2.6" opacity="0.75" />
      <path d="M132 42h.01" {...ink} strokeWidth="2.2" opacity="0.6" />
      <path
        d="M118 20c1-1 3-1 3 .5s-2 1.5-3 .3Z"
        fill="var(--sun)"
        opacity="0.8"
      />

      {/* ground */}
      <path
        d="M6 176C42 170 84 180 122 176 152 173 174 178 194 172"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
