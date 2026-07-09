const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SteamTrainIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 54C34 38 68 30 100 34C134 30 166 40 194 56"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* steam puffs */}
      <path
        d="M58 40c-6-4-4-11 2-14-5-6 1-13 8-10-3-8 6-13 11-8"
        {...ink}
        strokeWidth="1.4"
        opacity="0.45"
      />

      {/* sun */}
      <path
        d="M160 28c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M160 28c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* body — one continuous silhouette from cowcatcher to cab roof */}
      <path
        d="M24 152C22 138 28 128 38 126C40 108 44 92 54 84C56 96 56 108 60 118C74 96 96 88 120 90C122 78 130 70 142 68C144 82 144 96 146 110C158 108 168 112 172 122C178 124 182 130 180 138C178 148 172 152 162 152C118 154 66 154 24 152Z"
        {...ink}
        strokeWidth="2.4"
      />
      {/* sketchy retrace */}
      <path
        d="M25 151C23 137 29 127 39 125C41 107 45 91 55 83C57 95 57 107 61 117C75 95 97 87 121 89C123 77 131 69 143 67C145 81 145 95 147 109C159 107 169 111 173 121C179 123 183 129 181 137C179 147 173 151 163 151"
        {...ink}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* smokestack */}
      <path
        d="M56 84c-1-8 0-15 3-20 4-1 8-1 11 0 2 5 3 12 2 20"
        {...ink}
        strokeWidth="1.9"
      />
      <path d="M55 84q9 4 18 0" {...ink} strokeWidth="1.6" />

      {/* cab window */}
      <path
        d="M144 76c1-4 5-6 9-5 4-1 8 1 8 5 1 5-3 9-9 8-5 1-9-3-8-8Z"
        fill="var(--sky)"
        opacity="0.5"
      />
      <path
        d="M144 76c1-4 5-6 9-5 4-1 8 1 8 5 1 5-3 9-9 8-5 1-9-3-8-8Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* boiler bands */}
      <path
        d="M68 100q10 3 20 0M92 92q11 3 22 0"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* headlamp */}
      <path
        d="M26 138c0-4 3-6 6-6 3 0 5 2 5 6 0 4-2 6-5 6-3 0-6-2-6-6Z"
        fill="var(--sun)"
        opacity="0.8"
      />
      <path
        d="M26 138c0-4 3-6 6-6 3 0 5 2 5 6 0 4-2 6-5 6-3 0-6-2-6-6Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* red trim stripe */}
      <path
        d="M40 128C74 126 116 128 150 130"
        stroke="var(--coral)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* wheels — hand-drawn spoked circles, not <circle> */}
      <path
        d="M56 152c0-9 7-16 16-16 9 0 16 7 16 16 0 9-7 16-16 16-9 0-16-7-16-16Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M60 152c0-7 5-12 12-12 7 0 12 5 12 12 0 7-5 12-12 12-7 0-12-5-12-12Z"
        fill="var(--surface-ink)"
        opacity="0.1"
      />
      <path
        d="M72 138v28M60 152h24M64 142l16 20M80 142l-16 20"
        {...ink}
        strokeWidth="1.2"
        opacity="0.6"
      />

      <path
        d="M120 154c0-8 6-14 14-14 8 0 14 6 14 14 0 8-6 14-14 14-8 0-14-6-14-14Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M123 154c0-6 5-11 11-11 6 0 11 5 11 11 0 6-5 11-11 11-6 0-11-5-11-11Z"
        fill="var(--surface-ink)"
        opacity="0.1"
      />
      <path
        d="M134 140v28M120 154h28M124 145l14 18M138 145l-14 18"
        {...ink}
        strokeWidth="1.2"
        opacity="0.6"
      />

      {/* small front wheel */}
      <path
        d="M30 148c0-6 5-10 11-10 6 0 11 4 11 10 0 6-5 10-11 10-6 0-11-4-11-10Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path d="M41 138v20M30 148h22" {...ink} strokeWidth="1.1" opacity="0.5" />

      {/* connecting rod */}
      <path
        d="M41 148C58 146 68 150 80 152"
        {...ink}
        strokeWidth="1.6"
        opacity="0.6"
      />

      {/* track */}
      <path
        d="M6 176C46 172 78 180 108 176 140 172 168 180 194 174"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M20 182q60-6 120 0M6 190q90-8 188 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
