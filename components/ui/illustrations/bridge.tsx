const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function BridgeIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 56C34 40 68 32 100 36C134 32 166 42 194 58"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* sun */}
      <path
        d="M158 30c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M158 30c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* left tower — one continuous silhouette */}
      <path
        d="M38 168C36 132 40 96 34 62C46 60 58 62 68 66C64 98 66 134 64 168Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path d="M34 62C46 60 58 62 68 66" {...ink} strokeWidth="2" />
      <path
        d="M40 100q13 3 26 0M42 130q11 3 22 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* right tower — hand-varied, not a mirror */}
      <path
        d="M136 168C134 130 138 92 132 60C146 58 158 61 168 66C163 98 166 134 164 168Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path d="M132 60C146 58 158 61 168 66" {...ink} strokeWidth="2" />
      <path
        d="M138 98q14 3 28-1M140 128q12 3 24-1"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* suspension cables — long sweeping catenary curves */}
      <path
        d="M8 130C30 90 60 70 100 70C140 70 170 90 192 130"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M9 131C31 91 61 71 100 71C139 71 169 91 191 131"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* vertical hangers, hand-spaced unevenly */}
      <path
        d="M20 128C21 140 21 150 20 160M36 108C37 130 36 148 36 160M56 88C57 118 56 142 56 160M78 74C79 108 78 138 78 160M100 70C100 108 100 138 100 160M122 74C121 108 122 138 122 160M144 88C143 118 144 142 144 160M164 108C163 130 164 148 164 160M180 128C179 140 179 150 180 160"
        {...ink}
        strokeWidth="1.2"
        opacity="0.6"
      />

      {/* deck */}
      <path
        d="M6 160C40 156 70 164 100 160 132 156 164 164 194 158"
        {...ink}
        strokeWidth="3"
      />
      <path
        d="M6 160C40 156 70 164 100 160 132 156 164 164 194 158"
        {...ink}
        strokeWidth="1.1"
        opacity="0.35"
      />
      <path
        d="M30 163q6 2 12 0M60 165q6 2 12 0M120 163q6 2 12 0M150 162q6 2 12 0"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* car crossing */}
      <path
        d="M84 154c1-3 5-4 9-4 3 0 6 1 8 3 3-1 4 2 2 4-6 1-14 1-19-3Z"
        fill="var(--coral)"
        opacity="0.75"
      />
      <path
        d="M84 154c1-3 5-4 9-4 3 0 6 1 8 3 3-1 4 2 2 4-6 1-14 1-19-3Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* water below */}
      <path
        d="M6 172C40 166 74 176 100 172 132 168 164 176 194 170"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 174C40 168 74 178 100 174 132 170 164 178 194 172 194 186 190 190 100 190 12 190 6 186 6 174Z"
        fill="var(--sky)"
        opacity="0.22"
      />
      <path
        d="M30 182q9 4 18 0M140 184q9 4 18 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.45"
      />
    </svg>
  );
}
