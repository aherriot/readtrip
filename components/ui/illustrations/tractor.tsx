const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a farm tractor parked in a furrowed field.
 * The body is one continuous silhouette from the tall narrow engine hood at
 * the front to the seat platform and ROPS bar at the back (deliberately not
 * a car shape — no low sloped windshield-to-trunk curve). Big rear wheels,
 * hand-drawn round via ~4 long curve segments (not a scallop ring), are
 * noticeably larger than the small front wheel.
 */
export function TractorIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M8 56C36 42 68 34 100 38C134 34 164 44 192 58"
        fill="var(--sky)"
        opacity="0.16"
      />

      {/* sun */}
      <path
        d="M162 30c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.82"
      />
      <path
        d="M162 30c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* field wash behind the tractor */}
      <path
        d="M6 150C44 142 78 152 108 148 142 144 168 152 194 146 194 168 188 178 100 178 12 178 6 168 6 150Z"
        fill="var(--leaf)"
        opacity="0.15"
      />
      {/* furrowed rows */}
      <path
        d="M4 156q40-8 80 0M4 164q40-8 80 0M100 152q46-8 94 0M100 162q46-8 94 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />
      {/* a few sprouts in the furrows */}
      <path
        d="M30 154c-1-3 1-5 3-4M96 148c-1-3 2-5 3-3M150 150c-1-3 2-4 3-3"
        {...ink}
        strokeWidth="1.2"
        stroke="var(--leaf)"
        opacity="0.8"
      />

      {/* body — one continuous silhouette, hood to seat platform to fender */}
      <path
        d="M140 150C143 138 145 124 144 110C143 98 148 88 152 90C157 92 156 104 158 116C159 126 160 134 162 142C170 141 176 145 174 152C182 152 186 156 182 160C176 162 168 160 160 161C142 163 122 160 104 161C96 162 88 160 82 156C74 158 66 156 60 150C52 152 44 148 40 140C38 128 42 116 52 110C58 106 66 108 70 114C78 106 90 100 102 100C112 100 120 104 126 112C130 106 135 100 140 96C142 108 140 122 138 134C138 140 138 146 140 150Z"
        fill="var(--coral)"
        opacity="0.32"
      />
      <path
        d="M140 150C143 138 145 124 144 110C143 98 148 88 152 90C157 92 156 104 158 116C159 126 160 134 162 142C170 141 176 145 174 152C182 152 186 156 182 160C176 162 168 160 160 161C142 163 122 160 104 161C96 162 88 160 82 156C74 158 66 156 60 150C52 152 44 148 40 140C38 128 42 116 52 110C58 106 66 108 70 114C78 106 90 100 102 100C112 100 120 104 126 112C130 106 135 100 140 96C142 108 140 122 138 134C138 140 138 146 140 150Z"
        {...ink}
        strokeWidth="2.3"
      />
      {/* sketchy retrace pass */}
      <path
        d="M141 149C144 137 146 123 145 109C144 97 149 87 153 89C158 91 157 103 159 115"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* seat back bump + ROPS roll bar rising from it, hand-varied uprights */}
      <path d="M64 108C62 96 65 84 62 72" {...ink} strokeWidth="2.1" />
      <path d="M76 106C79 94 76 82 80 68" {...ink} strokeWidth="2" />
      <path d="M62 72C68 68 74 66 80 68" {...ink} strokeWidth="2" />

      {/* exhaust pipe with a small puff of smoke */}
      <path d="M148 90C147 78 150 68 147 58" {...ink} strokeWidth="2.1" />
      <path
        d="M146 58c-4-2-4-7 0-9-3-4 1-8 5-6-2-5 3-8 6-5"
        {...ink}
        strokeWidth="1.3"
        opacity="0.4"
      />

      {/* windshield-ish cab window over the dash */}
      <path
        d="M108 112c2-8 8-12 15-11-1 6-1 11 1 16-6 1-12-1-16-5Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M108 112c2-8 8-12 15-11-1 6-1 11 1 16-6 1-12-1-16-5Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* headlight */}
      <path
        d="M150 100c0-3 3-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-2 0-5-2-5-5Z"
        fill="var(--sun)"
        opacity="0.8"
      />
      <path
        d="M150 100c0-3 3-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-2 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* big rear wheel — round via ~4 long curve segments, not a scallop */}
      <path
        d="M40 160c0-15 13-27 28-27 15 0 28 12 28 27 0 15-13 27-28 27-15 0-28-12-28-27Z"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M46 160c0-11 10-20 22-20 12 0 22 9 22 20 0 11-10 20-22 20-12 0-22-9-22-20Z"
        fill="var(--surface-ink)"
        opacity="0.1"
      />
      <path
        d="M68 133v54M40 160h56M50 141l36 38M86 141l-36 38"
        {...ink}
        strokeWidth="1.2"
        opacity="0.55"
      />

      {/* small front wheel */}
      <path
        d="M140 168c0-8 6-14 14-14 8 0 14 6 14 14 0 8-6 14-14 14-8 0-14-6-14-14Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M154 154v28M140 168h28"
        {...ink}
        strokeWidth="1.1"
        opacity="0.5"
      />

      {/* small bird, character touch */}
      <path
        d="M172 48c2.6-2.6 5-2.6 7 0 2-2.6 4.4-2.6 7 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* ground */}
      <path
        d="M6 186C46 180 78 190 108 186 140 182 168 190 194 184"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
