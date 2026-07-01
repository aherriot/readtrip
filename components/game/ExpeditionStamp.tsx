import { cn } from "@/lib/ui/cn";

export interface ExpeditionStampProps {
  /** The mastered topic, e.g. "Volcanoes" — rendered as "{title} Master". */
  title: string;
  /** Extra classes for layout. */
  className?: string;
}

/**
 * A mastery badge "stamped into the journal" (docs/10). A gold, slightly-rotated
 * stamp with the medal glyph + the topic — the tangible reward for mastering a
 * topic (docs/05). It thuds down with a press animation on mount, `motion-safe:`
 * only, so it's a still stamp under reduced motion (the `both` fill mode keeps
 * the settled frame). Presentational; a screen reader hears one clean label.
 *
 * Usage guidance: .claude/skills/design-system/references/expedition-stamp.md
 */
export function ExpeditionStamp({ title, className }: ExpeditionStampProps) {
  return (
    <div
      role="img"
      aria-label={`${title} Master badge`}
      className={cn(
        "flex h-28 w-28 -rotate-6 flex-col items-center justify-center gap-0.5 rounded-full text-center",
        "border-4 border-dashed border-sun bg-sun/15 text-surface-ink",
        "shadow-[0_0_26px_-6px_var(--sun)] motion-safe:animate-stamp",
        className
      )}
    >
      <span className="text-3xl leading-none" aria-hidden="true">
        🏅
      </span>
      <span className="max-w-[6rem] font-display text-sm leading-tight font-semibold break-words">
        {title}
      </span>
      <span className="font-display text-[0.7rem] tracking-widest text-surface-ink-soft uppercase">
        Master
      </span>
    </div>
  );
}
