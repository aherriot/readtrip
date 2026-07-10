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

      {/* body + neck + head, one continuous equine silhouette */}
      <path
        d="M44 126C40 116 46 108 56 108C58 98 66 92 76 94C80 84 90 78 100 82C104 74 112 68 122 70C134 66 146 72 148 84C156 86 160 94 156 102C160 108 158 116 151 119C154 108 152 100 144 96C140 92 132 92 128 96C126 90 118 88 112 92C114 100 112 108 105 111C110 118 108 126 100 129C104 134 102 141 95 143C99 149 96 156 88 157C78 160 68 156 63 148C55 149 47 145 45 137C40 135 38 130 44 126Z"
        fill="var(--orchid)"
        opacity="0.16"
      />
      <path
        d="M44 126C40 116 46 108 56 108C58 98 66 92 76 94C80 84 90 78 100 82C104 74 112 68 122 70C134 66 146 72 148 84C156 86 160 94 156 102C160 108 158 116 151 119C154 108 152 100 144 96C140 92 132 92 128 96C126 90 118 88 112 92C114 100 112 108 105 111C110 118 108 126 100 129C104 134 102 141 95 143C99 149 96 156 88 157C78 160 68 156 63 148C55 149 47 145 45 137C40 135 38 130 44 126Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M45 125C41 116 47 109 57 109C59 99 67 93 77 95C81 85 91 79 101 83C105 75 113 69 123 71C135 67 147 73 149 85C157 87 161 95 157 103C161 109 159 117 152 120C155 109 153 101 145 97C141 93 133 93 129 97C127 91 119 89 113 93C115 101 113 109 106 112C111 119 109 127 101 130C105 135 103 142 96 144C100 150 97 157 89 158C79 161 69 157 64 149C56 150 48 146 46 138C41 136 39 131 45 125Z"
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
        d="M46 128C36 132 28 140 28 150C22 148 18 154 22 160C16 160 14 166 18 170"
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
