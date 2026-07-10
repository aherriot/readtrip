const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a dancer mid-arabesque. Unlike
 * `human-body.tsx`'s static standing figure, the pose is dynamic — a
 * standing leg planted, the working leg extended back and up, one arm
 * curved overhead and the other low to the side — with a flowing tutu and
 * hair in a bun. Head stays noticeably smaller than the torso and the
 * elbow/knee joints get a real bend, not a smooth bow.
 */
export function BalletDancerIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* head + torso, one continuous silhouette */}
      <path
        d="M104 26C111 26 118 31 116 38C122 41 128 47 129 58C127 68 121 73 117 75C114 82 112 87 113 93C120 98 128 101 130 108C130 115 122 119 116 118C108 121 100 120 95 116C89 118 84 115 83 109C84 101 92 97 96 92C93 85 90 79 90 73C86 70 82 65 83 58C85 47 93 40 100 37C97 33 99 28 104 26Z"
        fill="var(--orchid)"
        opacity="0.14"
      />
      <path
        d="M104 26C111 26 118 31 116 38C122 41 128 47 129 58C127 68 121 73 117 75C114 82 112 87 113 93C120 98 128 101 130 108C130 115 122 119 116 118C108 121 100 120 95 116C89 118 84 115 83 109C84 101 92 97 96 92C93 85 90 79 90 73C86 70 82 65 83 58C85 47 93 40 100 37C97 33 99 28 104 26Z"
        {...ink}
        strokeWidth="2.1"
      />
      {/* sketchy retrace pass */}
      <path
        d="M104 27C110 27 117 32 115 38C121 42 127 47 128 58C126 68 120 73 116 75C113 82 111 87 112 93C119 98 127 101 129 107C129 114 121 118 115 117C107 120 100 119 96 115C90 117 85 114 84 108C85 101 93 97 97 92C94 85 91 79 91 73C87 70 83 65 84 58C86 47 94 40 100 37C98 33 100 28 104 27Z"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* hair bun */}
      <path
        d="M112 30c4-2 8 1 7 5-1 4-6 5-9 2-2-2-1-5 2-7Z"
        fill="var(--surface-ink)"
        opacity="0.8"
      />
      <path
        d="M112 30c4-2 8 1 7 5-1 4-6 5-9 2-2-2-1-5 2-7Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* front arm — curved overhead */}
      <path
        d="M122 46C130 35 126 21 109 16C99 14 92 19 90 25"
        {...ink}
        strokeWidth="2.1"
      />
      <path d="M90 25c-2 2-3 4-2 6" {...ink} strokeWidth="1.5" opacity="0.7" />

      {/* back arm — extended low to the side, hand-varied not mirrored */}
      <path
        d="M90 50C81 51 71 53 65 57C61 59 58 60 56 62"
        {...ink}
        strokeWidth="2.1"
      />
      <path d="M56 62c-2 1-3 2-4 4" {...ink} strokeWidth="1.5" opacity="0.7" />

      {/* tutu — flowing tulle, layered */}
      <path
        d="M80 110c-9 5-16 15-13 25 3 9 13 12 22 10 8 8 21 9 30 3 10 5 22 2 26-6 4-8-3-17-11-21 2-9-5-17-14-19-8-5-18-3-24 3-6-4-14-2-20 5Z"
        fill="var(--orchid)"
        opacity="0.16"
      />
      <path
        d="M78 111c-8 6-14 16-12 26 3 10 14 14 24 12 8 8 20 10 30 4 10 6 22 3 26-6 4-8-2-18-10-22 2-10-4-18-14-20-8-6-18-4-24 2-6-4-14-2-20 4Z"
        fill="var(--violet)"
        opacity="0.28"
      />
      <path
        d="M78 111c-8 6-14 16-12 26 3 10 14 14 24 12 8 8 20 10 30 4 10 6 22 3 26-6 4-8-2-18-10-22 2-10-4-18-14-20-8-6-18-4-24 2-6-4-14-2-20 4Z"
        {...ink}
        strokeWidth="1.7"
      />

      {/* standing leg — planted, real knee flex */}
      <path
        d="M99 118C101 130 104 143 101 155C100 166 97 177 94 188"
        {...ink}
        strokeWidth="2.2"
      />
      <path d="M89 189 96 191" {...ink} strokeWidth="2.4" opacity="0.85" />

      {/* working leg — extended back and up into arabesque */}
      <path
        d="M97 119C112 122 130 117 146 105C153 100 158 96 162 92"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M162 92c4-2 8-3 11-2"
        {...ink}
        strokeWidth="1.8"
        opacity="0.85"
      />

      {/* a small sparkle trailing the lifted foot — character touch */}
      <path
        d="M178 84c1-3 3-3 4 0M182 79c0-2 2-2 2 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.7"
      />
    </svg>
  );
}
