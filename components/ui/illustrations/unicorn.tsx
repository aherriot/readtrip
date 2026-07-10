const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a unicorn standing in a meadow. Body, neck,
 * and head are one continuous silhouette with real equine proportions (a
 * long low body, not a stocky blob); the mane, tail, and horn are their own
 * hand-drawn strokes so the spiral horn and flowing hair read as separate
 * pen touches rather than baked into the outline.
 */
export function UnicornIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* meadow sky wash */}
      <path
        d="M6 50C36 34 74 28 108 34C142 28 170 38 192 52C192 96 192 132 190 158C154 168 116 162 84 166C50 170 20 164 8 156C6 120 6 82 6 50Z"
        fill="var(--sky)"
        opacity="0.14"
      />

      {/* small rainbow accent, character touch */}
      <path
        d="M18 96C30 74 56 62 82 66"
        {...ink}
        strokeWidth="3"
        stroke="var(--coral)"
        opacity="0.55"
      />
      <path
        d="M22 100C33 80 57 69 80 72"
        {...ink}
        strokeWidth="3"
        stroke="var(--sun)"
        opacity="0.55"
      />
      <path
        d="M26 104C36 86 58 76 78 78"
        {...ink}
        strokeWidth="3"
        stroke="var(--leaf)"
        opacity="0.55"
      />

      {/* body + neck + head, one continuous equine silhouette: muzzle, poll
          (horn base), long neck curve, shoulder, back sweep, haunch,
          hindquarter, belly sweep, chest back to muzzle — 9 long purposeful
          curves, not a chain of even bumps */}
      <path
        d="M150 82C158 76 152 66 140 64C120 58 104 66 98 80C90 90 80 94 72 98C54 104 38 98 30 110C24 120 26 130 34 136C28 142 24 148 32 152C56 158 82 150 100 140C112 128 122 112 128 96C132 88 140 84 150 82Z"
        fill="var(--orchid)"
        opacity="0.16"
      />
      <path
        d="M150 82C158 76 152 66 140 64C120 58 104 66 98 80C90 90 80 94 72 98C54 104 38 98 30 110C24 120 26 130 34 136C28 142 24 148 32 152C56 158 82 150 100 140C112 128 122 112 128 96C132 88 140 84 150 82Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M151 83C159 77 153 67 141 65C121 59 105 67 99 81C91 91 81 95 73 99C55 105 39 99 31 111C25 121 27 131 35 137C29 143 25 149 33 153C57 159 83 151 101 141C113 129 123 113 129 97C133 89 141 85 151 83Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* spiral horn, hand-drawn */}
      <path
        d="M141 62C143 54 140 47 144 40C147 45 152 46 150 52C154 49 158 51 156 56C152 55 148 58 148 62"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M141 62C143 54 140 47 144 40C147 45 152 46 150 52C154 49 158 51 156 56C152 55 148 58 148 62"
        fill="var(--sun)"
        opacity="0.25"
      />

      {/* flowing mane, a few long curling strokes */}
      <path
        d="M120 71C110 76 104 84 106 92C96 90 92 98 96 106C88 106 84 114 90 120"
        {...ink}
        strokeWidth="1.8"
        stroke="var(--violet)"
        opacity="0.8"
      />
      <path
        d="M128 72C120 80 118 88 122 94"
        {...ink}
        strokeWidth="1.6"
        stroke="var(--violet)"
        opacity="0.65"
      />

      {/* flowing tail, own stroke */}
      <path
        d="M36 134C30 140 26 146 28 154C20 150 16 156 20 162C14 162 12 168 16 172"
        {...ink}
        strokeWidth="1.8"
        stroke="var(--violet)"
        opacity="0.75"
      />

      {/* legs, hand-varied not mirrored */}
      <path
        d="M64 148c-1 10-2 18-3 26M92 152c1 10 2 18 3 26"
        {...ink}
        strokeWidth="6.5"
        opacity="0.85"
      />
      <path d="M58 174h11M89 178h11" {...ink} strokeWidth="4.5" opacity="0.9" />

      {/* eye + tiny sparkle */}
      <path
        d="M132 84c.6-1.1 2.3-1.1 2.3.5s-1.9 1.5-2.3-.5Z"
        fill="var(--surface-ink)"
      />
      <path
        d="M150 46c1.4-1.6 3.6-.6 3 1.3s-3.6 1-3-1.3Z"
        fill="var(--sun)"
        opacity="0.85"
      />

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
        stroke="var(--leaf)"
        opacity="0.6"
      />
    </svg>
  );
}
