const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ChemistryLabIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* shelf wash */}
      <path
        d="M8 46C40 38 68 42 100 38C134 42 162 36 192 44"
        fill="var(--violet)"
        opacity="0.14"
      />

      {/* smoke wisp rising */}
      <path
        d="M62 60c-6-6-4-12 1-16-5-6-1-13 5-14-4-8 4-14 10-10"
        {...ink}
        strokeWidth="1.4"
        opacity="0.4"
      />

      {/* sparks */}
      <path
        d="M150 40c1.2-1.2 2.6-1 2.8.6.2 1.6-1.8 2.2-2.8 1M160 52c1-1 2.2-.8 2.4.6.2 1.4-1.4 1.8-2.4.8M140 54c1-1 2.2-.8 2.4.6.2 1.4-1.4 1.8-2.4.8"
        fill="var(--sun)"
        opacity="0.85"
      />

      {/* Erlenmeyer flask — one continuous silhouette, no straight-sided cone */}
      <path
        d="M90 46C90 58 90 68 88 76C78 92 62 112 54 138C50 152 60 164 76 165C92 167 108 167 124 165C140 163 148 151 143 137C134 111 118 92 108 76C106 68 106 58 106 46Z"
        {...ink}
        strokeWidth="2.4"
      />
      {/* sketchy retrace */}
      <path
        d="M91 47C91 59 91 68 89 76C79 92 63 112 55 138C51 151 61 163 77 164C93 166 108 166 124 164C139 162 147 150 142 136C133 111 117 92 107 76C105 68 105 58 105 47Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* flask neck rim */}
      <path d="M88 44q9 4 18 0" {...ink} strokeWidth="1.8" />
      <path d="M86 40q11 5 22 0" {...ink} strokeWidth="1.8" />

      {/* liquid inside, bowed surface */}
      <path
        d="M62 128c14 4 62 4 76 0 4 6 6 12 5 18-4 8-10 14-24 15-16 2-32 2-48 0-13-1-19-7-23-15-1-6 1-12 14-18Z"
        fill="var(--leaf)"
        opacity="0.5"
      />
      <path
        d="M62 128c14 4 62 4 76 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* bubbles in the liquid */}
      <path
        d="M84 142c1.2-1.2 2.8-1 3 .8.2 1.8-2 2.4-3-.8M104 148c1-1.2 2.4-1 2.6.6.2 1.6-1.6 2.2-2.6-.6M96 156c1.2-1.2 2.6-1 2.8.6.2 1.6-1.8 2.2-2.8-.6"
        {...ink}
        strokeWidth="1.2"
        opacity="0.55"
      />

      {/* small round-bottom flask beside it */}
      <path
        d="M150 100c-1 6-1 12-4 16-6 8-8 18-2 26 6 8 22 8 27 0 5-8 3-18-3-26-3-4-3-10-4-16Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M148 130c8 3 17 3 25 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
      <path
        d="M148 132c9 6 17 6 25 0 1 6-2 12-12 12s-14-6-13-12Z"
        fill="var(--coral)"
        opacity="0.5"
      />
      <path d="M148 96q5 3 10 0" {...ink} strokeWidth="1.5" />

      {/* bench + ground */}
      <path
        d="M8 178C46 172 80 182 108 178 140 174 168 182 194 176"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M8 180C46 174 80 184 108 180 140 176 168 184 194 178 194 190 188 194 100 194 14 194 8 190 8 180Z"
        fill="var(--sun)"
        opacity="0.12"
      />

      {/* test tube rack */}
      <path
        d="M20 178C19 166 21 156 18 146M32 178C33 164 31 154 34 146"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M17 146c0-4 2-6 4-6s4 2 4 6-2 8-4 8-4-4-4-8Z"
        fill="var(--sky)"
        opacity="0.7"
      />
      <path
        d="M33 146c0-4 2-6 4-6s4 2 4 6-2 8-4 8-4-4-4-8Z"
        fill="var(--orchid)"
        opacity="0.7"
      />
    </svg>
  );
}
