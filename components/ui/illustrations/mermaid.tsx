const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a mermaid sitting on a rock. Torso and tail
 * are one continuous flowing silhouette — shoulders wider than waist per the
 * human-body proportion discipline, then a smooth transition into a bi-lobed
 * tail fin (not a mirrored symmetric fin). Hair, rock, and companion fish are
 * their own strokes.
 */
export function MermaidIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* water wash */}
      <path
        d="M4 60C32 44 68 38 102 44C138 38 168 48 194 62C194 104 194 138 192 162C158 172 120 166 88 170C54 174 24 168 8 160C4 126 4 92 4 60Z"
        fill="var(--sky)"
        opacity="0.18"
      />

      {/* rock she's sitting on */}
      <path
        d="M96 148C90 140 98 132 110 133C114 124 126 122 134 128C144 125 154 132 152 142C160 144 160 154 150 157C136 162 112 161 100 155C94 153 92 150 96 148Z"
        fill="var(--surface-ink)"
        opacity="0.14"
      />
      <path
        d="M96 148C90 140 98 132 110 133C114 124 126 122 134 128C144 125 154 132 152 142C160 144 160 154 150 157C136 162 112 161 100 155C94 153 92 150 96 148Z"
        {...ink}
        strokeWidth="1.8"
      />

      {/* torso + tail, one continuous silhouette: shoulders wide, taper to
          waist, then flowing into the tail */}
      <path
        d="M112 66C120 64 128 68 127 75C134 78 138 85 134 92C130 98 122 100 116 98C118 106 114 112 106 112C106 120 100 126 92 124C88 132 78 134 72 128C66 134 56 132 54 124C48 126 42 120 46 114C40 112 38 104 44 100C48 90 56 118 62 108C68 118 78 122 88 118C82 108 84 96 92 90C88 82 92 74 100 71C102 66 106 65 112 66Z"
        fill="var(--aqua)"
        opacity="0.18"
      />
      <path
        d="M112 66C120 64 128 68 127 75C134 78 138 85 134 92C130 98 122 100 116 98C118 106 114 112 106 112C106 120 100 126 92 124C88 132 78 134 72 128C66 134 56 132 54 124C48 126 42 120 46 114C40 112 38 104 44 100C48 90 56 96 62 108C68 118 78 122 88 118C82 108 84 96 92 90C88 82 92 74 100 71C102 66 106 65 112 66Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass on primary silhouette */}
      <path
        d="M113 67C121 65 129 69 128 76C135 79 139 86 135 93C131 99 123 101 117 99C119 107 115 113 107 113C107 121 101 127 93 125C89 133 79 135 73 129C67 135 57 133 55 125C49 127 43 121 47 115C41 113 39 105 45 101C49 91 57 97 63 109C69 119 79 123 89 119C83 109 85 97 93 91C89 83 93 75 101 72C103 67 107 66 113 67Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* bi-lobed tail fin, flowing not mirror-symmetric */}
      <path
        d="M44 100C34 96 24 98 18 106C26 108 32 108 38 106C30 112 22 116 14 116C22 122 32 122 40 118C34 126 26 130 18 132C28 136 40 132 46 124"
        fill="var(--aqua)"
        opacity="0.3"
      />
      <path
        d="M44 100C34 96 24 98 18 106C26 108 32 108 38 106C30 112 22 116 14 116C22 122 32 122 40 118C34 126 26 130 18 132C28 136 40 132 46 124"
        {...ink}
        strokeWidth="1.9"
      />

      {/* flowing hair, a few long curling strokes */}
      <path
        d="M118 70C126 72 132 78 132 86C138 84 142 90 138 96"
        {...ink}
        strokeWidth="1.8"
        stroke="var(--coral)"
        opacity="0.8"
      />
      <path
        d="M108 66C104 74 104 82 108 88C102 88 100 96 105 100"
        {...ink}
        strokeWidth="1.7"
        stroke="var(--coral)"
        opacity="0.7"
      />

      {/* face + arm accent */}
      <path
        d="M120 78c.6-1.1 2.3-1.1 2.3.5s-1.9 1.5-2.3-.5Z"
        fill="var(--surface-ink)"
      />
      <path
        d="M126 90C120 96 116 100 118 106"
        {...ink}
        strokeWidth="1.7"
        opacity="0.7"
      />

      {/* small fish companion, character touch */}
      <path
        d="M162 118C168 114 176 114 180 118C176 122 168 122 162 118Z"
        fill="var(--sun)"
        opacity="0.7"
      />
      <path
        d="M162 118C168 114 176 114 180 118C176 122 168 122 162 118Z"
        {...ink}
        strokeWidth="1.4"
      />
      <path
        d="M180 118 186 114M180 118 186 122"
        {...ink}
        strokeWidth="1.3"
        opacity="0.7"
      />

      {/* bubbles, character touch */}
      <path
        d="M158 70c1-1.6 3.4-1.6 3.4.6s-2.8 2.4-3.4-.6ZM168 58c.8-1.4 2.8-1.4 2.8.5s-2.4 2-2.8-.5Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* waterline / ground */}
      <path
        d="M4 168C36 162 68 172 100 168 132 164 164 174 196 168"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M20 174 30 172M140 176 150 173"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
