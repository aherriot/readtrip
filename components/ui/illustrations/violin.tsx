const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a violin and bow. The body is one continuous
 * hand-drawn figure-8 silhouette (upper bout narrower than the lower bout,
 * pinched waist between them) — not a simple oval — with f-holes as small
 * curved marks, a tapered neck, a hand-drawn spiral scroll (not a circle),
 * thin parallel strings, and a bow laid across it at an angle.
 */
export function ViolinIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* body — one continuous figure-8 silhouette: upper bout, waist, lower
          bout, hand-varied left to right */}
      <path
        d="M84 97C70 98 60 103 64 113C67 121 76 125 75 132C74 141 54 148 57 160C60 174 79 184 101 183C125 182 145 172 145 157C145 146 124 139 125 131C126 124 136 119 132 109C128 100 115 96 104 99C99 100 102 104 96 104C91 104 90 97 84 97Z"
        fill="var(--sun)"
        opacity="0.18"
      />
      <path
        d="M84 97C70 98 60 103 64 113C67 121 76 125 75 132C74 141 54 148 57 160C60 174 79 184 101 183C125 182 145 172 145 157C145 146 124 139 125 131C126 124 136 119 132 109C128 100 115 96 104 99C99 100 102 104 96 104C91 104 90 97 84 97Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass on the body outline */}
      <path
        d="M85 98C72 99 62 104 65 113C68 120 77 124 76 131C75 140 56 147 58 159C61 172 80 182 101 181C124 180 143 171 144 157C144 147 123 140 124 132C125 125 135 120 131 110C127 101 116 97 105 100C100 101 103 105 97 105C92 105 91 98 85 98Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* f-holes — small curved marks, hand-varied not mirrored */}
      <path
        d="M92 130c-4 5-4 12-1 18 1 3 3 3 5 2M89 128c-1-2-3-2-4 0M90 152c-1 2-3 2-4 0"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M112 132c3 6 3 13-1 19-2 3-4 3-6 1M115 130c1-2 3-2 4-1M113 154c1 2 3 2 4 0"
        {...ink}
        strokeWidth="1.3"
      />

      {/* bridge */}
      <path
        d="M92 138c3-2 7-2 8 0 2 4 2 9 0 13-1 2-5 2-8 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.75"
      />

      {/* tailpiece */}
      <path d="M91 172C94 179 106 179 109 172" {...ink} strokeWidth="1.6" />
      <path
        d="M91 172C94 179 106 179 109 172"
        fill="var(--surface-ink)"
        opacity="0.18"
      />

      {/* neck — tapered, hand-bowed edges rather than a straight rect */}
      <path
        d="M93 97C91 78 90 58 90 40C90 34 94 29 99 29C104 30 107 35 106 41C105 60 104 79 103 97Z"
        fill="var(--sun)"
        opacity="0.14"
      />
      <path
        d="M93 97C91 78 90 58 90 40C90 34 94 29 99 29C104 30 107 35 106 41C105 60 104 79 103 97Z"
        {...ink}
        strokeWidth="1.8"
      />

      {/* scroll — a small hand-drawn spiral, not a circle */}
      <path
        d="M99 29C97 22 90 20 86 24C82 28 84 35 90 36C95 37 98 33 96 30C94 28 91 29 91 32"
        {...ink}
        strokeWidth="1.7"
      />

      {/* pegs */}
      <path
        d="M84 39 77 37M85 48 78 50M112 39 119 37M111 48 118 50"
        {...ink}
        strokeWidth="1.4"
        opacity="0.8"
      />

      {/* strings — thin parallel lines, not perfectly even */}
      <path
        d="M94 32 92 172M97 31 96 173M101 31 103 172M104 32 107 171"
        {...ink}
        strokeWidth="0.8"
        opacity="0.7"
      />

      {/* bow — stick, hair, and a frog at one end, laid across at an angle */}
      <path
        d="M36 180C54 160 78 133 100 108C122 84 138 66 154 47"
        {...ink}
        strokeWidth="2.1"
      />
      <path
        d="M39 183C57 164 80 137 101 112C123 88 141 69 156 50"
        {...ink}
        strokeWidth="0.9"
        opacity="0.6"
      />
      <path
        d="M32 184c-2 3 0 8 4 9 5 1 8-3 6-7-1-4-6-4-10-2Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />
      <path d="M154 46c3-3 7-4 10-2" {...ink} strokeWidth="1.4" opacity="0.8" />

      {/* a small floating musical note — character touch */}
      <path
        d="M162 96c0-10 1-19 2-27M164 69c4-1 7 1 6 4-1 3-5 4-8 2"
        {...ink}
        strokeWidth="1.5"
        opacity="0.75"
      />
      <path
        d="M158 96c-3-1-5 1-5 4 0 3 3 4 6 3 2-1 3-4 1-7Z"
        fill="var(--coral)"
        opacity="0.8"
      />
    </svg>
  );
}
