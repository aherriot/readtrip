const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an armored knight, helmet through torso as
 * one continuous silhouette (the plume, shield, sword, and legs break off as
 * their own strokes — the same way a dinosaur's legs do, not a stitched-on
 * head or chest plate).
 */
export function KnightIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* banner wash behind */}
      <path
        d="M60 20C80 12 120 12 142 22C148 60 146 100 150 138C110 146 88 144 54 138C56 98 54 58 60 20Z"
        fill="var(--coral)"
        opacity="0.1"
      />

      {/* helmet + torso, one continuous silhouette */}
      <path
        d="M100 30C108 26 116 30 116 38C124 40 128 48 124 56C132 60 136 70 130 78C140 84 146 96 138 104C144 112 142 124 130 128C132 138 126 148 112 148C110 154 90 154 88 148C74 148 68 138 70 128C58 124 56 112 62 104C54 96 58 84 68 78C62 70 66 60 74 56C70 48 74 40 82 38C82 30 90 26 100 30Z"
        fill="var(--sky)"
        opacity="0.18"
      />
      <path
        d="M100 30C108 26 116 30 116 38C124 40 128 48 124 56C132 60 136 70 130 78C140 84 146 96 138 104C144 112 142 124 130 128C132 138 126 148 112 148C110 154 90 154 88 148C74 148 68 138 70 128C58 124 56 112 62 104C54 96 58 84 68 78C62 70 66 60 74 56C70 48 74 40 82 38C82 30 90 26 100 30Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M99 32C106 28 114 32 114 39C122 41 126 49 122 56C130 61 134 70 128 78C138 85 143 96 136 104C142 113 140 123 129 127C131 137 125 146 112 146C110 151 91 151 89 146C76 146 70 137 72 127C60 123 58 112 64 104C56 97 60 85 70 79C64 71 68 61 76 57C72 49 76 41 83 39C83 32 91 28 99 32Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* visor slit + faceplate rivets */}
      <path d="M90 62c8-1 14-1 20 1" {...ink} strokeWidth="1.6" />
      <path
        d="M84 46h.01M116 46h.01M84 92h.01M116 92h.01"
        {...ink}
        strokeWidth="2.2"
        opacity="0.55"
      />

      {/* plume on top */}
      <path
        d="M98 30c-2-8-1-16 3-22M104 28c1-9 4-16 8-21M110 30c3-8 7-14 12-18"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M99 22c3-9 9-15 16-18-1 9-6 16-12 21-2 1-4-1-4-3Z"
        fill="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M99 22c3-9 9-15 16-18-1 9-6 16-12 21-2 1-4-1-4-3Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* shield, its own stroke */}
      <path
        d="M40 88C42 78 52 72 62 74C64 92 62 110 56 124C48 120 40 112 38 100C37 96 38 91 40 88Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M40 88C42 78 52 72 62 74C64 92 62 110 56 124C48 120 40 112 38 100C37 96 38 91 40 88Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M50 84 44 96 52 96 46 108"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* sword, its own stroke */}
      <path d="M148 60C150 88 152 116 154 140" {...ink} strokeWidth="2.4" />
      <path
        d="M148 60c1-6 3-10 5-13M148 60c-2-5-1-10 2-14"
        {...ink}
        strokeWidth="1.6"
      />
      <path d="M138 96 164 96" {...ink} strokeWidth="2.6" />
      <path
        d="M154 140c-3 3-3 7 0 10 3-3 3-7 0-10Z"
        fill="var(--sun)"
        opacity="0.8"
      />

      {/* legs */}
      <path
        d="M92 148c-2 12-3 22-4 32M108 148c2 12 3 22 3 32"
        {...ink}
        strokeWidth="6"
      />
      <path d="M84 180h10M104 180h11" {...ink} strokeWidth="5" opacity="0.9" />

      {/* ground + grass */}
      <path
        d="M6 172C40 166 70 176 100 172 132 168 164 178 194 170"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M24 172c-1-5 2-8 5-8 1-4 6-5 8-1M164 170c-1-5 3-7 6-6"
        {...ink}
        strokeWidth="1.4"
        stroke="var(--leaf)"
        opacity="0.9"
      />
    </svg>
  );
}
