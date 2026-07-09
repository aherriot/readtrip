const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function BicycleIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 46C34 32 68 24 100 28C134 24 164 34 192 48"
        fill="var(--sky)"
        opacity="0.18"
      />

      {/* sun */}
      <path
        d="M156 30c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M156 30c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* rear wheel — hand-drawn spoked wheel, not <circle> */}
      <path
        d="M42 150c0-16 13-29 29-29 16 0 29 13 29 29 0 16-13 29-29 29-16 0-29-13-29-29Z"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M71 121C55 122 42 135 42 150c0 16 13 29 29 29 16 0 29-13 29-29 0-15-12-27-27-29Z"
        {...ink}
        strokeWidth="1"
        opacity="0.35"
      />
      <path
        d="M71 150l-20-14M71 150l24-10M71 150l6 24M71 150l-8 23M71 150l24 6M71 150l-26 4"
        {...ink}
        strokeWidth="1.2"
        opacity="0.6"
      />
      <path
        d="M71 144c3 0 6 3 6 6 0 3-3 6-6 6-3 0-6-3-6-6 0-3 3-6 6-6Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />

      {/* front wheel — hand-varied, not a copy of the rear */}
      <path
        d="M96 152c0-17 14-30 31-30 17 0 31 13 31 30 0 17-14 30-31 30-17 0-31-13-31-30Z"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M127 122c-16 1-29 14-29 30 0 17 14 30 31 30 15 0 27-11 30-25Z"
        {...ink}
        strokeWidth="1"
        opacity="0.35"
      />
      <path
        d="M127 152l-22-13M127 152l25-9M127 152l4 25M127 152l-9 24M127 152l25 4M127 152l-27 6"
        {...ink}
        strokeWidth="1.2"
        opacity="0.6"
      />
      <path
        d="M127 146c3 0 6 3 6 6 0 3-3 6-6 6-3 0-6-3-6-6 0-3 3-6 6-6Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />

      {/* frame — one continuous path, seat to pedal to fork to handlebar */}
      <path
        d="M60 108C64 118 68 128 71 150C96 148 108 152 127 152C120 130 112 116 104 104C88 104 74 105 60 108Z"
        {...ink}
        strokeWidth="2.6"
      />
      <path d="M104 104C110 96 116 90 122 84" {...ink} strokeWidth="2.6" />
      <path
        d="M60 108C64 118 68 128 71 150"
        {...ink}
        strokeWidth="1"
        opacity="0.35"
      />

      {/* seat */}
      <path d="M60 108C58 100 60 92 58 84" {...ink} strokeWidth="1.9" />
      <path
        d="M52 82c2-3 12-4 15-1 2 3-2 6-8 6-5 0-8-3-7-5Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path
        d="M52 82c2-3 12-4 15-1 2 3-2 6-8 6-5 0-8-3-7-5Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* handlebar */}
      <path d="M122 84c-8 2-14 2-20 0" {...ink} strokeWidth="2" />
      <path d="M122 84C120 76 122 70 120 64" {...ink} strokeWidth="1.9" />

      {/* pedal + crank */}
      <path d="M96 150c2-6 8-9 14-8" {...ink} strokeWidth="1.6" />
      <path
        d="M107 140c4-2 8 0 8 3 0 3-4 5-8 3-3-1-3-4 0-6Z"
        fill="var(--leaf)"
        opacity="0.7"
      />
      <path
        d="M107 140c4-2 8 0 8 3 0 3-4 5-8 3-3-1-3-4 0-6Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* ground */}
      <path
        d="M6 190C40 184 74 194 100 190 132 186 160 194 194 188"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
