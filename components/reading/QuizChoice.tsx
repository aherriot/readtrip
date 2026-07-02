"use client";

import { Badge, type BadgeTone } from "@/components/ui/Badge";
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

// Feedback is never color-only (a11y floor): each resolved state carries a border
// + soft fill (the accent as a *fill*, not small text), a status icon, and a
// status word. The answer text itself always stays `surface-ink` for guaranteed
// contrast on either surface.
const stateStyles: Record<QuizChoiceState, string> = {
  default:
    "border-surface-rule bg-surface-panel not-disabled:hover:border-surface-accent",
  selected: "border-surface-accent bg-surface-accent/10",
  correct: "border-leaf bg-leaf/20",
  retry: "border-coral bg-coral/15",
};

type Feedback = { icon: string; label: string; tone: BadgeTone };

const statusBadge: Partial<Record<QuizChoiceState, Feedback>> = {
  correct: { icon: "✓", label: "Yes!", tone: "leaf" },
  retry: { icon: "↻", label: "Try again", tone: "coral" },
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
  const badge = statusBadge[state];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "relative flex min-h-[60px] w-full items-center rounded-lg border-2 px-6 py-3 text-left",
        "font-body text-lg text-surface-ink transition-colors duration-150",
        "disabled:cursor-default disabled:opacity-100",
        stateStyles[state]
      )}
    >
      <span className="min-w-0 w-full">{children}</span>
      {/* Floats above the choice instead of sitting in flow, so the answer text
          always gets the button's full width and never reflows when the badge
          appears on resolve. */}
      {badge && (
        <Badge
          tone={badge.tone}
          icon={badge.icon}
          className="absolute -right-2 -top-2 shadow-sm"
        >
          {badge.label}
        </Badge>
      )}
    </button>
  );
}
