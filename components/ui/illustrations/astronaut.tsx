const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an astronaut drifting above a lunar
 * horizon. Helmet through suit is one continuous silhouette (arms, backpack,
 * and legs break off as their own strokes, same as a dinosaur's legs).
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

      {/* helmet + suit, one continuous silhouette */}
      <path
        d="M100 44C110 40 120 46 118 56C128 60 132 72 124 80C134 86 138 100 128 108C136 116 134 130 120 134C122 146 112 156 98 154C96 162 78 160 78 152C64 154 56 142 60 132C48 128 46 114 56 106C46 98 50 84 60 78C52 70 56 58 66 54C64 46 72 40 82 42C84 38 92 38 100 44Z"
        fill="var(--sky)"
        opacity="0.2"
      />
      <path
        d="M100 44C110 40 120 46 118 56C128 60 132 72 124 80C134 86 138 100 128 108C136 116 134 130 120 134C122 146 112 156 98 154C96 162 78 160 78 152C64 154 56 142 60 132C48 128 46 114 56 106C46 98 50 84 60 78C52 70 56 58 66 54C64 46 72 40 82 42C84 38 92 38 100 44Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M99 46C108 42 118 48 116 57C126 61 130 72 122 80C132 87 136 100 126 108C134 116 132 129 118 133C120 145 111 154 97 152C95 160 79 158 79 151C65 153 58 141 62 131C50 127 48 114 58 106C48 98 52 85 62 79C54 71 58 59 68 55C66 47 74 41 83 43C85 39 92 40 99 46Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* visor reflection */}
      <path
        d="M84 70c6-6 20-6 28 0-4 8-22 8-28 0Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M84 70c6-6 20-6 28 0-4 8-22 8-28 0Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path d="M92 68c2-2 6-2 8 0" {...ink} strokeWidth="1.2" opacity="0.6" />

      {/* chest patch + suit seams */}
      <path
        d="M92 120 108 120 104 132 96 132Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path d="M92 120 108 120 104 132 96 132Z" {...ink} strokeWidth="1.3" />
      <path
        d="M76 98c8 1 16 1 24 0M74 112c10 1 20 1 30 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* backpack, its own stroke */}
      <path
        d="M56 90c-8 0-13 6-12 14 1 8 7 12 14 11"
        {...ink}
        strokeWidth="1.7"
        opacity="0.75"
      />

      {/* arms, one reaching with a small flag */}
      <path
        d="M56 100C42 96 30 88 22 76M136 96C148 100 158 110 160 124"
        {...ink}
        strokeWidth="5"
      />
      <path d="M22 76c-1-6 1-11 5-14" {...ink} strokeWidth="4" />
      <path d="M22 76 30 62 22 71Z" fill="var(--coral)" opacity="0.8" />
      <path d="M22 76 30 62 22 71Z" {...ink} strokeWidth="1.3" />

      {/* legs, curled as if floating */}
      <path
        d="M84 152c-6 10-8 20-6 30M110 150c8 8 12 18 10 28"
        {...ink}
        strokeWidth="6"
      />
      <path d="M78 182h8M118 178h9" {...ink} strokeWidth="5" opacity="0.9" />

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
