import type { ReactNode } from "react";

/**
 * The unified icon set — one consistent "field-journal doodle" language for the
 * whole product. Every glyph is authored on a 24×24 grid as CLEAN geometry; the
 * shared `#rt-doodle` filter (see IconDefs) adds the hand-drawn waver, and the
 * `<Icon>` wrapper owns sizing, a11y, and the accent color. So a glyph here is
 * just the inner paths.
 *
 * Two ink layers per glyph:
 *  - `ink`  — the pen outline, `currentColor` (inherits `--surface-ink`).
 *  - `pop`  — a "colored-in" accent fill (`var(--icon-accent)`), often nudged a
 *             hair off the outline so it reads like crayon over the ink.
 */
const ink = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const pop = { fill: "var(--icon-accent)", stroke: "none" } as const;

export const GLYPHS = {
  // ---- functional UI ----
  check: (
    <>
      <path
        {...ink}
        d="M3.6 12c0-4.7 3.8-8.5 8.4-8.5S20.4 7.3 20.4 12s-3.8 8.5-8.4 8.5"
        stroke="var(--icon-accent)"
        opacity="0.5"
      />
      <path {...ink} d="M6.5 12.4 10.3 16.4 17.7 7.4" strokeWidth="2" />
    </>
  ),
  retry: (
    <>
      <path {...ink} d="M19 12a7 7 0 1 1-2.1-5" stroke="var(--icon-accent)" />
      <path {...pop} d="M17.4 3.4 17.6 8l-4.5-.8Z" />
    </>
  ),
  close: <path {...ink} d="M6 6 18 18M18 6 6 18" strokeWidth="2" />,
  search: (
    <>
      <circle
        {...pop}
        cx="10.7"
        cy="10.7"
        r="5.3"
        opacity="0.85"
        transform="translate(0.5 0.6)"
      />
      <circle {...ink} cx="10.5" cy="10.5" r="6" />
      <path {...ink} d="M15 15 20 20" strokeWidth="2" />
    </>
  ),
  "chevron-down": <path {...ink} d="M5 9 12 15.5 19 9" strokeWidth="2" />,
  alert: (
    <>
      <circle {...ink} cx="12" cy="12" r="8.6" />
      <path {...ink} d="M12 7.4v5.3" strokeWidth="2" />
      <circle cx="12" cy="16.4" r="1.1" fill="currentColor" />
    </>
  ),
  "arrow-right": (
    <path {...ink} d="M4 12h13.5M12 5.8 18.2 12 12 18.2" strokeWidth="2" />
  ),
  flag: (
    <>
      <path
        {...pop}
        d="M7 5.5h10l-2.2 3.6L17 12.7H7Z"
        transform="translate(0.5 0.7)"
      />
      <path {...ink} d="M6.5 20.5V4M6.5 5h10.5l-2.2 3.8L17 12.6H6.5" />
    </>
  ),
  compass: (
    <>
      <path
        {...pop}
        d="M15.9 8.6 13 13.4 8.3 15.7 11.1 10.8Z"
        opacity="0.9"
        transform="translate(0.6 1)"
      />
      <circle {...ink} cx="12" cy="12" r="8.6" />
      <path {...ink} d="M15.5 8.5 12.6 13 8.5 15.5 11.4 11Z" />
      <circle cx="12" cy="12" r="0.7" fill="currentColor" />
    </>
  ),

  // ---- adventure / reading ----
  rocket: (
    <>
      <path
        {...pop}
        d="M10.3 15.4c-.5 1.7-.4 3.5 1.7 5.5 2-2 2.2-3.8 1.6-5.6Z"
        transform="translate(0.4 0.8)"
      />
      <circle
        {...pop}
        cx="12"
        cy="9.8"
        r="1.7"
        transform="translate(0.5 0.6)"
      />
      <path
        {...ink}
        d="M12 2.2c3.3 2.4 5 6 5 10.1l-2 3H9l-2-3c0-4.1 1.7-7.7 5-10.1Z"
      />
      <circle {...ink} cx="12" cy="9.9" r="1.8" />
      <path
        {...ink}
        d="M9 15.3c-1.6.7-2.4 2.2-2.5 4 1.6-.3 2.5-1 3-1.9M15 15.3c1.6.7 2.4 2.2 2.5 4-1.6-.3-2.5-1-3-1.9"
      />
    </>
  ),
  book: (
    <>
      <path
        {...pop}
        d="M12 6.7C10.4 5.2 7.9 4.8 4.6 5.3v11.6c3.3-.5 5.8 0 7.4 1.4Z"
        opacity="0.92"
        transform="translate(-0.7 1.1)"
      />
      <path
        {...ink}
        d="M12 6.6C10.4 5.1 7.9 4.6 4.4 5.1v12c3.5-.5 6.1 0 7.6 1.5 1.5-1.5 4.1-2 7.6-1.5v-12C16.1 4.6 13.6 5.1 12 6.6Z"
      />
      <path {...ink} d="M12 6.6v12" />
    </>
  ),
  books: (
    <>
      <path
        {...pop}
        d="M14.5 4.7 19.4 6 16.8 20 12 18.7Z"
        transform="translate(0.4 0.4)"
      />
      <rect {...ink} x="4.5" y="5" width="5.2" height="15" rx="0.8" />
      <path {...ink} d="M4.5 9h5.2M4.5 16h5.2" />
      <path {...ink} d="M11.3 6.2 16.2 4.9l3.3 12.4-4.9 1.3Z" />
      <path {...ink} d="M12.2 9.6 17 8.3" opacity="0.8" />
    </>
  ),
  star: (
    <>
      <path
        {...pop}
        d="M12 3.6l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.9 6.9 18.9 8 13.3 3.8 9.5l5.7-.7Z"
        transform="translate(-0.9 1.1)"
      />
      <path
        {...ink}
        d="M12 3.6l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.9 6.9 18.9 8 13.3 3.8 9.5l5.7-.7Z"
      />
    </>
  ),

  // ---- rewards ----
  medal: (
    <>
      <path {...ink} d="M8.5 3.5 12 10M15.5 3.5 12 10" />
      <circle
        {...pop}
        cx="12"
        cy="15"
        r="5.2"
        opacity="0.9"
        transform="translate(0.4 0.5)"
      />
      <circle {...ink} cx="12" cy="15" r="5.5" />
      <path
        {...ink}
        d="M12 12.5l1 2 2.2.2-1.6 1.5.5 2.2L12 17.4 9.9 18.6l.5-2.2-1.6-1.5 2.2-.2Z"
        strokeWidth="1.3"
      />
    </>
  ),
  sparkles: (
    <>
      <path
        {...pop}
        d="M11 3c.6 2.8 1.7 3.9 4.5 4.5-2.8.6-3.9 1.7-4.5 4.5-.6-2.8-1.7-3.9-4.5-4.5C9.3 6.9 10.4 5.8 11 3Z"
        transform="translate(0.3 0.3)"
      />
      <path
        {...ink}
        d="M11 3c.6 2.8 1.7 3.9 4.5 4.5-2.8.6-3.9 1.7-4.5 4.5-.6-2.8-1.7-3.9-4.5-4.5C9.3 6.9 10.4 5.8 11 3Z"
      />
      <path
        {...ink}
        d="M17.5 13c.3 1.6 1 2.2 2.5 2.5-1.6.3-2.2 1-2.5 2.5-.3-1.6-1-2.2-2.5-2.5 1.6-.3 2.2-1 2.5-2.5Z"
        strokeWidth="1.4"
      />
    </>
  ),
  party: (
    <>
      <path {...pop} d="M4 20l3.5-9.5 6 6Z" transform="translate(0.3 0.4)" />
      <path
        {...ink}
        d="M3.6 20.4 7.4 10.2c.3-.7 1.2-.9 1.8-.3l4.9 4.9c.6.6.4 1.5-.3 1.8Z"
      />
      <path
        {...ink}
        d="M13 10c1.4-1.4 3.4-1.4 4.8 0M14 6c2.4-.6 4.6 1.6 4 4M18.5 4.5l.6-.9M20.5 8l1-.3M17 3l-.2-1"
        strokeWidth="1.4"
      />
    </>
  ),
  puzzle: (
    <>
      <path
        {...pop}
        d="M9.5 4.5a2 2 0 0 1 4 0c0 .6.4 1 1 1H17a1 1 0 0 1 1 1v2.5c0 .6.4 1 1 1a2 2 0 0 1 0 4c-.6 0-1 .4-1 1V18a1 1 0 0 1-1 1h-2.5c-.6 0-1-.4-1-1a2 2 0 0 0-4 0c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1v-2.5c0-.6.4-1 1-1a2 2 0 0 0 0-4c-.6 0-1-.4-1-1V6.5a1 1 0 0 1 1-1h3.5c.6 0 1-.4 1-1Z"
        opacity="0.9"
        transform="translate(0.3 0.4)"
      />
      <path
        {...ink}
        d="M9.5 4.5a2 2 0 0 1 4 0c0 .6.4 1 1 1H17a1 1 0 0 1 1 1v2.5c0 .6.4 1 1 1a2 2 0 0 1 0 4c-.6 0-1 .4-1 1V18a1 1 0 0 1-1 1h-2.5c-.6 0-1-.4-1-1a2 2 0 0 0-4 0c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1v-2.5c0-.6.4-1 1-1a2 2 0 0 0 0-4c-.6 0-1-.4-1-1V6.5a1 1 0 0 1 1-1h3.5c.6 0 1-.4 1-1Z"
      />
    </>
  ),
  rainbow: (
    <>
      <path
        {...ink}
        d="M3.5 18a8.5 8.5 0 0 1 17 0"
        stroke="var(--icon-accent)"
      />
      <path {...ink} d="M6.3 18a5.7 5.7 0 0 1 11.4 0" />
      <path
        {...ink}
        d="M9.1 18a2.9 2.9 0 0 1 5.8 0"
        stroke="var(--icon-accent)"
      />
    </>
  ),

  // ---- calibration passages / content ----
  sun: (
    <>
      <circle {...pop} cx="12" cy="12" r="4.5" transform="translate(0.4 0.4)" />
      <circle {...ink} cx="12" cy="12" r="4.5" />
      <path
        {...ink}
        d="M12 2.5v2.3M12 19.2v2.3M2.5 12h2.3M19.2 12h2.3M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"
        strokeWidth="1.5"
      />
    </>
  ),
  mountain: (
    <>
      <path {...pop} d="M8.5 8.5 3 20h11Z" transform="translate(0.4 0.4)" />
      <path {...ink} d="M2.5 20 8.5 8l3.4 6.4M11 20l4.5-9 6 9Z" />
      <path
        {...ink}
        d="M6.6 11.6c.6.7 1.4.7 2 0M13.4 14c.5.7 1.3.7 1.9 0"
        opacity="0.8"
        strokeWidth="1.4"
      />
    </>
  ),
  volcano: (
    <>
      <path
        {...pop}
        d="M9.1 10.6c.6-1 1.7-1.5 2.9-1.5s2.3.5 2.9 1.5c-.3 1.7.4 2.7 1.2 3.6-1.3.3-2.3-.2-3-1 .1 1.2-.3 2.2-1.1 3-.8-.8-1.2-1.8-1.1-3-.7.8-1.7 1.3-3 1 .8-.9 1.5-1.9 1.3-3.6Z"
        transform="translate(0.3 -0.4)"
      />
      <path {...ink} d="M8.6 10.6 3.6 20h16.8l-5-9.4" />
      <path {...ink} d="M9 10.6c.4-1.2 1.5-2 3-2s2.6.8 3 2" />
    </>
  ),
  cat: (
    <>
      <path
        {...pop}
        d="M7.5 8.9 6.8 5.4 9.9 7.7ZM16.5 8.9 17.2 5.4 14.1 7.7ZM12 13.9l1.2 1h-2.4Z"
        transform="translate(0.3 0.4)"
      />
      <path {...ink} d="M7.3 8.7 6.6 5 9.9 7.4M16.7 8.7 17.4 5 14.1 7.4" />
      <circle {...ink} cx="12" cy="13" r="5.2" />
      <path {...ink} d="M9.9 12.6h.01M14.1 12.6h.01" strokeWidth="2" />
      <path
        {...ink}
        d="M12 14.6v.7M12 15.3c-.6.6-1.5.6-2 0M12 15.3c.6.6 1.5.6 2 0"
        strokeWidth="1.2"
      />
      <path
        {...ink}
        d="M6.9 12.8 4.4 12.4M6.9 14.2 4.5 14.5M17.1 12.8 19.6 12.4M17.1 14.2 19.5 14.5"
        opacity="0.65"
        strokeWidth="1.2"
      />
    </>
  ),
  bee: (
    <>
      <ellipse
        {...pop}
        cx="12"
        cy="13.5"
        rx="4.3"
        ry="5.3"
        transform="translate(0.3 0.3)"
      />
      <ellipse {...ink} cx="12" cy="13.5" rx="4.3" ry="5.3" />
      <path
        {...ink}
        d="M8.2 12h7.6M8.4 15.5h7.2"
        opacity="0.9"
        strokeWidth="1.4"
      />
      <path
        {...ink}
        d="M9 8.6C6.5 6 3.8 6.6 4 9c.1 1.7 2 2.6 4.4 2M15 8.6C17.5 6 20.2 6.6 20 9c-.1 1.7-2 2.6-4.4 2"
      />
      <path {...ink} d="M10.7 5.2 12 7.2 13.3 5.2" strokeWidth="1.4" />
    </>
  ),
  octopus: (
    <>
      <path
        {...pop}
        d="M12 4.5c3.3 0 5.8 2.4 5.8 5.6 0 1.6-.5 2.7-.5 3.6H6.7c0-.9-.5-2-.5-3.6C6.2 6.9 8.7 4.5 12 4.5Z"
        transform="translate(0.3 0.4)"
      />
      <path {...ink} d="M12 4.3c3.3 0 5.8 2.5 5.8 5.7 0 1.6-.5 2.7-.5 3.6" />
      <path {...ink} d="M6.7 13.6c0-.9-.5-2-.5-3.6C6.2 6.8 8.7 4.3 12 4.3" />
      <path
        {...ink}
        d="M6.7 13.6c-.4 1.6-1.4 2.4-2.4 2.8M9 14c-.3 2-1 3.2-2 4M12 14.2v3.8M15 14c.3 2 1 3.2 2 4M17.3 13.6c.4 1.6 1.4 2.4 2.4 2.8"
        strokeWidth="1.4"
      />
      <path {...ink} d="M10 10h.01M14 10h.01" strokeWidth="2" />
    </>
  ),
  cave: (
    <>
      <path
        {...pop}
        d="M12 9.5c-2.6 0-4.5 2.4-4.5 5.5 0 .2 0 .4.1.5h8.8c0-.1.1-.3.1-.5 0-3.1-1.9-5.5-4.5-5.5Z"
        transform="translate(0.3 0.4)"
      />
      <path {...ink} d="M3.5 20c0-5.8 3.8-10.5 8.5-10.5S20.5 14.2 20.5 20" />
      <path
        {...ink}
        d="M8 20c0-2.9 1.8-5.5 4-5.5s4 2.6 4 5.5"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="none"
      />
    </>
  ),
  hero: (
    <>
      <path
        {...pop}
        d="M4.6 9.9C6.7 8.3 9.3 7.5 12 7.5s5.3.8 7.4 2.4c-.2 2.4-2.9 3.6-7.4 3.6S4.8 12.3 4.6 9.9Z"
        transform="translate(0.3 0.4)"
      />
      <path
        {...ink}
        d="M4.3 9.7C6.5 8 9.2 7.2 12 7.2s5.5.8 7.7 2.5c-.1 1-.5 1.9-1.2 2.5-1.5 1.3-3.6 1.9-6.5 1.9s-5-.6-6.5-1.9c-.7-.6-1.1-1.5-1.2-2.5Z"
      />
      <path {...ink} d="M6.7 8.9 5.2 6.6M17.3 8.9 18.8 6.6" strokeWidth="1.4" />
      <ellipse cx="9.2" cy="10.1" rx="1.5" ry="1" fill="currentColor" />
      <ellipse cx="14.8" cy="10.1" rx="1.5" ry="1" fill="currentColor" />
    </>
  ),
} as const;

export type IconName = keyof typeof GLYPHS;

/** Default semantic accent per glyph (a token var); override via `<Icon accent>`. */
export const GLYPH_ACCENT: Record<IconName, string> = {
  check: "var(--leaf)",
  retry: "var(--coral)",
  close: "currentColor",
  search: "var(--aqua)",
  "chevron-down": "currentColor",
  alert: "currentColor",
  "arrow-right": "currentColor",
  flag: "var(--sky)",
  compass: "var(--aqua)",
  rocket: "var(--coral)",
  book: "var(--sky)",
  books: "var(--sky)",
  star: "var(--sun)",
  medal: "var(--sun)",
  sparkles: "var(--violet)",
  party: "var(--violet)",
  puzzle: "var(--violet)",
  rainbow: "var(--sky)",
  sun: "var(--sun)",
  mountain: "var(--sky)",
  volcano: "var(--coral)",
  cat: "var(--coral)",
  bee: "var(--sun)",
  octopus: "var(--violet)",
  cave: "var(--sky)",
  hero: "var(--coral)",
};

export const ICON_NAMES = Object.keys(GLYPHS) as IconName[];

// Re-exported for the wrapper.
export type { ReactNode };
