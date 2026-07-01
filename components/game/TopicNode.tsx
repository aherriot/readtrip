"use client";

import { cn } from "@/lib/ui/cn";
import type { TopicNodeState } from "@/lib/map/nodeState";

export interface TopicNodeProps {
  /** Kid-facing topic title, e.g. "Dinosaurs". */
  title: string;
  /** Visual + semantic state (docs/10). Each state has an icon + word, not just color. */
  state: TopicNodeState;
  /** Fired when the child taps the node. Ignored while `locked`. */
  onSelect?: () => void;
}

// Every state pairs a distinct icon AND a status word with its color, so the node
// never communicates by color alone (a11y floor). The status word is real text
// inside the button, so a node's accessible name reads e.g. "Dinosaurs, Explored".
const STATE: Record<
  TopicNodeState,
  { icon: string; label: string; className: string; iconClassName?: string }
> = {
  locked: {
    icon: "🔒",
    label: "Locked",
    className:
      "border-dashed border-surface-rule text-surface-ink-soft opacity-70",
  },
  suggested: {
    icon: "✨",
    label: "Tap to explore",
    className: "border-aqua bg-surface-panel",
    // A gentle idle shimmer invites the tap — instant/off under reduced motion.
    iconClassName: "motion-safe:animate-pulse",
  },
  explored: {
    icon: "🧭",
    label: "Explored",
    className: "border-aqua bg-aqua/15",
  },
  mastered: {
    icon: "🏅",
    label: "Mastered",
    // Gold glow sells the "expedition stamp" — a fill + shadow, never small text.
    className: "border-sun bg-sun/15 shadow-[0_0_22px_-6px_var(--sun)]",
  },
};

/**
 * The world-map node — ReadTrip's signature element (docs/10). A real `<button>`
 * so keyboard + screen-reader behaviour is native and the global focus ring
 * applies; comfortably clears the kid touch-target floor. States are
 * `locked | suggested | explored | mastered`, each with its own icon + word +
 * color. Lives on the night/play surface via `--surface-*` tokens.
 */
export function TopicNode({ title, state, onSelect }: TopicNodeProps) {
  const config = STATE[state];
  const locked = state === "locked";
  return (
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
      <span
        className={cn("text-3xl leading-none", config.iconClassName)}
        aria-hidden="true"
      >
        {config.icon}
      </span>
      <span className="font-display text-lg leading-tight">{title}</span>
      <span className="font-body text-xs text-surface-ink-soft">
        {config.label}
      </span>
    </button>
  );
}
