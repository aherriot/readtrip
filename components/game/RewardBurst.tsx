import { cn } from "@/lib/ui/cn";

export interface RewardBurstProps {
  /** XP earned this loop — rendered as "+N XP". */
  xp: number;
  /** Extra classes for layout. */
  className?: string;
}

/**
 * A contained reward pop for an XP gain (docs/10 "Reward"). Not an overlay — it
 * sits inline in the result screen and "bursts" in on mount (`motion-safe:`, so
 * it's a still badge under reduced motion; the `both` fill keeps the final
 * frame). The gain is announced politely to screen readers via `aria-live`.
 *
 * For the bigger level-up moment use `LevelUpCelebration`; for a mastered topic
 * use `ExpeditionStamp`.
 *
 * Usage guidance: .claude/skills/design-system/references/reward-burst.md
 */
export function RewardBurst({ xp, className }: RewardBurstProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-pill bg-sun/(--tint-fill) px-4 py-2",
        "font-display text-lg font-semibold text-surface-ink",
        "motion-safe:animate-burst",
        className
      )}
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        ✨
      </span>
      <span>+{xp} XP</span>
    </div>
  );
}
