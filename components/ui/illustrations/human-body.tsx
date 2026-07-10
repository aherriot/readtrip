const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a standing human figure. The silhouette is
 * one continuous path but the curve segments map onto real landmarks — a
 * head noticeably narrower than the shoulders, a neck-in, a shoulder flare,
 * a pinched waist, and a hip flare — so it reads as a person, not a smooth
 * egg. Arms and legs break off as their own strokes with a real elbow/knee
 * bend rather than a single bowed curve, and are deliberately hand-varied
 * left to right rather than mirrored.
 */
export function HumanBodyIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* head + torso, one continuous silhouette: head arc, neck-in,
          shoulder-out, taper to waist, hip flare */}
      <path
        d="M100 24C108 24 116 29 114 36C120 39 128 45 131 60C128 71 122 76 118 78C112 87 108 90 106 96C104 103 114 105 120 110C123 116 117 121 113 124C104 127 106 130 99 129C92 131 90 127 86 123C80 120 76 115 79 109C81 101 91 99 93 95C87 89 83 84 81 77C77 66 70 63 68 59C71 51 78 48 96 47C90 45 88 41 85 37C88 30 93 25 100 24Z"
        fill="var(--sky)"
        opacity="0.14"
      />
      <path
        d="M100 24C108 24 116 29 114 36C120 39 128 45 131 60C128 71 122 76 118 78C112 87 108 90 106 96C104 103 114 105 120 110C123 116 117 121 113 124C104 127 106 130 99 129C92 131 90 127 86 123C80 120 76 115 79 109C81 101 91 99 93 95C87 89 83 84 81 77C77 66 70 63 68 59C71 51 78 48 96 47C90 45 88 41 85 37C88 30 93 25 100 24Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace pass on the primary silhouette */}
      <path
        d="M100 25C107 25 115 30 113 37C119 40 126 46 130 60C127 70 121 75 117 78C111 87 109 90 107 96C105 102 113 106 119 110C122 115 116 120 112 123C104 126 105 129 99 128C93 130 90 126 87 122C81 119 77 114 80 109C82 101 90 99 92 95C86 88 82 84 80 76C76 66 71 63 69 59C72 52 79 49 95 48C89 46 87 42 86 37C89 31 94 26 100 25Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* right arm — shoulder to elbow to hand, a real bend, not a bow */}
      <path
        d="M129 62C136 70 143 78 145 88C147 96 138 104 133 112"
        {...ink}
        strokeWidth="2.1"
      />
      {/* gauntlet-free hand accent */}
      <path
        d="M133 112c-1 3-1 6 1 8"
        {...ink}
        strokeWidth="1.6"
        opacity="0.7"
      />

      {/* left arm — hand-varied, not a mirror of the right */}
      <path
        d="M68 60C60 68 52 76 50 82C48 90 56 100 60 108"
        {...ink}
        strokeWidth="2.1"
      />
      <path d="M60 108c1 3 1 6-1 8" {...ink} strokeWidth="1.5" opacity="0.7" />

      {/* right leg — hip to knee to ankle, direction reverses at the knee */}
      <path
        d="M113 124C115 135 120 143 119 149C118 156 111 166 108 176"
        {...ink}
        strokeWidth="2.2"
      />
      <path d="M104 176h10" {...ink} strokeWidth="4.2" opacity="0.9" />

      {/* left leg — hand-varied, distinct knee bend */}
      <path
        d="M86 123C83 133 79 142 82 148C85 157 92 167 90 177"
        {...ink}
        strokeWidth="2.2"
      />
      <path d="M85 177h9" {...ink} strokeWidth="4.2" opacity="0.9" />

      {/* lungs */}
      <path
        d="M83 78c-6 3-8 11-4 19 3 6 9 5 10 0 1-8-1-15-6-19Z"
        fill="var(--sky)"
        opacity="0.4"
      />
      <path
        d="M117 78c6 3 8 11 4 19-3 6-9 5-10 0-1-8 1-15 6-19Z"
        fill="var(--sky)"
        opacity="0.4"
      />

      {/* heart */}
      <path
        d="M99 96c-6-10-19-6-19 3 0 8 10 16 19 23 9-7 19-15 19-23 0-9-13-13-19-3Z"
        fill="var(--coral)"
        opacity="0.85"
      />
      <path
        d="M99 96c-6-10-19-6-19 3 0 8 10 16 19 23 9-7 19-15 19-23 0-9-13-13-19-3Z"
        {...ink}
        strokeWidth="1.6"
      />

      {/* pulse line, a small character touch */}
      <path
        d="M46 130h16l6 -14 7 26 6 -18 5 6h60"
        {...ink}
        strokeWidth="1.6"
        opacity="0.7"
      />
    </svg>
  );
}
