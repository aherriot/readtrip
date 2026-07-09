const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function WaterfallIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 46C34 30 68 22 100 26C134 22 166 32 194 48"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* sun */}
      <path
        d="M158 32c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M158 32c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* left cliff — one continuous silhouette */}
      <path
        d="M6 190C10 160 8 132 22 108C34 88 30 66 44 48C52 60 48 78 58 92C68 78 64 58 76 44C82 60 78 82 88 96C92 108 88 130 92 150C94 168 88 182 84 190Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M30 96q7 3 14 0M20 128q8 3 16-1M40 66q6 3 12 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M6 190C10 160 8 132 22 108C34 88 30 66 44 48C52 60 48 78 58 92C68 78 64 58 76 44C82 60 78 82 88 96C92 108 88 130 92 150C94 168 88 182 84 190Z"
        fill="var(--leaf)"
        opacity="0.12"
      />

      {/* right cliff — hand-varied, not a mirror */}
      <path
        d="M194 190C190 164 192 138 180 116C170 98 174 78 162 62C156 74 160 90 152 102C144 90 148 72 138 60C132 74 136 94 128 106C124 118 128 138 124 156C122 172 128 184 132 190Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M170 104q-7 3-14 0M180 136q-8 3-16-1"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M194 190C190 164 192 138 180 116C170 98 174 78 162 62C156 74 160 90 152 102C144 90 148 72 138 60C132 74 136 94 128 106C124 118 128 138 124 156C122 172 128 184 132 190Z"
        fill="var(--leaf)"
        opacity="0.12"
      />

      {/* falling water — a few long winding strands */}
      <path
        d="M96 96C94 118 98 140 92 162"
        stroke="var(--sky)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M110 92C112 116 108 138 114 160"
        stroke="var(--sky)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M96 96C94 118 98 140 92 162M110 92C112 116 108 138 114 160"
        {...ink}
        strokeWidth="1.6"
        opacity="0.6"
      />
      <path
        d="M100 100c2 20-2 40 0 58M106 106c-2 18 2 36-1 52"
        {...ink}
        strokeWidth="1"
        opacity="0.35"
      />

      {/* mist wash at the base */}
      <path
        d="M64 168C80 158 122 158 138 168C148 174 144 184 130 186C104 190 74 190 58 184C48 180 54 172 64 168Z"
        fill="var(--sky)"
        opacity="0.25"
      />

      {/* pool ground */}
      <path
        d="M6 190C40 184 74 194 100 190 128 186 160 194 194 188"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 192C40 186 74 196 100 192 128 188 160 196 194 190 194 197 190 198 100 198 12 198 6 197 6 192Z"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* birds */}
      <path
        d="M50 24c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />
    </svg>
  );
}
