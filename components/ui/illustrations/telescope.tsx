const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a refractor telescope on a tripod. The tube
 * is drawn as one closed, tapered silhouette — chunky at the objective end,
 * narrowing to roughly a third that width at the eyepiece — rather than a
 * thin constant-width line, so it reads as a real optical tube. It pivots
 * on a mount joint above a three-legged tripod (not two), with a moon,
 * ringed planet, and stars keeping the night-sky accent.
 */
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
        d="M46 42c9-9 22-9 30-1-11-2-21 3-25 12-4 9 0 18 8 23-12 1-22-6-24-17-2-7 3-12 11-17Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M46 42c9-9 22-9 30-1-11-2-21 3-25 12-4 9 0 18 8 23-12 1-22-6-24-17-2-7 3-12 11-17Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* ringed planet */}
      <path
        d="M172 78c6-1 12 4 12 9 1 6-5 11-12 10-6 1-12-4-12-10 0-5 5-8 12-9Z"
        fill="var(--violet)"
        opacity="0.75"
      />
      <path
        d="M172 78c6-1 12 4 12 9 1 6-5 11-12 10-6 1-12-4-12-10 0-5 5-8 12-9Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path
        d="M154 87c6-7 30-5 36 1-6 5-30 4-36-1Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.8"
      />

      {/* stars — tiny hand-drawn blobs, not circle primitives */}
      <path
        d="M97 24c.5-1 2-1 2 .5s-1.6 1.4-2 .3Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />
      <path
        d="M127 18c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />
      <path
        d="M60 20c.4-.9 1.6-.9 1.6.4s-1.3 1.2-1.6.2Z"
        fill="var(--surface-ink)"
        opacity="0.5"
      />

      {/* tube — one closed, tapered silhouette: narrow eyepiece cap, long
          barrel, wide objective cap */}
      <path
        d="M84 132C90 124 96 118 100 113C118 96 133 68 147 40C152 46 158 51 169 56C160 68 150 84 138 100C128 112 120 122 116 127C108 132 100 138 92 144C89 140 87 136 84 132Z"
        fill="var(--surface-ink)"
        opacity="0.12"
      />
      <path
        d="M84 132C90 124 96 118 100 113C118 96 133 68 147 40C152 46 158 51 169 56C160 68 150 84 138 100C128 112 120 122 116 127C108 132 100 138 92 144C89 140 87 136 84 132Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass on the tube outline */}
      <path
        d="M86 131C92 123 97 117 101 112C119 95 134 67 148 39C151 44 156 49 167 55C158 67 149 83 137 99C127 111 119 121 115 126C107 131 100 137 93 143C90 139 88 135 86 131Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* objective lens ring at the wide end */}
      <path d="M150 44c4 3 9 3 13 0" {...ink} strokeWidth="1.4" opacity="0.6" />
      <path
        d="M151 45c3 2 7 2 10 0"
        stroke="var(--sky)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* eyepiece cap at the narrow end */}
      <path d="M86 136c2-2 5-2 6 0" {...ink} strokeWidth="2" opacity="0.75" />

      {/* finder scope, a small tube riding on the main barrel */}
      <path
        d="M113 103c6-3 13-1 16 4"
        {...ink}
        strokeWidth="2.4"
        opacity="0.7"
      />

      {/* equatorial mount joint where the tube pivots */}
      <path
        d="M100 118c2-3 8-3 10 0 2 4-2 8-6 8s-6-4-4-8Z"
        fill="var(--surface-ink)"
        opacity="0.85"
      />
      {/* counterweight shaft, an accurate mount detail */}
      <path
        d="M98 122c-6 4-10 10-11 17"
        {...ink}
        strokeWidth="1.8"
        opacity="0.7"
      />
      <path
        d="M85 138c1-3 6-3 7 0 1 3-1.5 6-3.5 6s-4.5-3-3.5-6Z"
        fill="var(--surface-ink)"
        opacity="0.6"
      />

      {/* tripod — three legs, not two */}
      <path d="M104 122c-16 10-27 24-31 40" {...ink} strokeWidth="3" />
      <path d="M104 122c15 8 26 22 30 39" {...ink} strokeWidth="3" />
      <path d="M106 123c-1 14 2 30-2 44" {...ink} strokeWidth="2.6" />

      {/* cross-brace stabilizer between the legs */}
      <path
        d="M87 148c8 3 17 3 25 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />

      {/* feet */}
      <path
        d="M69 162h9M129 161h9M99 167h8"
        {...ink}
        strokeWidth="2.4"
        opacity="0.8"
      />

      {/* ground */}
      <path
        d="M12 172C50 166 80 176 108 172 140 168 168 176 192 170"
        {...ink}
        strokeWidth="2"
        opacity="0.7"
      />
    </svg>
  );
}
