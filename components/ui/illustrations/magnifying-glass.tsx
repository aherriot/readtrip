const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a magnifying glass held over a leaf. One
 * generic entry in the "no specific art yet" fallback pool (see
 * `lib/illustrations/resolve.ts`) — the lens is a genuinely round object, so
 * it uses the `pyramid.tsx` sun / `telescope.tsx` moon treatment (one closed
 * path, a handful of long sweeps) instead of a chain of small bumps, which
 * reads as a cloud rather than a lens. The handle continues off the rim as
 * one stroke rather than a separate stitched-on rectangle.
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

      {/* lens rim — a round object, drawn as a handful of long sweeps,
          not a chain of small scallops */}
      <path
        d="M98 40C130 38 156 62 158 94C160 126 136 152 104 154C72 156 46 132 44 100C42 68 66 42 98 40Z"
        fill="var(--sky)"
        opacity="0.18"
      />
      <path
        d="M98 40C130 38 156 62 158 94C160 126 136 152 104 154C72 156 46 132 44 100C42 68 66 42 98 40Z"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M97 42C127 41 152 64 154 94C156 124 133 149 105 152C75 154 51 131 49 101C47 71 69 44 97 42Z"
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
      <path d="M148 138C157 150 166 162 178 174" {...ink} strokeWidth="7" />
      <path
        d="M146 140C155 152 164 164 176 176"
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
