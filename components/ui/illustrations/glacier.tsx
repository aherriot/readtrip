const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function GlacierIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* pale winter sky */}
      <path
        d="M6 60C34 44 68 36 100 40C134 36 166 46 194 62"
        fill="var(--sky)"
        opacity="0.22"
      />

      {/* low sun */}
      <path
        d="M42 34c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.7"
      />
      <path
        d="M42 34c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* main glacier mass — one continuous jagged silhouette */}
      <path
        d="M12 154C24 128 30 102 52 84C58 96 54 110 64 120C74 100 70 78 88 62C96 78 90 98 102 112C114 92 108 68 128 54C132 74 122 96 138 112C150 96 146 76 162 66C166 88 156 110 172 128C180 140 184 148 188 156C150 162 108 158 72 160C52 162 30 158 12 154Z"
        fill="var(--sky)"
        opacity="0.3"
      />
      <path
        d="M12 154C24 128 30 102 52 84C58 96 54 110 64 120C74 100 70 78 88 62C96 78 90 98 102 112C114 92 108 68 128 54C132 74 122 96 138 112C150 96 146 76 162 66C166 88 156 110 172 128C180 140 184 148 188 156C150 162 108 158 72 160C52 162 30 158 12 154Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace on the skyline only */}
      <path
        d="M13 153C25 128 31 103 53 85C59 97 55 111 65 121C75 101 71 79 89 63C97 79 91 99 103 113C115 93 109 69 129 55C133 75 123 97 139 113C151 97 147 77 163 67"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* crevasse cracks — uneven, hand-run */}
      <path
        d="M64 122q6 8 2 18M100 114q6 9 1 20M138 114q6 8 2 18"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
      <path
        d="M40 108q10 4 20 0M150 96q9 4 18 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* ice-blue shading facets */}
      <path
        d="M88 62c8 16 2 34 14 50-14-4-22-18-22-34 0-6 3-12 8-16Z"
        fill="var(--sky)"
        opacity="0.35"
      />
      <path
        d="M128 54c4 20-6 40 10 58-16-2-26-18-24-36 1-9 7-17 14-22Z"
        fill="var(--sky)"
        opacity="0.3"
      />

      {/* iceberg floating in the water */}
      <path
        d="M158 158c4-10 14-12 20-6 8-2 14 4 12 10-8 4-18 4-24 0-4 2-6 0-8-4Z"
        fill="var(--sky)"
        opacity="0.4"
      />
      <path
        d="M158 158c4-10 14-12 20-6 8-2 14 4 12 10-8 4-18 4-24 0-4 2-6 0-8-4Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* water */}
      <path
        d="M6 160C40 154 74 164 100 160 132 156 164 164 194 158"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 162C40 156 74 166 100 162 132 158 164 166 194 160 194 176 190 180 100 180 12 180 6 176 6 162Z"
        fill="var(--sky)"
        opacity="0.24"
      />
      <path
        d="M20 170q9 4 18 0M140 172q9 4 18 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* small penguin */}
      <path
        d="M28 158c-1-6 3-10 8-10 5 0 9 4 8 10-1 4-6 6-8 6s-7-2-8-6Z"
        fill="var(--surface-ink)"
        opacity="0.75"
      />
      <path
        d="M28 158c-1-6 3-10 8-10 5 0 9 4 8 10-1 4-6 6-8 6s-7-2-8-6Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M34 152c0-1.4 1.4-2 2.4-1 1 1 .4 2.6-1 2.8-1.4.2-1.6-1-1.4-1.8Z"
        fill="var(--sun)"
        opacity="0.8"
      />
    </svg>
  );
}
