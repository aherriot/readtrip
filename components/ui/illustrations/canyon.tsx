const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a Grand-Canyon-like gorge, with layered rock
 * strata banding down to a winding river at the bottom. Each stratum is a
 * closed hand-wobbled band (never a straight-edged rectangle); the river is
 * one continuous winding path — see the illustrations skill.
 */
export function CanyonIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 30C40 18 80 14 108 20C144 14 176 22 194 32"
        fill="var(--sky)"
        opacity="0.22"
        stroke="none"
      />

      {/* distant birds */}
      <path
        d="M70 26c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6.4 0M132 34c2-2.1 4-2.1 5.6 0 1.6-2.1 3.6-2.1 5.4 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* stratum 1 — top rim, sun wash */}
      <path
        d="M4 44C36 34 74 30 108 36 144 30 174 38 196 46 196 56 184 62 148 58 112 62 76 56 44 60 22 62 8 56 4 44Z"
        fill="var(--sun)"
        opacity="0.18"
      />
      <path
        d="M4 44C36 34 74 30 108 36 144 30 174 38 196 46"
        {...ink}
        strokeWidth="1.6"
        opacity="0.7"
      />

      {/* stratum 2 — coral band */}
      <path
        d="M4 60C38 52 78 58 110 54 146 58 172 52 196 60 194 76 176 82 142 78 108 82 72 76 40 80 16 82 4 74 4 60Z"
        fill="var(--coral)"
        opacity="0.24"
      />
      <path
        d="M4 60C38 52 78 58 110 54 146 58 172 52 196 60"
        {...ink}
        strokeWidth="1.7"
        opacity="0.75"
      />

      {/* stratum 3 — deeper rust/orchid band */}
      <path
        d="M2 80C34 74 76 80 112 76 148 80 174 74 198 82 196 100 178 106 140 102 104 106 66 100 34 104 12 106 2 96 2 80Z"
        fill="var(--orchid)"
        opacity="0.22"
      />
      <path
        d="M2 80C34 74 76 80 112 76 148 80 174 74 198 82"
        {...ink}
        strokeWidth="1.8"
        opacity="0.8"
      />

      {/* rock ledge texture, hand-run, uneven */}
      <path
        d="M20 68q10 3 22-1M60 66q14 3 28-1M120 66q12 3 24-1M156 68q10 3 20-1"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />
      <path
        d="M14 90q12 3 26-1M70 92q16 3 32-1M132 90q14 3 28-1"
        {...ink}
        strokeWidth="1.3"
        opacity="0.55"
      />

      {/* stratum 4 — canyon walls, darkest, main strokes */}
      <path
        d="M0 100C30 96 70 102 106 98 142 102 172 96 200 104 198 132 176 148 138 142 100 150 66 140 34 148 10 152 0 132 0 100Z"
        fill="var(--coral)"
        opacity="0.16"
      />
      <path
        d="M0 100C30 96 70 102 106 98 142 102 172 96 200 104"
        {...ink}
        strokeWidth="2.1"
      />
      <path
        d="M2 101C32 97 71 103 107 99 143 103 172 97 199 105"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* cliff face crevices, hand-varied vertical hints, no long straight edges */}
      <path
        d="M40 100c-2 12-4 24-3 40M96 100c1 14-2 28 1 44M150 100c2 12-1 26 2 40"
        {...ink}
        strokeWidth="1.4"
        opacity="0.5"
      />

      {/* canyon floor + winding river, one continuous path */}
      <path
        d="M0 148C24 144 60 152 96 148 132 144 168 152 200 148 200 164 200 178 200 190 168 184 132 190 96 186 60 190 24 184 0 190 0 176 0 162 0 148Z"
        fill="var(--sun)"
        opacity="0.14"
      />
      <path
        d="M0 152C30 148 66 154 100 150 134 146 168 152 200 148"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M6 170C26 162 44 176 68 168 92 160 108 178 132 170 152 164 168 176 194 168"
        {...ink}
        strokeWidth="3"
        stroke="var(--sky)"
        opacity="0.8"
      />
      <path
        d="M6 170C26 162 44 176 68 168 92 160 108 178 132 170 152 164 168 176 194 168"
        {...ink}
        strokeWidth="1.6"
      />
    </svg>
  );
}
