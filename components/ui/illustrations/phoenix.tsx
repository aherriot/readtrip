const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a phoenix mid-flight. Body, neck, and head
 * are one continuous silhouette; the long tail and wing plumes are a handful
 * of sweeping feather strokes rather than many identical repeated feathers,
 * with a warm ember wash trailing beneath the tail as a character touch.
 */
export function PhoenixIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 40C36 24 74 18 108 26C142 20 170 30 192 46C192 90 192 128 190 156C154 166 116 160 84 164C50 168 20 162 8 154C6 118 6 76 6 40Z"
        fill="var(--sky)"
        opacity="0.14"
      />

      {/* trailing flame/ember wash beneath the tail */}
      <path
        d="M20 148C40 156 62 158 78 150C60 168 34 174 16 166C8 162 12 152 20 148Z"
        fill="var(--coral)"
        opacity="0.24"
      />

      {/* long sweeping tail feathers, a handful of strokes not many repeats */}
      <path
        d="M96 118C76 132 52 140 26 138"
        {...ink}
        strokeWidth="2"
        opacity="0.85"
      />
      <path
        d="M100 124C82 142 58 156 30 160"
        {...ink}
        strokeWidth="2"
        opacity="0.75"
      />
      <path
        d="M92 128C76 148 54 166 28 174"
        {...ink}
        strokeWidth="1.8"
        opacity="0.6"
      />
      <path d="M26 138C22 144 20 150 22 155" fill="var(--sun)" opacity="0.7" />
      <path
        d="M30 160C25 165 23 170 26 174"
        fill="var(--coral)"
        opacity="0.6"
      />

      {/* body + neck + head, one continuous silhouette: head, crest, neck-in,
          chest, wing-shoulder, back arch, tail-base, belly sweep, throat
          back to head — 9 long purposeful curves, not a chain of even bumps */}
      <path
        d="M150 40C158 34 148 28 138 32C126 38 118 46 118 54C120 64 126 70 132 76C142 82 150 84 150 92C146 104 132 110 118 114C104 118 96 120 92 124C100 108 104 96 110 88C120 76 132 62 142 50C146 46 148 43 150 40Z"
        fill="var(--sun)"
        opacity="0.22"
      />
      <path
        d="M150 40C158 34 148 28 138 32C126 38 118 46 118 54C120 64 126 70 132 76C142 82 150 84 150 92C146 104 132 110 118 114C104 118 96 120 92 124C100 108 104 96 110 88C120 76 132 62 142 50C146 46 148 43 150 40Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass */}
      <path
        d="M151 41C159 35 149 29 139 33C127 39 119 47 119 55C121 65 127 71 133 77C143 83 151 85 151 93C147 105 133 111 119 115C105 119 97 121 93 125C101 109 105 97 111 89C121 77 133 63 143 51C147 47 149 44 151 41Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* crest feathers on head */}
      <path
        d="M148 40 154 30M154 42 162 34M142 38 145 27"
        {...ink}
        strokeWidth="1.5"
        opacity="0.75"
      />

      {/* far wing (behind) */}
      <path
        d="M118 78C132 66 150 60 168 62C158 74 144 82 130 88C142 88 152 94 158 104C142 106 126 104 114 98C116 92 116 84 118 78Z"
        fill="var(--sun)"
        opacity="0.2"
      />
      <path
        d="M118 78C132 66 150 60 168 62C158 74 144 82 130 88C142 88 152 94 158 104C142 106 126 104 114 98C116 92 116 84 118 78Z"
        {...ink}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* near wing, its own stroke, long sweeping feather plumes */}
      <path
        d="M110 84C126 68 148 58 172 58C160 74 144 84 128 92C142 92 154 100 160 112C142 114 122 112 108 104C112 98 110 90 110 84Z"
        fill="var(--coral)"
        opacity="0.3"
      />
      <path
        d="M110 84C126 68 148 58 172 58C160 74 144 84 128 92C142 92 154 100 160 112C142 114 122 112 108 104C112 98 110 90 110 84Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M132 68 152 62M136 78 158 76M132 90 150 96"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* eye + beak */}
      <path
        d="M152 54c.6-1.1 2.3-1.1 2.3.5s-1.9 1.5-2.3-.5Z"
        fill="var(--surface-ink)"
      />
      <path
        d="M160 52 166 55 160 58Z"
        fill="var(--surface-ink)"
        opacity="0.75"
      />

      {/* spark/ember character touches */}
      <path
        d="M182 40c1.4-1.6 3.6-.6 3 1.3s-3.6 1-3-1.3Z"
        fill="var(--sun)"
        opacity="0.8"
      />
      <path
        d="M172 96c1-1.4 3-.6 2.6 1.1s-3 1.1-2.6-1.1Z"
        fill="var(--coral)"
        opacity="0.75"
      />

      {/* ground */}
      <path
        d="M4 168C36 162 68 172 100 168 132 164 164 174 196 168"
        {...ink}
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  );
}
