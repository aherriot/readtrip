const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function GearsMachineIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* workshop wash */}
      <path
        d="M8 48C40 38 68 42 100 38C134 42 162 36 192 46"
        fill="var(--sun)"
        opacity="0.14"
      />

      {/* big gear — teeth as hand-varied notches around a round-ish path, not a scallop ring */}
      <path
        d="M74 46c4-6 8-6 10 0 5-3 9-1 8 5 6 1 8 5 4 9 4 5 2 10-4 11 1 6-3 9-9 8-1 6-6 8-10 4-4 4-9 2-10-4-6 1-10-2-9-8-6-1-8-6-4-11-4-4-2-8 4-9-1-6 3-8 8-5 1-6 6-6 12 0Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M67 70c0-9 8-16 17-16 9 0 17 7 17 16 0 9-8 16-17 16-9 0-17-7-17-16Z"
        fill="var(--sun)"
        opacity="0.4"
      />
      <path
        d="M67 70c0-9 8-16 17-16 9 0 17 7 17 16 0 9-8 16-17 16-9 0-17-7-17-16Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M78 70c0-3 3-6 6-6 3 0 6 3 6 6 0 3-3 6-6 6-3 0-6-3-6-6Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* smaller interlocking gear, hand-varied teeth */}
      <path
        d="M136 92c3-5 6-5 8 0 4-2 7-1 6 4 5 1 6 4 3 7 3 4 1 8-3 9 1 5-2 7-7 6-1 5-5 6-8 3-3 3-7 1-8-3-5 1-8-1-7-6-4-1-5-5-3-9-3-3-1-6 3-7-1-5 2-6 6-4 2-4 6-4 10 0Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M130 111c0-7 6-13 14-13 8 0 14 6 14 13 0 7-6 13-14 13-8 0-14-6-14-13Z"
        fill="var(--sky)"
        opacity="0.4"
      />
      <path
        d="M130 111c0-7 6-13 14-13 8 0 14 6 14 13 0 7-6 13-14 13-8 0-14-6-14-13Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M139 111c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* third small gear lower-left, hand-varied teeth */}
      <path
        d="M46 130c2-4 5-4 6 0 3-2 6-1 5 3 4 1 5 4 2 6 2 3 1 6-3 7 1 4-2 6-6 5-1 4-4 5-6 2-3 2-6 0-6-3-4 1-6-1-5-5-3-1-4-4-2-6-2-3 0-5 3-6-1-4 2-5 5-4 1-3 5-3 7 1Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M41 146c0-6 5-11 12-11 7 0 12 5 12 11 0 6-5 11-12 11-7 0-12-5-12-11Z"
        fill="var(--leaf)"
        opacity="0.4"
      />
      <path
        d="M41 146c0-6 5-11 12-11 7 0 12 5 12 11 0 6-5 11-12 11-7 0-12-5-12-11Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* connecting bolts / plate the gears sit on */}
      <path d="M30 176C70 170 130 174 172 168" {...ink} strokeWidth="2.4" />
      <path
        d="M30 178C70 172 130 176 172 170 172 182 166 186 100 186 34 186 30 182 30 178Z"
        fill="var(--surface-ink)"
        opacity="0.08"
      />
      <path
        d="M52 176c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5ZM140 172c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* steam puff / motion lines */}
      <path
        d="M170 40c-6-4-4-10 1-13-4-6 1-11 7-8"
        {...ink}
        strokeWidth="1.3"
        opacity="0.4"
      />
      <path d="M20 60q8 3 16 0" {...ink} strokeWidth="1.2" opacity="0.4" />
    </svg>
  );
}
