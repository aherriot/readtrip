import type { CSSProperties } from "react";
import { cn } from "@/lib/ui/cn";
import { DOODLE_FILTER_ID } from "./icons/IconDefs";

export interface WordmarkProps {
  /**
   * Extra classes — set the height here (the SVG scales its whole viewBox to
   * fit), e.g. `h-8` on the /play header, `h-16` in the homepage hero.
   */
  className?: string;
  /**
   * Decorative-only (default `false`). When the wordmark is the page's title it
   * carries the accessible name "ReadTrip"; pass `decorative` when a real
   * heading already names the region and the mark would just repeat it.
   */
  decorative?: boolean;
}

// One tilt per letter of "ReadTrip" (8 glyphs) so the word looks hand-set on the
// page — each character rotated a few degrees, not machine-straight. SVG's
// `rotate` list rotates each glyph in turn around its own origin.
const LETTER_TILT = "-5 4 -3 6 -6 3 -2 5";

/**
 * The ReadTrip wordmark — hand-lettered gold on ink, the way the explorer would
 * ink their own journal's cover. Rendered as inline SVG (not a styled `<span>`)
 * so the letters carry a real outlined-fill look, a per-letter hand-set tilt, and
 * a drawn underline swash — a proper mark, legible at any size.
 *
 * Uses the live Shantell Sans face (via `--font-shantell`) inside `<text>`, so it
 * stays in one voice with the rest of the journal; `textLength` pins the width so
 * the viewBox is deterministic regardless of font metrics. The whole mark is
 * waved by the shared `#rt-doodle` turbulence filter for an inked-by-hand wobble.
 *
 * Size it by setting a height class (`h-8`, `h-16`) — everything scales with the
 * viewBox.
 */
export function Wordmark({ className, decorative = false }: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 268 84"
      className={cn("inline-block h-8 w-auto overflow-visible", className)}
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : "ReadTrip"}
      aria-hidden={decorative || undefined}
    >
      <g style={{ filter: `url(#${DOODLE_FILTER_ID})` } as CSSProperties}>
        {/* A gold "under-copy" offset down-right, so the ink letters sit on a warm
            colored shadow — brand colour that reads as a playful sticker, without
            fighting legibility the way a gold *fill* did at header size. */}
        <text
          x="137"
          y="59"
          textAnchor="middle"
          textLength="248"
          lengthAdjust="spacingAndGlyphs"
          rotate={LETTER_TILT}
          aria-hidden="true"
          className="[font-family:var(--font-shantell),cursive] text-[56px] font-bold fill-sun"
        >
          ReadTrip
        </text>
        {/* The letters themselves in solid ink — high contrast on paper at any
            size. */}
        <text
          x="134"
          y="56"
          textAnchor="middle"
          textLength="248"
          lengthAdjust="spacingAndGlyphs"
          rotate={LETTER_TILT}
          className="[font-family:var(--font-shantell),cursive] text-[56px] font-bold fill-surface-ink"
        >
          ReadTrip
        </text>
        {/* A hand-drawn underline swash — one confident pen stroke that lifts at
            the end, the way you'd underline your own title. */}
        <path
          d="M18 71 C74 66, 150 65, 214 68 C232 69, 244 70, 250 66"
          fill="none"
          stroke="var(--coral)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
