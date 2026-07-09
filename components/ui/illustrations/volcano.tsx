const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function VolcanoIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* smoke */}
      <path
        d="M78 26c-4-7 3-13 11-11-2-8 9-13 16-7 6-6 17-2 16 6 7-1 10 8 4 12-6 5-16 3-21-1-7 4-16 1-19-4-5 2-9-1-7-5Z"
        {...ink}
        strokeWidth="1.4"
        opacity="0.45"
      />

      {/* cone (truncated, crater at top) — bowed edges, asymmetric */}
      <path
        d="M83 47C77 74 67 108 51 152C58 154 66 155 75 155C90 156 106 154 121 155C136 155 150 153 168 150C154 108 140 76 118 48C107 47 94 47 83 47Z"
        {...ink}
        strokeWidth="2.4"
      />
      <path
        d="M85 50C79 76 69 110 54 151C70 154 100 155 122 154C140 152 152 151 165 149C151 109 137 77 116 50C105 49 95 49 85 50Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />
      <path d="M88 47c4-6 20-5 28 1" {...ink} strokeWidth="1.6" />

      {/* rock texture */}
      <path
        d="M56 108 65 113M133 96 141 103M40 148 51 152M158 140 169 145"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />

      {/* lava pool in crater */}
      <path
        d="M90 46c4-4 17-3 20 1-2 3-16 3-20-1Z"
        fill="var(--coral)"
        opacity="0.9"
      />

      {/* lava streaks following the slope */}
      <path
        d="M105 50C114 76 125 106 138 138"
        stroke="var(--coral)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M99 50C92 78 79 114 63 154"
        stroke="var(--coral)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* ground + rocks */}
      <path
        d="M12 168C48 162 76 172 100 168 126 164 154 174 188 167"
        {...ink}
        strokeWidth="2"
      />
      <path d="M32 170c-2-4 2-7 6-6 3-4 8-1 7 3" {...ink} strokeWidth="1.3" />
      <path d="M160 172c-2-4 2-7 6-6" {...ink} strokeWidth="1.3" />
    </svg>
  );
}
