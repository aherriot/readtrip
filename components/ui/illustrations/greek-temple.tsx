const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function GreekTempleIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M8 66C34 50 68 42 100 46C134 42 164 50 192 64"
        fill="var(--sky)"
        opacity="0.22"
      />

      {/* sun */}
      <path
        d="M34 26c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M34 26c6-1 11 4 11 9 .5 6-5 10-11 9-6 1-11-3-11-9 0-5 5-8 11-9Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* pediment — hand-bowed triangle, not perfect */}
      <path
        d="M28 76C56 54 76 40 100 32C124 41 145 55 172 77C124 73 76 73 28 76Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M52 68c16-14 32-24 48-25M100 33c17 8 30 19 44 34"
        {...ink}
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* roofline detail */}
      <path d="M26 76C60 71 140 71 174 76" {...ink} strokeWidth="2.4" />
      <path
        d="M64 60c3-2 7-1 8 2M112 55c3-1 6 1 7 4"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />

      {/* columns — five, each hand-varied, no two identical */}
      <path d="M40 84C39 108 41 138 39 164" {...ink} strokeWidth="2.2" />
      <path d="M52 85C53 110 51 140 52 165" {...ink} strokeWidth="2.2" />
      <path
        d="M44 96c1 8-1 20 1 30M46 118c1 6 0 15 1 22"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      <path d="M76 83C75 109 77 137 76 164" {...ink} strokeWidth="2.2" />
      <path d="M88 84C89 111 87 139 88 165" {...ink} strokeWidth="2.2" />
      <path
        d="M80 100c1 9-1 19 1 28"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      <path d="M112 84C111 110 113 138 112 165" {...ink} strokeWidth="2.2" />
      <path d="M124 83C125 109 123 137 124 164" {...ink} strokeWidth="2.2" />
      <path
        d="M116 102c1 8-1 18 1 27"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      <path d="M148 85C147 111 149 139 148 165" {...ink} strokeWidth="2.2" />
      <path d="M160 84C161 110 159 138 160 164" {...ink} strokeWidth="2.2" />
      <path
        d="M152 98c1 9-1 20 1 29"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* column capitals — small hand curls, not repeated identically */}
      <path
        d="M37 84c2-3 8-3 10 0M74 82c2-3 9-3 11 0M110 83c2-3 9-3 11 0M146 84c2-3 9-3 11 0"
        {...ink}
        strokeWidth="1.6"
      />

      {/* steps */}
      <path d="M18 165C58 161 142 161 182 165" {...ink} strokeWidth="2" />
      <path d="M12 172C56 168 144 168 188 172" {...ink} strokeWidth="2" />
      <path d="M6 179C54 175 146 175 194 179" {...ink} strokeWidth="2" />
      <path
        d="M6 181C54 177 146 177 194 181 194 188 188 190 100 190 12 190 6 188 6 181Z"
        fill="var(--sun)"
        opacity="0.14"
      />

      {/* olive branch accent + vase */}
      <path
        d="M158 152c3-6 8-9 14-9-2 6-6 9-14 9Zm0 0c1-7 6-11 13-11-3 7-7 10-13 11Z"
        fill="var(--leaf)"
        opacity="0.7"
      />
      <path
        d="M158 152c3-6 8-9 14-9-2 6-6 9-14 9Zm0 0c1-7 6-11 13-11-3 7-7 10-13 11Z"
        {...ink}
        strokeWidth="1.2"
      />

      {/* small bird */}
      <path
        d="M150 40c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />
    </svg>
  );
}
