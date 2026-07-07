# WorldMap

The child's personalized map of knowledge — a set of [`TopicNode`](topic-node.md)s (explored
topics + suggested neighbours) laid out as sticky notes on the journal. A pen-boxed
(`secondary`) "Show N more" toggle with a chevron expands the grid; mastered topics tuck into a
pen-boxed `<details>` disclosure below.
Source: [`components/game/WorldMap.tsx`](../../../../components/game/WorldMap.tsx).

```tsx
import { WorldMap } from "@/components/game/WorldMap";

<WorldMap nodes={nodes} onSelect={(node) => explore(node.topicSlug)} />;
```

## When to use

- The `/play` home surface where the child picks a topic. Fed by `getChildMap` (`lib/map`),
  with curated starters seeded for a brand-new explorer.

## When **not** to use

- A flat list of arbitrary choices → `Button`s or a list; the map is specifically the
  explored/suggested topic graph.

## Props

| Prop        | Type                          | Notes                                                            |
| ----------- | ----------------------------- | ---------------------------------------------------------------- |
| `nodes`     | `readonly MapNodeView[]`      | Renders nothing when empty. Ordered internally (explored first). |
| `onSelect`  | `(node: MapNodeView) => void` | Fired with the chosen node on tap.                               |
| `onDismiss` | `(node: MapNodeView) => void` | Permanently removes a node. Never offered for mastered nodes.    |

## Density

- Non-mastered nodes (explored + suggested) render first, capped to two rows (4 nodes on the
  2-column mobile layout) with a "Show N more topics" toggle when there are more — keeps
  "Something new" and the free-form input from sinking far down the page on a large map.
- Mastered nodes are tucked behind a collapsible `<details>` ("⭐ N topics mastered") below
  the active grid, since they're ground already covered rather than something to tap next.

## Accessibility

- Rendered as a real `<ul>`/`<li>` list of buttons in a meaningful order (explored first),
  which **is** the screen-reader-friendly list view — the map is never purely spatial.
- Labelled region (`aria-labelledby` → its "Your world map" heading).
- The "Show more"/"Show fewer" toggle and the mastered `<details>` are both real, focusable
  controls — collapsed content isn't just visually hidden.
- All node a11y (roles, focus, target size, icon+word states) comes from
  [`TopicNode`](topic-node.md).

## Surface

The single field-journal surface; all color comes from `--surface-*` + accent tokens.
