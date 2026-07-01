# TopicNode

The world-map node — ReadTrip's signature element — on the night/play surface.
Source: [`components/game/TopicNode.tsx`](../../../../components/game/TopicNode.tsx).

```tsx
import { TopicNode } from "@/components/game/TopicNode";

<TopicNode title="Dinosaurs" state="explored" onSelect={() => open("dinosaurs")} />
<TopicNode title="Sharks" state="suggested" onSelect={openSharks} />
<TopicNode title="Deep Time" state="locked" />
```

## When to use

- A single topic on the world map. Rendered by [`WorldMap`](world-map.md); you rarely place
  one by hand outside the map or the gallery.

## When **not** to use

- A general action/submit → [`Button`](button.md).
- A quiz answer → [`QuizChoice`](quiz-choice.md).

## Props

| Prop       | Type                                                  | Default | Notes                                                          |
| ---------- | ----------------------------------------------------- | ------- | -------------------------------------------------------------- |
| `title`    | `string`                                              | —       | Kid-facing topic title.                                        |
| `state`    | `"locked" \| "suggested" \| "explored" \| "mastered"` | —       | Derive from map data with `toNodeState` (`lib/map`).           |
| `onSelect` | `() => void`                                          | —       | Fired on tap; ignored while `locked` (the button is disabled). |

## Accessibility

- A real `<button>`, so `Enter`/`Space`, focus, and SR semantics are native; the global
  `:focus-visible` ring applies. `locked` renders as a disabled button.
- **Never color-only** — every state pairs a distinct **icon + status word** (🔒 Locked,
  ✨ Tap to explore, 🧭 Explored, 🏅 Mastered) with its color, and the word is real text, so
  the node's accessible name reads e.g. "Dinosaurs Explored".
- Comfortably clears the 56–64px kid target floor.
- The idle shimmer on `suggested` is `motion-safe:` only — off under reduced motion.

## Surfaces

Built for `night` (the play surface); reads `--surface-*` + `--aqua`/`--sun` tokens, so it
never hardcodes color.
