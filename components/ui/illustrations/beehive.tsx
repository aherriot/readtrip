const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function BeehiveIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M8 40C36 26 70 20 100 24C132 20 162 28 190 40"
        fill="var(--sky)"
        opacity="0.18"
      />

      {/* branch the hive hangs from */}
      <path
        d="M6 44C40 40 70 46 100 40C132 34 164 42 196 36"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M40 44c2 4 1 8-1 12M150 40c1 4 3 7 6 10"
        {...ink}
        strokeWidth="1.4"
        opacity="0.5"
      />

      {/* hive — one continuous silhouette, layered dome tapering to a point */}
      <path
        d="M100 46C122 48 138 62 140 84C142 100 132 108 138 122C144 134 134 146 138 158C142 170 118 182 100 182C82 182 58 170 62 158C66 146 56 134 62 122C68 108 58 100 60 84C62 62 78 48 100 46Z"
        fill="var(--sun)"
        opacity="0.35"
      />
      <path
        d="M100 46C122 48 138 62 140 84C142 100 132 108 138 122C144 134 134 146 138 158C142 170 118 182 100 182C82 182 58 170 62 158C66 146 56 134 62 122C68 108 58 100 60 84C62 62 78 48 100 46Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace */}
      <path
        d="M100 48C121 50 136 63 138 84C140 99 130 107 136 121C142 133 132 145 136 157C140 168 118 180 100 180C83 180 60 168 64 157C68 145 58 133 64 121C70 107 60 99 62 84C64 63 79 50 100 48Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* hive bands — uneven, hand-run, not concentric circles */}
      <path d="M65 90q17 5 35 3 18-2 33 2" {...ink} strokeWidth="1.6" />
      <path d="M63 124q19 5 38 3 19-2 36 2" {...ink} strokeWidth="1.6" />
      <path d="M63 156q19 5 38 3 19-2 36 1" {...ink} strokeWidth="1.6" />

      {/* entrance hole */}
      <path
        d="M92 168c0-4 4-6 8-6s8 2 8 6c0 4-4 7-8 7s-8-3-8-7Z"
        fill="var(--surface-ink)"
        opacity="0.75"
      />

      {/* honeycomb hex texture, hand-varied */}
      <path
        d="M84 70l6-4 6 4 0 8-6 4-6-4Z M100 76l6-4 6 4 0 8-6 4-6-4Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* bees, small flight loops */}
      <path
        d="M40 66c2-2 5-2 5 1 0 2-3 3-5 1Zm5 1c2-2 5-1 5 2 0 2-3 3-5 1Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M40 66c2-2 5-2 5 1 0 2-3 3-5 1Zm5 1c2-2 5-1 5 2 0 2-3 3-5 1Z"
        {...ink}
        strokeWidth="1.2"
      />
      <path
        d="M36 64c1.4-2 3.6-2 4 .6M52 68c1.4-1.8 3.4-1.6 3.6.6"
        {...ink}
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M22 90C26 84 34 82 38 88"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      <path
        d="M162 100c2-2 5-2 5 1 0 2-3 3-5 1Zm5 1c2-2 5-1 5 2 0 2-3 3-5 1Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M162 100c2-2 5-2 5 1 0 2-3 3-5 1Zm5 1c2-2 5-1 5 2 0 2-3 3-5 1Z"
        {...ink}
        strokeWidth="1.2"
      />

      {/* flowers on the ground */}
      <path
        d="M6 190C40 184 74 194 108 190 142 186 168 194 194 188"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 192C40 186 74 196 108 192 142 188 168 196 194 190 194 197 190 198 100 198 12 198 6 197 6 192Z"
        fill="var(--leaf)"
        opacity="0.16"
      />
      <path
        d="M40 188c-2-4 1-7 4-6 0-4 5-5 6-1 3-1 5 2 3 5-4 2-9 2-13 2Z"
        fill="var(--coral)"
        opacity="0.75"
      />
    </svg>
  );
}
