const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: the journal itself, open, with a pressed
 * leaf and a resting pen. One generic entry in the "no specific art yet"
 * fallback pool (see `lib/illustrations/resolve.ts`) — fitting since every
 * ReadTrip page already lives inside this same object. The open cover is one
 * continuous silhouette across both pages, not two stitched rectangles.
 */
export function FieldJournalIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* desk wash */}
      <path
        d="M6 40C36 26 76 18 116 24C150 18 178 30 194 46C194 62 194 76 192 86C150 78 108 84 66 80C36 78 14 72 6 62C4 56 4 46 6 40Z"
        fill="var(--sky)"
        opacity="0.12"
      />

      {/* open book, one continuous silhouette across both pages */}
      <path
        d="M100 68C88 60 62 56 40 60C36 92 34 122 36 150C60 146 84 150 98 158C100 128 100 98 100 68Z"
        fill="var(--sun)"
        opacity="0.14"
      />
      <path
        d="M100 68C88 60 62 56 40 60C36 92 34 122 36 150C60 146 84 150 98 158C100 128 100 98 100 68Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M100 68C114 60 138 56 160 60C164 92 166 122 164 150C142 146 118 150 100 158C100 128 100 98 100 68Z"
        fill="var(--sun)"
        opacity="0.08"
      />
      <path
        d="M100 68C114 60 138 56 160 60C164 92 166 122 164 150C142 146 118 150 100 158C100 128 100 98 100 68Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path d="M100 68C100 98 100 128 98 158" {...ink} strokeWidth="1.8" />

      {/* ruled lines on both pages */}
      <path
        d="M44 76c16-3 34-3 50 0M44 90c16-3 34-3 50 0M44 104c16-3 34-3 50 0M44 118c16-3 34-3 50 0M44 132c16-3 34-3 50 0"
        {...ink}
        strokeWidth="1.1"
        opacity="0.35"
      />
      <path
        d="M108 74c16-3 34-3 50 0M108 88c16-3 34-3 50 0M108 102c16-3 34-3 50 0M108 116c16-3 34-3 50 0M108 130c16-3 34-3 50 0"
        {...ink}
        strokeWidth="1.1"
        opacity="0.35"
      />

      {/* pressed leaf on the right page */}
      <path
        d="M134 92C130 82 134 70 144 66C152 78 152 92 144 100C139 103 136 98 134 92Z"
        fill="var(--leaf)"
        opacity="0.4"
      />
      <path
        d="M134 92C130 82 134 70 144 66C152 78 152 92 144 100C139 103 136 98 134 92Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path
        d="M139 72c1 10 2 20 3 28"
        {...ink}
        strokeWidth="1.1"
        opacity="0.5"
      />

      {/* ribbon bookmark trailing out the side */}
      <path
        d="M46 60c-2 20-3 42-2 62 5-4 9-4 14 0-1-20 0-42 2-62"
        fill="var(--coral)"
        opacity="0.6"
      />
      <path
        d="M46 60c-2 20-3 42-2 62 5-4 9-4 14 0-1-20 0-42 2-62"
        {...ink}
        strokeWidth="1.3"
      />

      {/* pen resting diagonally across both pages */}
      <path d="M50 168C82 156 122 148 158 138" {...ink} strokeWidth="3" />
      <path
        d="M50 168c-2-3-1-6 2-8M158 138c3-1 6 0 7 3"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M154 136 164 140 158 132Z"
        fill="var(--surface-ink)"
        opacity="0.7"
      />
    </svg>
  );
}
