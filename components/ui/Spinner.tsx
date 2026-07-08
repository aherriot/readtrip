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
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

/**
 * An outward spiral — the kind of absent-minded coil a bored person doodles
 * into the margin of a notebook, winding out from the center and trailing
 * off. Unlike a tangle of crossing loops, a spiral never overlaps itself, so
 * it reads as one deliberate doodle rather than a scribbled-out mistake.
 * `pathLength={300}` normalizes the curve so the dash math below stays in
 * round numbers no matter the exact geometry.
 */
const SCRIBBLE_PATH =
  "M12 10.6 L12.43 10.51 L12.91 10.56 L13.38 10.77 L13.81 11.14" +
  " L14.12 11.65 L14.28 12.27 L14.26 12.95 L14.02 13.64 L13.57 14.26" +
  " L12.93 14.75 L12.14 15.05 L11.25 15.11 L10.34 14.91 L9.49 14.44" +
  " L8.78 13.72 L8.28 12.79 L8.06 11.72 L8.15 10.58 L8.58 9.48" +
  " L9.32 8.51 L10.34 7.76 L11.57 7.32 L12.92 7.24 L14.27 7.54" +
  " L15.52 8.24 L16.55 9.29 L17.27 10.62 L17.6 12.15 L17.48 13.74" +
  " L16.91 15.28 L15.9 16.63 L14.52 17.66 L12.87 18.29 L11.07 18.43" +
  " L9.26 18.06 L7.58 17.17 L6.2 15.82 L5.22 14.11 L4.75 12.14" +
  " L4.85 10.08 L5.54 8.1 L6.77 6.35 L8.48 4.98 L10.54 4.13" +
  " L12.8 3.89 L15.08 4.29 L17.19 5.33 L18.96 6.95";

/**
 * A small "working on it" spinner (docs/10 loading states) — a doodled
 * spiral, not a mechanical ring, as if traced once and then endlessly
 * re-traced by a bored hand. The full spiral sits there faintly as a guide;
 * a pen stroke in the same `currentColor` draws itself along it from start
 * to end (`motion-safe:animate-scribble`), then the whole stroke resets and
 * draws again — one continuous line growing at a time, never a fragment
 * appearing mid-path while another lingers elsewhere. The hand-drawn character
 * lives in the irregular spiral geometry itself (no runtime filter — a filter
 * on an *animating* stroke would re-rasterize every frame). It inherits the
 * surrounding text color, so it reads correctly on either surface with no
 * per-surface styling. The reduced-motion floor collapses the draw to its final
 * frame, leaving the spiral fully drawn as a still (but still clearly
 * hand-drawn) glyph.
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
      {/* The doodle underneath — always fully drawn, faint, like a line
          already sketched. */}
      <path
        d={SCRIBBLE_PATH}
        pathLength={300}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-30"
      />
      {/* The pen drawing it — a single dash exactly as long as the whole
          path (pathLength normalizes it to 300), so animating its offset
          from 300 (nothing showing) to 0 (fully drawn) reveals ONE
          continuously growing line from the start, never two separate
          fragments. It only reaches offset 0 — fully traced — right as
          the loop restarts back to 300, so a new pass never begins until
          the last one finished. */}
      <path
        d={SCRIBBLE_PATH}
        pathLength={300}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="300"
        className="motion-safe:animate-scribble"
      />
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
