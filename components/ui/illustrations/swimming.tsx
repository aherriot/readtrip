const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a swimmer mid-stroke in a pool. The
 * head-shoulder-torso silhouette is one continuous path, drawn in a dynamic
 * freestyle pose — head turned to breathe, one arm reaching forward, the
 * other trailing back, legs kicking — rather than a standing figure laid on
 * its side. Real proportions (shoulders wider than the waist) carry through
 * even in this horizontal pose.
 */
export function SwimmingIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* water wash */}
      <path
        d="M4 60C40 48 90 46 130 54C160 60 182 56 196 66C198 100 196 140 192 168C150 176 92 172 46 164C18 158 4 148 4 128Z"
        fill="var(--aqua)"
        opacity="0.18"
      />

      {/* wavy water lines behind the swimmer */}
      <path
        d="M10 76C30 70 48 82 68 76C88 70 104 82 124 76C144 70 162 82 182 76"
        {...ink}
        strokeWidth="1.6"
        opacity="0.55"
      />
      <path
        d="M8 96C28 90 46 102 66 96C86 90 102 102 122 96C142 90 160 102 180 96"
        {...ink}
        strokeWidth="1.6"
        opacity="0.5"
      />
      <path
        d="M14 140C34 134 52 146 72 140C92 134 108 146 128 140C148 134 166 146 186 140"
        {...ink}
        strokeWidth="1.6"
        opacity="0.45"
      />

      {/* head + shoulders + torso, one continuous silhouette, turned to breathe */}
      <path
        d="M158 62C163 60 168 63 167 68C172 70 178 75 176 82C173 88 166 89 160 87C150 92 138 94 128 92C118 98 106 100 96 96C88 100 80 99 76 92C71 87 74 80 82 78C90 75 100 76 108 79C120 74 134 76 146 72C150 68 154 63 158 62Z"
        fill="var(--sky)"
        opacity="0.16"
      />
      <path
        d="M158 62C163 60 168 63 167 68C172 70 178 75 176 82C173 88 166 89 160 87C150 92 138 94 128 92C118 98 106 100 96 96C88 100 80 99 76 92C71 87 74 80 82 78C90 75 100 76 108 79C120 74 134 76 146 72C150 68 154 63 158 62Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass on the primary silhouette */}
      <path
        d="M158 63C162 61 167 64 166 68C171 71 177 76 175 82C172 87 166 88 161 86C151 91 139 93 129 91C119 97 107 99 97 95C89 99 81 98 77 91C73 87 76 80 83 79C91 76 100 77 109 80C121 75 134 77 146 73C150 69 154 64 158 63Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />
      {/* small eye + breath marks on the turned face */}
      <path d="M164 68h.01" {...ink} strokeWidth="2.4" opacity="0.8" />

      {/* leading arm — reaching forward, real elbow bend */}
      <path
        d="M158 62C168 56 178 50 186 46C190 44 193 46 191 50C186 56 176 62 166 66"
        {...ink}
        strokeWidth="2.1"
      />

      {/* trailing arm — bent back after the stroke, hand-varied not mirrored */}
      <path
        d="M96 96C88 100 80 106 78 114C77 120 82 124 88 122"
        {...ink}
        strokeWidth="2"
      />

      {/* kicking legs — hip to knee to ankle, a real bend, hand-varied left/right */}
      <path
        d="M76 92C62 92 48 96 36 104C28 109 26 116 32 118"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M72 96C58 100 44 108 34 118C27 125 27 132 34 133"
        {...ink}
        strokeWidth="2"
        opacity="0.85"
      />

      {/* splash marks at the kicking feet */}
      <path
        d="M24 112c-3-2-6-1-7 2M20 120c-3 0-6 2-6 5M30 124c-2 2-3 5-2 8M22 132c-3 1-5 4-5 7"
        {...ink}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* bubbles trailing near the head */}
      <path
        d="M182 34c2-2 5-2 6 0 1 2-1 4-3 4s-4-2-3-4Z"
        fill="var(--aqua)"
        opacity="0.5"
      />
      <path
        d="M192 44c1-1 3-1 4 .5s-1 3-2.5 2.5S191 45 192 44Z"
        fill="var(--aqua)"
        opacity="0.5"
      />

      {/* lane-divider rope with alternating floats along the bottom edge */}
      <path
        d="M4 178C40 172 80 182 120 176C150 171 176 179 198 174"
        {...ink}
        strokeWidth="1.8"
        opacity="0.7"
      />
      <path
        d="M18 173c4-4 8-4 11 0-3 4-7 4-11 0Zm38 3c4-4 9-4 12 0-3 4-8 4-12 0Zm40-4c4-4 9-4 12 0-3 4-8 4-12 0Zm40 3c4-4 8-4 11 0-3 4-7 4-11 0Z"
        fill="var(--coral)"
        opacity="0.75"
      />
      <path
        d="M18 173c4-4 8-4 11 0-3 4-7 4-11 0Zm38 3c4-4 9-4 12 0-3 4-8 4-12 0Zm40-4c4-4 9-4 12 0-3 4-8 4-12 0Zm40 3c4-4 8-4 11 0-3 4-7 4-11 0Z"
        {...ink}
        strokeWidth="1.2"
      />
    </svg>
  );
}
