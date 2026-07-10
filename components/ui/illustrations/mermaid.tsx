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

      {/* torso + tail, one continuous silhouette: shoulder, armpit-in, chest/
          waist taper, hip, flowing (no-seam) transition into the tail, tail
          body, curling back up the tail's front edge to the other shoulder
          and neck — 9 long purposeful curves, not a chain of even bumps */}
      <path
        d="M116 66C124 69 128 77 124 85C132 92 128 100 118 103C108 106 100 103 94 106C84 112 70 114 60 108C48 102 44 96 47 88C56 94 66 100 76 96C86 92 90 84 92 76C96 68 104 64 112 64C114 65 115 65 116 66Z"
        fill="var(--aqua)"
        opacity="0.18"
      />
      <path
        d="M116 66C124 69 128 77 124 85C132 92 128 100 118 103C108 106 100 103 94 106C84 112 70 114 60 108C48 102 44 96 47 88C56 94 66 100 76 96C86 92 90 84 92 76C96 68 104 64 112 64C114 65 115 65 116 66Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass on primary silhouette */}
      <path
        d="M117 67C125 70 129 78 125 86C133 93 129 101 119 104C109 107 101 104 95 107C85 113 71 115 61 109C49 103 45 97 48 89C57 95 67 101 77 97C87 93 91 85 93 77C97 69 105 65 113 65C115 66 116 66 117 67Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* bi-lobed tail fin, flowing not mirror-symmetric */}
      <path
        d="M46 92C36 88 26 90 20 98C28 100 34 100 40 98C32 104 24 108 16 108C24 114 34 114 42 110C36 118 28 122 20 124C30 128 42 124 48 116"
        fill="var(--aqua)"
        opacity="0.3"
      />
      <path
        d="M46 92C36 88 26 90 20 98C28 100 34 100 40 98C32 104 24 108 16 108C24 114 34 114 42 110C36 118 28 122 20 124C30 128 42 124 48 116"
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
