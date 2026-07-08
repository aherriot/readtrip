"use client";

import { Icon } from "@/components/ui/Icon";
import { StampMark, type StampTone } from "@/components/ui/StampMark";
import type { IconName } from "@/components/ui/icons/glyphs";
import { cn } from "@/lib/ui/cn";

export type QuizChoiceState = "default" | "selected" | "correct" | "retry";

export interface QuizChoiceProps {
  /** The answer text. */
  children: string;
  /** Visual + semantic state. Feedback states pair color with an icon AND a word. */
  state?: QuizChoiceState;
  /** Fired when the child taps this choice. */
  onSelect?: () => void;
  /** Locks the choice — set once the question is resolved (or this one is wrong). */
  disabled?: boolean;
}

// Feedback is never color-only (a11y floor): each resolved state carries a soft
// fill (the accent as a *fill*, not small text), a re-inked hand-drawn pen box, a
// status icon, and a status word. The answer text itself always stays
// `surface-ink` for guaranteed contrast. The ink pen box comes from `.rt-inkbox`
// on the base; these add the per-state fill and (for feedback) the box color.
const stateStyles: Record<QuizChoiceState, string> = {
  default: "bg-surface-panel not-disabled:hover:bg-surface-ink/(--tint-wash)",
  selected: "bg-surface-accent/(--tint-wash)",
  correct: "rt-inkbox--correct bg-leaf/(--tint-fill)",
  retry: "rt-inkbox--retry bg-coral/(--tint-soft)",
};

type Feedback = {
  icon: IconName;
  label: string;
  tone: StampTone;
  tilt: number;
};

const statusStamp: Partial<Record<QuizChoiceState, Feedback>> = {
  correct: { icon: "check", label: "Yes!", tone: "leaf", tilt: -7 },
  retry: { icon: "retry", label: "Try again", tone: "coral", tilt: 5 },
};

/**
 * One big, tappable quiz answer (docs/10). A real `<button>` — keyboard + SR
 * behavior is native; the global `:focus-visible` ring applies. Hits the kid
 * touch-target floor and reads the `--surface-*` tokens, so it looks right on the
 * paper reading surface. Resolved states show **icon + text + color**, never
 * color alone.
 *
 * Usage guidance: .claude/skills/design-system/references/quiz-choice.md
 */
export function QuizChoice({
  children,
  state = "default",
  onSelect,
  disabled = false,
}: QuizChoiceProps) {
  const stamp = statusStamp[state];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        // Squared + a hand-drawn ink pen box (matching the other controls).
        "rt-inkbox relative flex min-h-[60px] w-full flex-col justify-center gap-1 rounded-[3px] px-6 py-3 text-left",
        "font-body text-lg text-surface-ink transition-colors duration-150",
        "disabled:cursor-default disabled:opacity-100",
        stateStyles[state]
      )}
    >
      <span className="w-full">{children}</span>
      {/* The feedback is a rubber stamp pressed over the choice's corner. It's
          absolutely positioned in its own wrapper (out of flow), so it overlays
          the box without changing its height or spanning its width — like a
          real stamp, it's fine for it to sit on top of the text underneath. */}
      {stamp && (
        <span className="pointer-events-none absolute bottom-1.5 right-3">
          <StampMark
            tone={stamp.tone}
            tilt={stamp.tilt}
            icon={
              <Icon
                name={stamp.icon}
                decorative
                size="sm"
                accent="currentColor"
              />
            }
          >
            {stamp.label}
          </StampMark>
        </span>
      )}
    </button>
  );
}
