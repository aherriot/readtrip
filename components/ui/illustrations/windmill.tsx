const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a traditional Dutch windmill — a tapered
 * tower body (one continuous silhouette, wider at the base), a cap, and
 * four long sails radiating from the hub at hand-varied angles and lengths
 * so they don't read as a perfect pinwheel — see the illustrations skill.
 */
export function WindmillIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 26C40 14 90 8 130 16C160 10 182 20 194 30"
        fill="var(--sky)"
        opacity="0.2"
        stroke="none"
      />

      {/* clouds, small hand-wobbled bumps (organic, exempt from round-object rule) */}
      <path
        d="M30 40c-4-4-2-9 3-10 1-4 7-6 10-2 4-3 9 0 8 5 4 1 4 6 0 7-5 2-16 2-21 0Z"
        fill="var(--sky)"
        opacity="0.4"
      />

      {/* far sail tips reach up before the tower — draw first so tower overlaps hub */}
      <path d="M101 70C118 58 134 46 150 36" {...ink} strokeWidth="5.5" />
      <path
        d="M101 70C118 58 134 46 150 36"
        {...ink}
        strokeWidth="1.6"
        opacity="0.5"
      />
      <path
        d="M112 58 121 65M124 49 133 56M136 41 145 47"
        {...ink}
        strokeWidth="1.2"
        opacity="0.6"
      />

      <path d="M101 70C114 88 128 104 142 122" {...ink} strokeWidth="5.5" />
      <path
        d="M101 70C114 88 128 104 142 122"
        {...ink}
        strokeWidth="1.6"
        opacity="0.5"
      />
      <path
        d="M108 82 118 78M118 96 128 92M129 110 138 106"
        {...ink}
        strokeWidth="1.2"
        opacity="0.6"
      />

      <path d="M101 70C86 84 70 96 54 112" {...ink} strokeWidth="5" />
      <path
        d="M101 70C86 84 70 96 54 112"
        {...ink}
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M92 79 84 87M78 92 70 100M64 104 57 110"
        {...ink}
        strokeWidth="1.1"
        opacity="0.6"
      />

      <path d="M101 70C90 56 78 44 60 28" {...ink} strokeWidth="5" />
      <path
        d="M101 70C90 56 78 44 60 28"
        {...ink}
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M94 62 84 66M84 51 74 55M72 39 63 42"
        {...ink}
        strokeWidth="1.1"
        opacity="0.6"
      />

      {/* tower — one continuous tapered silhouette, wider at base than top */}
      <path
        d="M62 182C64 160 68 132 74 104 79 82 82 70 87 60 89 56 90 54 92 52 98 50 104 50 110 52 112 54 113 56 115 60 120 70 123 82 128 104 134 132 138 160 140 182 130 186 116 184 101 184 86 184 72 186 62 182Z"
        fill="var(--coral)"
        opacity="0.16"
      />
      <path
        d="M62 182C64 160 68 132 74 104 79 82 82 70 87 60 89 56 90 54 92 52 98 50 104 50 110 52 112 54 113 56 115 60 120 70 123 82 128 104 134 132 138 160 140 182 130 186 116 184 101 184 86 184 72 186 62 182Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M64 180C66 159 70 131 76 105 80 84 84 71 89 61"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* cap on top of the tower */}
      <path
        d="M87 60C90 48 94 40 99 36 101 34 103 34 105 36 110 40 114 48 116 60 110 63 92 63 87 60Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M87 60C90 48 94 40 99 36 101 34 103 34 105 36 110 40 114 48 116 60"
        fill="var(--surface-ink)"
        opacity="0.14"
      />

      {/* hub */}
      <path
        d="M97 65c2-3 6-3 8 0 2 3-1 7-4 7s-6-4-4-7Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* door and windows, hand-varied not stacked evenly */}
      <path d="M92 174c0-8 1-14 8-15 7 1 8 7 8 15" {...ink} strokeWidth="1.5" />
      <path
        d="M90 130c4-1 8-1 12 0M96 108c3-1 6-1 9 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.6"
      />

      {/* field wash + grass tufts */}
      <path
        d="M6 184C40 178 70 188 100 184 132 180 164 188 194 182 194 196 190 200 100 200 10 200 6 196 6 184Z"
        fill="var(--leaf)"
        opacity="0.2"
      />
      <path
        d="M6 184C40 178 70 188 100 184 132 180 164 188 194 182"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M20 186c-1-5 2-8 5-8 1-4 6-5 8-1M160 184c-1-5 3-7 6-6M50 190c-1-4 2-7 5-6"
        {...ink}
        strokeWidth="1.3"
        stroke="var(--leaf)"
        opacity="0.85"
      />

      {/* distant bird */}
      <path
        d="M170 24c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6.4 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />
    </svg>
  );
}
