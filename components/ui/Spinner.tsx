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
 * A small "working on it" spinner (docs/10 loading states) — a loop pen-drawn
 * in `currentColor`, waved by the same `#rt-doodle` turbulence filter as the
 * icon set, so it reads as a quickly-sketched circle rather than a mechanical
 * ring. It inherits the text color of whatever contains it, so it reads
 * correctly on either surface with no per-surface styling. It spins via
 * Tailwind's `animate-spin`, gated on `motion-safe:` so the reduced-motion
 * floor turns it into a still (but still visibly hand-drawn) loop.
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
      className={cn(
        "shrink-0 motion-safe:animate-spin",
        sizeStyles[size],
        className
      )}
    >
      {/* An intentionally incomplete loop (not a full circle) — the gap reads
          as a pen lifted mid-stroke, same visual grammar as the old
          border-t-transparent ring but drawn by hand. */}
      <g filter={`url(#${DOODLE_FILTER_ID})`}>
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeDasharray="42 14"
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
