const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an armored knight. Helmet through torso is
 * one continuous silhouette, but it reads as armor rather than a blob
 * because the curve segments map onto real landmarks — a helmet dome
 * distinctly narrower than the shoulders, a neck-in, a pronounced pauldron
 * flare well past the helmet's width, and a breastplate taper down to a
 * belted waist. Arms and legs break off as their own strokes and end in a
 * gauntlet/greave flare rather than tapering to a point. Plume, shield, and
 * sword are separate strokes.
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
          pauldron flare, breastplate taper, belted waist */}
      <path
        d="M100 24C112 25 122 34 122 46C123 53 119 58 116 61C126 62 142 66 149 80C154 94 149 110 139 121C133 130 124 134 116 133C120 138 118 144 112 147C102 151 90 150 82 145C79 141 80 136 84 133C75 135 65 130 60 121C51 111 50 96 57 84C63 72 79 68 90 65C86 61 84 55 86 48C87 35 90 25 100 24Z"
        fill="var(--sky)"
        opacity="0.18"
      />
      <path
        d="M100 24C112 25 122 34 122 46C123 53 119 58 116 61C126 62 142 66 149 80C154 94 149 110 139 121C133 130 124 134 116 133C120 138 118 144 112 147C102 151 90 150 82 145C79 141 80 136 84 133C75 135 65 130 60 121C51 111 50 96 57 84C63 72 79 68 90 65C86 61 84 55 86 48C87 35 90 25 100 24Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M99 26C110 27 120 36 120 47C121 54 118 59 115 62C124 63 139 68 147 81C152 94 148 109 138 120C132 128 123 132 116 131C119 137 116 143 111 146C102 149 91 148 84 144C81 140 82 135 86 132C77 134 67 129 62 120C54 111 53 97 59 85C65 73 80 69 91 66C87 62 85 56 88 49C89 37 91 27 99 26Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* visor slit + rivets */}
      <path d="M88 50c8-1 16-1 24 1" {...ink} strokeWidth="1.6" />
      <path
        d="M84 36h.01M114 36h.01M64 92h.01M140 92h.01"
        {...ink}
        strokeWidth="2.2"
        opacity="0.55"
      />

      {/* belt line + buckle across the waist */}
      <path
        d="M80 128c14 3 28 3 40 0"
        {...ink}
        strokeWidth="1.8"
        opacity="0.75"
      />
      <path
        d="M96 126c3-2 6-2 8 0 1 3-1 6-4 6s-5-3-4-6Z"
        fill="var(--sun)"
        opacity="0.75"
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

      {/* right arm — shoulder to elbow to gauntlet, a real bend */}
      <path
        d="M139 84C150 92 159 100 158 111C157 118 152 124 148 130"
        {...ink}
        strokeWidth="2.6"
      />
      <path
        d="M143 130c1-3 7-4 9-1 2 3-1 8-6 8s-5-4-3-7Z"
        fill="var(--surface-ink)"
        opacity="0.8"
      />

      {/* left arm — hand-varied, gripping toward the shield */}
      <path
        d="M63 86C52 92 44 100 43 111C43 117 46 122 49 126"
        {...ink}
        strokeWidth="2.6"
      />
      <path
        d="M44 122c-2-3-7-3-9 0-2 4 1 8 6 8s5-5 3-8Z"
        fill="var(--surface-ink)"
        opacity="0.8"
      />

      {/* shield, its own stroke */}
      <path
        d="M28 96C30 86 40 80 50 82C52 100 50 118 44 132C36 128 28 120 26 108C25 104 26 99 28 96Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M28 96C30 86 40 80 50 82C52 100 50 118 44 132C36 128 28 120 26 108C25 104 26 99 28 96Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M38 92 32 104 40 104 34 116"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* sword, its own stroke */}
      <path d="M165 66C166 94 167 120 167 144" {...ink} strokeWidth="2.4" />
      <path
        d="M165 66c1-6 3-10 5-13M165 66c-2-5-1-10 2-14"
        {...ink}
        strokeWidth="1.6"
      />
      <path d="M155 102 177 102" {...ink} strokeWidth="2.6" />
      <path
        d="M167 144c-3 3-3 7 0 10 3-3 3-7 0-10Z"
        fill="var(--sun)"
        opacity="0.8"
      />

      {/* legs — hip to knee to greave, a real bend */}
      <path
        d="M90 148C93 159 96 168 93 174C91 178 88 181 86 184"
        {...ink}
        strokeWidth="5.5"
      />
      <path
        d="M108 148C106 159 104 168 108 174C110 178 113 181 115 184"
        {...ink}
        strokeWidth="5.5"
      />
      {/* greave flare partway down each shin */}
      <path
        d="M84 172c-2-3 1-6 5-6 5 0 8 3 6 6-2 3-9 3-11 0Z"
        fill="var(--surface-ink)"
        opacity="0.8"
      />
      <path
        d="M110 172c-2-3 1-6 6-6 4 0 7 3 5 6-2 3-9 3-11 0Z"
        fill="var(--surface-ink)"
        opacity="0.75"
      />
      <path
        d="M80 186h11M110 186h12"
        {...ink}
        strokeWidth="4.5"
        opacity="0.9"
      />

      {/* ground + grass */}
      <path
        d="M6 178C40 172 70 182 100 178 132 174 164 184 194 176"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M24 178c-1-5 2-8 5-8 1-4 6-5 8-1M164 176c-1-5 3-7 6-6"
        {...ink}
        strokeWidth="1.4"
        stroke="var(--leaf)"
        opacity="0.9"
      />
    </svg>
  );
}
