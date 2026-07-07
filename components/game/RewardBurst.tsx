import { cn } from "@/lib/ui/cn";
import { Highlight } from "@/components/ui/Highlight";
import { Icon } from "@/components/ui/Icon";

export interface RewardBurstProps {
  /** XP earned this loop — rendered as "+N XP". */
  xp: number;
  /** Extra classes for layout. */
  className?: string;
}

/**
 * A contained reward pop for an XP gain (docs/10 "Reward"). Not an overlay — it
 * sits inline in the result screen and "bursts" in on mount (`motion-safe:`, so
 * it's still highlighted text under reduced motion; the `both` fill keeps the
 * final frame). The "+N XP" is a `Highlight` marker swipe (the journal's
 * hand-annotated flair), not a pill. Announced politely via `aria-live`.
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
        "inline-flex items-center gap-2",
        "font-display text-lg font-semibold text-surface-ink",
        "motion-safe:animate-burst",
        className
      )}
    >
      <Icon name="sparkles" decorative accent="var(--sun)" size="lg" />
      <Highlight tone="sun">+{xp} XP</Highlight>
    </div>
  );
}
