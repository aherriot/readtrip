const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a farmers market produce stall. The awning
 * is the one place a scalloped edge is correct (it's literally sewn
 * scallops on real market awnings); the fruit piled on the table stays
 * round via the ~4-long-curve technique so it doesn't read as more awning.
 */
export function FarmersMarketIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M8 34C36 22 68 16 100 20C134 16 162 24 190 36"
        fill="var(--sky)"
        opacity="0.14"
      />

      {/* awning support poles */}
      <path d="M28 168C27 130 30 92 26 60" {...ink} strokeWidth="2.4" />
      <path d="M172 168C174 132 170 94 176 62" {...ink} strokeWidth="2.4" />

      {/* awning — one continuous scalloped canopy */}
      <path
        d="M20 60C18 48 26 40 40 40C46 34 56 32 62 36C70 30 82 32 86 38C94 32 106 32 112 38C118 32 130 32 136 38C142 32 154 34 158 40C172 40 182 48 180 60C174 58 168 63 162 60C156 65 149 60 143 62C137 57 130 62 124 60C118 65 111 60 105 62C99 57 92 62 86 60C80 65 73 60 67 62C61 57 54 62 48 60C42 65 35 60 29 62C24 60 22 62 20 60Z"
        fill="var(--coral)"
        opacity="0.55"
      />
      <path
        d="M20 60C18 48 26 40 40 40C46 34 56 32 62 36C70 30 82 32 86 38C94 32 106 32 112 38C118 32 130 32 136 38C142 32 154 34 158 40C172 40 182 48 180 60C174 58 168 63 162 60C156 65 149 60 143 62C137 57 130 62 124 60C118 65 111 60 105 62C99 57 92 62 86 60C80 65 73 60 67 62C61 57 54 62 48 60C42 65 35 60 29 62C24 60 22 62 20 60Z"
        {...ink}
        strokeWidth="1.9"
      />
      {/* awning stripe accents */}
      <path
        d="M52 44q3 8 0 15M88 42q3 9 0 17M124 42q3 9 0 17M156 46q3 8 0 14"
        {...ink}
        strokeWidth="1.3"
        stroke="var(--sun)"
        opacity="0.7"
      />

      {/* table — one continuous silhouette */}
      <path
        d="M18 168C16 160 24 156 34 156C90 154 130 154 176 157C184 157 186 163 184 170C182 176 176 176 168 175C126 172 74 172 32 175C22 176 16 174 18 168Z"
        fill="var(--sun)"
        opacity="0.2"
      />
      <path
        d="M18 168C16 160 24 156 34 156C90 154 130 154 176 157C184 157 186 163 184 170C182 176 176 176 168 175C126 172 74 172 32 175C22 176 16 174 18 168Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M40 175C38 178 36 184 38 188M162 174C164 178 162 184 164 188"
        {...ink}
        strokeWidth="2.2"
      />

      {/* crate of carrots — a bunch, distinct silhouette */}
      <path
        d="M30 154C29 148 34 145 40 145C46 145 51 148 50 154"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M34 145c1-8 2-14-1-20M40 144c0-9 2-15 0-21M45 145c-1-8-1-13 2-19"
        {...ink}
        strokeWidth="1.6"
        stroke="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M34 125c-3-2-5-6-4-9M40 123c-3-2-4-6-2-9M45 126c2-2 3-6 1-9"
        {...ink}
        strokeWidth="1.2"
        stroke="var(--leaf)"
        opacity="0.7"
      />

      {/* pile of round fruit — hand-drawn round via ~4 long curves */}
      <path
        d="M78 148c0-5 4-9 9-9 5 0 9 4 9 9 0 5-4 9-9 9-5 0-9-4-9-9Z"
        fill="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M78 148c0-5 4-9 9-9 5 0 9 4 9 9 0 5-4 9-9 9-5 0-9-4-9-9Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M94 150c0-4 4-8 8-8 5 0 8 4 8 8 0 5-3 8-8 8-4 0-8-3-8-8Z"
        fill="var(--sun)"
        opacity="0.75"
      />
      <path
        d="M94 150c0-4 4-8 8-8 5 0 8 4 8 8 0 5-3 8-8 8-4 0-8-3-8-8Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path
        d="M86 138c0-4 3-6 7-6 3 0 6 2 6 6 0 4-3 6-6 6-4 0-7-2-7-6Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path
        d="M86 138c0-4 3-6 7-6 3 0 6 2 6 6 0 4-3 6-6 6-4 0-7-2-7-6Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* small woven basket */}
      <path
        d="M126 158C124 150 132 145 142 145C152 145 159 150 158 158C159 166 152 170 142 170C132 170 125 166 126 158Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M128 154q7 3 14 0M134 163q7 3 14 0M130 158h24"
        {...ink}
        strokeWidth="1.1"
        opacity="0.5"
      />
      <path
        d="M130 146c1-6 6-9 12-9 6 0 11 3 12 9-8 2-16 2-24 0Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path
        d="M133 142c0-3 3-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-2 0-5-2-5-5Z"
        fill="var(--leaf)"
        opacity="0.75"
      />
      <path
        d="M133 142c0-3 3-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-2 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.2"
      />

      {/* price sign, a small hand-lettered card */}
      <path
        d="M60 130c-1-4 2-7 6-7 4-1 7 2 6 7-1 4-4 6-8 5-3-1-4-3-4-5Z"
        fill="var(--sky)"
        opacity="0.4"
      />
      <path
        d="M60 130c-1-4 2-7 6-7 4-1 7 2 6 7-1 4-4 6-8 5-3-1-4-3-4-5Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path d="M61 127q6 1 8-1" {...ink} strokeWidth="1" opacity="0.6" />

      {/* customer's hand reaching for produce, character touch */}
      <path
        d="M194 150c-6 1-11 4-14 9-2 3-1 6 2 6 2 3 6 3 8 0 3 2 6 0 6-3 2 0 3-3 1-5"
        {...ink}
        strokeWidth="1.8"
        opacity="0.85"
      />

      {/* ground */}
      <path
        d="M6 190C46 184 78 194 108 190 140 186 168 194 194 188"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
