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

      {/* body: eagle front (head, beak, feathered neck, chest) transitioning
          at the shoulder into lion back (spine arch, haunch bulge, tail base),
          one continuous silhouette — 9 long purposeful curves, not a chain
          of even bumps */}
      <path
        d="M24 140C14 128 16 112 30 108C48 92 58 86 70 82C82 76 90 72 100 68C108 62 114 58 122 55C134 50 146 48 155 58C152 62 150 64 148 66C138 76 128 84 120 92C100 108 84 120 70 130C50 138 34 140 24 140Z"
        fill="var(--sun)"
        opacity="0.16"
      />
      <path
        d="M24 140C14 128 16 112 30 108C48 92 58 86 70 82C82 76 90 72 100 68C108 62 114 58 122 55C134 50 146 48 155 58C152 62 150 64 148 66C138 76 128 84 120 92C100 108 84 120 70 130C50 138 34 140 24 140Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M25 139C15 127 17 113 31 109C49 93 59 87 71 83C83 77 91 73 101 69C109 63 115 59 123 56C135 51 147 49 156 59C153 63 151 65 149 67C139 77 129 85 121 93C101 109 85 121 71 131C51 139 35 141 25 139Z"
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
        d="M36 112 30 117M44 122 38 127M56 130 50 135"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* tufted lion tail, own stroke */}
      <path
        d="M26 139C17 135 10 139 8 147C4 145 1 149 3 155"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M3 155c-2 2-2 5 0 7 2 1 5-1 5-4"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path d="M3 155c-2 2-2 5 0 7 2 1 5-1 5-4" {...ink} strokeWidth="1.3" />

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
        d="M153 58 161 61 153 65 151 61Z"
        fill="var(--surface-ink)"
        opacity="0.8"
      />
      <path
        d="M144 55c.6-1.1 2.3-1.1 2.3.5s-1.9 1.5-2.3-.5Z"
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
