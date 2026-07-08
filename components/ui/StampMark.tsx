import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { InkFrame } from "@/components/ui/icons/InkFrame";

/** Which colored ink the stamp is inked in. Each maps to an AA-safe ink. */
export type StampTone = "leaf" | "coral";

export interface StampMarkProps extends HTMLAttributes<HTMLSpanElement> {
  /** The stamped word — the meaning (e.g. "Yes!", "Try again"). A word or two. */
  children: ReactNode;
  /** Semantic ink color. Pick by meaning (leaf = correct, coral = try-again). */
  tone: StampTone;
  /** Optional leading glyph. Decorative — the word carries the meaning. */
  icon?: ReactNode;
  /** Hand-stamped tilt in degrees (default `-7`). Keep it small (±10°). */
  tilt?: number;
}

// The ink each tone stamps in — the AA-safe small-text semantics (which resolve
// to the darker `-strong` shades), so the small stamp text/frame clears AA on
// paper (the bright --leaf/--coral don't).
const toneInk: Record<StampTone, string> = {
  leaf: "var(--surface-success)",
  coral: "var(--surface-danger)",
};

/**
 * A rubber-stamp status mark — a tilted, double-ruled ink frame around a short
 * uppercase word, the way a teacher stamps a page. ReadTrip's **stamped-on**
 * status language: it's meant to be dropped *over* content — position it
 * absolutely so it overlaps rather than reflowing the box. Used for quiz
 * feedback ("Yes!" / "Try again"). For a quiet inline label instead, reach for
 * `Highlight` (a marker swipe over written text).
 *
 * Still honors the a11y floor — **icon + word + color**, never color alone — and
 * inks in the AA-safe darker shade so the small mark stays legible on paper. The
 * frame is waved by the shared `#rt-sketch` turbulence filter (via a filtered
 * `::before`, so the text stays crisp) for a hand-pressed, slightly-uneven edge.
 *
 * Presentational only — the caller owns placement and the a11y wiring (leave the
 * word visible when it conveys state; `aria-hidden` it when a label elsewhere
 * already announces the same thing).
 *
 * Usage guidance: .claude/skills/design-system/references/stamp-mark.md
 */
export function StampMark({
  children,
  tone,
  icon,
  tilt = -7,
  className,
  style,
  ...rest
}: StampMarkProps) {
  return (
    <span
      className={cn(
        // Uppercase, tracked, bold — reads as stamped, not typed.
        "relative inline-flex items-center gap-1.5 px-2.5 py-1",
        "font-display text-sm font-bold uppercase tracking-[0.08em]",
        className
      )}
      style={
        {
          color: toneInk[tone],
          rotate: `${tilt}deg`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {/* A double-ruled hand-drawn frame — an outer box plus a lighter inset
          rule — reads as a pressed rubber stamp. Pre-baked geometry, no filter;
          the label stays crisp since the frame is its own layer. */}
      <InkFrame weight={2} tone={toneInk[tone]} />
      <span aria-hidden="true" className="absolute inset-[3px] opacity-[0.85]">
        <InkFrame weight={1.4} tone={toneInk[tone]} />
      </span>
      {icon != null && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
