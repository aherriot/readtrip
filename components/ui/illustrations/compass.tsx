const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a brass compass over a torn map corner. One
 * generic entry in the "no specific art yet" fallback pool (see
 * `lib/illustrations/resolve.ts`) — the compass housing is one continuous
 * hand-drawn silhouette, never a `<circle>`.
 */
export function CompassIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* map corner peeking out behind */}
      <path
        d="M20 120C50 108 90 116 130 106C150 100 170 108 184 122C186 148 184 172 180 190C140 182 96 190 56 182C36 178 22 168 16 152C14 140 16 128 20 120Z"
        fill="var(--sun)"
        opacity="0.12"
      />
      <path
        d="M24 122C52 112 88 118 126 110M30 140C60 132 100 138 140 130M26 158C56 150 92 156 130 150"
        {...ink}
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M60 116c8-2 14 4 10 12-8-2-14-6-10-12ZM100 172c6-4 14 0 12 8-8 0-16-2-12-8Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.4"
      />

      {/* compass housing, one continuous hand-drawn silhouette */}
      <path
        d="M100 40C118 38 132 50 134 68C148 72 156 86 150 102C158 112 156 128 144 136C142 152 126 162 110 158C104 168 88 168 82 158C66 160 54 148 56 132C44 126 40 110 50 100C46 84 56 70 72 66C74 52 86 42 100 40Z"
        fill="var(--sun)"
        opacity="0.22"
      />
      <path
        d="M100 40C118 38 132 50 134 68C148 72 156 86 150 102C158 112 156 128 144 136C142 152 126 162 110 158C104 168 88 168 82 158C66 160 54 148 56 132C44 126 40 110 50 100C46 84 56 70 72 66C74 52 86 42 100 40Z"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M99 42C116 40 129 51 131 68C144 73 152 86 146 101C154 111 152 127 141 134C139 150 124 159 109 156C103 165 89 165 83 156C68 158 57 147 59 132C48 127 44 111 54 101C50 86 59 72 74 68C76 55 87 44 99 42Z"
        {...ink}
        strokeWidth="1"
        opacity="0.35"
      />

      {/* inner rim + tick marks */}
      <path
        d="M96 58C110 56 121 66 122 80C132 84 138 94 134 106C140 114 138 126 128 132C126 144 114 152 102 149C97 156 87 156 82 149C70 151 61 143 63 131C55 127 51 117 58 108C55 96 62 86 74 82C75 71 84 62 96 58Z"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />
      <path
        d="M100 46 100 56M154 100 144 100M100 154 100 144M46 100 56 100M124 56 118 64M144 76 136 82M144 126 136 120M124 146 118 138M76 146 82 138M56 126 64 120M56 76 64 82M76 56 82 64"
        {...ink}
        strokeWidth="1.3"
        opacity="0.55"
      />

      {/* needle */}
      <path
        d="M100 68 108 98 100 94 92 98Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path d="M100 68 108 98 100 94 92 98Z" {...ink} strokeWidth="1.4" />
      <path
        d="M100 94 108 98 100 130 92 98Z"
        fill="var(--surface-ink)"
        opacity="0.15"
      />
      <path d="M100 94 108 98 100 130 92 98Z" {...ink} strokeWidth="1.4" />
      <path
        d="M100 94c2-2 5-2 6.5.5 1.4 2.4-1 5.5-6.5 5.5s-8-3.1-6.5-5.5C94.9 92 98 92 100 94Z"
        fill="var(--surface-ink)"
      />

      {/* N marking */}
      <path d="M96 50 96 42 102 50 102 42" {...ink} strokeWidth="1.5" />

      {/* lanyard loop */}
      <path
        d="M92 40c1-6 6-10 12-9 6 1 9 6 8 12"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />
    </svg>
  );
}
