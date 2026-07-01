// World-map node state (docs/05, docs/10). A stored MapNode is either a
// `suggested` neighbor or an `explored` topic; mastery is tracked separately on
// TopicProgress, so it's layered in here at read time. The resulting state drives
// the TopicNode's look — each state has a distinct icon + label, not just color.
// Pure so it's unit-testable without a DB or DOM.

/** The persisted status of a map node (see `MapNode.status` in the schema). */
export type MapNodeStatus = "suggested" | "explored";

/** The four visual states a TopicNode can render (docs/10). */
export type TopicNodeState = "locked" | "suggested" | "explored" | "mastered";

/** A map node flattened for rendering — what `getChildMap` returns per topic. */
export interface MapNodeView {
  topicSlug: string;
  title: string;
  status: MapNodeStatus;
  /** From TopicProgress: a mastered topic outranks its `explored` status. */
  mastered: boolean;
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

// Explored/mastered topics come first (a sense of ground covered), then the
// suggested neighbors inviting the next tap. Stable, title-alphabetical within a
// group so the layout — and the screen-reader list order — doesn't jump around.
const GROUP_ORDER: Record<MapNodeStatus, number> = {
  explored: 0,
  suggested: 1,
};

/** Order nodes for display + the screen-reader list: explored first, then suggested. */
export function orderNodes(nodes: readonly MapNodeView[]): MapNodeView[] {
  return [...nodes].sort(
    (a, b) =>
      GROUP_ORDER[a.status] - GROUP_ORDER[b.status] ||
      a.title.localeCompare(b.title)
  );
}
