"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";

export interface LevelUpCelebrationProps {
  /** Whether the celebration overlay is shown. Controlled by the parent. */
  open: boolean;
  /** The level the child just reached. */
  level: number;
  /** Called when the child dismisses the celebration (button, Escape, backdrop). */
  onDismiss: () => void;
}

/**
 * The level-up celebration overlay (docs/10 "Reward"). The bigger reward beat: a
 * focus-trapped, dismissable overlay announcing the new level. Built on `Modal`
 * so it inherits the focus trap, `Escape`/backdrop dismissal, focus restore, and
 * the field-journal panel (docs/10). The badge glyph "bursts" in `motion-safe:`
 * only, so under reduced motion it's a still overlay with the same words.
 *
 * For a plain XP gain use `RewardBurst`; for a mastered topic use
 * `ExpeditionStamp`.
 *
 * Usage guidance: .claude/skills/design-system/references/level-up-celebration.md
 */
export function LevelUpCelebration({
  open,
  level,
  onDismiss,
}: LevelUpCelebrationProps) {
  return (
    <Modal
      open={open}
      onClose={onDismiss}
      title={`Level ${level}!`}
      hideCloseButton
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="motion-safe:animate-burst" aria-hidden="true">
          <Icon name="party" decorative size="xl" />
        </span>
        <Text tone="soft" measure>
          You leveled up! New topics are opening on your map.
        </Text>
        <Button onClick={onDismiss} autoFocus>
          Keep exploring
        </Button>
      </div>
    </Modal>
  );
}
