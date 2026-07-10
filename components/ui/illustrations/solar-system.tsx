const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a simplified solar system — a hand-drawn
 * sun with a few planets orbiting on hand-wobbled elliptical paths, plus a
 * streaking comet. Orbits and planets are all hand-authored curves, no
 * `<circle>`/`<ellipse>` — see the illustrations skill.
 */
export function SolarSystemIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* night wash */}
      <path
        d="M4 20C40 8 90 4 130 12C160 6 184 14 196 24"
        fill="var(--violet)"
        opacity="0.12"
        stroke="none"
      />

      {/* orbit 1 — innermost, hand-wobbled ellipse */}
      <path
        d="M30 82C36 68 50 60 64 61 78 62 88 72 90 86 92 100 82 112 66 114 50 116 36 108 31 96 29 91 28 87 30 82Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
        strokeDasharray="3 5"
      />

      {/* orbit 2 */}
      <path
        d="M14 84C22 60 46 46 70 48 96 50 114 66 116 90 118 114 98 134 72 136 46 138 22 122 15 100 12 95 12 89 14 84Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
        strokeDasharray="4 6"
      />

      {/* orbit 3 — outermost */}
      <path
        d="M2 88C10 52 44 28 78 30 116 32 144 56 148 92 152 128 122 158 84 160 46 162 10 136 3 102 0 97 0 93 2 88Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
        strokeDasharray="5 7"
      />

      {/* orbit 4 — far, catches the comet's path */}
      <path
        d="M8 132C-2 84 40 44 96 42 156 40 194 78 196 122 198 158 162 184 108 186 54 188 16 168 8 132Z"
        {...ink}
        strokeWidth="1"
        opacity="0.32"
        strokeDasharray="5 8"
      />

      {/* sun — hand-drawn round burst, ~4 long curve segments */}
      <path
        d="M42 92 45 78M62 78 60 92M28 100 42 102M78 100 64 102M34 84 44 90M70 84 60 90"
        {...ink}
        strokeWidth="1.6"
        opacity="0.75"
      />
      <path
        d="M52 82c8-.4 14.6 5.6 14.2 13.4C65.8 103 59.6 108.4 52 108 44 107.6 38 101.6 38.4 94 38.8 86.4 44.4 82.4 52 82Z"
        fill="var(--sun)"
        opacity="0.9"
      />
      <path
        d="M52 82c8-.4 14.6 5.6 14.2 13.4C65.8 103 59.6 108.4 52 108 44 107.6 38 101.6 38.4 94 38.8 86.4 44.4 82.4 52 82Z"
        {...ink}
        strokeWidth="1.8"
      />

      {/* planet on orbit 1 */}
      <path
        d="M90 86c3-3 7-3 8.5.5 1.5 3.5-1 7-5 7s-6.5-4-3.5-7.5Z"
        fill="var(--sky)"
        opacity="0.85"
      />
      <path
        d="M90 86c3-3 7-3 8.5.5 1.5 3.5-1 7-5 7s-6.5-4-3.5-7.5Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* planet on orbit 2, larger */}
      <path
        d="M114 118c4-4 10-3.6 12 1 2 4.6-1.6 10-6.6 10-5 0-9-4.4-5.4-11Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M114 118c4-4 10-3.6 12 1 2 4.6-1.6 10-6.6 10-5 0-9-4.4-5.4-11Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* planet on orbit 3, with a tiny ring hint */}
      <path
        d="M136 84c5-4.6 12-4 14.4 1.6 2.4 5.6-2 12-8 12-6 0-10.6-6.6-6.4-13.6Z"
        fill="var(--leaf)"
        opacity="0.85"
      />
      <path
        d="M136 84c5-4.6 12-4 14.4 1.6 2.4 5.6-2 12-8 12-6 0-10.6-6.6-6.4-13.6Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path
        d="M122 92c8-6 26-5 32 2"
        {...ink}
        strokeWidth="1.1"
        opacity="0.6"
      />

      {/* far small planet on orbit 4 */}
      <path
        d="M40 158c2.4-2.6 6-2.4 7 .6 1 3-1 6-4.4 6-3.4 0-5-3.6-2.6-6.6Z"
        fill="var(--violet)"
        opacity="0.8"
      />
      <path
        d="M40 158c2.4-2.6 6-2.4 7 .6 1 3-1 6-4.4 6-3.4 0-5-3.6-2.6-6.6Z"
        {...ink}
        strokeWidth="1.2"
      />

      {/* comet streak */}
      <path
        d="M162 34C176 46 186 58 194 72"
        {...ink}
        strokeWidth="2.4"
        opacity="0.5"
      />
      <path
        d="M188 66c2-4 6-4 8-1 2 3.4-1.4 7-5 6.4-3.6-.6-4.6-2.6-3-5.4Z"
        fill="var(--aqua)"
        opacity="0.85"
      />
      <path
        d="M188 66c2-4 6-4 8-1 2 3.4-1.4 7-5 6.4-3.6-.6-4.6-2.6-3-5.4Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* distant stars */}
      <path
        d="M170 22h.01M108 12h.01M20 46h.01"
        {...ink}
        strokeWidth="2.2"
        opacity="0.5"
      />
    </svg>
  );
}
