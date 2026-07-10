const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a submarine — a torpedo-shaped hull (one
 * continuous silhouette, bow taper distinct from stern taper), a conning
 * tower with a periscope, stern fins, portholes, and bubbles among wavy
 * water lines — see the illustrations skill.
 */
export function SubmarineIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* water wash */}
      <path
        d="M4 60C40 48 90 44 130 52C160 46 184 54 196 62"
        fill="var(--sky)"
        opacity="0.16"
        stroke="none"
      />

      {/* hull — one continuous silhouette; bow (left) tapers sharper/shorter than stern (right) */}
      <path
        d="M26 114C31 100 46 92 68 90 92 88 118 88 142 92 158 95 170 100 178 108 182 112 184 116 182 120 178 128 166 133 148 136 120 140 88 140 62 136 46 133 33 127 27 118 25 116 25 115 26 114Z"
        fill="var(--coral)"
        opacity="0.14"
      />
      <path
        d="M26 114C31 100 46 92 68 90 92 88 118 88 142 92 158 95 170 100 178 108 182 112 184 116 182 120 178 128 166 133 148 136 120 140 88 140 62 136 46 133 33 127 27 118 25 116 25 115 26 114Z"
        {...ink}
        strokeWidth="2.3"
      />
      <path
        d="M29 113C34 101 48 94 68 92 92 90 116 90 140 94"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* conning tower / sail rising from top-middle */}
      <path
        d="M92 90C90 78 92 68 98 62 102 58 108 58 111 62 116 68 117 78 116 90"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M92 90C90 78 92 68 98 62 102 58 108 58 111 62 116 68 117 78 116 90Z"
        fill="var(--violet)"
        opacity="0.18"
      />
      <path d="M97 76c4-1 8-1 12 0" {...ink} strokeWidth="1.2" opacity="0.6" />

      {/* periscope */}
      <path d="M104 58C103 48 104 40 103 32" {...ink} strokeWidth="1.6" />
      <path d="M103 32 111 30" {...ink} strokeWidth="1.8" />

      {/* stern fins/rudder, hand-varied not mirrored */}
      <path
        d="M172 118c8-6 18-8 24-4-4 6-14 10-22 10Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M168 130c7 5 16 8 22 5-3-7-13-12-20-12Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* bow plane */}
      <path d="M52 116c-6 3-11 8-13 14" {...ink} strokeWidth="1.6" />

      {/* portholes — small hand-drawn rings, not circle primitives */}
      <path
        d="M62 112c1.6-1.8 4-1.8 4.6 0 .6 1.8-.8 3.6-2.6 3.6s-2.6-1.8-2-3.6Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M84 111c1.6-1.8 4-1.8 4.6 0 .6 1.8-.8 3.6-2.6 3.6s-2.6-1.8-2-3.6Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M106 111c1.6-1.8 4-1.8 4.6 0 .6 1.8-.8 3.6-2.6 3.6s-2.6-1.8-2-3.6Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M128 112c1.6-1.8 4-1.8 4.6 0 .6 1.8-.8 3.6-2.6 3.6s-2.6-1.8-2-3.6Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* small accent stripe */}
      <path
        d="M40 122C70 126 110 126 150 122"
        {...ink}
        strokeWidth="1.2"
        stroke="var(--sky)"
        opacity="0.6"
      />

      {/* bubbles rising */}
      <path
        d="M118 56c1.6-1.8 3.8-1.6 4 .6.2 2.2-2 3.4-3.6 2.4-1.6-1-1.8-2-.4-3Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.6"
      />
      <path
        d="M124 44c1.2-1.4 3-1.2 3 .5s-1.6 2.6-2.8 1.8c-1.2-.8-1-1.6-.2-2.3Z"
        {...ink}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* fish character touch */}
      <path
        d="M42 150c6-4 13-4 17 0-2 3-3 5-3 6 0 1 1 3 3 6-4 4-11 4-17 0-3-2-4-4-4-6 0-2 1-4 4-6Z"
        fill="var(--sun)"
        opacity="0.8"
      />
      <path
        d="M42 150c6-4 13-4 17 0-2 3-3 5-3 6 0 1 1 3 3 6-4 4-11 4-17 0-3-2-4-4-4-6 0-2 1-4 4-6Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* wavy water lines above and below */}
      <path
        d="M6 46C24 40 40 50 58 44 76 38 92 48 110 42 128 36 144 46 162 40 176 36 188 42 196 40"
        {...ink}
        strokeWidth="1.4"
        opacity="0.55"
      />
      <path
        d="M8 172C28 166 46 176 66 170 86 164 104 174 124 168 144 162 162 172 192 166"
        {...ink}
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
  );
}
