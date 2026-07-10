const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a soccer ball mid-kick in front of a goal
 * frame, with a kicking leg silhouette cropped at the scene's edge. The ball
 * is a hand-authored round shape (a handful of long curve segments, not a
 * chain of small scallops) with a few pentagon panel lines baked onto its
 * face so it reads specifically as a soccer ball. The goal posts and
 * crossbar are hand-bowed rather than ruled straight, per the illustrations
 * skill's anti-geometric rules.
 */
export function SoccerMatchIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky/pitch wash */}
      <path
        d="M6 40C34 26 70 22 104 28C140 34 168 26 192 36C196 60 194 100 192 150C150 158 96 156 50 152C24 148 8 140 6 132Z"
        fill="var(--sky)"
        opacity="0.16"
      />

      {/* goal frame — back-left, hand-bowed posts + crossbar */}
      <path d="M18 148C16 118 15 90 17 62" {...ink} strokeWidth="2.4" />
      <path d="M76 150C75 121 74 92 73 60" {...ink} strokeWidth="2.3" />
      <path d="M17 62C34 57 56 55 73 60" {...ink} strokeWidth="2.2" />
      {/* sketchy retrace on the crossbar so it doesn't read as one clean vector line */}
      <path
        d="M18 64C35 60 55 58 72 63"
        {...ink}
        strokeWidth="1"
        opacity="0.45"
      />

      {/* netting — a few crossing lines, not a filled mesh */}
      <path
        d="M20 68 44 96M30 65 56 108M42 63 68 128M56 61 74 100"
        {...ink}
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M72 68 30 92M74 82 24 112M75 100 34 130M73 118 44 142"
        {...ink}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* motion lines trailing the ball, implying it was just struck */}
      <path
        d="M40 108C56 104 68 100 78 96M46 122C60 118 72 116 82 113M56 134C68 131 78 129 86 127"
        {...ink}
        strokeWidth="1.6"
        opacity="0.55"
      />

      {/* soccer ball — one round silhouette, ~4 long curve segments */}
      <path
        d="M126 66c15-2 28 8 29 23 1 15-10 27-25 29-15 2-29-8-30-23-1-14 11-27 26-29Z"
        fill="var(--surface-ink)"
        opacity="0.06"
      />
      <path
        d="M126 66c15-2 28 8 29 23 1 15-10 27-25 29-15 2-29-8-30-23-1-14 11-27 26-29Z"
        {...ink}
        strokeWidth="2.3"
      />
      {/* sketchy double-stroke retrace on the ball's outline */}
      <path
        d="M127 68c14-2 26 7 27 21 1 14-9 25-23 27-14 2-27-7-28-21-1-13 10-25 24-27Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* pentagon panel lines on the ball's face — the detail that reads "soccer ball" */}
      <path
        d="M132 84 141 87 139 97 128 98 125 88Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path
        d="M132 84 122 78M141 87 150 82M139 97 146 105M128 98 122 108M125 88 116 86"
        {...ink}
        strokeWidth="1.3"
        opacity="0.75"
      />

      {/* kicking leg + foot, silhouette cropped at the scene's edge */}
      <path
        d="M200 178C186 172 174 162 168 148C163 136 168 122 178 116"
        {...ink}
        strokeWidth="8"
      />
      <path
        d="M178 116c8-2 16 1 21 6 4 5 3 9-2 10-9 2-19-1-24-6-3-4-1-8 5-10Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />
      <path
        d="M178 116c8-2 16 1 21 6 4 5 3 9-2 10-9 2-19-1-24-6-3-4-1-8 5-10Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* ground line */}
      <path
        d="M4 156C46 150 90 160 128 156 158 153 180 158 196 152"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M4 158C46 152 90 162 128 158 158 155 180 160 196 154 196 172 160 178 100 178 40 178 4 172 4 158Z"
        fill="var(--leaf)"
        opacity="0.14"
      />

      {/* small character touch — a clump of grass at the corner flag spot */}
      <path
        d="M188 152c-1-5 1-8 3-10-1 5-1 8-1 10Zm0 0c1-6 4-9 7-9-2 6-4 8-7 9Zm0 0c-2-5-5-7-8-6 3 4 5 6 8 6Z"
        fill="var(--leaf)"
        opacity="0.7"
      />
    </svg>
  );
}
