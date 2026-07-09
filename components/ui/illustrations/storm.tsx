const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a lumpy storm cloud, lightning bolt, and
 * rain. The cloud's puffy silhouette is one continuous winding path (a
 * string of hand-varied bumps), not a cluster of overlapping circles.
 */
export function StormIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash behind the cloud */}
      <path
        d="M10 40C40 24 80 16 120 22C150 16 178 26 192 44C192 60 192 74 190 84C150 78 110 84 70 80C40 78 16 72 8 62C6 54 7 46 10 40Z"
        fill="var(--violet)"
        opacity="0.12"
      />

      {/* cloud, one continuous bumpy silhouette */}
      <path
        d="M34 74C22 66 24 50 40 44C40 30 56 20 72 26C82 14 102 12 116 22C132 14 152 20 158 34C174 32 186 46 180 60C192 64 194 80 180 86C182 96 172 106 156 102C146 110 128 110 116 102C102 110 84 108 76 98C60 106 42 100 38 88C24 88 16 78 34 74Z"
        fill="var(--surface-ink)"
        opacity="0.08"
      />
      <path
        d="M34 74C22 66 24 50 40 44C40 30 56 20 72 26C82 14 102 12 116 22C132 14 152 20 158 34C174 32 186 46 180 60C192 64 194 80 180 86C182 96 172 106 156 102C146 110 128 110 116 102C102 110 84 108 76 98C60 106 42 100 38 88C24 88 16 78 34 74Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace */}
      <path
        d="M36 72C25 65 27 51 42 46C42 32 58 22 74 28C84 16 103 14 117 24C133 16 153 22 159 35C173 34 184 47 179 60C190 64 193 79 180 85C181 94 172 104 157 100C147 108 129 108 117 100C104 108 86 106 78 96C62 104 44 98 40 86C27 86 18 78 36 72Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* lightning bolt */}
      <path
        d="M104 92 90 126 104 124 88 162 122 118 106 121Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M104 92 90 126 104 124 88 162 122 118 106 121Z"
        {...ink}
        strokeWidth="1.7"
      />

      {/* rain */}
      <path
        d="M52 96c-3 8-5 14-7 20M68 100c-2 8-4 14-6 20M142 92c-3 8-5 14-7 19M158 98c-2 7-4 13-6 18"
        {...ink}
        strokeWidth="1.6"
        opacity="0.55"
      />

      {/* wind gusts off to the side */}
      <path
        d="M12 108c10-2 18 1 24 6M8 122c14-2 24 2 32 8"
        {...ink}
        strokeWidth="1.4"
        opacity="0.5"
      />

      {/* puddle ground */}
      <path
        d="M6 172C40 166 70 176 100 172 132 168 164 178 194 170"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M58 172c8-3 20-3 26 1-6 5-20 5-26-1Z"
        {...ink}
        strokeWidth="1.3"
        opacity="0.6"
        fill="var(--sky)"
      />
    </svg>
  );
}
