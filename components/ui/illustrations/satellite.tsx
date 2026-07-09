const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SatelliteIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* night wash */}
      <path
        d="M6 40C34 24 68 16 100 20C134 16 166 26 194 42"
        fill="var(--violet)"
        opacity="0.16"
      />

      {/* Earth curve, background, lower edge */}
      <path
        d="M0 200C10 160 46 138 90 140C130 142 158 162 172 200Z"
        fill="var(--sky)"
        opacity="0.3"
      />
      <path
        d="M4 172C24 148 56 136 90 140C122 144 148 158 166 182"
        {...ink}
        strokeWidth="1.6"
        opacity="0.55"
      />
      <path
        d="M40 156q10-3 18 2M78 148q11-2 20 3"
        {...ink}
        strokeWidth="1.1"
        opacity="0.35"
      />

      {/* stars */}
      <path
        d="M30 40c.6-1.4 2.4-1.4 2.4.6s-2 2-2.4-.6Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />
      <path
        d="M150 30c.5-1.2 2.1-1.2 2.1.5s-1.7 1.7-2.1-.5Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />
      <path
        d="M170 60c.5-1.2 2.1-1.2 2.1.5s-1.7 1.7-2.1-.5Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />
      <path
        d="M60 24c.5-1.2 2.1-1.2 2.1.5s-1.7 1.7-2.1-.5Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />

      {/* orbit path */}
      <path
        d="M20 96c14-24 46-38 78-32"
        {...ink}
        strokeWidth="1.2"
        opacity="0.35"
      />

      {/* satellite body — one hand-drawn box, no <rect> */}
      <path
        d="M84 84C83 78 86 74 92 74C100 73 108 74 114 76C118 78 118 92 115 96C108 99 98 99 90 97C85 95 84 90 84 84Z"
        fill="var(--sun)"
        opacity="0.3"
      />
      <path
        d="M84 84C83 78 86 74 92 74C100 73 108 74 114 76C118 78 118 92 115 96C108 99 98 99 90 97C85 95 84 90 84 84Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M90 78q10 3 20-1M88 92q11 3 22-1"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* dish antenna */}
      <path
        d="M114 78c8-4 16-2 20 5-8 1-14 4-18 9-3-5-3-10-2-14Z"
        fill="var(--sky)"
        opacity="0.55"
      />
      <path
        d="M114 78c8-4 16-2 20 5-8 1-14 4-18 9-3-5-3-10-2-14Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path d="M116 92c4 4 6 9 6 15" {...ink} strokeWidth="1.3" />

      {/* left solar panel */}
      <path
        d="M84 82C70 80 56 80 44 82C42 87 42 91 44 96C56 98 70 98 84 96"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M84 82C70 80 56 80 44 82C42 87 42 91 44 96C56 98 70 98 84 96"
        fill="var(--coral)"
        opacity="0.45"
      />
      <path
        d="M56 81q1 8 0 16M68 82q1 7 0 14"
        {...ink}
        strokeWidth="1"
        opacity="0.5"
      />
      <path d="M84 84C81 84 79 87 82 90" {...ink} strokeWidth="1.6" />

      {/* right solar panel — hand-varied, not mirrored */}
      <path
        d="M115 76C130 74 146 75 158 79C161 84 160 89 157 94C145 96 130 95 115 92"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M115 76C130 74 146 75 158 79C161 84 160 89 157 94C145 96 130 95 115 92"
        fill="var(--coral)"
        opacity="0.45"
      />
      <path
        d="M132 76q2 8 1 16M144 78q2 7 1 14"
        {...ink}
        strokeWidth="1"
        opacity="0.5"
      />
      <path d="M115 78C118 79 119 82 116 85" {...ink} strokeWidth="1.6" />

      {/* small comet streaking behind */}
      <path
        d="M158 118C148 112 138 110 128 112"
        {...ink}
        strokeWidth="1.4"
        opacity="0.45"
      />
      <path
        d="M158 118c2-2 5-2 5 1 0 3-3 3-5-1Z"
        fill="var(--sun)"
        opacity="0.8"
      />
    </svg>
  );
}
