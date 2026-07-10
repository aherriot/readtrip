const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: an apple orchard with a large gnarled tree
 * and a smaller one behind it. Foliage is the one place the many-small-bump
 * "cloud" technique is correct (a genuinely irregular organic edge), so both
 * canopies use it — but apples and the basket's fruit stay round via the
 * ~4-long-curve technique so they don't read as more foliage.
 */
export function OrchardIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M8 44C36 30 68 22 100 26C134 22 164 32 192 46"
        fill="var(--sky)"
        opacity="0.16"
      />

      {/* distant smaller tree */}
      <path
        d="M150 96c-6-5-5-13 1-16-4-8 4-15 11-11 2-8 12-9 16-2 6-4 13 1 11 8 6 1 7 8 2 11-5 4-13 3-17-1-6 4-12 3-16-1-3 3-6 4-8 12Z"
        {...ink}
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M162 96C160 116 162 132 160 148"
        {...ink}
        strokeWidth="2.4"
        opacity="0.5"
      />
      <path
        d="M158 108c0-2 2-4 4-4 2 0 4 2 4 4 0 2-2 4-4 4-2 0-4-2-4-4Z"
        fill="var(--coral)"
        opacity="0.6"
      />

      {/* main tree — gnarled trunk, one continuous hand-bowed silhouette */}
      <path
        d="M76 168C74 152 78 138 72 124C68 114 76 106 82 110C80 98 88 90 94 94C92 82 100 74 106 78C104 68 112 62 118 68C122 60 132 62 134 70C140 66 148 70 146 78C154 78 158 86 152 92C158 96 156 106 148 108C152 118 146 128 136 126C138 138 128 146 118 142C120 156 112 166 100 166C104 172 100 178 92 176C88 180 80 178 78 172C74 174 70 172 70 168C72 168 74 168 76 168Z"
        {...ink}
        strokeWidth="1.7"
        opacity="0.85"
      />
      <path
        d="M96 100C98 116 96 130 100 146C102 156 98 164 100 168"
        {...ink}
        strokeWidth="4.5"
      />
      <path
        d="M100 146c-4 4-10 6-16 4M100 130c6 2 12 0 16-4"
        {...ink}
        strokeWidth="2"
        opacity="0.75"
      />
      {/* bark texture, uneven grain lines */}
      <path
        d="M94 156q3-10 1-20M104 158q-2-12 1-24"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* apples hanging in the canopy, hand-drawn round via ~4 curves */}
      <path
        d="M84 100c0-4 3-7 7-7 4 0 7 3 7 7 0 4-3 7-7 7-4 0-7-3-7-7Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M84 100c0-4 3-7 7-7 4 0 7 3 7 7 0 4-3 7-7 7-4 0-7-3-7-7Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path d="M91 93c0-2 1-4 2-4" {...ink} strokeWidth="1.1" opacity="0.6" />

      <path
        d="M118 88c0-4 3-6 7-6 4 0 6 2 6 6 0 4-2 6-6 6-4 0-7-2-7-6Z"
        fill="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M118 88c0-4 3-6 7-6 4 0 6 2 6 6 0 4-2 6-6 6-4 0-7-2-7-6Z"
        {...ink}
        strokeWidth="1.3"
      />

      <path
        d="M132 108c0-4 4-7 8-7 4 0 8 3 8 7 0 4-4 7-8 7-4 0-8-3-8-7Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M132 108c0-4 4-7 8-7 4 0 8 3 8 7 0 4-4 7-8 7-4 0-8-3-8-7Z"
        {...ink}
        strokeWidth="1.4"
      />

      <path
        d="M104 118c0-3 3-6 6-6 4 0 6 3 6 6 0 4-2 6-6 6-3 0-6-2-6-6Z"
        fill="var(--coral)"
        opacity="0.75"
      />
      <path
        d="M104 118c0-3 3-6 6-6 4 0 6 3 6 6 0 4-2 6-6 6-3 0-6-2-6-6Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* fallen apples on the ground */}
      <path
        d="M52 176c0-3 3-6 6-6 4 0 6 3 6 6 0 3-2 6-6 6-3 0-6-3-6-6Z"
        fill="var(--coral)"
        opacity="0.75"
      />
      <path
        d="M52 176c0-3 3-6 6-6 4 0 6 3 6 6 0 3-2 6-6 6-3 0-6-3-6-6Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M148 178c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path
        d="M148 178c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.2"
      />

      {/* wicker basket with a few apples */}
      <path
        d="M18 168C16 160 24 155 34 155C44 155 51 160 50 168C51 176 44 180 34 180C24 180 17 176 18 168Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M20 163q7 3 14 0M26 172q7 3 14 0M22 168h24"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />
      <path
        d="M22 156c1-6 6-9 12-9 6 0 11 3 12 9-8 2-16 2-24 0Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path
        d="M24 152c0-3 3-5 6-5 3 0 6 2 6 5 0 3-3 5-6 5-3 0-6-2-6-5Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M24 152c0-3 3-5 6-5 3 0 6 2 6 5 0 3-3 5-6 5-3 0-6-2-6-5Z"
        {...ink}
        strokeWidth="1.2"
      />
      <path
        d="M34 154c0-3 3-5 6-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-6-2-6-5Z"
        fill="var(--coral)"
        opacity="0.75"
      />
      <path
        d="M34 154c0-3 3-5 6-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-6-2-6-5Z"
        {...ink}
        strokeWidth="1.2"
      />

      {/* small bird, character touch */}
      <path
        d="M46 78c2.6-2.6 5-2.6 7 0 2-2.6 4.4-2.6 7 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* ground */}
      <path
        d="M6 184C46 178 78 188 108 184 140 180 168 188 194 182"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
