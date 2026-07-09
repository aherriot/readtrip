const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a magnifying glass held over a leaf. One
 * generic entry in the "no specific art yet" fallback pool (see
 * `lib/illustrations/resolve.ts`) — the lens is a hand-drawn closed
 * silhouette, never a `<circle>`, and the handle is one continuous stroke
 * out of the rim rather than a separate stitched-on rectangle.
 */
export function MagnifyingGlassIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* desk wash */}
      <path
        d="M8 150C40 138 80 132 120 138C152 132 178 142 194 156C194 168 194 178 192 186C150 180 108 186 66 182C36 180 16 174 8 164C6 160 6 154 8 150Z"
        fill="var(--sun)"
        opacity="0.12"
      />

      {/* leaf under the lens */}
      <path
        d="M84 116C78 100 84 82 100 74C112 90 112 110 100 124C93 128 87 124 84 116Z"
        fill="var(--leaf)"
        opacity="0.35"
      />
      <path
        d="M84 116C78 100 84 82 100 74C112 90 112 110 100 124C93 128 87 124 84 116Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M92 82c2 14 3 28 4 42"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* lens rim, one continuous hand-drawn silhouette, and its handle
          growing out of the same path — not a separate stitched rectangle */}
      <path
        d="M96 40C114 38 128 50 130 68C144 72 152 86 146 102C158 112 162 128 152 138C148 146 138 150 128 148C122 158 108 164 94 158C80 164 64 158 58 144C46 138 42 124 50 112C42 100 46 84 60 76C60 60 74 46 90 44C92 41 94 40 96 40Z"
        fill="var(--sky)"
        opacity="0.18"
      />
      <path
        d="M96 40C114 38 128 50 130 68C144 72 152 86 146 102C158 112 162 128 152 138C148 146 138 150 128 148C122 158 108 164 94 158C80 164 64 158 58 144C46 138 42 124 50 112C42 100 46 84 60 76C60 60 74 46 90 44C92 41 94 40 96 40Z"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M95 42C112 40 126 51 128 68C141 73 149 86 143 101C154 111 158 126 149 136C145 144 136 148 127 146C121 156 108 162 95 156C82 162 67 156 61 143C50 137 46 124 54 113C46 101 50 86 63 78C64 63 77 49 92 46C93 44 94 43 95 42Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.35"
      />

      {/* shine highlight */}
      <path
        d="M72 66c6-10 16-16 26-16"
        {...ink}
        strokeWidth="1.6"
        opacity="0.5"
      />

      {/* handle, continuing off the rim */}
      <path d="M152 138C160 150 168 162 178 174" {...ink} strokeWidth="7" />
      <path
        d="M150 140C158 152 166 164 176 176"
        {...ink}
        strokeWidth="2"
        opacity="0.4"
      />
      <path
        d="M158 148c2-3 6-3 8 0M166 158c2-3 6-3 8 0"
        {...ink}
        strokeWidth="1.6"
        opacity="0.6"
      />

      {/* sparkle marks around the discovery */}
      <path
        d="M40 90c1-3 4-3 4 1s-3 4-4-1ZM160 60c1-2.6 3.4-2.6 3.4.5s-2.7 3-3.4-.5Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
