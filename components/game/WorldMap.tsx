"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { orderNodes, toNodeState, type MapNodeView } from "@/lib/map/nodeState";
import { TopicNode } from "./TopicNode";

export interface WorldMapProps {
  /** The child's map: explored topics + suggested neighbours. */
  nodes: readonly MapNodeView[];
  /** Fired with the chosen node when the child taps one. */
  onSelect: (node: MapNodeView) => void;
  /**
   * Fired with the node when the child dismisses it, permanently removing it
   * from their map. Never offered for mastered nodes (tucked below).
   */
  onDismiss?: (node: MapNodeView) => void;
}

// Two rows on the narrowest (2-column) layout — enough to orient without
// pushing the free-form input far down the page.
const COLLAPSED_ROWS = 2;
const COLLAPSED_COLUMNS = 2;
const COLLAPSED_COUNT = COLLAPSED_ROWS * COLLAPSED_COLUMNS;

// Mastered topics are shown as compact rows, not full tiles, and paged in
// batches — a child with 100 mastered topics shouldn't render 100 112px
// tiles the moment they open the <details>.
const MASTERED_PAGE_SIZE = 10;

/**
 * The child's personalized world map of knowledge (docs/05). Explored topics are
 * lit, mastered ones stamped, and suggested neighbours invite the next tap. The
 * "map" is rendered as a real list of buttons — randomized (see `orderNodes`) so
 * explored ground doesn't perpetually crowd out new/dive tiles — which doubles
 * as the screen-reader-friendly list view; it's never purely spatial (a11y
 * floor, docs/10). Lives on the night/play surface.
 */
export function WorldMap({ nodes, onSelect, onDismiss }: WorldMapProps) {
  const [expanded, setExpanded] = useState(false);
  const [masteredShown, setMasteredShown] = useState(MASTERED_PAGE_SIZE);
  const [masteredOpen, setMasteredOpen] = useState(false);
  // Randomized once per node set, not on every re-render — otherwise toggling
  // "Show more" or dismissing a topic (both local state changes on the same
  // `nodes` prop) would reshuffle every tile out from under the child mid-tap.
  const ordered = useMemo(() => orderNodes(nodes), [nodes]);

  if (nodes.length === 0) return null;
  // Mastered topics are "ground already covered" — keep them off the main map so
  // it doesn't grow into screens of scrolling, and tuck them behind a count the
  // child can expand. Everything still-to-do (explored + suggested) stays on top.
  const active = ordered.filter((node) => !node.mastered);
  const mastered = ordered.filter((node) => node.mastered);

  const hasMore = active.length > COLLAPSED_COUNT;
  const visible = expanded ? active : active.slice(0, COLLAPSED_COUNT);
  const remaining = active.length - COLLAPSED_COUNT;

  const masteredVisible = mastered.slice(0, masteredShown);
  const masteredRemaining = mastered.length - masteredShown;

  return (
    <section
      aria-labelledby="world-map-heading"
      className="flex w-full flex-col gap-3"
    >
      <Heading id="world-map-heading" level={2}>
        Your world map
      </Heading>
      <Text tone="soft" size="sm">
        Tap a glowing spot to explore it — new places appear as you discover
        more.
      </Text>
      {visible.length > 0 && (
        <ul className="grid list-none grid-cols-2 gap-4 sm:grid-cols-3">
          {visible.map((node, index) => (
            <li
              key={node.topicSlug}
              className="flex motion-safe:animate-cascade-in"
              // Stagger each tile so the grid ripples into place; cap the delay
              // so a large map doesn't leave later tiles hanging invisibly. When
              // expanded, the newly revealed tiles (index ≥ COLLAPSED_COUNT) are
              // the only ones that (re)mount, so offset their delay to the reveal
              // — they ripple as their own wave, not tacked onto the first rows.
              style={{
                animationDelay: `${
                  Math.min(
                    Math.max(index - (expanded ? COLLAPSED_COUNT : 0), 0),
                    8
                  ) * 55
                }ms`,
              }}
            >
              <TopicNode
                title={node.title}
                state={toNodeState(node)}
                kind={node.kind}
                onSelect={() => onSelect(node)}
                onDismiss={onDismiss ? () => onDismiss(node) : undefined}
              />
            </li>
          ))}
        </ul>
      )}
      {hasMore && (
        <Button
          type="button"
          variant="ghost"
          size="md"
          className="self-center"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded
            ? "Show fewer topics"
            : `Show ${remaining} more topic${remaining === 1 ? "" : "s"}`}
        </Button>
      )}
      {mastered.length > 0 && (
        <details
          open={masteredOpen}
          onToggle={(event) => setMasteredOpen(event.currentTarget.open)}
          className="mt-1 rounded-lg border border-surface-rule px-4 py-3"
        >
          <summary className="cursor-pointer font-body text-sm text-surface-ink-soft marker:text-surface-ink-soft">
            🏅 {mastered.length} topic{mastered.length === 1 ? "" : "s"}{" "}
            mastered
          </summary>
          {/* Keyed on open state so the rows remount — and re-run their cascade
              — each time the child expands the disclosure, not just on mount
              (when they're still display:none inside the closed <details>). */}
          <ul
            key={masteredOpen ? "open" : "closed"}
            className="mt-3 flex list-none flex-col divide-y divide-surface-rule"
          >
            {masteredVisible.map((node, index) => (
              <li
                key={node.topicSlug}
                className="motion-safe:animate-cascade-in"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(node)}
                  className="flex w-full items-center gap-2 py-3 text-left transition-colors hover:bg-surface-ink/(--tint-wash)"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    🏅
                  </span>
                  <span className="flex-1 font-body text-sm text-surface-ink">
                    {node.title}
                  </span>
                  <span className="font-body text-xs text-surface-ink-soft">
                    Mastered
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {masteredRemaining > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              className="mt-2 w-full"
              onClick={() => setMasteredShown((n) => n + MASTERED_PAGE_SIZE)}
            >
              Show {Math.min(MASTERED_PAGE_SIZE, masteredRemaining)} more
            </Button>
          )}
        </details>
      )}
    </section>
  );
}
