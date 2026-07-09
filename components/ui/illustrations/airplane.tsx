const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function AirplaneIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 90C34 74 68 66 100 70C134 66 166 76 194 92"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* sun */}
      <path
        d="M162 34c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M162 34c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* clouds */}
      <path
        d="M30 130c-3-5 2-9 7-8-1-6 7-9 11-4 5-4 12 0 11 5 5 0 6 6 2 8-4 3-11 2-14-1-5 3-11 1-13-3Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.4"
      />
      <path
        d="M140 150c-2-4 2-7 5-6 0-5 6-7 9-3 4-3 9 0 8 4 4 0 5 5 1 6-3 2-8 1-10-1-4 2-8 0-10-3Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.35"
      />

      {/* fuselage — one continuous silhouette, nose to tail */}
      <path
        d="M22 108C34 100 50 96 64 98C88 84 116 76 142 78C154 80 160 88 156 96C150 108 138 116 124 120C106 122 88 122 70 118C56 128 40 132 24 128C18 122 18 114 22 108Z"
        fill="var(--sky)"
        opacity="0.35"
      />
      <path
        d="M22 108C34 100 50 96 64 98C88 84 116 76 142 78C154 80 160 88 156 96C150 108 138 116 124 120C106 122 88 122 70 118C56 128 40 132 24 128C18 122 18 114 22 108Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace */}
      <path
        d="M23 107C35 99 51 95 65 97C89 83 117 75 143 77C155 79 161 87 157 95"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* cockpit window */}
      <path
        d="M40 106c1-4 5-6 9-5 4-1 7 1 7 5 1 4-3 7-8 6-4 1-8-2-8-6Z"
        fill="var(--sun)"
        opacity="0.55"
      />
      <path
        d="M40 106c1-4 5-6 9-5 4-1 7 1 7 5 1 4-3 7-8 6-4 1-8-2-8-6Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* cabin windows, uneven spacing */}
      <path
        d="M68 100c1-1 3-1 3 1s-2 2-3 0M80 98c1-1 3-1 3 1s-2 2-3 0M92 96c1-1 3-1 3 1s-2 2-3 0M104 94c1-1 3-1 3 1s-2 2-3 0"
        {...ink}
        strokeWidth="1.1"
        opacity="0.5"
      />

      {/* wing — swept, one continuous shape not mirrored */}
      <path
        d="M92 108c6 10 16 20 32 26-4-12-6-24-4-36-12 2-21 6-28 10Z"
        fill="var(--coral)"
        opacity="0.55"
      />
      <path
        d="M92 108c6 10 16 20 32 26-4-12-6-24-4-36-12 2-21 6-28 10Z"
        {...ink}
        strokeWidth="1.9"
      />

      {/* tail fin */}
      <path
        d="M132 84c8-4 16-6 22-4-4 8-10 14-18 17-2-4-3-9-4-13Z"
        fill="var(--leaf)"
        opacity="0.55"
      />
      <path
        d="M132 84c8-4 16-6 22-4-4 8-10 14-18 17-2-4-3-9-4-13Z"
        {...ink}
        strokeWidth="1.8"
      />

      {/* small horizontal stabilizer */}
      <path
        d="M124 118c6 4 12 8 20 8-3-6-7-11-13-14Z"
        fill="var(--leaf)"
        opacity="0.4"
      />
      <path
        d="M124 118c6 4 12 8 20 8-3-6-7-11-13-14Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* contrail */}
      <path
        d="M18 120C10 122 4 122 -2 120"
        {...ink}
        strokeWidth="1.6"
        opacity="0.4"
      />

      {/* ground far below */}
      <path
        d="M6 190C40 184 74 194 100 190 132 186 164 194 194 188"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 192C40 186 74 196 100 192 132 188 164 196 194 190 194 197 190 198 100 198 12 198 6 197 6 192Z"
        fill="var(--leaf)"
        opacity="0.14"
      />
    </svg>
  );
}
