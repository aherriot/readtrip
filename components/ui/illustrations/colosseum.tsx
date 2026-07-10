const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: the Roman Colosseum. The whole facade —
 * ground-level ruin on the left rising to the intact parapet on the
 * right — is one continuous silhouette path, the same discipline as the
 * dinosaur's body: a real amphitheater wall doesn't stop and restart.
 * Three tiers of arches are layered on top as separate small marks (the
 * same "stone course" idea as the pyramid), each tier authored as one
 * `<path>` holding several arch subpaths rather than one shape per
 * arch, so the arch row reads as repeated windows, not as the main
 * silhouette's shape.
 */
export function ColosseumIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sun-baked sky wash */}
      <path
        d="M8 56C34 42 66 34 100 38C136 34 166 44 192 58"
        fill="var(--sun)"
        opacity="0.16"
      />

      {/* sun, round-shape technique */}
      <path
        d="M34 24c6.2-.6 11.4 4.2 11 10.5C44.6 41 39.4 45.4 33.4 44.9 27.2 44.4 22.4 39.4 22.8 33 23.2 26.8 28 24.6 34 24Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M34 24c6.2-.6 11.4 4.2 11 10.5C44.6 41 39.4 45.4 33.4 44.9 27.2 44.4 22.4 39.4 22.8 33 23.2 26.8 28 24.6 34 24Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M34 12 34 20M14 34 22 34M50 20 44 26M18 20 24 26"
        {...ink}
        strokeWidth="1.4"
        opacity="0.75"
      />

      {/* distant flags on the parapet */}
      <path
        d="M104 54c0-6 0-11-1-15M148 54c0-6 1-11 0-15"
        {...ink}
        strokeWidth="1.4"
      />
      <path d="M103 39 113 43 103 47Z" fill="var(--coral)" opacity="0.8" />
      <path d="M103 39 113 43 103 47Z" {...ink} strokeWidth="1.1" />
      <path d="M148 39 158 42 148 46Z" fill="var(--sun)" opacity="0.8" />
      <path d="M148 39 158 42 148 46Z" {...ink} strokeWidth="1.1" />

      {/* whole facade — ruined left rising to intact right, one path */}
      <path
        d="M24 150C22 130 24 112 30 98C34 94 30 90 40 90C50 88 46 74 56 68C64 62 66 60 72 58C100 54 140 54 170 57C180 62 184 80 183 100C182 122 183 138 182 150C130 155 76 155 24 150Z"
        fill="var(--coral)"
        opacity="0.14"
      />
      <path
        d="M24 150C22 130 24 112 30 98C34 94 30 90 40 90C50 88 46 74 56 68C64 62 66 60 72 58C100 54 140 54 170 57C180 62 184 80 183 100C182 122 183 138 182 150C130 155 76 155 24 150Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M25 149C23 130 25 113 31 99C35 95 31 91 41 91C51 89 47 75 57 69C65 63 67 61 73 59C100 55 139 55 169 58C179 63 183 81 182 100C181 121 182 137 181 149"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* rubble scatter at the base of the ruined side */}
      <path
        d="M28 148c2-3 6-3 7 0M36 150c2-4 6-3 7 1M22 152c2-2 4-2 6 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.55"
      />

      {/* tier 3 — top row, only over the intact right section */}
      <path
        d="M99 92C99 82 101 74 104 74C107 74 109 82 109 92M117 91C117 81 119 73 122 73C125 73 127 81 127 91M135 92C135 82 137 74 140 74C143 74 145 82 145 92M153 91C153 81 155 73 158 73C161 73 163 81 163 91"
        {...ink}
        strokeWidth="1.3"
        opacity="0.55"
      />

      {/* tier 2 — middle row */}
      <path
        d="M70 118C70 107 73 99 76 99C79 99 82 108 82 118M88 117C88 106 91 98 94 98C97 98 100 107 100 117M106 118C106 108 109 100 112 100C115 100 118 108 118 118M124 117C124 106 127 98 130 98C133 98 136 107 136 117M142 118C142 107 145 99 148 99C151 99 154 108 154 118M160 117C160 106 163 98 166 98C169 98 172 107 172 117"
        {...ink}
        strokeWidth="1.4"
        opacity="0.65"
      />

      {/* tier 1 — ground-level row, widest, spans the ruin too */}
      <path
        d="M51 150C51 137 54 129 58 129C62 129 65 138 65 150M69 150C69 136 72 128 76 128C80 128 83 137 83 150M87 150C87 135 90 127 94 127C98 127 101 136 101 150M105 150C105 136 108 128 112 128C116 128 119 137 119 150M123 150C123 137 126 129 130 129C134 129 137 138 137 150M141 150C141 136 144 128 148 128C152 128 155 137 155 150M159 150C159 135 162 127 166 127C170 127 173 136 173 150"
        {...ink}
        strokeWidth="1.6"
        opacity="0.75"
      />

      {/* tiny distant figures for scale */}
      <path
        d="M86 150c0-3 0-5 0-7M86 143c-2 0-3 2-3 4M86 143c2 0 3 2 3 4"
        {...ink}
        strokeWidth="1.2"
        opacity="0.7"
      />
      <path
        d="M148 150c0-3 0-5 0-7M148 143c-2 0-3 2-3 4M148 143c2 0 3 2 3 4"
        {...ink}
        strokeWidth="1.2"
        opacity="0.7"
      />

      {/* ground */}
      <path
        d="M6 168C40 162 70 172 100 168 132 164 164 172 194 166"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 170C40 164 70 174 100 170 132 166 164 174 194 168 194 180 190 184 100 184 12 184 6 180 6 170Z"
        fill="var(--sun)"
        opacity="0.14"
      />
    </svg>
  );
}
