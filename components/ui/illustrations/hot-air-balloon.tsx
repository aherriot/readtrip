const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function HotAirBalloonIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 40C34 24 68 16 100 20C134 16 166 26 194 42"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* distant clouds */}
      <path
        d="M18 100c-3-5 2-9 7-8-1-6 7-9 11-4 5-4 12 0 11 5 5 0 6 6 2 8-4 3-11 2-14-1-5 3-11 1-13-3Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M160 130c-2-4 2-7 5-6 0-5 6-7 9-3 4-3 9 0 8 4 4 0 5 5 1 6-3 2-8 1-10-1-4 2-8 0-10-3Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.35"
      />

      {/* birds */}
      <path
        d="M150 36c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* envelope — one continuous silhouette, hand-bowed teardrop */}
      <path
        d="M100 24C124 26 140 46 138 72C136 96 122 112 108 118C104 122 96 122 92 118C78 112 64 96 62 72C60 46 76 26 100 24Z"
        fill="var(--coral)"
        opacity="0.45"
      />
      <path
        d="M100 24C124 26 140 46 138 72C136 96 122 112 108 118C104 122 96 122 92 118C78 112 64 96 62 72C60 46 76 26 100 24Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace */}
      <path
        d="M100 26C123 28 138 47 136 72C134 95 121 111 107 117"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* gore panel seams, hand-run from top to bottom */}
      <path
        d="M100 24C94 52 94 88 100 120M100 24C88 52 84 88 92 118M100 24C112 52 116 88 108 118M100 24C82 52 76 84 88 112M100 24C118 52 124 84 112 112"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* accent color band */}
      <path
        d="M64 70C76 74 124 74 136 70"
        stroke="var(--sun)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* basket + rigging */}
      <path
        d="M92 118C90 124 88 130 90 136M108 118C110 124 112 130 110 136"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M86 136c0-5 6-8 14-8 8 0 14 3 14 8 0 6-2 12-2 18-8 2-16 2-24 0 0-6-2-12-2-18Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M86 136c0-5 6-8 14-8 8 0 14 3 14 8 0 6-2 12-2 18-8 2-16 2-24 0 0-6-2-12-2-18Z"
        fill="var(--sun)"
        opacity="0.2"
      />
      <path
        d="M88 140q12 3 24 0M87 148q13 3 26 0"
        {...ink}
        strokeWidth="1.1"
        opacity="0.5"
      />

      {/* traveler waving from the basket */}
      <path
        d="M96 132c0-2 2-4 4-4 2 0 4 2 4 4 0 2-2 3-4 3-2 0-4-1-4-3Z"
        fill="var(--sun)"
        opacity="0.75"
      />
      <path d="M104 134c3-2 6-2 8 0" {...ink} strokeWidth="1.3" />

      {/* horizon + hills */}
      <path
        d="M6 178C40 168 74 182 104 176 136 170 168 182 194 174"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M6 180C40 170 74 184 104 178 136 172 168 184 194 176 194 190 188 194 100 194 12 194 6 190 6 180Z"
        fill="var(--leaf)"
        opacity="0.16"
      />
    </svg>
  );
}
