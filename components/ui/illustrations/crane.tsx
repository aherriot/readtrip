const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CraneIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 50C34 34 68 26 100 30C134 26 166 36 194 52"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* clouds */}
      <path
        d="M148 24c-2-4 2-7 5-6 0-5 6-7 9-3 4-3 9 0 8 4 4 0 5 5 1 6-3 2-8 1-10-1-4 2-8 0-10-3Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.4"
      />

      {/* mast — one continuous vertical, hand-bowed not ruler-straight */}
      <path d="M64 176C62 138 66 92 60 40" {...ink} strokeWidth="3.2" />
      <path
        d="M65 176C63 138 67 92 61 40"
        {...ink}
        strokeWidth="1"
        opacity="0.35"
      />

      {/* lattice texture on mast */}
      <path
        d="M56 60l8 12M64 60l-8 12M55 92l9 14M64 92l-9 14M53 126l10 16M63 126l-10 16"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* jib — long horizontal boom with counter-jib, one continuous path */}
      <path
        d="M6 44C26 40 44 38 60 40C86 34 118 32 150 34C160 34 168 36 176 40"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M7 45C27 41 45 39 61 41"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* jib lattice bracing */}
      <path
        d="M76 36l6 8M92 34l6 8M108 33l6 8M124 33l6 8M140 34l6 7"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* counterweight block */}
      <path
        d="M8 44c-3-1-5 2-5 5 0 4 3 6 6 6 4 0 6-3 6-6 0-4-3-6-7-5Z"
        fill="var(--surface-ink)"
        opacity="0.4"
      />
      <path
        d="M8 44c-3-1-5 2-5 5 0 4 3 6 6 6 4 0 6-3 6-6 0-4-3-6-7-5Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* cab */}
      <path
        d="M52 40c4-4 12-4 15 0 2 4 0 10-7 10-8 0-11-6-8-10Z"
        fill="var(--sun)"
        opacity="0.6"
      />
      <path
        d="M52 40c4-4 12-4 15 0 2 4 0 10-7 10-8 0-11-6-8-10Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* hoist cable + hook, dropping to a load */}
      <path d="M150 34C148 60 150 84 148 106" {...ink} strokeWidth="1.4" />
      <path
        d="M148 106c-3 0-5 2-5 5 0 3 3 4 5 4 3 0 5-1 5-4 0-3-2-5-5-5Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* suspended steel beam load */}
      <path
        d="M118 116C132 114 148 116 162 118C164 122 164 126 162 130C148 132 132 130 118 128C116 124 116 120 118 116Z"
        fill="var(--coral)"
        opacity="0.5"
      />
      <path
        d="M118 116C132 114 148 116 162 118C164 122 164 126 162 130C148 132 132 130 118 128C116 124 116 120 118 116Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M140 118c1 4-1 8 1 12"
        {...ink}
        strokeWidth="1.1"
        opacity="0.5"
      />

      {/* base + support legs */}
      <path
        d="M64 176c-12 3-22 10-28 18M64 176c14 4 25 12 30 20"
        {...ink}
        strokeWidth="2"
      />
      <path d="M40 188C74 184 106 192 138 188" {...ink} strokeWidth="2" />
      <path
        d="M40 190C74 186 106 194 138 190 138 196 134 198 90 198 46 198 40 196 40 190Z"
        fill="var(--sun)"
        opacity="0.14"
      />
    </svg>
  );
}
