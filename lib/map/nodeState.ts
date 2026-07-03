// World-map node state (docs/05, docs/10). A stored MapNode is either a
// `suggested` neighbor or an `explored` topic; mastery is tracked separately on
// TopicProgress, so it's layered in here at read time. The resulting state drives
// the TopicNode's look — each state has a distinct icon + label, not just color.
// Pure so it's unit-testable without a DB or DOM.

/** The persisted status of a map node (see `MapNode.status` in the schema). */
export type MapNodeStatus = "suggested" | "explored";

/** The four visual states a TopicNode can render (docs/10). */
export type TopicNodeState = "locked" | "suggested" | "explored" | "mastered";

/** Which pool a *suggested* node came from — see `MapNode.kind` in the schema.
 * Meaningless once a node is explored, so it's nullable there. */
export type SuggestionKind = "deep" | "diverse";

/** A map node flattened for rendering — what `getChildMap` returns per topic. */
export interface MapNodeView {
  topicSlug: string;
  title: string;
  status: MapNodeStatus;
  /** From TopicProgress: a mastered topic outranks its `explored` status. */
  mastered: boolean;
  /** Deep/diverse pool, set while `suggested`; null once meaning is moot. */
  kind: SuggestionKind | null;
}

/**
 * Resolve a node's visual state. Mastery wins over everything (a mastered topic
 * has necessarily been explored); otherwise the stored status maps straight
 * through. `locked` is reserved for not-yet-unlocked nodes and isn't produced
 * from map data today, but the component renders it (see the gallery).
 */
export function toNodeState(node: {
  status: MapNodeStatus;
  mastered: boolean;
}): TopicNodeState {
  if (node.mastered) return "mastered";
  return node.status;
}

// WorldMap's collapsed grid (COLLAPSED_ROWS * COLLAPSED_COLUMNS) — the first
// screenful a child sees before tapping "Show more".
const FRONT_WINDOW = 4;

// The suggested pool's total ceiling (SUGGESTION_CAPS: deep 8 + diverse 4, see
// lib/map/queries.ts) — the widest window worth guaranteeing "something new"
// variety within, so a bored child doesn't have to dig past a wall of
// explored/deep tiles to find a fresh topic.
const FRESH_WINDOW = 12;
const MIN_FRESH_IN_WINDOW = 3;

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Swap the first node matching `predicate` into `targetIndex`, if one exists. */
function placeFirstMatchAt(
  nodes: MapNodeView[],
  targetIndex: number,
  predicate: (node: MapNodeView) => boolean
): void {
  if (targetIndex >= nodes.length || predicate(nodes[targetIndex])) return;
  const sourceIndex = nodes.findIndex(predicate);
  if (sourceIndex === -1) return;
  [nodes[targetIndex], nodes[sourceIndex]] = [
    nodes[sourceIndex],
    nodes[targetIndex],
  ];
}

/**
 * Pull matching nodes into the first `windowSize` slots (swapping in from
 * beyond the window) until at least `targetCount` are present, or none remain
 * to pull in. `protectedIndices` are left alone even if they don't match, so
 * earlier placements (e.g. `placeFirstMatchAt`) aren't undone.
 */
function ensureCountWithin(
  nodes: MapNodeView[],
  windowSize: number,
  predicate: (node: MapNodeView) => boolean,
  targetCount: number,
  protectedIndices: ReadonlySet<number>
): void {
  let count = nodes.slice(0, windowSize).filter(predicate).length;
  let searchFrom = windowSize;
  while (count < targetCount) {
    const sourceIndex = nodes.findIndex(
      (node, i) => i >= searchFrom && predicate(node)
    );
    if (sourceIndex === -1) break;
    const destIndex = nodes.findIndex(
      (node, i) =>
        i < windowSize && !protectedIndices.has(i) && !predicate(node)
    );
    if (destIndex === -1) break;
    [nodes[destIndex], nodes[sourceIndex]] = [
      nodes[sourceIndex],
      nodes[destIndex],
    ];
    count++;
    searchFrom = sourceIndex + 1;
  }
}

/**
 * Order nodes for display + the screen-reader list. Randomized on every call
 * (no stable seed) so the map doesn't calcify into "explored tiles always up
 * top" — but a fully random shuffle can also bury every "new" or "dive" tile
 * on a lucky draw, so two guarantees are layered on top:
 *  - the first screenful (FRONT_WINDOW) always has one "diverse" (new topic)
 *    tile and one "deep" (dive) tile, if either kind exists at all;
 *  - the whole suggested-pool ceiling (FRESH_WINDOW) surfaces at least
 *    MIN_FRESH_IN_WINDOW diverse tiles, so a child bored of deep/explored
 *    ground still finds fresh topics without digging through everything.
 */
export function orderNodes(nodes: readonly MapNodeView[]): MapNodeView[] {
  const order = shuffle(nodes);

  placeFirstMatchAt(order, 0, (n) => n.kind === "diverse");
  placeFirstMatchAt(order, 1, (n) => n.kind === "deep");

  ensureCountWithin(
    order,
    Math.min(FRESH_WINDOW, order.length),
    (n) => n.kind === "diverse",
    MIN_FRESH_IN_WINDOW,
    new Set([0, 1])
  );

  return order;
}
