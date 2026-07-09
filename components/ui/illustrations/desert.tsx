const ink = {
  fill: "none",
  stroke: "var(--surface-ink)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * A field-journal illustration: rolling dunes, a walking camel, a saguaro
 * cactus, and a low sun. The camel's body+hump+neck is one continuous
 * silhouette (legs break off separately, same as the dinosaur); the cactus's
 * arm is a bump on its own silhouette rather than a stitched-on shape.
 */
export function DesertIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* sky wash */}
      <path
        d="M6 60C36 42 74 32 112 38C146 32 176 44 194 60C194 72 194 82 192 90C150 82 108 88 66 84C36 82 14 76 6 70C4 66 4 63 6 60Z"
        fill="var(--sun)"
        opacity="0.14"
      />

      {/* sun */}
      <path
        d="M158 46c7-.3 13 5 12.6 12.2C170.2 65 164 70 157 69.6 150 69.2 145 63.4 145.4 56.6 145.8 49.8 151.4 46.3 158 46Z"
        fill="var(--sun)"
        opacity="0.85"
      />
      <path
        d="M158 46c7-.3 13 5 12.6 12.2C170.2 65 164 70 157 69.6 150 69.2 145 63.4 145.4 56.6 145.8 49.8 151.4 46.3 158 46Z"
        {...ink}
        strokeWidth="1.7"
      />

      {/* camel body + hump + neck, one continuous silhouette */}
      <path
        d="M170 108C177 103 173 94 165 92C162 84 159 90 157 86C151 75 149 63 146 57C141 45 133 42 129 47C123 52 121 59 117 63C107 59 97 63 94 73C85 71 79 77 79 83C73 79 69 85 71 91C63 93 57 101 61 107C67 105 73 103 79 101C85 109 93 113 103 111C111 117 127 117 137 111C145 115 151 113 155 107C161 109 165 109 170 108Z"
        fill="var(--sun)"
        opacity="0.16"
      />
      <path
        d="M170 108C177 103 173 94 165 92C162 84 159 90 157 86C151 75 149 63 146 57C141 45 133 42 129 47C123 52 121 59 117 63C107 59 97 63 94 73C85 71 79 77 79 83C73 79 69 85 71 91C63 93 57 101 61 107C67 105 73 103 79 101C85 109 93 113 103 111C111 117 127 117 137 111C145 115 151 113 155 107C161 109 165 109 170 108Z"
        {...ink}
        strokeWidth="2.2"
      />
      <path
        d="M168 106C174 102 171 94 163 92C160 85 158 90 156 87C150 76 148 64 145 58C140 47 133 44 130 49C124 54 122 60 118 64C108 60 98 64 95 74C87 72 81 78 81 84C75 80 71 86 73 92C65 94 59 101 63 106C68 104 74 102 80 100C86 108 94 112 104 110C112 116 127 115 137 110C144 114 150 112 154 106C159 108 164 108 168 106Z"
        {...ink}
        strokeWidth="1.1"
        opacity="0.4"
      />

      {/* legs */}
      <path
        d="M150 106c1 16 1 30 0 44M163 104c2 16 2 30 0 44"
        {...ink}
        strokeWidth="4.5"
      />
      <path
        d="M76 92c-1 16-2 30-3 44M90 96c0 16 0 30-1 44"
        {...ink}
        strokeWidth="4.5"
        opacity="0.85"
      />

      {/* cactus, arm as a bump on the same silhouette */}
      <path
        d="M40 172C36 152 34 132 36 114C30 110 24 102 28 94C32 88 40 90 42 98C42 82 44 64 48 48C50 42 56 42 58 48C60 64 60 82 58 98C64 92 72 92 74 100C76 108 68 114 60 112C60 132 60 152 58 172C52 174 46 174 40 172Z"
        fill="var(--leaf)"
        opacity="0.3"
      />
      <path
        d="M40 172C36 152 34 132 36 114C30 110 24 102 28 94C32 88 40 90 42 98C42 82 44 64 48 48C50 42 56 42 58 48C60 64 60 82 58 98C64 92 72 92 74 100C76 108 68 114 60 112C60 132 60 152 58 172C52 174 46 174 40 172Z"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M40 90c1 16 1 40 0 60M50 60c1 20 1 44 0 66"
        {...ink}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* footprints, character touch */}
      <path
        d="M110 168c.6-1.4 3-1.4 2.6.6s-3.2 1.4-2.6-.6ZM122 172c.6-1.4 3-1.4 2.6.6s-3.2 1.4-2.6-.6Z"
        {...ink}
        strokeWidth="1.2"
        opacity="0.5"
      />

      {/* dune horizon layers */}
      <path
        d="M6 150C40 138 76 156 112 148 144 142 172 158 194 148"
        {...ink}
        strokeWidth="1.6"
        opacity="0.5"
      />
      <path
        d="M6 172C40 162 76 176 112 170 144 164 172 178 194 170"
        {...ink}
        strokeWidth="2"
      />
      <path
        d="M6 174C40 164 76 178 112 172 144 166 172 180 194 172 194 190 190 194 100 194 12 194 6 188 6 174Z"
        fill="var(--sun)"
        opacity="0.16"
      />
    </svg>
  );
}
