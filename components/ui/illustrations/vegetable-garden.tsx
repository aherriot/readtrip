const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a small backyard vegetable garden. Two
 * hand-wobbled raised beds (mounded soil, not straight rectangles) hold a
 * handful of vegetables that read by silhouette alone — carrot fronds,
 * a lobed cabbage, a tomato plant with round fruit, and corn stalks — plus
 * a watering can as the character touch.
 */
export function VegetableGardenIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M8 40C36 28 68 22 100 26C134 22 162 30 190 42"
        fill="var(--sky)"
        opacity="0.14"
      />

      {/* sun */}
      <path
        d="M166 26c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.8"
      />
      <path
        d="M166 26c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* raised bed 1 — mounded soil, hand-wobbled not a rectangle */}
      <path
        d="M8 150C6 142 16 136 34 136C52 134 68 140 70 148C72 156 60 162 42 162C24 164 10 158 8 150Z"
        fill="var(--sun)"
        opacity="0.16"
      />
      <path
        d="M8 150C6 142 16 136 34 136C52 134 68 140 70 148C72 156 60 162 42 162C24 164 10 158 8 150Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M16 146q10 3 20 0M40 152q10 3 20 0"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* raised bed 2 */}
      <path
        d="M112 156C110 148 122 142 142 142C162 140 180 146 182 154C184 162 170 168 150 168C130 170 114 164 112 156Z"
        fill="var(--sun)"
        opacity="0.16"
      />
      <path
        d="M112 156C110 148 122 142 142 142C162 140 180 146 182 154C184 162 170 168 150 168C130 170 114 164 112 156Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M122 152q11 3 22 0M152 158q11 3 22 0"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* carrot fronds — feathery leaf lines over a peeking orange root */}
      <path
        d="M20 138c-1-8 1-14-2-20M26 136c1-9-1-16 3-22M32 138c-2-8 2-15-1-21"
        {...ink}
        strokeWidth="1.3"
        stroke="var(--leaf)"
        opacity="0.85"
      />
      <path
        d="M22 138c1 4 4 6 6 6 3 0 5-3 5-6-1-4-9-4-11 0Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path
        d="M22 138c1 4 4 6 6 6 3 0 5-3 5-6-1-4-9-4-11 0Z"
        {...ink}
        strokeWidth="1.2"
      />

      {/* cabbage — lobed rosette silhouette (organic edge exception) */}
      <path
        d="M52 148c-4-3-3-8 1-9-2-5 3-9 7-6 1-5 8-6 10-1 4-2 8 2 6 6 4 1 4 6 0 8-3 3-9 3-12 1-4 3-9 3-12 1Z"
        fill="var(--leaf)"
        opacity="0.35"
      />
      <path
        d="M52 148c-4-3-3-8 1-9-2-5 3-9 7-6 1-5 8-6 10-1 4-2 8 2 6 6 4 1 4 6 0 8-3 3-9 3-12 1-4 3-9 3-12 1Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* tomato plant — stem, leaves, two round tomatoes */}
      <path
        d="M138 152C136 138 140 126 137 114"
        {...ink}
        strokeWidth="1.7"
        stroke="var(--leaf)"
        opacity="0.9"
      />
      <path
        d="M137 130c-6-1-10-5-11-10 6 0 10 3 11 10Zm0-16c5-2 8-6 8-11-5 1-8 5-8 11Z"
        fill="var(--leaf)"
        opacity="0.4"
      />
      <path
        d="M126 138c0-4 3-7 7-7 4 0 7 3 7 7 0 4-3 7-7 7-4 0-7-3-7-7Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M126 138c0-4 3-7 7-7 4 0 7 3 7 7 0 4-3 7-7 7-4 0-7-3-7-7Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path
        d="M144 128c0-3 2-6 6-6 3 0 6 3 6 6 0 3-3 6-6 6-4 0-6-3-6-6Z"
        fill="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M144 128c0-3 2-6 6-6 3 0 6 3 6 6 0 3-3 6-6 6-4 0-6-3-6-6Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* corn stalks — tall blades with one husked cob peeking through */}
      <path
        d="M164 150c1-14 4-26 2-40M172 148c-1-16 3-28 0-42"
        {...ink}
        strokeWidth="1.7"
        stroke="var(--leaf)"
        opacity="0.85"
      />
      <path
        d="M166 124c4-2 8-5 8-11-6 1-9 5-8 11Zm2-14c-4-1-8-4-8-9 6 0 9 4 8 9Z"
        fill="var(--leaf)"
        opacity="0.4"
      />
      <path
        d="M167 128c3-2 7-2 8 2 1 6-1 13-1 19-4 0-6-3-7-9-1-4-1-9 0-12Z"
        fill="var(--sun)"
        opacity="0.55"
      />
      <path
        d="M167 128c3-2 7-2 8 2 1 6-1 13-1 19-4 0-6-3-7-9-1-4-1-9 0-12Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* watering can — one continuous silhouette, character touch */}
      <path
        d="M84 168C82 160 87 154 96 154C102 154 107 157 108 163C114 161 120 163 120 168C122 165 127 164 128 168C128 172 124 174 120 173C112 176 98 176 90 174C86 175 82 172 84 168Z"
        fill="var(--aqua)"
        opacity="0.3"
      />
      <path
        d="M84 168C82 160 87 154 96 154C102 154 107 157 108 163C114 161 120 163 120 168C122 165 127 164 128 168C128 172 124 174 120 173C112 176 98 176 90 174C86 175 82 172 84 168Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path d="M96 154C95 148 98 144 96 139" {...ink} strokeWidth="1.5" />
      <path d="M108 163c3-3 5-2 6 1" {...ink} strokeWidth="1.2" opacity="0.6" />
      {/* droplets falling from the spout */}
      <path
        d="M129 172c1 2 0 4-1 4s-2-2-1-4c0-1 1-2 2 0Z"
        fill="var(--aqua)"
        opacity="0.7"
      />

      {/* a small butterfly, character touch */}
      <path
        d="M96 96c-3-3-2-7 1-8 2 3 2 6-1 8Zm2 0c3-3 2-7-1-8-2 3-2 6 1 8Z"
        fill="var(--orchid)"
        opacity="0.7"
      />
      <path d="M97 88v10" {...ink} strokeWidth="1" opacity="0.6" />

      {/* ground */}
      <path
        d="M6 178C46 172 78 182 108 178 140 174 168 182 194 176"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
