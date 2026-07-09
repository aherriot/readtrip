const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a shark banking through open water, dorsal
 * fin, tail, and back all one continuous silhouette (see the illustrations
 * skill's "favor one continuous stroke" rule) — only the pectoral fin breaks
 * off as its own stroke, the same way a dinosaur's legs do.
 */
export function SharkIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* water wash */}
      <path
        d="M4 50C30 34 66 26 104 32C140 26 172 36 196 52C196 100 196 140 194 168C160 178 120 172 88 176C54 180 22 174 6 166C4 128 4 88 4 50Z"
        fill="var(--sky)"
        opacity="0.16"
      />

      {/* body + dorsal fin + tail, one continuous silhouette */}
      <path
        d="M172 96C180 90 174 81 163 77C158 75 161 83 155 81C144 74 134 68 127 65C123 55 119 45 113 43C109 52 107 61 103 68C87 71 73 78 65 85C49 78 37 68 33 59C27 69 23 82 26 92C30 97 41 96 58 99C64 106 73 113 86 119C97 117 105 115 111 113C123 111 133 111 141 109C151 107 160 102 168 100C170 98 171 97 172 96Z"
        fill="var(--sky)"
        opacity="0.3"
      />
      <path
        d="M172 96C180 90 174 81 163 77C158 75 161 83 155 81C144 74 134 68 127 65C123 55 119 45 113 43C109 52 107 61 103 68C87 71 73 78 65 85C49 78 37 68 33 59C27 69 23 82 26 92C30 97 41 96 58 99C64 106 73 113 86 119C97 117 105 115 111 113C123 111 133 111 141 109C151 107 160 102 168 100C170 98 171 97 172 96Z"
        {...ink}
        strokeWidth="2.3"
      />
      {/* sketchy retrace pass */}
      <path
        d="M170 94C177 89 172 82 162 79C157 77 160 84 154 82C144 76 135 70 128 67C124 58 120 48 114 46C111 54 108 62 105 69C89 73 76 80 68 87C52 80 40 70 35 61C29 71 25 82 28 92C32 96 42 96 59 99C65 105 74 112 87 118C97 116 106 114 112 112C124 110 134 110 142 108C151 106 160 102 167 99C168 97 169 96 170 94Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* gill slits */}
      <path
        d="M148 82c1 5 1 9 1 13M154 80c1 5 2 9 1 13M160 78c1 5 2 9 1 12"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* pectoral fin, its own stroke */}
      <path
        d="M118 108C112 118 100 128 84 133C90 122 98 113 108 108C112 106 116 106 118 108Z"
        fill="var(--surface-ink)"
        opacity="0.12"
      />
      <path
        d="M118 108C112 118 100 128 84 133C90 122 98 113 108 108C112 106 116 106 118 108Z"
        {...ink}
        strokeWidth="1.7"
      />

      {/* eye + teeth */}
      <path
        d="M158 88c.5-1 2-1 2 .4s-1.6 1.3-2-.4Z"
        fill="var(--surface-ink)"
      />
      <path
        d="M167 96 172 96 167 100 165 96Z"
        fill="var(--surface-ink)"
        opacity="0.7"
      />

      {/* bubbles */}
      <path
        d="M40 44c1-2 4-2 4 .8s-3 2.6-4-.8ZM50 32c.8-1.6 3-1.6 3 .6s-2.4 2-3-.6Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* seabed ripple ground */}
      <path
        d="M6 168C40 160 70 172 100 168 132 164 164 174 194 166"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M20 175 30 173M100 178 112 176M150 174 160 172"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
