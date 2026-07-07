import { cn } from "@/lib/ui/cn";
import { DOODLE_FILTER_ID } from "@/components/ui/icons/IconDefs";

type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  /** Ring diameter. `sm` sits inside a control, `lg` anchors a loading screen. */
  size?: SpinnerSize;
  /**
   * Accessible name announced via `role="status"` (e.g. "Loading your lesson").
   * Omit for a purely decorative spinner inside an already-labelled control —
   * a loading `Button` or a screen whose heading already says what's happening —
   * so a screen reader isn't told "Loading" twice. Then it's `aria-hidden`.
   */
  label?: string;
  /** Extra classes for layout / to override the inherited color. */
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

/**
 * Three loose, overlapping loops — the kind of absent-minded circles a bored
 * person scribbles into the margin of a notebook, one drawn over the next
 * without lifting the pen. `pathLength={300}` normalizes the (irregular,
 * hand-authored) curve so the dash math below stays in round numbers no
 * matter the exact geometry.
 */
const SCRIBBLE_PATH =
  "M4 13a6 6 0 1 1 11 -3q1 3 -1 5" +
  "a5 5 0 1 1 -9 -3q1.5 -3.5 5 -3" +
  "a4 4 0 1 1 3 7q-3 2 -6 0";

/**
 * A small "working on it" spinner (docs/10 loading states) — a scribbled
 * tangle of loops, not a mechanical ring, as if traced once and then
 * endlessly re-traced by a bored hand. The full doodle sits there faintly;
 * a shorter dash in the same `currentColor` chases around it forever
 * (`motion-safe:animate-scribble`), reading as restless retracing rather
 * than a spinning object. Waved by the shared `#rt-doodle` turbulence
 * filter, the same one the icon set uses, for an inked wobble. It inherits
 * the surrounding text color, so it reads correctly on either surface with
 * no per-surface styling. The reduced-motion floor freezes the chase,
 * leaving the static scribble as a still (but clearly hand-drawn) glyph.
 *
 * Pair it with text: on its own a spinner says "wait" but not "for what". Inside
 * a labelled control (a loading Button) leave `label` off; standing alone, pass
 * a `label` so screen readers hear what's loading.
 *
 * Usage guidance: .claude/skills/design-system/references/spinner.md
 */
export function Spinner({ size = "md", label, className }: SpinnerProps) {
  const ring = (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("shrink-0", sizeStyles[size], className)}
    >
      <g filter={`url(#${DOODLE_FILTER_ID})`}>
        {/* The doodle underneath — always fully drawn, faint, like a line
            already sketched. */}
        <path
          d={SCRIBBLE_PATH}
          pathLength={300}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="opacity-30"
        />
        {/* The pen re-tracing it — a shorter dash chasing endlessly around
            the same loops, like a hand that can't stop circling. */}
        <path
          d={SCRIBBLE_PATH}
          pathLength={300}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="90 210"
          className="motion-safe:animate-scribble"
        />
      </g>
    </svg>
  );

  // No label → decorative, hidden from assistive tech (the surrounding control
  // or heading already carries the meaning). With a label → a polite live status
  // region whose sr-only text names what's loading.
  if (!label) return ring;
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      {ring}
      <span className="sr-only">{label}</span>
    </span>
  );
}
