const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: two meshing gears and a smaller idle
 * gear on a mounting plate. Unlike an organic edge, real gear teeth ARE
 * evenly spaced — so each gear is one closed path plotted around a
 * circle with a consistent tooth rhythm (12/9/8 teeth), the hand-drawn
 * imperfection coming from small tooth-to-tooth jitter and the hub
 * being drawn with the round-shape technique (a handful of long curves,
 * not a scallop ring), rather than from random notch spacing. The big
 * and mid gears are placed so their teeth visually interlock.
 */
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
        d="M8 40C40 30 68 34 100 30C134 34 162 28 192 38"
        fill="var(--sun)"
        opacity="0.14"
      />

      {/* mounting plate / frame, drawn first so the gears sit on top */}
      <path
        d="M22 168C64 160 132 164 178 156C182 172 178 184 100 186C22 188 18 182 22 168Z"
        fill="var(--surface-ink)"
        opacity="0.08"
      />
      <path
        d="M22 168C64 160 132 164 178 156C182 172 178 184 100 186C22 188 18 182 22 168Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M40 174c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5ZM152 168c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* big gear — 12 teeth, hand-plotted rhythm with slight jitter */}
      <path
        d="M104 72.7L112.3 77.9L111.7 84.7L102.5 88.4L107.7 97.4L103.8 103.1L93.6 101.3L93.3 111.2L87.1 114.1L79.3 107.9L74.1 116L67.3 115.4L63.5 106.8L54.8 111.4L49.2 107.5L50.8 97.4L41.2 97L38.4 90.9L43.8 83.3L36.1 78.1L36.7 71.4L45.8 67.7L40.5 58.7L44.4 53.1L54.2 54.4L54.5 44.3L60.7 41.3L68.7 48L73.9 39.4L80.8 40L84.3 49.8L92.9 45.1L98.5 48.9L97 58.7L107.3 58.7L110.1 64.9Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M88.5 76.6C77.8 91.4 77.8 91.4 77.8 91.4C62.7 87.7 62.7 87.7 62.7 87.7C63.4 68.8 63.4 68.8 63.4 68.8C78.1 65.4 78.1 65.4 78.1 65.4C88.5 76.6 88.5 76.6 88.5 76.6Z"
        fill="var(--sun)"
        opacity="0.4"
      />
      <path
        d="M88.7 76.3C90.1 88.9 85.4 92.5 73.3 91.9C61.3 91.3 60.2 92.5 58.9 79.5C57.6 66.5 63.4 62.7 75.5 64C87.6 65.3 87.2 63.6 88.7 76.3Z"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M78 76c0-3 3-6 6-6 3 0 6 3 6 6 0 3-3 6-6 6-3 0-6-3-6-6Z"
        {...ink}
        strokeWidth="1.4"
      />

      {/* mid gear — 9 teeth, positioned so its teeth mesh with the big gear */}
      <path
        d="M136.9 48.7L143.9 51.3L144.4 56.8L137.6 60.4L141.8 67.1L138.6 71.7L131 70.1L129.6 77.1L124.4 78.5L119.6 73.5L113.9 77.9L109 75.6L108.8 68.3L101.1 68.4L98.8 63.4L103.8 57.5L98 52.7L99.4 47.3L107 46.1L105.9 39L110.3 35.9L116.6 39L120.4 33.1L125.8 33.6L128.5 40.1L135.2 38.1L139 41.9Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M127.9 57.1C127 63 130.8 64 122.7 65.4C114.6 66.7 114.9 62.6 114.3 56.8C113.6 50.9 115 48.1 121.5 48.5C128 48.8 128.9 51.2 127.9 57.1Z"
        fill="var(--sky)"
        opacity="0.4"
      />
      <path
        d="M127.9 57.1C127 63 130.8 64 122.7 65.4C114.6 66.7 114.9 62.6 114.3 56.8C113.6 50.9 115 48.1 121.5 48.5C128 48.8 128.9 51.2 127.9 57.1Z"
        {...ink}
        strokeWidth="1.6"
      />
      <path
        d="M117 57c0-3 2-5 5-5 3 0 5 2 5 5 0 3-2 5-5 5-3 0-5-2-5-5Z"
        {...ink}
        strokeWidth="1.3"
      />

      {/* small idle gear, lower-left, 8 teeth */}
      <path
        d="M56.6 147.2L61.4 150.7L60.6 155.3L55 157L56.2 163.2L52.3 166L46.7 162.2L43.3 167.4L38.7 166.6L37.3 160.6L31.3 161.7L28.6 158L31.8 152.7L26 149.3L26.8 144.5L33.4 143.3L31.9 136.9L35.8 134.2L41.3 137.6L44.7 132.5L49.3 133.3L50.9 139.2L57.4 137.7L60.1 141.7Z"
        {...ink}
        strokeWidth="1.7"
      />
      <path
        d="M50.8 151C49.9 156.9 47.7 155.7 43.3 155.1C38.9 154.5 38 154.9 38.2 149.8C38.3 144.8 39.5 144.7 44.1 144.7C48.6 144.8 51.7 145.1 50.8 151Z"
        fill="var(--leaf)"
        opacity="0.4"
      />
      <path
        d="M50.8 151C49.9 156.9 47.7 155.7 43.3 155.1C38.9 154.5 38 154.9 38.2 149.8C38.3 144.8 39.5 144.7 44.1 144.7C48.6 144.8 51.7 145.1 50.8 151Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* linkage rod from the idle gear up to the frame, and steam puff */}
      <path
        d="M52 130c10-12 16-24 12-40"
        {...ink}
        strokeWidth="2.2"
        opacity="0.6"
      />
      <path
        d="M170 36c-6-4-4-10 1-13-4-6 1-11 7-8"
        {...ink}
        strokeWidth="1.3"
        opacity="0.4"
      />
      <path d="M20 58q8 3 16 0" {...ink} strokeWidth="1.2" opacity="0.4" />
    </svg>
  );
}
