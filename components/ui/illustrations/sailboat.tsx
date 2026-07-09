const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SailboatIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 50C34 34 68 26 100 30C134 26 166 36 194 52"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* sun */}
      <path
        d="M150 30c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M150 30c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* gulls */}
      <path
        d="M40 44c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* mast, one continuous stroke */}
      <path d="M100 150C99 108 100 68 102 34" {...ink} strokeWidth="2.6" />

      {/* mainsail — hand-bowed, not a straight-edged triangle */}
      <path
        d="M102 40c-20 8-30 26-26 50 18 4 32-2 40-16-4-14-8-24-14-34Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M102 40c-20 8-30 26-26 50 18 4 32-2 40-16-4-14-8-24-14-34Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M84 56c6 2 11 8 13 18M92 46c-4 12-4 26 4 36"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* jib sail — hand-varied, deliberately smaller and different curve */}
      <path
        d="M100 52c14 6 22 20 22 38-14 1-24-6-28-18 1-8 3-14 6-20Z"
        fill="var(--sun)"
        opacity="0.45"
      />
      <path
        d="M100 52c14 6 22 20 22 38-14 1-24-6-28-18 1-8 3-14 6-20Z"
        {...ink}
        strokeWidth="1.8"
      />

      {/* hull — one continuous silhouette */}
      <path
        d="M40 150C60 154 80 156 100 156C122 156 144 154 164 148C158 162 148 172 132 174C112 178 88 178 68 174C52 172 44 162 40 150Z"
        fill="var(--coral)"
        opacity="0.4"
      />
      <path
        d="M40 150C60 154 80 156 100 156C122 156 144 154 164 148C158 162 148 172 132 174C112 178 88 178 68 174C52 172 44 162 40 150Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M40 150C60 154 80 156 100 156C122 156 144 154 164 148"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* deck rail detail */}
      <path
        d="M56 168q11 3 22 0M118 168q11 3 22-1"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* small pennant flag at masthead */}
      <path d="M102 34 114 38 102 43Z" fill="var(--leaf)" opacity="0.8" />
      <path d="M102 34 114 38 102 43Z" {...ink} strokeWidth="1.2" />

      {/* waterline + waves */}
      <path
        d="M6 178C36 172 62 182 96 178 130 174 158 182 194 176"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 180C36 174 62 184 96 180 130 176 158 184 194 178 194 190 190 194 96 194 12 194 6 190 6 180Z"
        fill="var(--sky)"
        opacity="0.2"
      />
      <path
        d="M22 186q8 4 16 0M150 188q8 4 16 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
