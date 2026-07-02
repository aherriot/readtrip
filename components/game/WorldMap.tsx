"use client";

import { useState } from "react";
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
}

// Two rows on the narrowest (2-column) layout — enough to orient without
// pushing "Something new" and the free-form input far down the page.
const COLLAPSED_ROWS = 2;
const COLLAPSED_COLUMNS = 2;
const COLLAPSED_COUNT = COLLAPSED_ROWS * COLLAPSED_COLUMNS;

/**
 * The child's personalized world map of knowledge (docs/05). Explored topics are
 * lit, mastered ones stamped, and suggested neighbours invite the next tap. The
 * "map" is rendered as a real list of buttons in a meaningful order (explored
 * first), which doubles as the screen-reader-friendly list view — it's never
 * purely spatial (a11y floor, docs/10). Lives on the night/play surface.
 */
export function WorldMap({ nodes, onSelect }: WorldMapProps) {
  const [expanded, setExpanded] = useState(false);

  if (nodes.length === 0) return null;

  const ordered = orderNodes(nodes);
  // Mastered topics are "ground already covered" — keep them off the main map so
  // it doesn't grow into screens of scrolling, and tuck them behind a count the
  // child can expand. Everything still-to-do (explored + suggested) stays on top.
  const active = ordered.filter((node) => !node.mastered);
  const mastered = ordered.filter((node) => node.mastered);

  const hasMore = active.length > COLLAPSED_COUNT;
  const visible = expanded ? active : active.slice(0, COLLAPSED_COUNT);
  const remaining = active.length - COLLAPSED_COUNT;

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
          {visible.map((node) => (
            <li key={node.topicSlug} className="flex">
              <TopicNode
                title={node.title}
                state={toNodeState(node)}
                onSelect={() => onSelect(node)}
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
        <details className="mt-1 rounded-lg border border-surface-rule px-4 py-3">
          <summary className="cursor-pointer font-body text-sm text-surface-ink-soft marker:text-surface-ink-soft">
            ⭐ {mastered.length} topic{mastered.length === 1 ? "" : "s"}{" "}
            mastered
          </summary>
          <ul className="mt-4 grid list-none grid-cols-2 gap-4 sm:grid-cols-3">
            {mastered.map((node) => (
              <li key={node.topicSlug} className="flex">
                <TopicNode
                  title={node.title}
                  state={toNodeState(node)}
                  onSelect={() => onSelect(node)}
                />
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
