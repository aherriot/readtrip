const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function DinosaurIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* far legs (behind) */}
      <path
        d="M88 138c-1 12-2 22-3 32M122 136c1 12 2 22 2 32"
        {...ink}
        strokeWidth="7"
        opacity="0.55"
      />

      {/* tail */}
      <path d="M64 112C46 108 28 116 14 138" {...ink} strokeWidth="4" />

      {/* body + neck, one continuous silhouette (not two stitched shapes) */}
      <path
        d="M60 121C58 99 77 82 101 82C114 82 124 87 132 96C137 84 143 71 150 60C154 53 159 49 163 51C165 55 162 61 158 67C152 78 144 90 136 101C142 106 146 113 146 121C147 138 128 152 106 153C82 154 62 141 60 121Z"
        fill="var(--leaf)"
        opacity="0.2"
      />
      <path
        d="M60 121C58 99 77 82 101 82C114 82 124 87 132 96C137 84 143 71 150 60C154 53 159 49 163 51C165 55 162 61 158 67C152 78 144 90 136 101C142 106 146 113 146 121C147 138 128 152 106 153C82 154 62 141 60 121Z"
        {...ink}
        strokeWidth="2.3"
      />

      {/* back plates */}
      <path
        d="M50 106 44 96 58 98M75 82 70 70 84 76M100 78 96 65 110 72M126 82 123 70 136 77"
        {...ink}
        strokeWidth="1.5"
        opacity="0.75"
      />

      {/* head, a small blob at the end of the neck */}
      <path
        d="M162 44c3-5 10-5 13 0 2 4-1.5 9-6.5 9S159 48 162 44Z"
        fill="var(--leaf)"
        opacity="0.3"
      />
      <path
        d="M162 44c3-5 10-5 13 0 2 4-1.5 9-6.5 9S159 48 162 44Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M170 44c.5-1 2-1 2 .3s-1.6 1.5-2.2.4Z"
        fill="var(--surface-ink)"
      />

      {/* near legs */}
      <path
        d="M80 140c-1 12-2 22-4 32M116 138c2 12 3 22 3 32"
        {...ink}
        strokeWidth="8"
      />
      <path d="M72 172h10M116 172h11" {...ink} strokeWidth="5" opacity="0.9" />

      {/* spots */}
      <path
        d="M85 108h.01M100 122h.01M70 100h.01"
        {...ink}
        strokeWidth="3"
        opacity="0.5"
      />

      {/* ground + grass */}
      <path
        d="M6 170C40 164 70 174 100 170 132 166 164 174 194 168"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M24 170c-1-5 2-8 5-8 1-4 6-5 8-1M170 168c-1-5 3-7 6-6"
        {...ink}
        strokeWidth="1.4"
        stroke="var(--leaf)"
        opacity="0.9"
      />
    </svg>
  );
}
