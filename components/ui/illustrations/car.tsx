const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CarIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 60C34 44 68 36 100 40C134 36 166 46 194 62"
        fill="var(--sky)"
        opacity="0.18"
      />

      {/* sun */}
      <path
        d="M158 36c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M158 36c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* body — one continuous silhouette, hood to trunk with cabin bump */}
      <path
        d="M20 138C22 126 30 120 42 118C48 104 60 96 76 96C88 96 98 100 106 108C122 104 140 106 152 116C164 116 174 122 176 132C182 132 186 136 184 142C182 148 176 150 168 148C150 150 130 150 112 148C92 150 68 150 48 148C36 150 24 148 20 140Z"
        fill="var(--coral)"
        opacity="0.4"
      />
      <path
        d="M20 138C22 126 30 120 42 118C48 104 60 96 76 96C88 96 98 100 106 108C122 104 140 106 152 116C164 116 174 122 176 132C182 132 186 136 184 142C182 148 176 150 168 148C150 150 130 150 112 148C92 150 68 150 48 148C36 150 24 148 20 140Z"
        {...ink}
        strokeWidth="2.2"
      />
      {/* sketchy retrace */}
      <path
        d="M21 137C23 125 31 119 43 117C49 103 61 95 77 95"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* windshield + windows */}
      <path
        d="M50 118c4-10 14-16 26-16 10 0 18 5 24 12-16 4-34 4-50 4Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M50 118c4-10 14-16 26-16 10 0 18 5 24 12-16 4-34 4-50 4Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M108 114c8-2 20 0 28 6-9 1-19 1-27 0Z"
        fill="var(--sky)"
        opacity="0.4"
      />
      <path
        d="M108 114c8-2 20 0 28 6-9 1-19 1-27 0Z"
        {...ink}
        strokeWidth="1.5"
      />
      <path
        d="M76 102c1 6-1 12 1 18"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* door line + handle */}
      <path
        d="M88 122C87 132 89 140 88 148"
        {...ink}
        strokeWidth="1.4"
        opacity="0.5"
      />
      <path d="M96 130q6 2 12 0" {...ink} strokeWidth="1.2" opacity="0.5" />

      {/* headlight + taillight */}
      <path
        d="M22 132c0-3 3-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-2 0-5-2-5-5Z"
        fill="var(--sun)"
        opacity="0.8"
      />
      <path
        d="M22 132c0-3 3-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-2 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M172 128c0-3 2-5 5-5 2 0 4 2 4 5 0 3-2 5-4 5-3 0-5-2-5-5Z"
        fill="var(--coral)"
        opacity="0.7"
      />
      <path
        d="M172 128c0-3 2-5 5-5 2 0 4 2 4 5 0 3-2 5-4 5-3 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* bumper stripe */}
      <path
        d="M28 148C64 150 108 150 150 148"
        stroke="var(--sun)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* wheels — hand-drawn spoked circles, not <circle> */}
      <path
        d="M46 168c0-8 7-15 15-15 8 0 15 7 15 15 0 8-7 15-15 15-8 0-15-7-15-15Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M49 168c0-6 5-11 12-11 7 0 12 5 12 11 0 6-5 11-12 11-7 0-12-5-12-11Z"
        fill="var(--surface-ink)"
        opacity="0.1"
      />
      <path d="M61 156v24M49 168h24" {...ink} strokeWidth="1.1" opacity="0.5" />

      <path
        d="M134 168c0-8 7-15 15-15 8 0 15 7 15 15 0 8-7 15-15 15-8 0-15-7-15-15Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M137 168c0-6 5-11 12-11 7 0 12 5 12 11 0 6-5 11-12 11-7 0-12-5-12-11Z"
        fill="var(--surface-ink)"
        opacity="0.1"
      />
      <path
        d="M149 156v24M137 168h24"
        {...ink}
        strokeWidth="1.1"
        opacity="0.5"
      />

      {/* road */}
      <path
        d="M6 186C46 182 78 190 108 186 140 182 168 190 194 184"
        {...ink}
        strokeWidth="2.2"
      />
      <path d="M20 190q60-4 120 0" {...ink} strokeWidth="1.3" opacity="0.45" />
    </svg>
  );
}
