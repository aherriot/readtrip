const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function TelescopeIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* night wash */}
      <path
        d="M6 60C34 40 70 30 108 36C142 30 172 42 194 58"
        fill="var(--violet)"
        opacity="0.14"
        stroke="none"
      />

      {/* moon */}
      <path
        d="M52 46c9-9 22-9 30-1-11-2-21 3-25 12-4 9 0 18 8 23-12 1-22-6-24-17-2-7 3-12 11-17Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M52 46c9-9 22-9 30-1-11-2-21 3-25 12-4 9 0 18 8 23-12 1-22-6-24-17-2-7 3-12 11-17Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* ringed planet — hand-drawn, not a perfect circle */}
      <path
        d="M162 43c6-1 12 4 12 9 1 6-5 11-12 10-6 1-12-4-12-10 0-5 5-8 12-9Z"
        fill="var(--violet)"
        opacity="0.75"
      />
      <path
        d="M162 43c6-1 12 4 12 9 1 6-5 11-12 10-6 1-12-4-12-10 0-5 5-8 12-9Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path
        d="M144 52c6-7 30-5 36 1-6 5-30 4-36-1Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.8"
      />

      {/* stars — tiny blobs, not <circle> */}
      <path
        d="M97 29c.5-1 2-1 2 .5s-1.6 1.4-2 .3Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />
      <path
        d="M127 23c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />
      <path
        d="M29 23c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />

      {/* tube + shaft, one continuous stroke from tripod pivot to objective */}
      <path
        d="M104 143C103 128 103 118 105 108C119 88 134 67 149 46"
        stroke="var(--surface-ink)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M129 84c4 3 8 3 11 0" {...ink} strokeWidth="1.2" opacity="0.5" />
      <path
        d="M143 52c3 3 7 3 10 0"
        fill="none"
        stroke="var(--sky)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* eyepiece bulge at the bend */}
      <path
        d="M98 103c2-3 8-3 10 0 1.5 3-1.5 7-5 7s-6.5-4-5-7Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* tripod */}
      <path
        d="M104 143c-13 7-23 17-27 26M104 143c14 5 25 15 29 25M104 143C102 152 106 168 103 178"
        {...ink}
        strokeWidth="2"
      />
    </svg>
  );
}
