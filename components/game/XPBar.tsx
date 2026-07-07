"use client";

import { useEffect, useState } from "react";
import { Highlight } from "@/components/ui/Highlight";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { levelProgress } from "@/lib/gamification/xp";
import { cn } from "@/lib/ui/cn";

export interface XPBarProps {
  /** The child's cumulative XP. The bar derives the level + fill from it. */
  xp: number;
  /** Extra classes for layout (the bar fills its container's width). */
  className?: string;
}

/**
 * The XP / level bar (docs/10). A "Level N" chip beside a `sun`-toned
 * `ProgressBar` filling toward the next level. On mount the fill counts up from
 * empty (a satisfying reward beat) via the ProgressBar's CSS width transition —
 * so the global reduced-motion floor turns it into an instant, correct final
 * state with no JS to opt out of. The current standing is announced politely to
 * screen readers.
 *
 * Usage guidance: .claude/skills/design-system/references/xp-bar.md
 */
export function XPBar({ xp, className }: XPBarProps) {
  const { level, xpIntoLevel, xpForLevel, pct } = levelProgress(xp);

  // Count-up: render empty for the first paint, then flip to the real value so
  // the ProgressBar transitions its width. Under reduced motion the transition
  // is zeroed globally, so it snaps to `pct` with no perceptible movement.
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className="shrink-0 px-1 font-display text-sm font-semibold whitespace-nowrap text-surface-ink"
        // The number is echoed in the progress bar's live summary below; keep
        // this label out of the a11y tree so it isn't announced twice.
        aria-hidden="true"
      >
        {/* A highlighter swipe over the written level, not a pill. */}
        <Highlight tone="sun">Lvl {level}</Highlight>
      </span>
      <ProgressBar
        label={`Level ${level}: ${xpIntoLevel} of ${xpForLevel} XP to the next level`}
        value={filled ? pct : 0}
        tone="sun"
        className="w-full min-w-0"
      />
    </div>
  );
}
