const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a griffin, eagle in front and lion behind,
 * as one continuous body silhouette with a clear transition at the
 * shoulder — feathered neck/chest tapering into a furred haunch and tufted
 * tail. Wings, legs, and talons break off as their own strokes.
 */
export function GriffinIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 46C34 30 70 24 104 30C138 24 168 34 192 50C192 92 192 130 190 158C156 168 118 162 86 166C52 170 22 164 8 156C6 120 6 80 6 46Z"
        fill="var(--sky)"
        opacity="0.14"
      />

      {/* far wing (behind) */}
      <path
        d="M118 78C132 62 152 54 172 56C160 70 144 80 128 88C142 88 154 96 160 108C142 110 124 106 112 96C114 90 116 84 118 78Z"
        fill="var(--sun)"
        opacity="0.2"
      />
      <path
        d="M118 78C132 62 152 54 172 56C160 70 144 80 128 88C142 88 154 96 160 108C142 110 124 106 112 96C114 90 116 84 118 78Z"
        {...ink}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* body: eagle front (head, curved beak, feathered chest) transitioning
          into lion back (furred haunch, tufted tail), one continuous silhouette */}
      <path
        d="M30 140C22 136 20 128 27 123C24 114 30 107 39 108C40 100 47 95 55 97C58 90 65 84 74 84C80 74 90 66 100 66C108 58 118 54 127 57C134 51 144 51 149 57C156 55 163 60 161 68C168 70 170 78 165 84C160 90 152 91 146 88C144 96 138 101 130 100C132 108 128 114 120 114C120 122 114 128 106 127C106 134 100 139 92 137C90 145 82 149 74 146C68 152 58 151 54 144C46 147 38 144 36 137C33 141 30 141 30 140Z"
        fill="var(--sun)"
        opacity="0.16"
      />
      <path
        d="M30 140C22 136 20 128 27 123C24 114 30 107 39 108C40 100 47 95 55 97C58 90 65 84 74 84C80 74 90 66 100 66C108 58 118 54 127 57C134 51 144 51 149 57C156 55 163 60 161 68C168 70 170 78 165 84C160 90 152 91 146 88C144 96 138 101 130 100C132 108 128 114 120 114C120 122 114 128 106 127C106 134 100 139 92 137C90 145 82 149 74 146C68 152 58 151 54 144C46 147 38 144 36 137C33 141 30 141 30 140Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M31 139C24 135 22 128 28 124C25 115 31 108 40 109C41 101 48 96 56 98C59 91 66 85 75 85C81 75 91 67 101 67C109 59 119 55 128 58C135 52 145 52 150 58C157 56 164 61 162 69C169 71 171 79 166 85C161 91 153 92 147 89C145 97 139 102 131 101C133 109 129 115 121 115C121 123 115 129 107 128C107 135 101 140 93 138C91 146 83 150 75 147C69 153 59 152 55 145C47 148 39 145 37 138C34 142 31 142 31 139Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* feathered neck texture (eagle half) */}
      <path
        d="M110 68 116 60M120 64 125 55M132 60 136 51"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* furred haunch texture (lion half) */}
      <path
        d="M52 118 46 122M58 126 52 131M66 132 60 137"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* tufted lion tail, own stroke */}
      <path
        d="M32 138C22 134 14 138 12 146C8 144 4 148 6 154"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 154c-2 2-2 5 0 7 2 1 5-1 5-4"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path d="M6 154c-2 2-2 5 0 7 2 1 5-1 5-4" {...ink} strokeWidth="1.3" />

      {/* near wing, large spread, own stroke */}
      <path
        d="M106 76C124 58 148 48 172 50C158 66 138 78 120 86C136 86 150 94 156 108C136 110 114 106 100 96C104 88 104 82 106 76Z"
        fill="var(--sun)"
        opacity="0.32"
      />
      <path
        d="M106 76C124 58 148 48 172 50C158 66 138 78 120 86C136 86 150 94 156 108C136 110 114 106 100 96C104 88 104 82 106 76Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M128 60 150 54M132 72 154 68M126 86 146 92"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* eagle beak + eye (front legs stay implicit as talons below) */}
      <path
        d="M150 60 158 63 150 67 148 63Z"
        fill="var(--surface-ink)"
        opacity="0.8"
      />
      <path
        d="M142 58c.6-1.1 2.3-1.1 2.3.5s-1.9 1.5-2.3-.5Z"
        fill="var(--surface-ink)"
      />

      {/* eagle talons (front legs) */}
      <path
        d="M92 138c0 8-1 14-2 20"
        {...ink}
        strokeWidth="5.5"
        opacity="0.85"
      />
      <path
        d="M84 158 88 158 92 158M88 158 88 162"
        {...ink}
        strokeWidth="1.6"
        opacity="0.75"
      />

      {/* lion paws (back legs) */}
      <path
        d="M52 144c-1 8-1 14-2 20"
        {...ink}
        strokeWidth="6.5"
        opacity="0.9"
      />
      <path d="M46 166h9" {...ink} strokeWidth="4.5" opacity="0.9" />

      {/* ground */}
      <path
        d="M4 172C36 166 68 176 100 172 132 168 164 178 196 172"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M22 178 30 175M140 180 148 177"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
