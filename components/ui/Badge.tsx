import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

export type BadgeTone =
  "leaf" | "coral" | "orchid" | "aqua" | "violet" | "sky" | "sun";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The status word — the meaning (e.g. "Yes!", "Try again"). Keep it a word or two. */
  children: ReactNode;
  /** Semantic accent → a token border + soft fill. Pick by meaning, not by look. */
  tone: BadgeTone;
  /** Optional leading glyph. Always decorative — the word carries the meaning. */
  icon?: ReactNode;
}

// One soft fill opacity across tones so the whole family reads as one language;
// the border carries the hue at full strength. Text stays `currentColor` so the
// pill inherits `--surface-ink` and reads on either surface with no per-surface
// styling.
const toneStyles: Record<BadgeTone, string> = {
  leaf: "border-leaf bg-leaf/(--tint-fill)",
  coral: "border-coral bg-coral/(--tint-fill)",
  orchid: "border-orchid bg-orchid/(--tint-fill)",
  aqua: "border-aqua bg-aqua/(--tint-fill)",
  violet: "border-violet bg-violet/(--tint-fill)",
  sky: "border-sky bg-sky/(--tint-fill)",
  sun: "border-sun bg-sun/(--tint-fill)",
};

/**
 * A compact status pill — a token border + soft fill wrapping an optional icon
 * and a short word. ReadTrip communicates state with **icon + word + color**,
 * never color alone (a11y floor); Badge is the shared shape behind those markers
 * (quiz feedback and similar "one word of state" indicators).
 *
 * Presentational only — it owns the pill *look*, not meaning or placement:
 * - **The word is the meaning; the `icon` is decorative** (rendered `aria-hidden`).
 * - **The caller owns the a11y contract.** Leave the badge as-is when its word
 *   conveys state; pass `aria-hidden` when the badge only mirrors a label already
 *   announced elsewhere.
 * - **The caller owns positioning** — an absolute corner, a reserved column —
 *   via `className`. Badge never sets its own layout.
 *
 * Usage guidance: .claude/skills/design-system/references/badge.md
 */
export function Badge({
  children,
  tone,
  icon,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill border px-3 py-1 text-sm font-body font-medium",
        toneStyles[tone],
        className
      )}
      {...rest}
    >
      {icon != null && <span aria-hidden="true">{icon}</span>}
      {/* The word in its own element so the flex `gap` sits between icon and
          word, and the word stays individually addressable. */}
      <span>{children}</span>
    </span>
  );
}
