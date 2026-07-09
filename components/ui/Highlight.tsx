import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

/** Which accent the highlighter is inked in. */
export type HighlightTone =
  "sun" | "aqua" | "sky" | "violet" | "leaf" | "coral" | "orchid";

export interface HighlightProps extends HTMLAttributes<HTMLSpanElement> {
  /** The words to highlight — keep it short (a label, a level, a status word). */
  children: ReactNode;
  /** Which accent colors the marker swipe. Defaults to `"sun"`. */
  tone?: HighlightTone;
}

/**
 * A highlighter swipe over inline text — the journal alternative to a pill.
 * Instead of boxing a status word in a bordered chip, ReadTrip can run a
 * translucent marker stroke across plain written text (e.g. a "Lvl 2" label),
 * leaning into the hand-annotated feel. The text keeps its normal `--surface-ink`
 * color and reads through the translucent color, so contrast is unaffected.
 *
 * The swipe is a `::before` (see `.rt-marker` in globals.css): uneven hand-run
 * edges via a pre-baked marker-stroke mask (`--rt-marker-stroke`, an elongated
 * capsule, not a circle — see scripts/bake-ink.mjs), overshooting the text
 * sideways and sitting slightly askew like a real marker pass.
 *
 * Presentational only — it's a text treatment, not a control. When the
 * highlighted word is the *only* carrier of some state (rare), make sure the
 * meaning is also in the text, never the color alone (a11y floor).
 *
 * Usage guidance: .claude/skills/design-system/references/highlight.md
 */
export function Highlight({
  children,
  tone = "sun",
  className,
  style,
  ...rest
}: HighlightProps) {
  return (
    <span
      className={cn("rt-marker", className)}
      style={{ "--marker": `var(--${tone})`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </span>
  );
}
