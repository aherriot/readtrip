const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: the Great Pyramid, sun, and a smaller pyramid
 * behind it. Larger and more detailed than the icon set, but the same
 * discipline — ink-outline geometry with a few flat "marker" accent fills, all
 * baked into the path data by hand (no runtime SVG filter, no perfect
 * circles/straight edges — see the illustrations skill's anti-geometric list).
 */
export function PyramidIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky marker wash */}
      <path
        d="M8 62C22 48 46 40 78 44C112 48 138 42 168 54C182 60 190 70 188 78C160 66 128 74 96 70C60 66 34 74 10 72C4 68 4 65 8 62Z"
        fill="var(--sky)"
        opacity="0.3"
      />

      {/* sun */}
      <g>
        <path
          d="M28 12 30 22M46 12 44 22M14 28 24 30M60 28 50 30M18 15 26 24M56 15 48 24"
          {...ink}
          strokeWidth="1.6"
          opacity="0.8"
        />
        <path
          d="M37 20c6.4-.3 11.8 4.7 11.4 11.2C48 37.4 42.6 42 36.4 41.7 30 41.4 25 36.2 25.4 30 25.8 23.8 30.8 20.3 37 20Z"
          fill="var(--sun)"
          opacity="0.88"
        />
        <path
          d="M37 20c6.4-.3 11.8 4.7 11.4 11.2C48 37.4 42.6 42 36.4 41.7 30 41.4 25 36.2 25.4 30 25.8 23.8 30.8 20.3 37 20Z"
          {...ink}
          strokeWidth="1.8"
        />
      </g>

      {/* birds */}
      <path
        d="M92 24c2.6-2.6 5-2.6 7 0 2-2.6 4.4-2.6 7 0M112 34c2.2-2.3 4.4-2.3 6.2 0 1.8-2.3 3.9-2.3 6 0"
        {...ink}
        strokeWidth="1.5"
        opacity="0.75"
      />

      {/* distant pyramid — no straight edges, each side hand-varied */}
      <path
        d="M141 60C150 82 158 106 173 154C150 158 128 156 110 154C121 122 131 90 141 60Z"
        {...ink}
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M128 98c8 1 17 2 24-1M122 113c10 2 22 2 33-1M117 129c13 2 27 3 41-1M112 145c15 2 33 3 50-2"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* main pyramid — hand-bowed edges, not straight lines */}
      <path
        d="M99 33C87 63 61 108 38 156C77 161 121 152 163 157C147 111 121 65 99 33Z"
        {...ink}
        strokeWidth="2.4"
      />
      {/* sketchy retrace pass, fainter + offset, so it doesn't read as one clean vector path */}
      <path
        d="M101 35C90 66 65 109 41 154C79 158 119 150 160 154C144 109 119 64 101 35Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.45"
      />
      <path
        d="M99 33C101 74 104 118 106 157"
        {...ink}
        strokeWidth="2"
        opacity="0.85"
      />

      {/* stone courses — uneven, hand-run */}
      <path d="M87 58q11 3 23-1" {...ink} strokeWidth="1.6" />
      <path d="M78 80q21 4 42-1" {...ink} strokeWidth="1.6" />
      <path d="M69 102q30 4.5 61-1" {...ink} strokeWidth="1.7" />
      <path d="M60 124q39 5 79-1" {...ink} strokeWidth="1.8" />
      <path d="M50 146q49 5.5 100-1" {...ink} strokeWidth="1.9" />

      {/* small explorer flag */}
      <path d="M99 33C98 29 101 26 99 22" {...ink} strokeWidth="1.6" />
      <path d="M99 23 111 27 99 32Z" fill="var(--coral)" opacity="0.85" />
      <path d="M99 23 111 27 99 32Z" {...ink} strokeWidth="1.3" />

      {/* ground + sand */}
      <path
        d="M6 156C40 150 70 160 100 156 132 152 164 160 194 155"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 158C40 152 70 162 100 158 132 154 164 163 194 157 194 168 190 174 100 174 12 174 6 168 6 158Z"
        fill="var(--sun)"
        opacity="0.14"
      />
      <path
        d="M20 165 26 163M32 168 38 165M148 167 154 165M168 165 174 168"
        {...ink}
        strokeWidth="1.3"
        opacity="0.55"
      />

      {/* little palm accent */}
      <path
        d="M18 156c-1-6 1-11 5-14M18 156c1-7 5-11 10-12M18 156c2-7 7-10 12-9"
        {...ink}
        strokeWidth="1.5"
      />
      <path d="M18 156C17 152 19 149 18 145" {...ink} strokeWidth="1.7" />
      <path
        d="M18 148c-3-3-1-8 4-9-1 5-2 7-4 9Zm0 0c1-4 5-6 9-5-3 4-6 5-9 5Zm0 0c-1-4-5-6-9-5 3 4 6 5 9 5Z"
        fill="var(--leaf)"
        opacity="0.75"
      />
    </svg>
  );
}
