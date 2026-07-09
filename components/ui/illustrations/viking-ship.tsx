const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function VikingShipIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 70C30 54 62 46 98 50C134 46 166 56 192 72"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* sun low on the horizon */}
      <path
        d="M158 58c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M158 58c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* gulls */}
      <path
        d="M40 34c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6 0M62 44c2-2.1 4-2.1 5.6 0 1.6-2.1 3.5-2.1 5.4 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* mast + sail, one continuous mast stroke */}
      <path d="M96 154C95 108 96 68 98 34" {...ink} strokeWidth="2.6" />
      <path
        d="M98 40c-24 6-32 20-30 42 20 8 40 6 58-4-6-20-14-32-28-38Z"
        fill="var(--coral)"
        opacity="0.5"
      />
      <path
        d="M98 40c-24 6-32 20-30 42 20 8 40 6 58-4-6-20-14-32-28-38Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M74 58c8 3 14 8 15 20M100 46c-4 12-4 24 2 34M124 56c-2 8-6 15-12 20"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* hull — one continuous silhouette, prow curling high, stern lower */}
      <path
        d="M96 148C70 150 46 152 26 148C34 136 44 126 40 112 60 118 80 122 100 122 122 122 144 118 166 111 160 128 172 138 178 149C158 154 132 150 96 148Z"
        {...ink}
        strokeWidth="2.4"
      />
      {/* sketchy retrace */}
      <path
        d="M97 149C71 151 47 153 27 149C35 137 45 127 41 113 61 119 81 123 101 123 123 123 145 119 167 112 161 129 173 139 179 150C159 155 133 151 97 149Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* prow serpent head detail */}
      <path
        d="M166 111c8-6 12-14 10-24-4 4-9 6-13 12"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M172 92c1.4-1.2 3-1 3.4.6.4 1.6-1.4 2.4-3.4 1.8Z"
        fill="var(--surface-ink)"
        opacity="0.7"
      />

      {/* stern curl */}
      <path d="M40 112c-6-5-9-12-8-20" {...ink} strokeWidth="1.7" />

      {/* shields along the hull */}
      <path
        d="M52 132c1-4 5-6 8-4 3-2 7 0 7 4 0 4-4 6-7 5-3 1-8-1-8-5Z"
        fill="var(--sky)"
        opacity="0.7"
      />
      <path
        d="M52 132c1-4 5-6 8-4 3-2 7 0 7 4 0 4-4 6-7 5-3 1-8-1-8-5Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M92 137c1-4 5-6 8-4 3-2 6 0 6 4 0 4-3 6-6 5-3 1-7-1-8-5Z"
        fill="var(--leaf)"
        opacity="0.7"
      />
      <path
        d="M92 137c1-4 5-6 8-4 3-2 6 0 6 4 0 4-3 6-6 5-3 1-7-1-8-5Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M130 134c1-4 4-6 7-4 3-2 6 0 6 4 0 4-3 5-6 5-3 1-6-1-7-5Z"
        fill="var(--coral)"
        opacity="0.65"
      />
      <path
        d="M130 134c1-4 4-6 7-4 3-2 6 0 6 4 0 4-3 5-6 5-3 1-6-1-7-5Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* oars */}
      <path
        d="M30 146c-8 3-15 6-22 12M172 148c8 2 15 5 21 11"
        {...ink}
        strokeWidth="1.5"
        opacity="0.65"
      />

      {/* waterline + waves */}
      <path
        d="M6 158C36 152 62 162 96 158 130 154 158 162 194 156"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 160C36 154 62 164 96 160 130 156 158 164 194 158 194 172 190 176 96 176 10 176 6 172 6 160Z"
        fill="var(--sky)"
        opacity="0.16"
      />
      <path
        d="M20 168q8 4 16 0M150 170q8 4 16 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
