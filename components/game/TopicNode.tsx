"use client";

import { useState } from "react";
import { cn } from "@/lib/ui/cn";
import { Icon } from "@/components/ui/Icon";
import { StickyNote, type StickyTone } from "@/components/ui/StickyNote";
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

// Every state pairs a distinct status word with a color, so the node never
// communicates by color alone (a11y floor). The word is always real text tied
// to the button — either visible (locked/mastered) or, for suggested/explored,
// carried by the sr-only span below and mirrored by the visible header strip
// (STRIP). `tone` is the sticky-note paper color; `locked` has no note (it's an
// empty, not-yet-discovered slot — a dashed outline instead of a stuck note).
const STATE: Record<
  TopicNodeState,
  { label: string; tone: StickyTone | null }
> = {
  locked: { label: "Locked", tone: null },
  suggested: { label: "Tap to explore", tone: "aqua" },
  // "Continue" — started but not yet mastered; sky paper keeps it distinct from
  // the aqua "deep" and violet "new" suggestions and the gold "mastered".
  explored: { label: "Continue", tone: "sky" },
  mastered: { label: "Mastered", tone: "sun" },
};

/** Small, STABLE tilt from the title so a note keeps its hand-placed angle. */
function tiltFor(title: string): number {
  let h = 0;
  for (const ch of title) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ((h % 5) - 2) * 0.9; // -1.8° … +1.8°
}

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
 * (native keyboard + screen-reader behaviour, global focus ring, clears the kid
 * touch-target floor) wrapping a `StickyNote`: each explored/suggested/mastered
 * topic is a colored note stuck onto the journal; `locked` is an empty dashed
 * slot (nothing discovered yet). States are `locked | suggested | explored |
 * mastered`, each with its own status word + color.
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
  // A suggested diverse node is a violet "new/breadth" note; otherwise the
  // state's own paper color. `null` tone (locked) → the empty dashed slot.
  const tone: StickyTone | null =
    state === "suggested" && kind === "diverse" ? "violet" : config.tone;
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
  // The note's inner content: the status strip (suggested/explored) + the title
  // + the state word (visible body text for locked/mastered, sr-only otherwise).
  const inner = (
    <>
      {strip && (
        // Decorative: the same word is carried by the sr-only status label below,
        // so screen readers hear it once. Sighted users get the strip.
        <div
          aria-hidden="true"
          className={cn(
            // Square top corners to match the note (a real sticky note is cut
            // square) — no rounded-t here.
            "flex items-center gap-1.5 border-b-2 px-3 py-1.5",
            "font-display text-[0.65rem] font-semibold uppercase leading-none tracking-wide text-surface-ink",
            strip.className
          )}
        >
          <Icon name={strip.icon} decorative accent="currentColor" size="sm" />
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
    </>
  );

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
          // A plain, sized, focusable box — the visible tile is the note inside.
          // Squared so the focus ring matches the square note. Hover lifts it
          // toward the pointer (motion-safe); active presses it. Transform
          // (translate/scale) composes with the note's own `rotate`.
          "block w-full rounded-[1px] text-surface-ink disabled:cursor-not-allowed",
          "transition-transform duration-150",
          "not-disabled:motion-safe:hover:-translate-y-0.5 not-disabled:active:scale-[0.98]"
        )}
      >
        {tone ? (
          <StickyNote
            tone={tone}
            tilt={tiltFor(title)}
            tape
            padding="none"
            className="flex h-full min-h-[112px] w-full flex-col"
          >
            {inner}
          </StickyNote>
        ) : (
          // Locked = an empty, not-yet-discovered slot: a dashed outline, no note.
          <div className="flex h-full min-h-[112px] w-full flex-col rounded-[1px] border-2 border-dashed border-surface-rule text-surface-ink-soft opacity-60">
            {inner}
          </div>
        )}
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
          className={cn(
            // A hand-drawn "cross it out" mark, not a badge: just the inked X
            // (the shared doodle filter gives the glyph its wavy, pen-drawn
            // edges) with no circle, fill, or shadow — a whole map of tiles
            // must not read as a grid of red buttons. It rests as a quiet muted
            // mark and inks up to the danger color (--surface-danger) on
            // hover/focus, where the destructive removal is about to happen.
            // The 44px button is an invisible kid-sized hit area around the
            // small glyph, hung off the corner so it doesn't cover the
            // tap-to-explore target.
            "absolute -right-1.5 -top-1.5 flex h-11 w-11 items-center justify-center rounded-pill",
            "text-surface-ink-soft transition",
            "not-disabled:hover:text-surface-danger not-disabled:focus-visible:text-surface-danger",
            "not-disabled:motion-safe:hover:scale-110",
            "disabled:cursor-not-allowed"
          )}
        >
          <Icon name="close" decorative size="md" />
        </button>
      )}
    </div>
  );
}
