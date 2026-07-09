const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ButterflyIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* meadow sky wash */}
      <path
        d="M8 30C36 18 70 12 100 16C132 12 162 20 190 32"
        fill="var(--sky)"
        opacity="0.18"
      />

      {/* left upper wing */}
      <path
        d="M98 70C78 46 50 34 30 40C18 46 16 62 26 74C38 88 62 92 82 84C90 81 96 76 98 70Z"
        fill="var(--coral)"
        opacity="0.55"
      />
      <path
        d="M98 70C78 46 50 34 30 40C18 46 16 62 26 74C38 88 62 92 82 84C90 81 96 76 98 70Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M40 52c8 2 16 8 22 18M32 62c9 1 18 6 26 14"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* left lower wing — deliberately smaller, not mirrored math */}
      <path
        d="M96 84C82 82 66 88 58 100C52 110 56 122 68 124C82 126 96 116 100 102C101 96 99 89 96 84Z"
        fill="var(--sun)"
        opacity="0.6"
      />
      <path
        d="M96 84C82 82 66 88 58 100C52 110 56 122 68 124C82 126 96 116 100 102C101 96 99 89 96 84Z"
        {...ink}
        strokeWidth="1.8"
      />

      {/* right upper wing — hand-varied, not a copy of the left */}
      <path
        d="M102 70C124 44 154 33 174 41C185 47 186 63 175 74C162 87 138 90 118 81C111 78 105 75 102 70Z"
        fill="var(--sky)"
        opacity="0.55"
      />
      <path
        d="M102 70C124 44 154 33 174 41C185 47 186 63 175 74C162 87 138 90 118 81C111 78 105 75 102 70Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M158 51c-7 3-14 9-19 18M167 61c-8 2-16 7-23 14"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* right lower wing */}
      <path
        d="M104 84C119 81 134 88 141 99C147 109 142 121 130 123C117 125 104 115 101 101C100 95 101 89 104 84Z"
        fill="var(--leaf)"
        opacity="0.55"
      />
      <path
        d="M104 84C119 81 134 88 141 99C147 109 142 121 130 123C117 125 104 115 101 101C100 95 101 89 104 84Z"
        {...ink}
        strokeWidth="1.8"
      />

      {/* body — one continuous path from head to tail tip */}
      <path
        d="M99 52C96 60 96 68 98 76C95 84 95 94 98 104C96 112 97 122 100 130"
        {...ink}
        strokeWidth="3"
      />
      {/* head */}
      <path
        d="M96 50c-1-3 2-5 3-3 1-2 4 0 3 3-1 2-4 2-6 0Z"
        {...ink}
        strokeWidth="1.6"
      />
      {/* antennae */}
      <path
        d="M97 49C92 44 90 39 84 36M101 49C106 44 109 39 116 37"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M84 36c1.3-1 2.8-.5 2.6 1-.2 1.5-2 1.6-2.6-1Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />
      <path
        d="M116 37c1.3-1 2.8-.5 2.6 1-.2 1.5-2 1.6-2.6-1Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />

      {/* ground with flowers */}
      <path
        d="M10 172C46 166 78 176 108 172 140 168 168 176 194 170"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M10 174C46 168 78 178 108 174 140 170 168 178 194 172 194 184 190 188 100 188 14 188 10 184 10 174Z"
        fill="var(--leaf)"
        opacity="0.16"
      />
      <path d="M46 172C45 165 46 159 44 153" {...ink} strokeWidth="1.5" />
      <path
        d="M44 148c-2-3 0-6 3-5 0-3 4-4 5-1 3-2 5 1 3 4-3 2-8 2-11 2Z"
        fill="var(--violet)"
        opacity="0.7"
      />
      <path d="M150 172C151 164 149 158 152 152" {...ink} strokeWidth="1.5" />
      <path
        d="M152 147c2-3 6-2 6 1 3-1 5 2 3 5-3 2-8 1-9-2-2 0-2-2 0-4Z"
        fill="var(--coral)"
        opacity="0.7"
      />
    </svg>
  );
}
