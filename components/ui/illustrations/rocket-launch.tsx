const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function RocketLaunchIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* stars */}
      <path
        d="M40 30c.4 2.4 1.3 3.3 3.7 3.7-2.4.4-3.3 1.3-3.7 3.7-.4-2.4-1.3-3.3-3.7-3.7 2.4-.4 3.3-1.3 3.7-3.7Z"
        fill="var(--sun)"
        opacity="0.8"
      />
      <path
        d="M160 24c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3Z"
        fill="var(--sun)"
        opacity="0.7"
      />
      <path
        d="M150 60c.3 1.8 1 2.4 2.8 2.8-1.8.4-2.5 1-2.8 2.8-.4-1.8-1-2.4-2.8-2.8 1.8-.4 2.4-1 2.8-2.8Z"
        fill="var(--sun)"
        opacity="0.6"
      />
      <path
        d="M54 55c.5-1 1.8-1 1.8.5s-1.4 1.4-1.8.4Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />
      <path
        d="M131 42c.4-.9 1.6-.9 1.6.4s-1.2 1.2-1.6.3Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />

      {/* rocket body — bowed, not a mirrored curve */}
      <path
        d="M99 26C113 44 118 76 113 107H85C83 73 89 45 99 26Z"
        fill="var(--sky)"
        opacity="0.16"
      />
      <path
        d="M99 26C113 44 118 76 113 107H85C83 73 89 45 99 26Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M100 61c6-1 12 3 12 9 1 6-5 11-12 10-6 1-11-4-11-10 0-5 5-8 11-9Z"
        fill="var(--sky)"
        opacity="0.55"
      />
      <path
        d="M100 61c6-1 12 3 12 9 1 6-5 11-12 10-6 1-11-4-11-10 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* fins — deliberately not mirrored */}
      <path d="M85 95 64 119 87 111Z" fill="var(--coral)" opacity="0.8" />
      <path d="M85 95 64 119 87 111Z" {...ink} strokeWidth="1.6" />
      <path d="M115 97 136 116 113 113Z" fill="var(--coral)" opacity="0.8" />
      <path d="M115 97 136 116 113 113Z" {...ink} strokeWidth="1.6" />
      <path d="M86 105C93 107 106 106 114 106" {...ink} strokeWidth="1.8" />

      {/* flame */}
      <path
        d="M90 108c-4 12-8 24-2 36 4-8 6-8 8 0 6-12 2-24-6-36Z"
        fill="var(--sun)"
        opacity="0.9"
      />
      <path
        d="M110 108c4 12 8 24 2 36-4-8-6-8-8 0-6-12-2-24 6-36Z"
        fill="var(--coral)"
        opacity="0.85"
      />

      {/* launch smoke */}
      <path
        d="M40 168c-6-8 2-16 12-14-2-10 10-16 18-8 8-8 20-2 18 6 10-2 14 8 6 14-10 8-26 6-34-2-10 8-22 8-20 4Z"
        {...ink}
        strokeWidth="1.4"
        opacity="0.4"
      />
      <path
        d="M120 172c-4-6 2-12 10-10 0-8 12-12 16-4 8-4 16 2 12 8-6 6-18 6-24 0-8 6-14 8-14 6Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.35"
      />

      <path
        d="M6 172C42 166 72 176 100 172 130 168 162 176 194 170"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
