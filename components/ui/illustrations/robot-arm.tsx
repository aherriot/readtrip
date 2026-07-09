const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function RobotArmIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* workshop wash */}
      <path
        d="M8 40C40 30 70 34 100 30C132 34 162 28 192 38"
        fill="var(--violet)"
        opacity="0.14"
      />

      {/* base plinth */}
      <path
        d="M60 176c2-14 0-24 4-34 12-4 24-4 36 0 4 10 2 20 4 34Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M60 176c2-14 0-24 4-34 12-4 24-4 36 0 4 10 2 20 4 34Z"
        fill="var(--surface-ink)"
        opacity="0.08"
      />
      <path d="M66 156q17 4 34-1" {...ink} strokeWidth="1.2" opacity="0.4" />

      {/* shoulder swivel joint */}
      <path
        d="M84 142c0-6 5-10 12-10 7 0 12 4 12 10 0 6-5 10-12 10-7 0-12-4-12-10Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M84 142c0-6 5-10 12-10 7 0 12 4 12 10 0 6-5 10-12 10-7 0-12-4-12-10Z"
        {...ink}
        strokeWidth="1.9"
      />

      {/* first arm segment — one continuous stroke, thick */}
      <path
        d="M92 134C82 116 74 100 82 80"
        stroke="var(--surface-ink)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M92 134C82 116 74 100 82 80"
        stroke="var(--sun)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* elbow joint */}
      <path
        d="M73 78c0-5 4-9 10-9 6 0 10 4 10 9 0 5-4 9-10 9-6 0-10-4-10-9Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M73 78c0-5 4-9 10-9 6 0 10 4 10 9 0 5-4 9-10 9-6 0-10-4-10-9Z"
        {...ink}
        strokeWidth="1.8"
      />

      {/* second arm segment, angling out toward the gripper */}
      <path
        d="M78 70C92 58 108 50 128 48"
        stroke="var(--surface-ink)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M78 70C92 58 108 50 128 48"
        stroke="var(--sun)"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* wrist joint */}
      <path
        d="M120 46c0-5 4-8 8-8 5 0 8 3 8 8 0 5-3 8-8 8-4 0-8-3-8-8Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M120 46c0-5 4-8 8-8 5 0 8 3 8 8 0 5-3 8-8 8-4 0-8-3-8-8Z"
        {...ink}
        strokeWidth="1.7"
      />

      {/* gripper claws, hand-varied not mirrored */}
      <path
        d="M136 42c8-4 16-4 22 1-4 6-10 9-16 8"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M136 50c9 2 17 0 22-6-5 5-12 7-18 6"
        {...ink}
        strokeWidth="1.9"
      />

      {/* small block being picked up */}
      <path
        d="M156 38c6-1 12 1 13 6 1 5-4 9-10 8-6 1-11-2-11-7 0-4 3-6 8-7Z"
        fill="var(--coral)"
        opacity="0.6"
      />
      <path
        d="M156 38c6-1 12 1 13 6 1 5-4 9-10 8-6 1-11-2-11-7 0-4 3-6 8-7Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* control panel */}
      <path
        d="M28 168c8-4 20-4 26 2 2 6-2 10-13 10-11 0-16-6-13-12Z"
        fill="var(--leaf)"
        opacity="0.4"
      />
      <path
        d="M28 168c8-4 20-4 26 2 2 6-2 10-13 10-11 0-16-6-13-12Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M34 172c1.4-1.2 3-1 3.4.6.4 1.6-1.4 2.4-3.4 1.8ZM44 172c1.4-1.2 3-1 3.4.6.4 1.6-1.4 2.4-3.4 1.8Z"
        fill="var(--sun)"
        opacity="0.85"
      />

      {/* floor */}
      <path
        d="M8 182C46 176 80 186 108 182 140 178 168 186 194 180"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
