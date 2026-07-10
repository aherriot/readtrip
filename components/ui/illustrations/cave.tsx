const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a cave interior — a jagged rock-arch mouth
 * (deliberately irregular, not a smooth oval), stalactites/stalagmites, a
 * small reflecting pool, and a couple of bats. The cave mouth is one
 * continuous silhouette path — see the illustrations skill.
 */
export function CaveIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* cave interior dark wash */}
      <path
        d="M10 40C4 70 2 110 8 150 30 172 84 178 130 174 168 170 194 150 196 118 198 84 188 52 160 30 128 8 74 6 40 16 22 22 14 30 10 40Z"
        fill="var(--surface-ink)"
        opacity="0.1"
      />

      {/* jagged cave-mouth arch — one continuous irregular silhouette */}
      <path
        d="M8 178C6 150 4 122 12 96 18 76 14 62 28 48 38 38 34 50 46 42 58 34 54 48 68 38 82 28 78 42 96 32 114 22 108 38 128 30 148 22 142 40 160 38 176 36 168 52 182 56 194 60 184 74 194 84 202 92 190 104 194 116 198 130 190 142 192 156 194 172 176 168 178 182"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M9 176C7 149 6 123 13 97 19 78 16 63 29 49"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* floor line */}
      <path
        d="M8 178C44 184 90 180 130 184 158 186 176 182 192 184"
        {...ink}
        strokeWidth="2"
      />

      {/* stalactites — tapered drips of varied length from the ceiling */}
      <path
        d="M56 44c-2 10-3 20-1 28 2-1 4-1 5 1 3-9 3-19 1-29Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M84 34c-2 14-4 26-1 38 2-1 5-1 6 1 3-13 2-27-1-39Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M114 32c-2 16-3 30 0 42 2-1 5-1 6 1 4-15 3-30-2-43Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M146 40c-1 10-2 18 0 26 2-1 4-1 5 1 2-9 1-18-1-27Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* stalagmites — rising from the floor, varied heights */}
      <path
        d="M40 182c1-10 2-19-1-26-2 1-4 1-5-1-3 8-2 18 1 27Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M78 186c2-14 3-27 0-38-2 1-5 1-6-1-3 12-2 27 1 39Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M132 188c2-18 3-33-1-46-2 1-5 1-7-1-3 15-1 33 2 47Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M162 184c1-9 2-17-1-24-2 1-4 1-5-1-2 8-1 17 1 25Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* small reflecting pool near the mouth, catching entrance light */}
      <path
        d="M84 168c14-6 32-6 44 0 4 2-6 8-22 8-14 0-26-4-22-8Z"
        fill="var(--sky)"
        opacity="0.3"
      />
      <path
        d="M84 168c14-6 32-6 44 0 4 2-6 8-22 8-14 0-26-4-22-8Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path
        d="M96 169c4-1 9-1 14 0M100 173c5-1 10-1 15 1"
        {...ink}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* light shaft from the mouth, sun wash */}
      <path
        d="M60 60C74 90 90 120 100 168"
        fill="var(--sun)"
        opacity="0.14"
        stroke="none"
        strokeWidth="18"
      />

      {/* bats */}
      <path
        d="M100 66c3-4 6-4 7 0 1-4 4-4 7 0-2 3-5 2-7 4-2-2-5-1-7-4Z"
        fill="var(--surface-ink)"
        opacity="0.75"
      />
      <path
        d="M130 84c2.4-3.2 4.8-3.2 5.6 0 .8-3.2 3.2-3.2 5.6 0-1.6 2.4-4 1.6-5.6 3.2-1.6-1.6-4-.8-5.6-3.2Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />
    </svg>
  );
}
