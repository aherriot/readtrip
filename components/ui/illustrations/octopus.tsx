const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an octopus over a sandy seafloor. The
 * mantle is one round shape built from ~4 long curve segments (the
 * pyramid-sun / telescope-moon technique), not a chain of small bumps —
 * a bulbous head reads as round, not as a cloud. The eight tentacles
 * are grouped into four continuous winding `<path>`s (two tentacles
 * each, as paired subpaths) rather than eight separate limb shapes,
 * with suckers only marked on the frontmost pair for detail without
 * clutter.
 */
export function OctopusIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* water wash */}
      <path
        d="M6 20C40 8 80 4 120 10C154 4 178 14 194 26C194 90 194 140 192 176C150 166 108 172 66 168C36 164 14 156 6 140C4 100 4 58 6 20Z"
        fill="var(--sky)"
        opacity="0.14"
      />

      {/* bubbles rising */}
      <path
        d="M150 30c1.8-1.6 3.8-.4 3.4 1.8-.4 2.2-3 2.2-3.4 0-.2-.9 0-1.4 0-1.8ZM160 46c1.4-1.2 3-.3 2.6 1.4-.3 1.7-2.3 1.7-2.6 0-.1-.6 0-1 0-1.4ZM144 16c1.4-1.2 3-.3 2.6 1.4-.3 1.7-2.3 1.7-2.6 0-.1-.6 0-1 0-1.4Z"
        fill="var(--sky)"
        opacity="0.6"
      />

      {/* seaweed, back-left */}
      <path
        d="M22 178c-2-14-1-28 4-40M30 178c1-16 4-30 10-42"
        {...ink}
        strokeWidth="1.6"
        opacity="0.55"
        stroke="var(--leaf)"
      />

      {/* back pair of tentacles — farthest, pushed back in depth */}
      <path
        d="M46 108C30 106 16 114 10 128C6 138 12 146 6 156M146 108C162 104 176 112 182 126C186 136 180 144 186 154"
        {...ink}
        strokeWidth="4"
        opacity="0.5"
      />

      {/* side pair of tentacles */}
      <path
        d="M62 104C46 112 34 128 20 132C10 135 4 142 8 150M130 104C146 110 160 124 176 128C186 132 192 140 188 148"
        {...ink}
        strokeWidth="5"
        opacity="0.75"
      />

      {/* lower pair of tentacles, curling more vertically */}
      <path
        d="M70 106C64 124 72 138 62 154C56 164 64 172 56 184M122 106C128 122 120 136 130 152C136 162 128 172 136 182"
        {...ink}
        strokeWidth="5"
        opacity="0.85"
      />

      {/* front pair of tentacles — heaviest, with suckers */}
      <path
        d="M82 102C78 118 90 130 82 146C76 158 86 168 78 180M110 102C116 116 104 130 114 144C122 156 112 168 120 178"
        {...ink}
        strokeWidth="6.5"
        opacity="0.95"
      />
      <path
        d="M80 122h.01M84 140h.01M79 160h.01M114 120h.01M112 138h.01M117 158h.01"
        {...ink}
        strokeWidth="2.6"
        opacity="0.5"
      />

      {/* mantle — one round shape, ~4 long curve segments */}
      <path
        d="M126.7 67.3C129.5 92.7 118.4 103.2 92.9 101.2C63.6 98.9 66.4 100.4 65.2 71C64.1 45.5 70.8 38 96.3 38.1C126.2 38.4 123.4 37.6 126.7 67.3Z"
        fill="var(--orchid)"
        opacity="0.28"
      />
      <path
        d="M126.7 67.3C129.5 92.7 118.4 103.2 92.9 101.2C63.6 98.9 66.4 100.4 65.2 71C64.1 45.5 70.8 38 96.3 38.1C126.2 38.4 123.4 37.6 126.7 67.3Z"
        {...ink}
        strokeWidth="2.3"
      />
      {/* sketchy retrace */}
      <path
        d="M125 68C127 91 117 101 93 99C66 97 68 99 67 71C66 47 72 40 96 40C124 40 122 39 125 68Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* mantle texture spots */}
      <path
        d="M84 54h.01M104 50h.01M92 84h.01M112 78h.01"
        {...ink}
        strokeWidth="2.2"
        opacity="0.35"
      />

      {/* eyes, hand-varied so they're not mirrored copies */}
      <path
        d="M78 66c3-3 7-3 7 1s-4 5-7 2c-1-1-1-2 0-3Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />
      <path
        d="M104 70c3-4 8-3 8 1 0 4-5 5-8 2-1-1-1-2 0-3Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />

      {/* coral accent, foreground right */}
      <path
        d="M158 176c2-10 0-20-4-28M168 178c1-8 4-16 2-24M176 176c-1-7 2-14 0-20"
        {...ink}
        strokeWidth="1.7"
        opacity="0.7"
        stroke="var(--coral)"
      />
      <path
        d="M158 176c2-10 0-20-4-28M168 178c1-8 4-16 2-24M176 176c-1-7 2-14 0-20"
        {...ink}
        strokeWidth="1"
        opacity="0.3"
      />

      {/* sandy seafloor */}
      <path
        d="M6 182C40 176 70 186 100 182 132 178 164 186 194 180"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 184C40 178 70 188 100 184 132 180 164 188 194 182 194 192 190 196 100 196 12 196 6 192 6 184Z"
        fill="var(--sun)"
        opacity="0.14"
      />
    </svg>
  );
}
