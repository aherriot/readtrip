"use client";

import { cn } from "@/lib/ui/cn";
import type { SuggestionKind, TopicNodeState } from "@/lib/map/nodeState";

export interface TopicNodeProps {
  /** Kid-facing topic title, e.g. "Dinosaurs". */
  title: string;
  /** Visual + semantic state (docs/10). Each state has a status word, not just color. */
  state: TopicNodeState;
  /**
   * Deep (neighbour of an explored topic) vs. diverse (unrelated breadth
   * starter). Only meaningful while `suggested`; picks the corner badge.
   * Defaults to `"deep"` when omitted.
   */
  kind?: SuggestionKind | null;
  /** Fired when the child taps the node. Ignored while `locked`. */
  onSelect?: () => void;
  /**
   * Fired when the child dismisses the node, permanently removing it from their
   * map. Only rendered for `suggested`/`explored` — never `locked`/`mastered`.
   */
  onDismiss?: () => void;
}

// Every state pairs a distinct status word with its color, so the node never
// communicates by color alone (a11y floor). The word is always real text tied
// to the button — either visible (locked/mastered) or, for suggested/explored,
// carried by the sr-only span below and mirrored by the visible corner badge
// (BADGE) so sighted and screen-reader users get equivalent information.
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

type BadgeKind = "explored" | SuggestionKind;

// The corner badge shown on suggested/explored nodes — a compact icon + word
// that replaces the old full-width "Tap to explore"/"Explored" text row. All
// three share the same shape/position so they read as one visual language
// (docs/10: state differences are icon+color, never color alone).
const BADGE: Record<
  BadgeKind,
  { icon: string; text: string; className: string }
> = {
  explored: {
    icon: "✓",
    text: "Explored",
    className: "border-aqua bg-aqua/25",
  },
  deep: { icon: "🔎", text: "Deep", className: "border-aqua bg-aqua/20" },
  diverse: { icon: "🧭", text: "New", className: "border-violet bg-violet/20" },
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
  kind,
  onSelect,
  onDismiss,
}: TopicNodeProps) {
  const config = STATE[state];
  const locked = state === "locked";
  const dismissible = onDismiss && DISMISSIBLE_STATES.includes(state);

  // Suggested/explored nodes trade their old full-width status text for a
  // corner badge (icon + short word); locked/mastered keep the visible label
  // as before. `null` here means "no badge" (locked/mastered).
  const badgeKind: BadgeKind | null =
    state === "explored"
      ? "explored"
      : state === "suggested"
        ? (kind ?? "deep")
        : null;
  const badge = badgeKind ? BADGE[badgeKind] : null;
  const showLabelInline = state === "locked" || state === "mastered";
  // A suggested diverse node borrows the diverse badge's violet accent for its
  // border too, so the whole tile — not just the badge — reads as breadth.
  const nodeClassName =
    state === "suggested" && kind === "diverse"
      ? "border-violet bg-surface-panel"
      : config.className;

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={locked}
        onClick={onSelect}
        className={cn(
          "relative flex h-full min-h-[112px] w-full flex-col items-center justify-center gap-1 rounded-lg border-2 p-4 text-center",
          "text-surface-ink transition-[transform,background-color,border-color,box-shadow] duration-150 disabled:cursor-not-allowed",
          // Desktop affordance: an explorable node lifts toward the pointer and
          // gains a soft glow on hover. Locked nodes stay put (nothing to tap);
          // the reduced-motion floor neutralizes the lift.
          "not-disabled:hover:shadow-[var(--surface-elevation)] not-disabled:motion-safe:hover:-translate-y-0.5",
          "not-disabled:active:scale-[0.98]",
          nodeClassName
        )}
      >
        {badge && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-2 top-2 flex items-center gap-1 rounded-pill border px-2 py-0.5",
              "font-display text-[0.65rem] leading-none font-semibold tracking-wide uppercase",
              badge.className
            )}
          >
            <span>{badge.icon}</span>
            <span>{badge.text}</span>
          </span>
        )}
        <span className="font-display text-lg leading-tight">{title}</span>
        {showLabelInline ? (
          <span className="font-body text-xs text-surface-ink-soft">
            {config.label}
          </span>
        ) : (
          <span className="sr-only">{config.label}</span>
        )}
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
