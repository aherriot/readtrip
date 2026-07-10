const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a friendly, storybook dragon. The tail, body,
 * neck, and head are one continuous winding silhouette (see the illustrations
 * skill's "favor one continuous stroke" rule) — only the wings and legs break
 * off as their own strokes, the same way a dinosaur's legs do. Kept charming
 * rather than menacing: a round friendly snout, tiny visible teeth, and a
 * small puff of smoke instead of a blast of fire.
 */
export function DragonIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 46C34 30 70 24 104 30C138 24 168 34 192 50C192 94 192 132 190 160C156 170 118 164 86 168C52 172 22 166 8 158C6 122 6 82 6 46Z"
        fill="var(--sky)"
        opacity="0.16"
      />

      {/* tail + body + neck + head, one continuous winding silhouette:
          tail tip, tail thickening, back arch, shoulder, neck rise, snout,
          jaw notch, chest sweep, belly, haunch back to tail base — 9 long
          purposeful curves, not a chain of even bumps */}
      <path
        d="M20 150C10 136 18 116 55 118C62 96 78 84 95 85C108 82 112 84 118 80C126 70 134 62 145 58C154 54 162 50 168 55C164 62 160 68 158 72C146 84 132 98 120 108C100 118 84 124 75 130C55 138 34 142 20 150Z"
        fill="var(--leaf)"
        opacity="0.22"
      />
      <path
        d="M20 150C10 136 18 116 55 118C62 96 78 84 95 85C108 82 112 84 118 80C126 70 134 62 145 58C154 54 162 50 168 55C164 62 160 68 158 72C146 84 132 98 120 108C100 118 84 124 75 130C55 138 34 142 20 150Z"
        {...ink}
        strokeWidth="2.3"
      />
      {/* sketchy retrace pass */}
      <path
        d="M21 149C12 135 19 117 56 119C63 97 79 85 96 86C109 83 113 85 119 81C127 71 135 63 146 59C155 55 163 51 169 56C165 63 161 69 159 73C147 85 133 99 121 109C101 119 85 125 76 131C56 139 35 143 21 149Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* back spikes, separate small marks, traced along the new back-arch-
          to-neck stretch of the silhouette */}
      <path
        d="M60 116 56 106 66 110M82 92 79 81 90 87M100 84 98 72 109 79M120 78 119 66 130 74M140 64 140 52 151 60"
        {...ink}
        strokeWidth="1.6"
        opacity="0.75"
      />

      {/* far wing (behind body) */}
      <path
        d="M96 104C104 92 118 84 132 84C126 94 118 100 110 104C118 102 126 104 130 110C120 112 108 112 100 110C104 116 104 122 100 126C94 118 92 110 96 104Z"
        fill="var(--violet)"
        opacity="0.22"
      />
      <path
        d="M96 104C104 92 118 84 132 84C126 94 118 100 110 104C118 102 126 104 130 110C120 112 108 112 100 110C104 116 104 122 100 126C94 118 92 110 96 104Z"
        {...ink}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* near wing, own stroke */}
      <path
        d="M84 108C92 92 110 80 128 78C120 90 110 98 100 104C110 100 120 102 126 110C114 112 100 112 90 108C96 116 96 124 90 130C82 122 78 114 84 108Z"
        fill="var(--violet)"
        opacity="0.32"
      />
      <path
        d="M84 108C92 92 110 80 128 78C120 90 110 98 100 104C110 100 120 102 126 110C114 112 100 112 90 108C96 116 96 124 90 130C82 122 78 114 84 108Z"
        {...ink}
        strokeWidth="1.9"
      />

      {/* legs */}
      <path
        d="M66 156c-2 8-2 14-1 20M100 162c1 8 2 14 2 20"
        {...ink}
        strokeWidth="6"
        opacity="0.9"
      />
      <path d="M60 176h11M96 182h11" {...ink} strokeWidth="4" opacity="0.85" />

      {/* friendly head details: eye, tiny teeth */}
      <path
        d="M152 68c.6-1 2.2-1 2.2.5s-1.8 1.4-2.2-.5Z"
        fill="var(--surface-ink)"
      />
      <path
        d="M160 74 164 78 158 79 156 75Z"
        fill="var(--surface-ink)"
        opacity="0.75"
      />
      <path
        d="M162 79 163 82M158 79 158 82"
        {...ink}
        strokeWidth="1.2"
        opacity="0.7"
      />

      {/* puff of smoke, character touch */}
      <path
        d="M170 62c3-2 7 0 7 3s-4 4-6 2c2 3 0 6-3 6s-4-4-2-6c-3 0-4-4-1-6 1 1 3 1 5 1Z"
        {...ink}
        strokeWidth="1.4"
        opacity="0.55"
      />

      {/* ground */}
      <path
        d="M4 168C36 162 68 172 100 168 132 164 164 174 196 168"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M18 175 28 173M140 176 150 174M164 172 174 175"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
