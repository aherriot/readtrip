const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CoralReefIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* water wash */}
      <path
        d="M6 40C40 24 80 16 120 22C152 18 178 28 194 42 194 100 194 150 194 190 130 194 66 194 6 190Z"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* light rays from surface */}
      <path
        d="M40 18c4 20 6 44 4 68M96 12c2 24 0 50-3 76M150 20c-2 22-1 46 3 70"
        {...ink}
        strokeWidth="1.2"
        opacity="0.3"
      />

      {/* fish, one continuous silhouette with a notched tail */}
      <path
        d="M92 66c10-6 22-6 29 2 5-3 10-3 12 1-2 4-7 4-12 1-7 8-19 8-29 2-4 2-8 1-9-2 3-1 6-2 9-4Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M92 66c10-6 22-6 29 2 5-3 10-3 12 1-2 4-7 4-12 1-7 8-19 8-29 2-4 2-8 1-9-2 3-1 6-2 9-4Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M104 68c1-1 3-1 3.4.5.4 1.6-1.6 2.2-3.4 1.5Z"
        fill="var(--surface-ink)"
        opacity="0.7"
      />

      {/* bubbles */}
      <path
        d="M150 50c1.2-1.1 2.6-1 2.8.6.2 1.6-1.8 2.2-2.8 1M158 62c1-1 2.2-.8 2.4.6.2 1.4-1.4 1.8-2.4.8M56 30c1-1 2.2-.8 2.4.6.2 1.4-1.4 1.8-2.4.8"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* sea floor */}
      <path
        d="M6 190C40 184 76 194 110 190 144 186 168 194 194 188"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 192C40 186 76 196 110 192 144 188 168 196 194 190 194 197 190 198 100 198 12 198 6 197 6 192Z"
        fill="var(--sun)"
        opacity="0.16"
      />

      {/* tall branching coral — one winding path, no separate blobs */}
      <path
        d="M50 190C48 168 52 150 44 132C38 148 34 158 22 160C34 166 42 158 46 144C42 164 46 178 52 190"
        fill="var(--coral)"
        opacity="0.6"
      />
      <path
        d="M50 190C48 168 52 150 44 132C38 148 34 158 22 160C34 166 42 158 46 144C42 164 46 178 52 190"
        {...ink}
        strokeWidth="1.8"
      />

      {/* fan coral — sweeping bulges, not many small scallops */}
      <path
        d="M96 190c-4-20-2-38 6-50 10 6 14 22 10 40-2-10-6-18-10-20 2 10 1 20-6 30Z"
        fill="var(--orchid)"
        opacity="0.55"
      />
      <path
        d="M96 190c-4-20-2-38 6-50 10 6 14 22 10 40-2-10-6-18-10-20 2 10 1 20-6 30Z"
        {...ink}
        strokeWidth="1.7"
      />

      {/* brain coral mound */}
      <path
        d="M140 190c-8-2-13-9-12-17 1-9 9-15 18-14 8-8 21-4 23 6 8 1 12 9 8 16-3 6-11 8-17 5-6 6-16 7-20 4Z"
        fill="var(--leaf)"
        opacity="0.55"
      />
      <path
        d="M140 190c-8-2-13-9-12-17 1-9 9-15 18-14 8-8 21-4 23 6 8 1 12 9 8 16-3 6-11 8-17 5-6 6-16 7-20 4Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M136 176q6-4 12 0M150 168q6-3 12 1M144 184q6-3 12 0"
        {...ink}
        strokeWidth="1.1"
        opacity="0.45"
      />

      {/* seaweed strands */}
      <path
        d="M170 190c-1-14 3-24-2-36M178 190c1-12-3-22 1-32"
        {...ink}
        strokeWidth="1.6"
        opacity="0.7"
      />
    </svg>
  );
}
