"use client";

import { cn } from "@/lib/ui/cn";
import type { TopicNodeState } from "@/lib/map/nodeState";

export interface TopicNodeProps {
  /** Kid-facing topic title, e.g. "Dinosaurs". */
  title: string;
  /** Visual + semantic state (docs/10). Each state has a status word, not just color. */
  state: TopicNodeState;
  /** Fired when the child taps the node. Ignored while `locked`. */
  onSelect?: () => void;
  /**
   * Fired when the child dismisses the node, permanently removing it from their
   * map. Only rendered for `suggested`/`explored` — never `locked`/`mastered`.
   */
  onDismiss?: () => void;
}

// Every state pairs a distinct status word with its color, so the node never
// communicates by color alone (a11y floor). The status word is real text inside
// the button, so a node's accessible name reads e.g. "Dinosaurs, Explored".
const STATE: Record<TopicNodeState, { label: string; className: string }> = {
  locked: {
    label: "Locked",
    className:
      "border-dashed border-surface-rule text-surface-ink-soft opacity-70",
  },
  suggested: {
    label: "Tap to explore",
    className: "border-aqua bg-surface-panel",
  },
  explored: {
    label: "Explored",
    className: "border-aqua bg-aqua/15",
  },
  mastered: {
    label: "Mastered",
    // Gold glow sells the "expedition stamp" — a fill + shadow, never small text.
    className: "border-sun bg-sun/15 shadow-[0_0_22px_-6px_var(--sun)]",
  },
};

// A node is dismissible while it's still something to do — not once it's locked
// (nothing to remove) or mastered (that's progress, not clutter).
const DISMISSIBLE_STATES: readonly TopicNodeState[] = ["suggested", "explored"];

/**
 * The world-map node — ReadTrip's signature element (docs/10). A real `<button>`
 * so keyboard + screen-reader behaviour is native and the global focus ring
 * applies; comfortably clears the kid touch-target floor. States are
 * `locked | suggested | explored | mastered`, each with its own status word +
 * color. Lives on the night/play surface via `--surface-*` tokens.
 */
export function TopicNode({
  title,
  state,
  onSelect,
  onDismiss,
}: TopicNodeProps) {
  const config = STATE[state];
  const locked = state === "locked";
  const dismissible = onDismiss && DISMISSIBLE_STATES.includes(state);
  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={locked}
        onClick={onSelect}
        className={cn(
          "flex min-h-[112px] w-full flex-col items-center justify-center gap-1 rounded-lg border-2 p-4 text-center",
          "text-surface-ink transition-colors duration-150 disabled:cursor-not-allowed",
          config.className
        )}
      >
        <span className="font-display text-lg leading-tight">{title}</span>
        <span className="font-body text-xs text-surface-ink-soft">
          {config.label}
        </span>
      </button>
      {dismissible && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDismiss();
          }}
          aria-label={`Dismiss ${title}`}
          className="absolute -right-2 -top-2 flex h-11 w-11 items-center justify-center rounded-pill bg-surface text-surface-ink-soft shadow-[var(--surface-elevation)] hover:bg-surface-ink/10"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
