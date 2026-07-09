const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an armored knight. Helmet through torso is
 * one continuous silhouette, but it reads as a figure — not a blob —
 * because the outline actually narrows at the neck before flaring back out
 * at the shoulders (pauldrons), the same in/out landmark a real suit of
 * armor has. The plume, shield, sword, and legs break off as their own
 * strokes.
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

      {/* helmet + torso, one continuous silhouette: dome, neck-in,
          shoulder/pauldron flare, torso taper, belt */}
      <path
        d="M100 24C116 25 128 37 128 52C129 61 124 68 120 72C118 77 113 79 110 80C124 78 142 79 150 92C155 106 148 122 137 133C130 143 118 147 106 146C93 150 79 147 70 140C59 130 54 115 59 99C51 88 66 77 85 79C91 78 93 75 90 70C74 68 70 60 72 52C73 37 85 25 100 24Z"
        fill="var(--sky)"
        opacity="0.18"
      />
      <path
        d="M100 24C116 25 128 37 128 52C129 61 124 68 120 72C118 77 113 79 110 80C124 78 142 79 150 92C155 106 148 122 137 133C130 143 118 147 106 146C93 150 79 147 70 140C59 130 54 115 59 99C51 88 66 77 85 79C91 78 93 75 90 70C74 68 70 60 72 52C73 37 85 25 100 24Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M99 26C114 27 126 39 126 53C127 62 122 68 118 72C127 76 141 80 148 92C153 105 146 121 136 132C129 141 117 145 105 144C93 148 80 145 72 138C61 129 56 115 61 100C53 89 67 78 86 80C79 76 76 70 76 65C70 58 68 55 70 51C71 38 86 27 99 26Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* visor slit + faceplate rivets */}
      <path d="M88 56c8-1 16-1 24 1" {...ink} strokeWidth="1.6" />
      <path
        d="M84 42h.01M114 42h.01M64 100h.01M140 100h.01"
        {...ink}
        strokeWidth="2.2"
        opacity="0.55"
      />

      {/* plume on top */}
      <path
        d="M98 24c-2-8-1-16 3-22M104 22c1-9 4-16 8-21M110 24c3-8 7-14 12-18"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M99 16c3-9 9-15 16-18-1 9-6 16-12 21-2 1-4-1-4-3Z"
        fill="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M99 16c3-9 9-15 16-18-1 9-6 16-12 21-2 1-4-1-4-3Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* shield, its own stroke */}
      <path
        d="M32 92C34 82 44 76 54 78C56 96 54 114 48 128C40 124 32 116 30 104C29 100 30 95 32 92Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M32 92C34 82 44 76 54 78C56 96 54 114 48 128C40 124 32 116 30 104C29 100 30 95 32 92Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M42 88 36 100 44 100 38 112"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* sword, its own stroke */}
      <path d="M162 64C163 92 164 118 164 142" {...ink} strokeWidth="2.4" />
      <path
        d="M162 64c1-6 3-10 5-13M162 64c-2-5-1-10 2-14"
        {...ink}
        strokeWidth="1.6"
      />
      <path d="M152 100 174 100" {...ink} strokeWidth="2.6" />
      <path
        d="M164 142c-3 3-3 7 0 10 3-3 3-7 0-10Z"
        fill="var(--sun)"
        opacity="0.8"
      />

      {/* legs */}
      <path
        d="M84 146c-2 12-3 22-4 32M108 146c2 12 3 22 3 32"
        {...ink}
        strokeWidth="6"
      />
      <path d="M76 178h10M100 178h11" {...ink} strokeWidth="5" opacity="0.9" />

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
