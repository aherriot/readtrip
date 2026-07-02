# TopicNode

The world-map node — ReadTrip's signature element — on the night/play surface.
Source: [`components/game/TopicNode.tsx`](../../../../components/game/TopicNode.tsx).

```tsx
import { TopicNode } from "@/components/game/TopicNode";

<TopicNode title="Dinosaurs" state="explored" onSelect={() => open("dinosaurs")} />
<TopicNode title="Sharks" state="suggested" kind="deep" onSelect={openSharks} onDismiss={() => dismiss("sharks")} />
<TopicNode title="Volcanoes" state="suggested" kind="diverse" onSelect={openVolcanoes} />
<TopicNode title="Deep Time" state="locked" />
```

## When to use

- A single topic on the world map. Rendered by [`WorldMap`](world-map.md); you rarely place
  one by hand outside the map or the gallery.

## When **not** to use

- A general action/submit → [`Button`](button.md).
- A quiz answer → [`QuizChoice`](quiz-choice.md).

## Props

| Prop        | Type                                                  | Default  | Notes                                                                                                                                               |
| ----------- | ----------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`     | `string`                                              | —        | Kid-facing topic title.                                                                                                                             |
| `state`     | `"locked" \| "suggested" \| "explored" \| "mastered"` | —        | Derive from map data with `toNodeState` (`lib/map`).                                                                                                |
| `kind`      | `"deep" \| "diverse" \| null`                         | `"deep"` | Only matters while `suggested`; picks the corner badge/accent (deep = aqua magnifier, diverse = violet compass). Pass `node.kind` straight through. |
| `onSelect`  | `() => void`                                          | —        | Fired on tap; ignored while `locked` (the button is disabled).                                                                                      |
| `onDismiss` | `() => void`                                          | —        | Permanently removes the node. Only rendered for `suggested`/`explored`.                                                                             |

## Accessibility

- A real `<button>`, so `Enter`/`Space`, focus, and SR semantics are native; the global
  `:focus-visible` ring applies. `locked` renders as a disabled button.
- **Never color-only** — every state pairs a distinct **status word** (Locked, Tap to
  explore, Explored, Mastered) with its color. For `locked`/`mastered` the word is visible
  body text; for `suggested`/`explored` it moves to an `sr-only` span (accessible name
  unchanged, e.g. "Dinosaurs Explored") and is mirrored visually by a small `aria-hidden`
  corner badge (icon + short word — "✓ Explored", "🔎 Deep", "🧭 New") so sighted users
  still get icon + text + color, never color alone.
- Comfortably clears the 56–64px kid target floor.
- The optional dismiss control is a separate 44px icon-only button (sibling of the main
  select button, never nested inside it) with `aria-label="Dismiss {title}"`; its click
  handler stops propagation so it never also triggers `onSelect`.

## Surfaces

Built for `night` (the play surface); reads `--surface-*` + `--aqua`/`--sun` tokens, so it
never hardcodes color.
