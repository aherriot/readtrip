"use client";

import { useState } from "react";
import { cn } from "@/lib/ui/cn";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icons/glyphs";
import type { SuggestionKind, TopicNodeState } from "@/lib/map/nodeState";

export interface TopicNodeProps {
  /** Kid-facing topic title, e.g. "Dinosaurs". */
  title: string;
  /** Visual + semantic state (docs/10). Each state has a status word, not just color. */
  state: TopicNodeState;
  /**
   * Deep (neighbour of an explored topic) vs. diverse (unrelated breadth
   * starter). Only meaningful while `suggested`; picks the header strip.
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
// carried by the sr-only span below and mirrored by the visible header strip
// (STRIP) so sighted and screen-reader users get equivalent information.
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
    // "Continue" — the child has started this topic but not yet mastered it, so
    // it reads as a call to pick it back up. Sky-blue keeps it distinct from the
    // aqua "deep" and violet "new" suggestions.
    label: "Continue",
    // Faint sky glow places it on a light ladder: suggested (flat) → exploring
    // (soft glow) → mastered (bright gold glow), so progress reads by light too.
    className:
      "border-sky bg-sky/(--tint-soft) shadow-[0_0_14px_-7px_var(--sky)]",
  },
  mastered: {
    label: "Mastered",
    // Gold glow sells the "expedition stamp" — a fill + shadow, never small text.
    className:
      "border-sun bg-sun/(--tint-soft) shadow-[0_0_22px_-6px_var(--sun)]",
  },
};

type StripKind = "explored" | SuggestionKind;

// The full-width header strip shown on suggested/explored nodes — a tinted bar
// (icon + word) that spans the top of the tile so the title always sits *below*
// it and can never crowd the marker. The tone tint + bottom rule carry the
// color; the icon + near-white word carry the meaning (docs/10: state
// differences are icon + word + color, never color alone).
const STRIP: Record<
  StripKind,
  { icon: IconName; text: string; className: string }
> = {
  explored: {
    icon: "flag",
    text: "Continue",
    className: "border-sky bg-sky/(--tint-fill)",
  },
  deep: {
    icon: "search",
    text: "Dive",
    className: "border-aqua bg-aqua/(--tint-fill)",
  },
  diverse: {
    icon: "compass",
    text: "New",
    className: "border-violet bg-violet/(--tint-fill)",
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
  kind,
  onSelect,
  onDismiss,
}: TopicNodeProps) {
  const config = STATE[state];
  const locked = state === "locked";
  const dismissible = onDismiss && DISMISSIBLE_STATES.includes(state);
  // While a dismissed tile plays its shrink-out, freeze interaction and defer
  // the actual removal (onDismiss) until the animation ends — see the wrapper's
  // onAnimationEnd below. Reduced-motion users hit the zeroed floor and remove
  // near-instantly.
  const [leaving, setLeaving] = useState(false);

  // Suggested/explored nodes carry their status word in a full-width header
  // strip (icon + short word); locked/mastered keep the visible inline label.
  // `null` here means "no strip" (locked/mastered).
  const stripKind: StripKind | null =
    state === "explored"
      ? "explored"
      : state === "suggested"
        ? (kind ?? "deep")
        : null;
  const strip = stripKind ? STRIP[stripKind] : null;
  const showLabelInline = state === "locked" || state === "mastered";
  // A suggested diverse node borrows the diverse strip's violet accent for its
  // border too, so the whole tile — not just the strip — reads as breadth.
  const nodeClassName =
    state === "suggested" && kind === "diverse"
      ? "border-violet bg-surface-panel"
      : config.className;

  return (
    <div
      className={cn("relative w-full", leaving && "animate-tile-out")}
      onAnimationEnd={
        leaving
          ? (event) => {
              if (event.animationName === "tile-out") onDismiss?.();
            }
          : undefined
      }
    >
      <button
        type="button"
        disabled={locked || leaving}
        onClick={onSelect}
        className={cn(
          // `overflow-hidden` clips the header strip's square top corners to the
          // tile's rounded frame, so the strip reads as part of the tile.
          "relative flex h-full min-h-[112px] w-full flex-col overflow-hidden rounded-lg border-2 text-surface-ink",
          "transition-[transform,background-color,border-color,box-shadow] duration-150 disabled:cursor-not-allowed",
          // Desktop affordance: an explorable node lifts toward the pointer and
          // gains a soft glow on hover. Locked nodes stay put (nothing to tap);
          // the reduced-motion floor neutralizes the lift.
          "not-disabled:hover:shadow-[var(--surface-elevation)] not-disabled:motion-safe:hover:-translate-y-0.5",
          "not-disabled:active:scale-[0.98]",
          nodeClassName
        )}
      >
        {strip && (
          // Decorative: the same word is carried by the sr-only status label
          // below, so screen readers hear it once. Sighted users get the strip.
          <div
            aria-hidden="true"
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-1.5",
              "font-display text-[0.65rem] font-semibold uppercase leading-none tracking-wide text-surface-ink",
              strip.className
            )}
          >
            <Icon
              name={strip.icon}
              decorative
              accent="currentColor"
              size="sm"
            />
            <span>{strip.text}</span>
          </div>
        )}
        <div className="flex flex-1 flex-col items-center justify-center gap-1 p-4 text-center">
          <span className="break-words font-display text-lg leading-tight">
            {title}
          </span>
          {showLabelInline ? (
            <span className="font-body text-xs text-surface-ink-soft">
              {config.label}
            </span>
          ) : (
            <span className="sr-only">{config.label}</span>
          )}
        </div>
      </button>
      {dismissible && (
        <button
          type="button"
          disabled={leaving}
          onClick={(event) => {
            event.stopPropagation();
            setLeaving(true);
          }}
          aria-label={`Dismiss ${title}`}
          className="absolute -right-2 -top-2 flex h-11 w-11 items-center justify-center rounded-pill bg-surface text-surface-ink-soft shadow-[var(--surface-elevation)] hover:bg-surface-ink/(--tint-wash)"
        >
          <Icon name="close" decorative size="sm" />
        </button>
      )}
    </div>
  );
}
