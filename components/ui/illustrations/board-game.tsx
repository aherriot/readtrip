const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a tabletop board game. The board itself is a
 * hand-bowed square-ish shape (never a ruled rectangle), with a winding path
 * of spaces drawn across it, a couple of hand-varied playing pieces, a die
 * resting nearby with pip marks drawn as tiny blobs rather than perfect
 * circles, and a card leaning against the board as a character touch.
 */
export function BoardGameIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* table wash */}
      <path
        d="M6 44C40 30 80 26 118 32C152 37 176 30 194 42C196 84 194 132 190 168C150 176 92 172 46 166C18 162 6 150 6 130Z"
        fill="var(--sky)"
        opacity="0.14"
      />

      {/* game board — hand-bowed square-ish shape, not a perfect rect */}
      <path
        d="M32 46C68 38 128 40 166 48C172 82 170 122 164 156C126 164 68 162 34 154C28 122 28 80 32 46Z"
        fill="var(--sun)"
        opacity="0.16"
      />
      <path
        d="M32 46C68 38 128 40 166 48C172 82 170 122 164 156C126 164 68 162 34 154C28 122 28 80 32 46Z"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M34 48C69 40 127 42 164 50C170 82 168 121 162 154"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* winding path of spaces across the board */}
      <path
        d="M44 62C64 58 82 60 96 68C110 76 108 90 92 94C76 98 60 96 50 104C40 112 44 124 60 128C78 132 108 128 128 122C144 117 150 106 148 92"
        {...ink}
        strokeWidth="2"
        opacity="0.75"
      />
      {/* individual space ticks along the path */}
      <path
        d="M44 62 46 68M62 59 63 65M80 61 83 67M96 68 100 73M92 94 89 100M74 97 72 103M56 100 53 106M62 128 63 122M84 129 85 123M108 127 110 121M128 122 132 117M146 108 150 103"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* playing pieces — hand-drawn pawns, deliberately different heights */}
      <path
        d="M60 128c-1-4 2-6 4-6-1-4 3-6 5-4 2-1 4 1 3 4 2 1 3 4 1 6-3 2-9 2-13 0Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M60 128c-1-4 2-6 4-6-1-4 3-6 5-4 2-1 4 1 3 4 2 1 3 4 1 6-3 2-9 2-13 0Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path d="M63 128 63 134" {...ink} strokeWidth="3" opacity="0.85" />

      <path
        d="M107 122c-1-6 2-9 5-9-1-6 4-9 7-6 2-2 5 1 4 6 3 1 4 6 1 9-4 3-12 3-17 0Z"
        fill="var(--violet)"
        opacity="0.85"
      />
      <path
        d="M107 122c-1-6 2-9 5-9-1-6 4-9 7-6 2-2 5 1 4 6 3 1 4 6 1 9-4 3-12 3-17 0Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path d="M111 122 111 130" {...ink} strokeWidth="3.4" opacity="0.85" />

      {/* die resting beside the board, pips as tiny hand-drawn blobs not circles */}
      <path
        d="M148 138c8-4 20-4 27 1 2 8 2 18-1 25-8 3-19 3-26-1-3-8-2-18 0-25Z"
        fill="var(--surface-ink)"
        opacity="0.05"
      />
      <path
        d="M148 138c8-4 20-4 27 1 2 8 2 18-1 25-8 3-19 3-26-1-3-8-2-18 0-25Z"
        {...ink}
        strokeWidth="2.1"
      />
      <path
        d="M154 146c1-1 3-1 3 .5s-2 1.5-3 .3Zm10-2c1-1 3-1 3 .5s-2 1.5-3 .3Zm-14 9c1-1 3-1 3 .5s-2 1.4-3 .2Zm9 1c1-1 3-1 3 .5s-2 1.4-3 .2Zm9-1c1-1 3-1 3 .4s-2 1.5-3 .3Z"
        fill="var(--surface-ink)"
      />

      {/* card leaning against the board — a character touch */}
      <path
        d="M20 150C22 138 26 128 32 122C40 128 44 140 42 152C34 156 26 155 20 150Z"
        fill="var(--sky)"
        opacity="0.3"
      />
      <path
        d="M20 150C22 138 26 128 32 122C40 128 44 140 42 152C34 156 26 155 20 150Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M26 134c2 3 6 4 9 3M25 141c3 3 7 4 10 2"
        {...ink}
        strokeWidth="1.2"
        opacity="0.6"
      />

      {/* spinner accent tucked at the top corner of the board */}
      <path
        d="M148 58c6-1 11 3 11 8 0 5-5 9-11 8-6-1-10-5-9-9 0-4 4-6 9-7Z"
        {...ink}
        strokeWidth="1.6"
        opacity="0.75"
      />
      <path
        d="M148 58 152 66 158 62"
        {...ink}
        strokeWidth="1.4"
        opacity="0.75"
      />
    </svg>
  );
}
