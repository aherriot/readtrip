const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CometIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* deep space wash */}
      <path
        d="M6 100C6 60 6 30 6 10C60 6 140 6 194 10C194 60 194 140 194 190C140 194 60 194 6 190Z"
        fill="var(--violet)"
        opacity="0.1"
      />

      {/* stars scattered */}
      <path
        d="M30 140c.6-1.4 2.4-1.4 2.4.6s-2 2-2.4-.6Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />
      <path
        d="M150 160c.5-1.2 2.1-1.2 2.1.5s-1.7 1.7-2.1-.5Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />
      <path
        d="M170 40c.5-1.2 2.1-1.2 2.1.5s-1.7 1.7-2.1-.5Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />
      <path
        d="M50 60c.5-1.2 2.1-1.2 2.1.5s-1.7 1.7-2.1-.5Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />
      <path
        d="M120 30c.5-1.2 2.1-1.2 2.1.5s-1.7 1.7-2.1-.5Z"
        fill="var(--surface-ink)"
        opacity="0.4"
      />
      <path
        d="M20 30c.5-1.2 2.1-1.2 2.1.5s-1.7 1.7-2.1-.5Z"
        fill="var(--surface-ink)"
        opacity="0.4"
      />

      {/* small ringed planet in the distance */}
      <path
        d="M158 150c5-1 10 3 10 8 .5 5-4 9-10 8-5 1-10-3-10-8 0-4 4-7 10-8Z"
        fill="var(--sky)"
        opacity="0.6"
      />
      <path
        d="M158 150c5-1 10 3 10 8 .5 5-4 9-10 8-5 1-10-3-10-8 0-4 4-7 10-8Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path
        d="M142 158c6-6 26-4 30 1-6 4-26 3-30-1Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.7"
      />

      {/* tail — long sweeping curves fanning from the head, one winding path each */}
      <path
        d="M118 92C96 82 68 76 40 78"
        stroke="var(--sky)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M122 100C100 96 70 96 44 104"
        stroke="var(--coral)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M120 108C100 110 74 116 52 128"
        stroke="var(--sun)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M118 92C96 82 68 76 40 78M122 100C100 96 70 96 44 104M120 108C100 110 74 116 52 128"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* comet head — one continuous irregular rock silhouette, not a circle */}
      <path
        d="M134 84C144 80 154 84 158 92C162 100 158 110 150 114C158 118 158 128 150 132C142 136 130 132 126 124C118 128 108 122 108 112C108 102 116 96 124 96C122 90 128 86 134 84Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace */}
      <path
        d="M135 85C145 81 155 85 159 93C163 101 159 111 151 115C159 119 159 129 151 133C143 137 131 133 127 125C119 129 109 123 109 113C109 103 117 97 125 97C123 91 129 87 135 85Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* crater texture, uneven */}
      <path
        d="M126 100q4-3 8 0M140 96q4-3 8 1M132 116q4-3 7 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* bright glow around the head */}
      <path
        d="M132 82c14-2 26 6 30 18 4 12-2 24-14 30"
        {...ink}
        strokeWidth="1"
        opacity="0.3"
      />

      {/* sparkle */}
      <path
        d="M60 40c.6-2.6 2.4-2.6 2.6 0 .2 2.6-2 2.6-2.6 0Zm-4-1c2.6-.6 2.6-2.4 0-2.6-2.6-.2-2.6 2-0 2.6Zm8 0c2.6.6 2.6 2.4 0 2.6-2.6.2-2.6-2 0-2.6Z"
        fill="var(--sun)"
        opacity="0.75"
      />
    </svg>
  );
}
