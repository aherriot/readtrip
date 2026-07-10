const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an open storybook. The two pages and the
 * spine crease are one continuous hand-drawn silhouette (pages bow slightly
 * rather than being flat rectangles), with squiggly "text" lines on each
 * page and a small star + swirl floating up out of the spine to suggest a
 * story coming to life.
 */
export function StoryBookIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* book — one continuous open-page silhouette with a spine dip */}
      <path
        d="M28 148C34 122 55 108 78 112C92 114 98 118 100 128C102 118 110 113 124 111C148 107 170 120 176 146C178 156 174 163 168 162C146 156 122 160 100 165C78 160 54 155 32 161C26 162 26 154 28 148Z"
        fill="var(--sun)"
        opacity="0.16"
      />
      <path
        d="M28 148C34 122 55 108 78 112C92 114 98 118 100 128C102 118 110 113 124 111C148 107 170 120 176 146C178 156 174 163 168 162C146 156 122 160 100 165C78 160 54 155 32 161C26 162 26 154 28 148Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M29 148C35 123 56 109 78 113C91 115 97 119 99 128C101 119 109 114 123 112C147 108 169 121 175 146C177 155 173 162 167 161C145 155 121 159 99 164C77 159 53 154 32 160C27 161 27 154 29 148Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* spine crease */}
      <path
        d="M100 128C99 140 101 153 100 165"
        {...ink}
        strokeWidth="1.8"
        opacity="0.8"
      />

      {/* page-bow shading near the outer edges */}
      <path
        d="M34 145c14-18 34-28 44-28M156 143c-14-20-34-30-44-30"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* squiggly text lines, left page */}
      <path
        d="M45 128c8 1 14-1 20 1M42 136c10 2 18-1 26 2M40 144c12 2 20 0 28 3M40 152c10 1 18-1 24 2"
        {...ink}
        strokeWidth="1.3"
        opacity="0.6"
      />

      {/* squiggly text lines, right page */}
      <path
        d="M118 126c8 1 15-2 21 0M116 134c11 2 19-1 27 1M115 142c13 1 21-2 29 2M118 150c9 2 16 0 22 3"
        {...ink}
        strokeWidth="1.3"
        opacity="0.6"
      />

      {/* bookmark ribbon */}
      <path
        d="M104 112c2 12 1 24-2 34"
        {...ink}
        strokeWidth="1.6"
        opacity="0.85"
        stroke="var(--coral)"
      />
      <path d="M102 146 108 152 100 150Z" fill="var(--coral)" opacity="0.8" />

      {/* floating star — character touch */}
      <path
        d="M83 78 87 66 91 78 103 74 92 82 96 94 87 86 79 95 82 83Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M83 78 87 66 91 78 103 74 92 82 96 94 87 86 79 95 82 83Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* floating swirl — character touch */}
      <path
        d="M142 90c-4-2-5-8-1-11 4-3 10-1 11 4 1 4-2 8-6 8"
        {...ink}
        strokeWidth="1.5"
        opacity="0.7"
        stroke="var(--sky)"
      />
    </svg>
  );
}
