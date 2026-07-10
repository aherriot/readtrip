const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: a Viking longship. The hull is one
 * continuous closed path — the sheerline (top edge) is a single bowed
 * sweep that dips at midship and rises dramatically at BOTH bow and
 * stern into carved prow points, rather than curling at only one end.
 * A single square sail hangs from one central mast, and shields of
 * varied size/spacing are mounted along the gunwale.
 */
export function VikingShipIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 62C30 46 62 38 98 42C134 38 166 48 194 64"
        fill="var(--sky)"
        opacity="0.2"
      />

      {/* sun low on the horizon, round-shape technique */}
      <path
        d="M158 50c6.4-1 11.8 3.7 11.6 9.8C169.4 66 164 70.4 157.6 69.8 151 69.2 146.2 64.2 146.6 58 147 51.8 152 51 158 50Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M158 50c6.4-1 11.8 3.7 11.6 9.8C169.4 66 164 70.4 157.6 69.8 151 69.2 146.2 64.2 146.6 58 147 51.8 152 51 158 50Z"
        {...ink}
        strokeWidth="1.5"
      />

      {/* gulls */}
      <path
        d="M40 28c2.4-2.4 4.6-2.4 6.4 0 1.8-2.4 4-2.4 6 0M64 38c2-2.1 4-2.1 5.6 0 1.6-2.1 3.5-2.1 5.4 0"
        {...ink}
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* mast, one gently bowed continuous stroke */}
      <path d="M100 140C99 110 100 70 102 36" {...ink} strokeWidth="2.6" />

      {/* square sail on the single central mast */}
      <path
        d="M67 46C82 40 118 40 133 47C136 62 137 78 133 90C112 96 88 96 68 90C65 76 65 60 67 46Z"
        fill="var(--coral)"
        opacity="0.5"
      />
      <path
        d="M67 46C82 40 118 40 133 47C136 62 137 78 133 90C112 96 88 96 68 90C65 76 65 60 67 46Z"
        {...ink}
        strokeWidth="1.9"
      />
      <path
        d="M74 52c14 4 40 4 52-2M70 68c18 4 42 4 60-2M74 84c14 3 38 3 52-2"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* hull — one continuous closed path: front of bow, keel, stern
          curl, and the sheerline sweeping back up to the bow, each
          curve hand-varied so bow and stern aren't mirror copies */}
      <path
        d="M184 62C196 84 190 110 172 134C136 150 78 152 26 126C18 112 8 90 18 68C40 86 70 100 100 108C130 100 158 84 184 62Z"
        {...ink}
        strokeWidth="2.4"
      />
      {/* sketchy retrace */}
      <path
        d="M183 63C194 84 189 109 171 133C136 149 79 151 27 125C19 112 10 91 19 69C41 87 70 101 100 109C129 101 157 85 183 63Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* bow prow — dragon-head carving detail, curling further up/out */}
      <path
        d="M184 62c8-8 10-18 6-28-4 5-10 9-12 16"
        {...ink}
        strokeWidth="1.8"
      />
      <path
        d="M190 34c1.4-1.3 3.1-1 3.4.7.3 1.7-1.5 2.3-3.4 1.5Z"
        fill="var(--surface-ink)"
        opacity="0.7"
      />

      {/* stern — a different, smaller carved curl (not a mirror of the bow) */}
      <path d="M18 68c-5-6-6-13-3-20" {...ink} strokeWidth="1.6" />
      <path
        d="M15 48c4-2 8-1 10 2-4 2-7 2-10-2Z"
        {...ink}
        strokeWidth="1.4"
        opacity="0.6"
      />

      {/* shields along the hull, varied size and spacing */}
      <path
        d="M66.9 129C68 136.4 67 137.6 59.6 138.7C51.5 139.9 50.1 139.2 48.9 131.1C47.8 123.6 52.3 121 59.8 122.4C66.9 123.8 65.9 121.8 66.9 129Z"
        fill="var(--sky)"
        opacity="0.7"
      />
      <path
        d="M66.9 129C68 136.4 67 137.6 59.6 138.7C51.5 139.9 50.1 139.2 48.9 131.1C47.8 123.6 52.3 121 59.8 122.4C66.9 123.8 65.9 121.8 66.9 129Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M102.7 137.4C101.2 142.9 100.8 143.5 95.1 142.9C88.6 142.3 86.8 140.9 88.4 134.5C90 128.3 91.2 128.7 97.5 129.8C103.3 130.9 104.3 131.7 102.7 137.4Z"
        fill="var(--leaf)"
        opacity="0.7"
      />
      <path
        d="M102.7 137.4C101.2 142.9 100.8 143.5 95.1 142.9C88.6 142.3 86.8 140.9 88.4 134.5C90 128.3 91.2 128.7 97.5 129.8C103.3 130.9 104.3 131.7 102.7 137.4Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M139.8 132.4C139.4 139.3 139 139.3 132.2 139.4C125.6 139.6 123.7 136.9 125.1 130.5C126.4 124.5 126.7 123.9 132.9 124.6C139.4 125.3 140.2 125.9 139.8 132.4Z"
        fill="var(--coral)"
        opacity="0.65"
      />
      <path
        d="M139.8 132.4C139.4 139.3 139 139.3 132.2 139.4C125.6 139.6 123.7 136.9 125.1 130.5C126.4 124.5 126.7 123.9 132.9 124.6C139.4 125.3 140.2 125.9 139.8 132.4Z"
        {...ink}
        strokeWidth="1.3"
      />
      <path
        d="M34 122c1-3 4-5 6-3 3-2 5 0 5 3 0 3-2 5-5 4-2 1-6-1-6-4Z"
        fill="var(--sun)"
        opacity="0.6"
      />
      <path
        d="M34 122c1-3 4-5 6-3 3-2 5 0 5 3 0 3-2 5-5 4-2 1-6-1-6-4Z"
        {...ink}
        strokeWidth="1.2"
      />

      {/* oars, faint */}
      <path
        d="M28 132c-8 3-15 6-22 12M170 130c8 2 15 5 21 11"
        {...ink}
        strokeWidth="1.4"
        opacity="0.55"
      />

      {/* waterline + waves */}
      <path
        d="M6 158C36 152 62 162 96 158 130 154 158 162 194 156"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 160C36 154 62 164 96 160 130 156 158 164 194 158 194 172 190 176 96 176 10 176 6 172 6 160Z"
        fill="var(--sky)"
        opacity="0.16"
      />
      <path
        d="M20 168q8 4 16 0M150 170q8 4 16 0"
        {...ink}
        strokeWidth="1.3"
        opacity="0.5"
      />
    </svg>
  );
}
