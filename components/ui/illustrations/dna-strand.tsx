const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a DNA double helix winding down the page,
 * base-pair rungs between the two backbone strands, and a small "zoomed in"
 * magnifying-glass accent in the corner. Each backbone is one continuous
 * winding path (not stitched segments) — see the illustrations skill.
 */
export function DnaStrandIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* lab-wash backdrop behind the helix */}
      <path
        d="M60 10C50 50 78 90 58 130 44 158 66 180 80 190"
        fill="var(--aqua)"
        opacity="0.12"
        stroke="none"
      />

      {/* strand one — continuous winding backbone */}
      <path
        d="M97 16C120 20 136 26 131 34 126 42 106 44 100 51 94 58 66 60 66 72 66 84 92 84 98 93 104 102 132 102 134 114 136 126 108 126 101 135 94 144 64 142 68 156 72 170 94 170 99 175"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M99 17C119 21 134 27 129 35 124 43 107 45 101 52 95 59 68 61 68 73 68 85 93 85 99 94 105 103 131 103 133 115 135 127 109 127 102 136 95 145 66 143 70 157 74 171 93 171 98 176"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* strand two — opposite phase, hand-varied (not a mirrored copy) */}
      <path
        d="M103 16C122 21 130 28 128 35 126 42 108 45 103 52 98 59 128 61 132 73 136 85 106 85 100 94 94 103 66 103 65 115 64 127 96 127 102 136 108 145 134 143 130 157 126 171 104 170 101 175"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M105 17C123 22 129 29 127 36 125 43 110 46 105 53 100 60 126 62 130 74 134 86 107 86 101 95 95 104 68 104 67 116 66 128 95 128 101 137 107 146 132 144 128 158 124 172 105 171 102 176"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* base-pair rungs — spacing and angle vary as the twist foreshortens */}
      <path d="M95 25 108 27" {...ink} strokeWidth="1.6" opacity="0.85" />
      <path d="M131 36 71 40" {...ink} strokeWidth="1.4" opacity="0.6" />
      <path d="M96 51 105 53" {...ink} strokeWidth="1.7" opacity="0.9" />
      <path d="M67 73 131 74" {...ink} strokeWidth="1.3" opacity="0.55" />
      <path d="M97 92 101 95" {...ink} strokeWidth="1.7" opacity="0.9" />
      <path d="M133 114 66 116" {...ink} strokeWidth="1.4" opacity="0.6" />
      <path d="M99 135 103 137" {...ink} strokeWidth="1.6" opacity="0.85" />
      <path d="M70 156 126 158" {...ink} strokeWidth="1.3" opacity="0.55" />

      {/* base-pair color dots, alternating accent pairs */}
      <path
        d="M101 26h.01"
        {...ink}
        strokeWidth="3"
        stroke="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M101 52h.01"
        {...ink}
        strokeWidth="3"
        stroke="var(--sky)"
        opacity="0.8"
      />
      <path
        d="M99 93.5h.01"
        {...ink}
        strokeWidth="3"
        stroke="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M101 136h.01"
        {...ink}
        strokeWidth="3"
        stroke="var(--sky)"
        opacity="0.8"
      />

      {/* magnifying-glass accent, zoomed context — hand-drawn round lens */}
      <path
        d="M150 128c8-7 20-6 25 2 5 9 1 20-7 25-9 5-20 2-25-6-5-8-1-14 7-21Z"
        fill="var(--violet)"
        opacity="0.16"
      />
      <path
        d="M150 128c8-7 20-6 25 2 5 9 1 20-7 25-9 5-20 2-25-6-5-8-1-14 7-21Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path d="M136 156C130 163 125 168 120 174" {...ink} strokeWidth="4" />
      {/* mini base pair inside the lens */}
      <path d="M158 136 172 140" {...ink} strokeWidth="1.4" opacity="0.8" />
      <path d="M156 148 170 146" {...ink} strokeWidth="1.4" opacity="0.8" />
      <path
        d="M164 138h.01"
        fill="var(--coral)"
        stroke="var(--coral)"
        strokeWidth="2.4"
      />

      {/* tiny spark off the lens */}
      <path
        d="M172 122 176 118M177 126 181 124"
        {...ink}
        strokeWidth="1.3"
        opacity="0.6"
      />
    </svg>
  );
}
