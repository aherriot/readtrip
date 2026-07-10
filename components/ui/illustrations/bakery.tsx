const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a loaf of bread cooling on a rack in front
 * of a brick oven, with a couple of round rolls and rising steam. The rolls
 * are hand-drawn round via ~4 long curve segments (not a scallop ring); the
 * oven's brick courses and the cooling rack are hand-wobbled, not a grid.
 */
export function BakeryIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* wall wash behind the oven */}
      <path
        d="M10 30C46 20 80 16 108 20C142 16 168 24 192 34C192 90 190 130 190 150C130 156 70 154 12 150C10 110 10 66 10 30Z"
        fill="var(--coral)"
        opacity="0.1"
      />

      {/* oven — arched brick opening */}
      <path
        d="M40 150C38 118 40 90 58 74C70 63 90 60 100 61C112 60 132 64 144 76C160 92 162 118 160 150"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M52 150C50 122 53 98 66 84C75 75 90 72 100 73"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />
      {/* brick courses, uneven not a grid */}
      <path
        d="M42 130q10 2 20-1M100 128q11 2 22-1M22 148q10-3 20 1M150 146q9-3 18 1"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />
      {/* oven mouth glow */}
      <path
        d="M64 148C62 122 68 100 82 90C90 84 110 84 118 91C132 101 138 122 136 148C112 152 88 152 64 148Z"
        fill="var(--sun)"
        opacity="0.22"
      />
      <path
        d="M64 148C62 122 68 100 82 90C90 84 110 84 118 91C132 101 138 122 136 148C112 152 88 152 64 148Z"
        {...ink}
        strokeWidth="1.8"
      />
      {/* embers glow inside */}
      <path
        d="M88 138c2-3 6-3 8 0 1 3-2 5-4 5s-5-2-4-5Zm18-6c2-2 5-2 6 0 1 2-1 4-3 4s-4-2-3-4Z"
        fill="var(--coral)"
        opacity="0.6"
      />

      {/* loaf of bread — rounded top with score-line slashes */}
      <path
        d="M28 158C24 148 32 138 46 136C60 134 78 136 92 140C102 143 106 150 102 158C104 164 98 168 86 169C66 171 44 170 28 164C24 162 26 160 28 158Z"
        fill="var(--sun)"
        opacity="0.35"
      />
      <path
        d="M28 158C24 148 32 138 46 136C60 134 78 136 92 140C102 143 106 150 102 158C104 164 98 168 86 169C66 171 44 170 28 164C24 162 26 160 28 158Z"
        {...ink}
        strokeWidth="2.1"
      />
      <path
        d="M29 157C25 147 33 137 47 135"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />
      {/* score-line slashes */}
      <path
        d="M42 143c4 5 5 11 4 17M60 140c3 6 3 12 1 18M78 143c3 5 3 10 2 15"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* cooling rack under the loaf, hand-wobbled parallel lines */}
      <path
        d="M14 170q46 4 92-1M110 170q22 2 44-1"
        {...ink}
        strokeWidth="1.6"
        opacity="0.7"
      />
      <path
        d="M22 168v8M46 167v9M70 168v8M94 167v9M120 168v7M140 167v8"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* two round rolls — hand-drawn round via ~4 long curve segments */}
      <path
        d="M136 168c0-7 6-12 13-12 7 0 13 5 13 12 0 7-6 12-13 12-7 0-13-5-13-12Z"
        fill="var(--sun)"
        opacity="0.4"
      />
      <path
        d="M136 168c0-7 6-12 13-12 7 0 13 5 13 12 0 7-6 12-13 12-7 0-13-5-13-12Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path d="M143 160c2 2 5 2 7 0" {...ink} strokeWidth="1.2" opacity="0.6" />

      <path
        d="M162 172c0-6 5-10 11-10 6 0 11 4 11 10 0 6-5 10-11 10-6 0-11-4-11-10Z"
        fill="var(--sun)"
        opacity="0.4"
      />
      <path
        d="M162 172c0-6 5-10 11-10 6 0 11 4 11 10 0 6-5 10-11 10-6 0-11-4-11-10Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path d="M168 166c2 1 4 1 6 0" {...ink} strokeWidth="1.1" opacity="0.5" />

      {/* steam / aroma squiggles rising from the loaf */}
      <path
        d="M50 132c-4-4-2-9 2-12-4-5 0-10 4-9M76 128c3-4 1-9-2-12 3-4 8-2 9 2"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />

      {/* rolling pin, character touch, leaning against the rack */}
      <path d="M172 152C166 146 158 140 150 136" {...ink} strokeWidth="3.6" />
      <path
        d="M150 136c-3-1-5-3-4-5M172 152c2 1 4 3 3 5"
        {...ink}
        strokeWidth="1.8"
        opacity="0.7"
      />

      {/* ground */}
      <path
        d="M6 182C46 176 78 186 108 182 140 178 168 186 194 180"
        {...ink}
        strokeWidth="2"
        opacity="0.7"
      />
    </svg>
  );
}
