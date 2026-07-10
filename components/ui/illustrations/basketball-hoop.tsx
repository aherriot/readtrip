const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a basketball hoop with a hand-bowed
 * backboard, a round rim (a handful of long curve segments, not a chain of
 * scallops), a net built from several hanging zigzag strokes rather than a
 * filled mesh, and a panel-textured basketball approaching through the air.
 */
export function BasketballHoopIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M8 30C40 18 80 16 118 22C150 27 176 22 194 34C192 62 190 96 188 120C140 128 88 124 44 118C20 114 8 104 8 90Z"
        fill="var(--sky)"
        opacity="0.16"
      />

      {/* backboard — hand-bowed rectangle-ish shape, not a perfect rect */}
      <path
        d="M52 26C74 22 118 23 142 27C144 44 143 60 141 74C116 78 76 77 53 73C51 58 51 42 52 26Z"
        fill="var(--surface-ink)"
        opacity="0.05"
      />
      <path
        d="M52 26C74 22 118 23 142 27C144 44 143 60 141 74C116 78 76 77 53 73C51 58 51 42 52 26Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M53 28C75 24 117 25 141 29C143 45 142 60 140 73"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />
      {/* shooter's square on the backboard */}
      <path
        d="M84 46 112 45 111 63 85 64Z"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* rim mount */}
      <path d="M84 74C86 79 88 82 96 84" {...ink} strokeWidth="3" />
      <path d="M112 73C110 78 108 81 100 84" {...ink} strokeWidth="3" />

      {/* rim — one round silhouette, ~4 long curve segments */}
      <path
        d="M98 82c14-1 27 3 28 9 1 6-12 11-27 11-15 0-28-5-27-11 1-6 12-10 26-9Z"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M99 84c12-1 23 3 24 8 1 5-10 9-23 9-13 0-24-4-23-9 1-5 10-9 22-8Z"
        {...ink}
        strokeWidth="1"
        opacity="0.45"
      />

      {/* net — several hanging zigzag/loop strokes, not a filled mesh */}
      <path
        d="M78 92 84 106 76 118 82 132"
        {...ink}
        strokeWidth="1.4"
        opacity="0.85"
      />
      <path
        d="M90 94 95 108 89 121 94 134"
        {...ink}
        strokeWidth="1.4"
        opacity="0.85"
      />
      <path
        d="M102 95 100 109 106 122 100 136"
        {...ink}
        strokeWidth="1.4"
        opacity="0.85"
      />
      <path
        d="M114 94 111 108 117 120 112 133"
        {...ink}
        strokeWidth="1.4"
        opacity="0.85"
      />
      <path
        d="M124 92 118 105 124 117 116 130"
        {...ink}
        strokeWidth="1.4"
        opacity="0.85"
      />
      {/* horizontal loop courses tying the net strands together */}
      <path
        d="M80 104c8 3 20 3 30 1 8-2 16-2 22 0"
        {...ink}
        strokeWidth="1"
        opacity="0.55"
      />
      <path
        d="M78 119c9 3 22 3 32 1 7-2 13-1 18 1"
        {...ink}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* basketball approaching the hoop, panel-line texture */}
      <path
        d="M154 108c13-1 24 8 25 20 1 12-9 23-22 24-13 1-24-8-25-20-1-12 9-23 22-24Z"
        fill="var(--coral)"
        opacity="0.28"
      />
      <path
        d="M154 108c13-1 24 8 25 20 1 12-9 23-22 24-13 1-24-8-25-20-1-12 9-23 22-24Z"
        {...ink}
        strokeWidth="2.1"
      />
      <path
        d="M132 128c8-2 24-3 35 1M158 109c-3 8-4 22-1 33M147 112c6 5 10 10 12 18"
        {...ink}
        strokeWidth="1.3"
        opacity="0.8"
      />

      {/* motion lines behind the ball */}
      <path
        d="M118 96C128 100 136 104 142 110M114 112C124 114 132 118 138 124M120 130C128 132 134 136 138 142"
        {...ink}
        strokeWidth="1.6"
        opacity="0.5"
      />

      {/* ground */}
      <path
        d="M4 172C46 166 90 176 128 172 158 169 180 174 196 168"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M4 174C46 168 90 178 128 174 158 171 180 176 196 170 196 186 160 190 100 190 40 190 4 186 4 174Z"
        fill="var(--sun)"
        opacity="0.12"
      />

      {/* small character touch — a bounced hash mark on the court */}
      <path
        d="M40 176c4-2 9-2 13 0M150 178c4-2 9-2 13 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
