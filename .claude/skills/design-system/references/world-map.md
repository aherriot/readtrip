# WorldMap

The child's personalized map of knowledge on the night/play surface — a set of
[`TopicNode`](topic-node.md)s (explored topics + suggested neighbours).
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

| Prop       | Type                          | Notes                                                            |
| ---------- | ----------------------------- | ---------------------------------------------------------------- |
| `nodes`    | `readonly MapNodeView[]`      | Renders nothing when empty. Ordered internally (explored first). |
| `onSelect` | `(node: MapNodeView) => void` | Fired with the chosen node on tap.                               |

## Accessibility

- Rendered as a real `<ul>`/`<li>` list of buttons in a meaningful order (explored first),
  which **is** the screen-reader-friendly list view — the map is never purely spatial.
- Labelled region (`aria-labelledby` → its "Your world map" heading).
- All node a11y (roles, focus, target size, icon+word states) comes from
  [`TopicNode`](topic-node.md).

## Surfaces

Built for `night` (the play surface); all color comes from `--surface-*` + accent tokens.
