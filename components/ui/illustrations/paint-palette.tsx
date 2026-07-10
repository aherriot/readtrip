const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an artist's palette with a thumb-hole,
 * several blobs of marker-bright paint around its rim, and two paintbrushes
 * crossing over it with visible bristle tips. The palette's kidney shape is
 * one continuous hand-drawn outline (not a circle/oval).
 */
export function PaintPaletteIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* palette — one continuous kidney silhouette */}
      <path
        d="M60 80C40 92 32 115 40 138C46 155 62 168 82 172C102 175 120 168 132 156C140 149 145 138 136 129C128 119 111 119 100 113C89 107 82 95 88 85C82 78 68 76 60 80Z"
        fill="var(--sky)"
        opacity="0.16"
      />
      <path
        d="M60 80C40 92 32 115 40 138C46 155 62 168 82 172C102 175 120 168 132 156C140 149 145 138 136 129C128 119 111 119 100 113C89 107 82 95 88 85C82 78 68 76 60 80Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M61 81C42 93 34 115 42 137C48 153 63 167 82 171C101 174 118 167 130 155C138 148 144 138 135 129C127 120 112 120 101 114C90 108 83 96 89 86C83 79 69 77 61 81Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* thumb hole — its own small hand-drawn blob, off-center */}
      <path
        d="M90 96c-4 3-5 9-1 12 4 3 9 1 10-3 1-5-3-9-9-9Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* paint blobs around the rim */}
      <path
        d="M58 82c3-3 8-2 9 2 1 4-3 8-7 7-4-1-5-6-2-9Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M80 76c3-4 9-3 9 1 1 5-4 8-8 6-3-2-3-5-1-7Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M107 82c4-2 9 1 8 5-1 4-6 6-9 3-3-2-2-6 1-8Z"
        fill="var(--sky)"
        opacity="0.85"
      />
      <path
        d="M128 97c4-1 8 3 6 7-2 4-7 5-9 1-2-3 0-7 3-8Z"
        fill="var(--leaf)"
        opacity="0.85"
      />
      <path
        d="M138 118c4 0 7 4 5 8-2 4-8 4-9 0-1-3 1-7 4-8Z"
        fill="var(--violet)"
        opacity="0.85"
      />
      <path
        d="M128 141c4-1 8 2 7 6-1 4-6 6-9 3-3-3-1-8 2-9Z"
        fill="var(--orchid)"
        opacity="0.85"
      />

      {/* brush one — handle, ferrule, splayed bristle tips */}
      <path d="M22 178C50 152 86 118 144 68" {...ink} strokeWidth="3" />
      <path d="M135 76 146 66" {...ink} strokeWidth="5" opacity="0.8" />
      <path
        d="M146 65c4-3 8-2 10 1M146 65c3-5 7-5 10-2M146 65c2-6 6-7 9-5"
        {...ink}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* brush two — lying alongside the first, not crossing it */}
      <path d="M38 186C64 162 96 132 152 86" {...ink} strokeWidth="2.6" />
      <path d="M143 94 154 84" {...ink} strokeWidth="4.5" opacity="0.8" />
      <path
        d="M154 83c4-2 8-1 9 3M154 83c2-5 6-6 9-4M154 83c1-6 5-8 8-6"
        {...ink}
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  );
}
