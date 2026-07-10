const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: the aurora borealis over a snowy,
 * hilly horizon. The lights are big overlapping flowing ribbons — each
 * one closed path with a long wavy top edge and a long wavy bottom
 * edge — rather than a set of parallel stripes, so they read as
 * sweeping curtains of light. A dark night wash, scattered stars, and a
 * snow-line horizon ground the scene the same way the pyramid's sand
 * band does.
 */
export function AuroraIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* night sky wash */}
      <path
        d="M4 10C40 4 80 2 100 6C130 2 170 4 196 12C198 60 198 100 196 140C130 128 70 132 4 140C2 96 2 50 4 10Z"
        fill="var(--violet)"
        opacity="0.22"
      />

      {/* stars */}
      <path
        d="M30 24c.5-1 2-1 2 .5s-1.6 1.4-2 .3ZM150 18c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2ZM176 40c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2ZM60 14c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2ZM18 52c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2ZM120 66c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />

      {/* ribbon 1 — green sweep, upper-left to lower-right */}
      <path
        d="M8 28C28 20 48 14 68 22C88 30 78 44 98 40C118 36 128 18 148 26C163 32 176 42 194 32C188 54 174 68 158 74C138 64 128 48 108 56C88 64 92 80 72 76C52 72 58 54 38 48C20 44 13 38 8 58C4 48 4 38 8 28Z"
        fill="var(--leaf)"
        opacity="0.3"
      />
      <path
        d="M8 28C28 20 48 14 68 22C88 30 78 44 98 40C118 36 128 18 148 26C163 32 176 42 194 32"
        {...ink}
        strokeWidth="1.4"
        opacity="0.5"
      />

      {/* ribbon 2 — violet sweep, drifting the other way, overlapping ribbon 1 */}
      <path
        d="M2 66C24 52 46 58 66 50C86 42 96 60 118 54C140 48 152 34 172 44C184 50 192 60 198 56C190 78 172 90 152 88C132 86 128 68 108 74C88 80 90 96 68 92C46 88 50 70 28 68C16 67 8 74 2 88C-2 80 -2 74 2 66Z"
        fill="var(--violet)"
        opacity="0.26"
      />
      <path
        d="M2 66C24 52 46 58 66 50C86 42 96 60 118 54C140 48 152 34 172 44C184 50 192 60 198 56"
        {...ink}
        strokeWidth="1.4"
        opacity="0.45"
      />

      {/* ribbon 3 — sky/aqua accent, thinner and higher */}
      <path
        d="M14 40C36 30 58 36 80 28C104 20 116 36 138 30C158 25 168 14 188 22C182 36 168 44 152 42C136 40 132 28 114 33C94 39 98 50 78 46C58 42 62 30 42 32C30 33 20 38 14 52C10 46 10 44 14 40Z"
        fill="var(--sky)"
        opacity="0.22"
      />

      {/* small night-bird / character touch, drifting between the ribbons */}
      <path
        d="M150 60c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* snowy hilly horizon silhouette */}
      <path
        d="M2 150C24 138 44 148 66 140C90 132 112 146 136 138C158 132 176 142 198 136C198 158 198 176 198 188C130 182 68 186 2 188C2 176 2 162 2 150Z"
        fill="var(--surface-ink)"
        opacity="0.1"
      />
      <path
        d="M2 150C24 138 44 148 66 140C90 132 112 146 136 138C158 132 176 142 198 136"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M2 152C24 140 44 150 66 142C90 134 112 148 136 140C158 134 176 144 198 138"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* snow-flecked pines, a couple of hand-varied triangles-by-curve */}
      <path
        d="M44 148c3-8 4-14 5-20 2 6 3 12 6 20-3-1-5-1-5 1-3-2-4-2-6-1Z"
        fill="var(--leaf)"
        opacity="0.4"
      />
      <path
        d="M44 148c3-8 4-14 5-20 2 6 3 12 6 20"
        {...ink}
        strokeWidth="1.4"
      />
      <path
        d="M108 142c2-6 3-11 4-16 2 5 2 10 5 16-2-1-4-1-4 0-2-1-3-1-5 0Z"
        fill="var(--leaf)"
        opacity="0.35"
      />
      <path
        d="M108 142c2-6 3-11 4-16 2 5 2 10 5 16"
        {...ink}
        strokeWidth="1.3"
      />

      {/* a tiny figure looking up at the lights */}
      <path
        d="M170 170c0-4 0-7 0-9M170 161c-2 0-3 2-3 4M170 161c2 0 3 2 3 4M167 170c-1 3-1 6 0 8M173 170c1 3 1 6 0 8"
        {...ink}
        strokeWidth="1.3"
        opacity="0.65"
      />
    </svg>
  );
}
