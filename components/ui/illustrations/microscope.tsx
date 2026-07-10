const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a lab microscope. Four honest landmarks make
 * it read as a microscope and not an abstract stand — a heavy round-footed
 * base, a curved pillar/arm that leans over at the top into an angled
 * eyepiece tube, a nosepiece with objective lenses hanging below the arm,
 * and a stage partway down the pillar with a slide + light hole. Coarse and
 * fine focus knobs sit on the side of the pillar, hand-varied in size.
 */
export function MicroscopeIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* discovery sparkles */}
      <path
        d="M150 34c.4 2.2 1.2 3 3.4 3.4-2.2.4-3 1.2-3.4 3.4-.4-2.2-1.2-3-3.4-3.4 2.2-.4 3-1.2 3.4-3.4Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.7"
      />
      <path
        d="M160 54c.3 1.8 1 2.4 2.8 2.8-1.8.4-2.5 1-2.8 2.8-.4-1.8-1-2.4-2.8-2.8 1.8-.4 2.4-1 2.8-2.8Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.6"
      />

      {/* heavy round-footed base */}
      <path
        d="M56 170C54 160 64 152 78 150C88 148 96 150 100 150C104 150 114 147 126 150C140 153 148 161 145 171C142 179 128 182 100 181C70 181 58 179 56 170Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />
      <path
        d="M56 170C54 160 64 152 78 150C88 148 96 150 100 150C104 150 114 147 126 150C140 153 148 161 145 171C142 179 128 182 100 181C70 181 58 179 56 170Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* pillar rising from the base, leaning forward into the arm */}
      <path
        d="M99 150C98 128 97 108 101 90C104 76 111 64 121 57"
        {...ink}
        strokeWidth="6.5"
      />
      {/* sketchy retrace pass on the primary structural stroke */}
      <path
        d="M100 149C99 127 98 109 102 91C105 77 112 65 120 58"
        {...ink}
        strokeWidth="2"
        opacity="0.45"
      />

      {/* arm bends over at the top into the angled eyepiece tube */}
      <path
        d="M121 57C114 50 106 44 100 36C97 31 94 26 92 21"
        {...ink}
        strokeWidth="5"
      />

      {/* eyepiece rim — a hand-drawn round opening kids look down into */}
      <path
        d="M85 20c1-4 6-6 10-4 4 2 4 7 0 9-4 2-9 0-10-5Z"
        fill="var(--surface-ink)"
        opacity="0.2"
      />
      <path
        d="M85 20c1-4 6-6 10-4 4 2 4 7 0 9-4 2-9 0-10-5Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* focus knobs on the side of the pillar, hand-varied — coarse then fine */}
      <path
        d="M92 126c-4-1-7 2-7 5 0 4 4 6 8 5 3-1 4-5 2-8-1-1-2-2-3-2Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />
      <path
        d="M91 141c-3-1-5 1-5 4 0 3 3 4 6 3 2-1 3-4 1-6-1 0-1-1-2-1Z"
        fill="var(--surface-ink)"
        opacity="0.75"
      />

      {/* nosepiece turret hanging below the arm */}
      <path
        d="M116 57c2 3 8 3 10 0 1 4-1 8-5 8s-6-4-5-8Z"
        fill="var(--surface-ink)"
        opacity="0.8"
      />
      {/* objective lenses of different lengths, like a real turret */}
      <path d="M118 65c-1 8-1 15 0 22" {...ink} strokeWidth="3.4" />
      <path d="M124 65c1 6 2 11 2 16" {...ink} strokeWidth="2.6" />
      <path d="M112 65c-1 5-2 9-2 13" {...ink} strokeWidth="2.2" />

      {/* stage — a solid filled plate crossing the pillar */}
      <path
        d="M75 108C88 105 100 106 100 106C100 106 115 104 130 107C131 111 131 115 130 119C115 116 100 117 100 117C100 117 88 116 75 119C74 115 74 111 75 108Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />
      {/* specimen slide sitting on the stage */}
      <path
        d="M90 110c6-1 12-1 18 0 0 2 0 4 0 6-6 1-12 1-18 0 0-2 0-4 0-6Z"
        stroke="var(--aqua)"
        strokeWidth="2.2"
        fill="none"
        opacity="0.85"
      />
      {/* light hole beneath the stage */}
      <path
        d="M97 113c1-2 4-2 5 0 1 2-1 4-3 4s-3-2-2-4Z"
        fill="var(--sun)"
        opacity="0.6"
      />

      {/* desk line */}
      <path
        d="M20 178C60 174 100 182 140 178 160 176 175 179 188 176"
        {...ink}
        strokeWidth="2"
        opacity="0.7"
      />
    </svg>
  );
}
