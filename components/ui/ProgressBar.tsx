import type { HTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";
import { toPercent } from "@/lib/ui/progress";
import { InkFrame } from "@/components/ui/icons/InkFrame";

type ProgressTone = "accent" | "sun" | "leaf";

export interface ProgressBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "role"
> {
  /** Current progress. Clamped to `0…max`, so out-of-range values can't break the track. */
  value: number;
  /** The full amount. Defaults to 100 (treat `value` as a percentage). */
  max?: number;
  /**
   * Accessible name for the bar (required — a progressbar needs a name). e.g.
   * "Reading-level calibration" or "XP to next level".
   */
  label: string;
  /** Fill color. `accent` follows the surface; `sun`/`leaf` for XP / success. */
  tone?: ProgressTone;
  /** Show a "7 / 12" style readout next to the bar. */
  showValue?: boolean;
}

const toneStyles: Record<ProgressTone, string> = {
  accent: "bg-surface-accent",
  sun: "bg-sun",
  leaf: "bg-leaf",
};

/**
 * Generic, animated progress track (XP, reading-level calibration, quiz
 * progress). Exposes the real `progressbar` role with `aria-valuenow/min/max`
 * and a human `aria-valuetext`, so screen readers announce progress. The fill
 * animates; the global reduced-motion floor turns that into an instant update.
 *
 * The track is a hand-drawn pen box (an `<InkFrame>`, same squared language as
 * `Card`/`Button` — no pill; the journal is squared-off) with a plain filled bar
 * inside it.
 *
 * Usage guidance: .claude/skills/design-system/references/progress-bar.md
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  tone = "accent",
  showValue = false,
  className,
  ...rest
}: ProgressBarProps) {
  const percent = toPercent(value, max);
  const rounded = Math.round(percent);

  return (
    <div className={cn("flex items-center gap-3", className)} {...rest}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={rounded}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${rounded}%`}
        className={cn(
          "rt-inkbox",
          "relative h-3 w-full rounded-[3px] bg-surface-ink/(--tint-soft)"
        )}
      >
        <InkFrame weight={1.1} />
        <div
          className={cn(
            "h-full rounded-[2px] transition-[width] duration-500 ease-out",
            toneStyles[tone]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showValue && (
        <span
          // Decorative duplicate of the bar's value — the progressbar already
          // announces it, so keep this out of the a11y tree.
          aria-hidden="true"
          className="shrink-0 font-display text-sm tabular-nums text-surface-ink-soft"
        >
          {Math.round(Math.min(Math.max(value, 0), max))} / {max}
        </span>
      )}
    </div>
  );
}
