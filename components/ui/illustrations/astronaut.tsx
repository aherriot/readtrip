const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an astronaut drifting above a lunar
 * horizon. The bubble helmet is drawn as its own round shape (the
 * pyramid-sun/telescope-moon technique — ~4 long curve segments, not a
 * chain of small scallops) so it reads distinctly wider than the neck
 * ring beneath it. The torso/limb silhouette is one continuous path from
 * neck ring, out to shoulders, tapering to a waist, and back — the same
 * discipline as the dinosaur's body path. A PLSS backpack pokes out
 * beside the torso as its own shape (the accuracy landmark the old
 * version was missing). Arms and legs are thick, padded strokes (not
 * thin dinosaur-style limbs) ending in gloves/boots drawn as small round
 * blobs, matching the suit's bulk.
 */
export function AstronautIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* night wash */}
      <path
        d="M6 30C36 16 76 8 116 14C150 8 178 20 194 36C194 74 194 108 192 132C150 122 108 130 66 124C36 120 14 110 6 96C4 74 4 50 6 30Z"
        fill="var(--violet)"
        opacity="0.14"
      />

      {/* distant planet, round-shape technique (4 curves) */}
      <path
        d="M186.2 36C186.3 49.3 180.9 51 167.7 49.2C155.2 47.6 154.6 49.8 153.3 37.3C151.9 23.5 156.1 22.6 169.9 22.5C182.6 22.4 186.2 23.2 186.2 36Z"
        fill="var(--coral)"
        opacity="0.65"
      />
      <path
        d="M186.2 36C186.3 49.3 180.9 51 167.7 49.2C155.2 47.6 154.6 49.8 153.3 37.3C151.9 23.5 156.1 22.6 169.9 22.5C182.6 22.4 186.2 23.2 186.2 36Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path
        d="M148 48c8-6 34-4 40 3"
        {...ink}
        strokeWidth="1.2"
        opacity="0.7"
      />

      {/* stars */}
      <path
        d="M40 30c.5-1 2-1 2 .5s-1.6 1.4-2 .3ZM70 20c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2ZM24 60c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2Z"
        fill="var(--surface-ink)"
        opacity="0.55"
      />

      {/* PLSS backpack — its own shape, drawn first so it pokes out beside the torso */}
      <path
        d="M52 82C44 80 39 87 39 96C39 109 39 119 44 129C49 136 55 133 57 126C52 111 52 97 57 87C55 83 54 81 52 82Z"
        fill="var(--surface-ink)"
        opacity="0.1"
      />
      <path
        d="M52 82C44 80 39 87 39 96C39 109 39 119 44 129C49 136 55 133 57 126C52 111 52 97 57 87C55 83 54 81 52 82Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M45 94c4 1 8 1 11 0M44 108c5 1 9 1 12 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.55"
      />

      {/* torso + limbs root, one continuous silhouette: neck ring, shoulder
          flare, torso taper, waist, hip */}
      <path
        d="M116 66C130 68 146 76 152 92C158 108 150 126 136 136C140 146 130 152 116 150C104 158 88 158 74 150C60 152 50 140 52 124C48 110 56 96 70 90C58 84 56 72 62 64C64 66 68 68 74 66C86 68 102 68 116 66Z"
        fill="var(--sky)"
        opacity="0.2"
      />
      <path
        d="M116 66C130 68 146 76 152 92C158 108 150 126 136 136C140 146 130 152 116 150C104 158 88 158 74 150C60 152 50 140 52 124C48 110 56 96 70 90C58 84 56 72 62 64C64 66 68 68 74 66C86 68 102 68 116 66Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M115 68C128 70 144 78 150 93C156 108 148 125 135 135C139 145 129 150 116 148C105 156 89 156 76 148C62 150 52 139 54 124C50 111 57 98 71 92C60 86 58 74 64 66"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* bubble helmet, its own round shape — 4 long curve segments,
          distinctly wider than the neck ring below it */}
      <path
        d="M124.6 46.6C123.9 66.6 122.1 68.5 102.1 69.8C79.3 71.2 69.9 65.8 73.2 43.1C76.5 21.5 81.1 22.6 102.9 24.6C123.4 26.6 125.3 26 124.6 46.6Z"
        fill="var(--sky)"
        opacity="0.22"
      />
      <path
        d="M124.6 46.6C123.9 66.6 122.1 68.5 102.1 69.8C79.3 71.2 69.9 65.8 73.2 43.1C76.5 21.5 81.1 22.6 102.9 24.6C123.4 26.6 125.3 26 124.6 46.6Z"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M123 47C122 65 120 67 102 68C81 69 72 64 75 43"
        {...ink}
        strokeWidth="1"
        opacity="0.45"
      />

      {/* visor reflection */}
      <path
        d="M82 48c6-7 22-7 30 0-3 9-25 9-30 0Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M82 48c6-7 22-7 30 0-3 9-25 9-30 0Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path d="M90 46c2-2 6-2 8 0" {...ink} strokeWidth="1.2" opacity="0.6" />

      {/* chest patch + suit seams */}
      <path
        d="M92 108 108 109 104 121 96 120Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path d="M92 108 108 109 104 121 96 120Z" {...ink} strokeWidth="1.3" />
      <path
        d="M80 96c8 1 16 1 24-1M78 132c10 1 20 1 30-1"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* arms — thick, padded, one gloved and reaching with a small flag */}
      <path d="M62 92C46 88 30 84 20 84" {...ink} strokeWidth="9" />
      <path d="M148 96C160 104 166 116 168 132" {...ink} strokeWidth="9" />
      <path
        d="M32.3 83.4C33 90.2 33 90.5 26.2 92C18.7 93.6 13.3 90.3 14.7 82.7C16.1 75 15.4 78.6 23.2 77.8C29 77.2 31.7 77.5 32.3 83.4Z"
        fill="var(--coral)"
        opacity="0.35"
      />
      <path
        d="M32.3 83.4C33 90.2 33 90.5 26.2 92C18.7 93.6 13.3 90.3 14.7 82.7C16.1 75 15.4 78.6 23.2 77.8C29 77.2 31.7 77.5 32.3 83.4Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M175.1 130.7C176.5 136.5 172.2 138.7 166.4 137.5C161.2 136.4 161.2 137.3 161.3 131.9C161.5 126.4 163.4 125.1 168.9 125.6C174.9 126.3 173.6 124.8 175.1 130.7Z"
        fill="var(--coral)"
        opacity="0.35"
      />
      <path
        d="M175.1 130.7C176.5 136.5 172.2 138.7 166.4 137.5C161.2 136.4 161.2 137.3 161.3 131.9C161.5 126.4 163.4 125.1 168.9 125.6C174.9 126.3 173.6 124.8 175.1 130.7Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path d="M20 84c-1-7 2-13 7-16" {...ink} strokeWidth="4" />
      <path d="M20 84 30 68 21 78Z" fill="var(--coral)" opacity="0.85" />
      <path d="M20 84 30 68 21 78Z" {...ink} strokeWidth="1.3" />

      {/* legs — thick, padded, curled as if floating, ending in boots */}
      <path d="M88 150c-6 12-10 22-8 32" {...ink} strokeWidth="10" />
      <path d="M122 148c8 10 12 20 10 32" {...ink} strokeWidth="10" />
      <path
        d="M89 182.4C88.3 189 84.7 188.7 78.2 187.8C71.7 186.9 69.2 186.9 71.2 180.7C73.3 174.5 75 175.8 81.5 176.6C87.5 177.4 89.6 176.4 89 182.4Z"
        fill="var(--surface-ink)"
        opacity="0.16"
      />
      <path
        d="M89 182.4C88.3 189 84.7 188.7 78.2 187.8C71.7 186.9 69.2 186.9 71.2 180.7C73.3 174.5 75 175.8 81.5 176.6C87.5 177.4 89.6 176.4 89 182.4Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M140 180.2C139.7 186.4 140.3 183.5 134.3 185C129 186.4 125 186.7 123.3 181.5C121.3 175 125.7 173.9 132.6 174.3C138.4 174.6 140.3 174.3 140 180.2Z"
        fill="var(--surface-ink)"
        opacity="0.16"
      />
      <path
        d="M140 180.2C139.7 186.4 140.3 183.5 134.3 185C129 186.4 125 186.7 123.3 181.5C121.3 175 125.7 173.9 132.6 174.3C138.4 174.6 140.3 174.3 140 180.2Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* lunar horizon */}
      <path
        d="M6 186C40 180 70 190 100 186 132 182 164 192 194 184"
        {...ink}
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  );
}
