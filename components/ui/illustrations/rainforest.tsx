const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function RainforestIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* back canopy */}
      <path
        d="M8 62C28 34 62 22 100 26C140 22 172 36 192 64C176 76 150 70 128 60C104 72 76 72 54 60C34 70 20 72 8 62Z"
        fill="var(--leaf)"
        opacity="0.28"
      />
      <path
        d="M8 62C28 34 62 22 100 26C140 22 172 36 192 64"
        {...ink}
        strokeWidth="1.6"
        opacity="0.6"
      />

      {/* trunks — bowed, not ruled straight */}
      <path
        d="M39 168C42 143 37 108 41 80M99 168C102 138 97 100 101 70M159 168C162 145 156 112 161 86"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M40 120 26 108M100 108 84 96M160 124 146 112"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* vines */}
      <path
        d="M64 40c2 14-4 26-2 42M136 46c-2 14 4 26 2 40"
        {...ink}
        strokeWidth="1.3"
        opacity="0.6"
      />

      {/* front canopy clumps */}
      <path
        d="M18 76c-6-14 6-26 20-24 0-14 18-20 26-8 8-10 24-4 22 8 12-4 22 6 16 16-10 10-30 8-40 0-12 8-28 8-36 0-4 6-6 8-8 8Z"
        fill="var(--leaf)"
        opacity="0.55"
      />
      <path
        d="M18 76c-6-14 6-26 20-24 0-14 18-20 26-8 8-10 24-4 22 8 12-4 22 6 16 16-10 10-30 8-40 0-12 8-28 8-36 0-4 6-6 8-8 8Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M108 68c-4-12 6-22 18-20 4-10 18-12 22-2 10-2 16 8 10 14-8 8-24 8-32 2-8 6-16 8-18 6Z"
        fill="var(--leaf)"
        opacity="0.45"
      />
      <path
        d="M108 68c-4-12 6-22 18-20 4-10 18-12 22-2 10-2 16 8 10 14-8 8-24 8-32 2-8 6-16 8-18 6Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* toucan */}
      <g transform="translate(0 2)">
        <path
          d="M126 108c0-6 5-10 11-10s11 4 11 10-5 9-11 9-11-3-11-9Z"
          fill="var(--surface-ink)"
          opacity="0.85"
        />
        <path
          d="M147 104c6-2 12 0 14 4-2 3-9 5-14 3Z"
          fill="var(--sun)"
          opacity="0.95"
        />
        <path
          d="M147 104c6-2 12 0 14 4-2 3-9 5-14 3Z"
          {...ink}
          strokeWidth="1.2"
        />
        <path
          d="M131 104c.6-.8 2-.6 2 .6s-1.7 1.4-2.3.2Z"
          fill="var(--paper)"
        />
      </g>
      <path d="M110 116h40" {...ink} strokeWidth="2" />

      {/* ferns */}
      <path
        d="M20 168c-2-10 2-18 8-20M20 168c-4-8-2-18 4-22M20 168c1-10 8-16 14-16"
        {...ink}
        strokeWidth="1.4"
        stroke="var(--leaf)"
      />
      <path
        d="M176 168c2-10-2-18-8-20M176 168c4-8 2-18-4-22"
        {...ink}
        strokeWidth="1.4"
        stroke="var(--leaf)"
      />
      <path
        d="M4 168C40 162 70 172 100 168 130 164 162 174 196 167"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
