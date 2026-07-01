"use client";

import { useState } from "react";
import { ExpeditionStamp } from "@/components/game/ExpeditionStamp";
import { LevelUpCelebration } from "@/components/game/LevelUpCelebration";
import { RewardBurst } from "@/components/game/RewardBurst";
import { XPBar } from "@/components/game/XPBar";
import { Button } from "@/components/ui/Button";

// Rewards live on the night/play surface (docs/10) — render the demo there so
// the sun/gold accents glow as intended. Level-up is an overlay, so it needs a
// trigger button in the gallery to open it.
export function RewardsDemo() {
  const [celebrating, setCelebrating] = useState(false);

  return (
    <div
      data-surface="night"
      data-testid="rewards-demo"
      className="flex flex-col gap-8 rounded-lg bg-surface p-6 text-surface-ink"
    >
      <div className="flex flex-col gap-3">
        <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
          XPBar — level + progress to next level
        </p>
        {/* 70 XP → Level 2, half-way to Level 3. */}
        <XPBar xp={70} className="max-w-sm" />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
          RewardBurst — an XP gain
        </p>
        <RewardBurst xp={20} />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
          ExpeditionStamp — a mastered topic
        </p>
        <ExpeditionStamp title="Volcanoes" />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
          LevelUpCelebration — the level-up overlay
        </p>
        <Button size="md" onClick={() => setCelebrating(true)}>
          Show level-up
        </Button>
        <LevelUpCelebration
          open={celebrating}
          level={3}
          onDismiss={() => setCelebrating(false)}
        />
      </div>
    </div>
  );
}
