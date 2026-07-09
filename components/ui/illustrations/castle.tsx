const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CastleIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* clouds */}
      <path
        d="M18 34c-3-5 2-9 7-8-1-6 7-9 11-4 5-4 12 0 11 5 5 0 6 6 2 8-4 3-11 2-14-1-5 3-11 1-13-3Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.45"
      />
      <path
        d="M150 26c-2-4 2-7 5-6 0-5 6-7 9-3 4-3 9 0 8 4 4 0 5 5 1 6-3 2-8 1-10-1-4 2-8 0-10-3Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.4"
      />

      {/* grass wash */}
      <path
        d="M10 168C50 162 80 172 100 168 122 164 152 172 190 166 190 176 186 180 100 180 14 180 10 176 10 168Z"
        fill="var(--leaf)"
        opacity="0.16"
      />

      {/* left tower — hand-bowed edges, uneven crenellations */}
      <path
        d="M29 168C27 138 30 100 32 73M58 168C60 136 57 99 55 73"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M32 73 31 61 38 63 37 73 45 71 44 60 52 62 55 73"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M39 98c-3 1-4 6-3 12 0 6 2 10 5 10s5-4 5-10c0-6-2-11-7-12Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* right tower — deliberately NOT a mirror of the left */}
      <path
        d="M143 168C141 134 145 102 141 74M171 168C169 140 173 105 168 75"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M141 74 143 62 150 65 148 75 157 72 155 61 164 64 168 75"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M152 100c-4 2-5 7-4 13 1 5 3 8 6 8s4-4 4-9c0-6-2-10-6-12Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* center wall — bowed top/bottom, not a rect */}
      <path
        d="M58 168C57 148 60 122 62 105C88 102 116 104 141 106C143 124 141 148 143 168"
        {...ink}
        strokeWidth="2.1"
      />
      <path
        d="M89 168C88 154 90 140 100 138 110 140 112 154 111 168"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M63 119c9 2 20 3 29 1M113 128c8 2 17 1 27-1"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* flags, hand-wobbled poles */}
      <path d="M35 61C34 55 37 51 35 47" {...ink} strokeWidth="1.5" />
      <path d="M35 48 47 52 35 57Z" fill="var(--sky)" opacity="0.85" />
      <path d="M35 48 47 52 35 57Z" {...ink} strokeWidth="1.2" />
      <path d="M155 60C157 54 153 50 156 46" {...ink} strokeWidth="1.5" />
      <path d="M156 47 168 51 156 56Z" fill="var(--coral)" opacity="0.85" />
      <path d="M156 47 168 51 156 56Z" {...ink} strokeWidth="1.2" />

      {/* stone texture — uneven, not a grid */}
      <path
        d="M31 128h21M33 148h19M144 130h22M146 150h20"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />
    </svg>
  );
}
