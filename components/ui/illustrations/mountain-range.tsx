const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function MountainRangeIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* clouds + sky wash */}
      <path
        d="M14 42c-3-6 3-11 9-9-1-7 8-11 13-5 6-5 14 0 12 6 6 0 7 7 1 9-5 3-13 2-16-2-6 3-13 1-16-3Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M6 76C24 62 50 54 84 58C120 62 148 55 182 68"
        fill="var(--sky)"
        opacity="0.18"
        stroke="none"
      />

      {/* back peak — bowed edges */}
      <path
        d="M51 58C40 84 24 116 7 154C36 158 68 156 96 155C82 122 68 89 51 58Z"
        {...ink}
        strokeWidth="1.6"
        opacity="0.5"
      />

      {/* main peak — bowed, asymmetric */}
      <path
        d="M106 33C93 62 76 100 55 154C89 158 121 152 158 156C144 122 128 88 106 33Z"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M105 47c5 10 12 24 8 33-4-3-6-7-11-6 6 8 15 20 11 30-5-2-9-8-14-7 4 6 8 12 6 18"
        {...ink}
        strokeWidth="1.5"
        opacity="0.85"
      />

      {/* front peak */}
      <path
        d="M154 68C143 92 128 122 113 155C138 158 168 154 199 158C182 128 168 98 154 68Z"
        {...ink}
        strokeWidth="2"
        opacity="0.85"
      />
      <path
        d="M154 78c2 6 6 12 2 18-3-2-6-4-9-3 4 6 9 12 6 18"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* flag on summit */}
      <path d="M106 33C105 29 108 26 106 22" {...ink} strokeWidth="1.5" />
      <path d="M106 23 118 27 106 31Z" fill="var(--coral)" opacity="0.85" />
      <path d="M106 23 118 27 106 31Z" {...ink} strokeWidth="1.2" />

      {/* tree line — hand-varied triangles */}
      <path
        d="M20 166 27 149 37 165ZM29 166 39 141 51 165ZM149 166 156 151 167 165ZM160 166 171 143 182 166Z"
        fill="var(--leaf)"
        opacity="0.5"
      />
      <path
        d="M20 166 27 149 37 165ZM29 166 39 141 51 165ZM149 166 156 151 167 165ZM160 166 171 143 182 166Z"
        {...ink}
        strokeWidth="1.3"
      />

      <path
        d="M2 166C40 160 70 170 100 166 132 162 164 170 198 165"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
