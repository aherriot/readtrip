const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: the classic comedy/tragedy mask pair. Each
 * face is a hand-drawn round-ish silhouette built from ~4 long curve
 * segments (the `compass.tsx`/`telescope.tsx` round-object technique), not a
 * scalloped ring — one mask smiling with raised brows, the other frowning
 * with furrowed brows, overlapping slightly with ribbon ties at the sides.
 */
export function TheaterMasksIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* comedy mask — face silhouette, ~4 long sweeps */}
      <path
        d="M75 60C100 58 118 76 116 100C114 122 96 138 74 136C52 134 36 118 38 96C40 74 54 62 75 60Z"
        fill="var(--sun)"
        opacity="0.22"
      />
      <path
        d="M75 60C100 58 118 76 116 100C114 122 96 138 74 136C52 134 36 118 38 96C40 74 54 62 75 60Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M76 61C99 60 117 77 115 100C113 121 96 137 75 135C54 133 37 118 39 97C41 75 55 63 76 61Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* comedy — raised brows and smiling eyes */}
      <path
        d="M56 78c5-4 11-4 15-1M82 76c5-4 11-3 15 0"
        {...ink}
        strokeWidth="1.6"
        opacity="0.85"
      />
      <path
        d="M60 89c4-3 9-3 12 0M85 87c4-3 9-3 12 1"
        {...ink}
        strokeWidth="1.5"
      />
      <path d="M52 108c8 12 24 16 36 6" {...ink} strokeWidth="2.1" />

      {/* comedy ribbon tie */}
      <path
        d="M40 132c-2 8-6 14-4 22"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />
      <path
        d="M34 152c-3 2-3 6 1 8 3 2 7 0 6-4-1-3-4-5-7-4Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />

      {/* tragedy mask — overlapping, slightly larger, hand-varied sweeps */}
      <path
        d="M132 68C158 68 174 88 171 111C168 133 149 148 127 145C105 142 91 124 94 101C97 79 110 68 132 68Z"
        fill="var(--violet)"
        opacity="0.22"
      />
      <path
        d="M132 68C158 68 174 88 171 111C168 133 149 148 127 145C105 142 91 124 94 101C97 79 110 68 132 68Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M133 69C157 69 173 89 170 111C167 132 148 147 128 144C106 141 92 123 95 102C98 80 111 69 133 69Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* tragedy — furrowed brows, downturned eyes and mouth */}
      <path
        d="M116 90c4-1 8 1 10 4M142 88c-4-1-8 1-10 4"
        {...ink}
        strokeWidth="1.6"
        opacity="0.85"
      />
      <path
        d="M112 100c4-2 8-2 11 0M138 98c4-2 8-2 11 1"
        {...ink}
        strokeWidth="1.5"
      />
      <path d="M108 130c8-10 24-10 34 0" {...ink} strokeWidth="2.1" />

      {/* tragedy ribbon tie */}
      <path
        d="M168 141c2 8 6 13 5 21"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />
      <path
        d="M172 162c3 1 4 5 1 8-3 3-7 1-7-3 0-3 3-6 6-5Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />
    </svg>
  );
}
