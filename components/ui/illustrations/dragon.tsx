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

      {/* tail + body + neck + head, one continuous winding silhouette */}
      <path
        d="M22 150C14 142 16 132 26 130C36 128 42 138 52 136C46 126 48 116 58 114C70 112 74 122 82 122C74 110 76 96 90 92C104 88 112 98 116 108C118 94 124 80 136 70C146 62 156 60 162 66C166 71 161 78 154 82C146 87 138 92 133 100C142 102 150 108 154 116C158 124 155 132 148 136C154 140 158 146 156 152C154 158 146 160 140 156C136 164 128 168 118 166C112 174 100 178 88 174C78 180 64 178 58 168C46 170 34 168 28 160C24 157 22 154 22 150Z"
        fill="var(--leaf)"
        opacity="0.22"
      />
      <path
        d="M22 150C14 142 16 132 26 130C36 128 42 138 52 136C46 126 48 116 58 114C70 112 74 122 82 122C74 110 76 96 90 92C104 88 112 98 116 108C118 94 124 80 136 70C146 62 156 60 162 66C166 71 161 78 154 82C146 87 138 92 133 100C142 102 150 108 154 116C158 124 155 132 148 136C154 140 158 146 156 152C154 158 146 160 140 156C136 164 128 168 118 166C112 174 100 178 88 174C78 180 64 178 58 168C46 170 34 168 28 160C24 157 22 154 22 150Z"
        {...ink}
        strokeWidth="2.3"
      />
      {/* sketchy retrace pass */}
      <path
        d="M24 149C17 141 18 132 27 130C37 128 43 137 53 135C47 126 49 117 59 115C71 113 75 122 83 122C75 111 77 97 91 93C104 89 112 99 116 108C119 95 125 81 137 71C147 63 156 61 162 67C165 72 160 78 153 82C146 87 139 92 134 100C142 102 150 108 154 115C158 123 155 131 148 135C154 139 157 145 155 151C153 157 146 159 140 155C136 163 128 167 119 165C112 172 101 177 89 173C79 179 65 177 59 167C47 169 35 167 29 159C25 156 24 153 24 149Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* back spikes, separate small marks */}
      <path
        d="M58 114 54 104 64 108M78 100 75 89 86 94M96 92 94 80 105 87M114 90 113 78 124 86M132 82 132 70 143 78"
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
