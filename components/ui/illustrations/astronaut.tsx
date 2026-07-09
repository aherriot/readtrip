const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an astronaut drifting above a lunar
 * horizon. Helmet through suit is one continuous silhouette, but it reads
 * as a figure — not a blob — because the outline actually narrows at the
 * neck ring before flaring back out at the shoulders, the same in/out
 * landmark a real spacesuit has. Arms, backpack, and legs break off as
 * their own strokes, same as a dinosaur's legs.
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

      {/* distant planet */}
      <path
        d="M168 40c8-1 15 5 14.6 13C182.2 61 175 67 167 66.4 159 65.8 153 59 153.4 51 153.8 43 160 41 168 40Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path
        d="M168 40c8-1 15 5 14.6 13C182.2 61 175 67 167 66.4 159 65.8 153 59 153.4 51 153.8 43 160 41 168 40Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M148 48c8-6 34-4 40 3"
        {...ink}
        strokeWidth="1.3"
        opacity="0.75"
      />

      {/* stars */}
      <path
        d="M40 30c.5-1 2-1 2 .5s-1.6 1.4-2 .3ZM70 20c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2ZM24 60c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2Z"
        fill="var(--surface-ink)"
        opacity="0.55"
      />

      {/* helmet + suit, one continuous silhouette: bubble dome, neck ring
          (narrows in), shoulder flare, torso taper, waist */}
      <path
        d="M100 28C118 29 130 43 128 59C130 67 124 73 118 76C116 81 112 83 108 83C126 81 146 84 154 98C160 112 152 128 140 138C134 148 120 152 106 150C92 154 78 150 70 140C58 130 52 113 58 99C50 87 66 78 84 80C79 79 76 76 74 72C68 68 62 61 64 59C64 43 82 29 100 28Z"
        fill="var(--sky)"
        opacity="0.2"
      />
      <path
        d="M100 28C118 29 130 43 128 59C130 67 124 73 118 76C116 81 112 83 108 83C126 81 146 84 154 98C160 112 152 128 140 138C134 148 120 152 106 150C92 154 78 150 70 140C58 130 52 113 58 99C50 87 66 78 84 80C79 79 76 76 74 72C68 68 62 61 64 59C64 43 82 29 100 28Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M99 30C116 31 128 44 126 58C128 65 122 71 117 74C126 78 143 82 152 96C157 109 150 125 138 135C132 145 119 149 107 148C94 152 80 148 72 138C61 128 55 112 61 98C53 88 68 79 85 81C77 78 71 71 71 65C65 60 63 57 65 54C67 41 84 30 99 30Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* visor reflection */}
      <path
        d="M82 52c6-6 20-6 28 0-4 8-22 8-28 0Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M82 52c6-6 20-6 28 0-4 8-22 8-28 0Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path d="M90 50c2-2 6-2 8 0" {...ink} strokeWidth="1.2" opacity="0.6" />

      {/* chest patch + suit seams */}
      <path
        d="M90 112 106 112 102 124 94 124Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path d="M90 112 106 112 102 124 94 124Z" {...ink} strokeWidth="1.3" />
      <path
        d="M78 98c8 1 16 1 24 0M76 134c10 1 20 1 30 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* backpack, its own stroke */}
      <path
        d="M60 98c-8 0-13 6-12 14 1 8 7 12 14 11"
        {...ink}
        strokeWidth="1.7"
        opacity="0.75"
      />

      {/* arms, one reaching with a small flag */}
      <path
        d="M58 102C44 100 30 92 20 80M146 102C158 106 166 114 166 128"
        {...ink}
        strokeWidth="5"
      />
      <path d="M20 80c-1-6 1-11 5-14" {...ink} strokeWidth="4" />
      <path d="M20 80 28 66 20 75Z" fill="var(--coral)" opacity="0.8" />
      <path d="M20 80 28 66 20 75Z" {...ink} strokeWidth="1.3" />

      {/* legs, curled as if floating */}
      <path
        d="M84 148c-6 10-8 20-6 30M126 146c8 8 12 18 10 28"
        {...ink}
        strokeWidth="6"
      />
      <path d="M78 178h8M134 174h9" {...ink} strokeWidth="5" opacity="0.9" />

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
