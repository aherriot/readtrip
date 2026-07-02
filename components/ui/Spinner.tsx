import { cn } from "@/lib/ui/cn";

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
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

/**
 * A small "working on it" spinner (docs/10 loading states). A ring drawn in
 * `currentColor` — it inherits the text color of whatever contains it, so it
 * reads correctly on either surface with no per-surface styling. It spins via
 * Tailwind's `animate-spin`, gated on `motion-safe:` so the reduced-motion floor
 * turns it into a still ring (still a clear "loading" glyph, no movement).
 *
 * Pair it with text: on its own a spinner says "wait" but not "for what". Inside
 * a labelled control (a loading Button) leave `label` off; standing alone, pass
 * a `label` so screen readers hear what's loading.
 *
 * Usage guidance: .claude/skills/design-system/references/spinner.md
 */
export function Spinner({ size = "md", label, className }: SpinnerProps) {
  const ring = (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block shrink-0 rounded-full border-current border-t-transparent",
        "motion-safe:animate-spin",
        sizeStyles[size],
        className
      )}
    />
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
