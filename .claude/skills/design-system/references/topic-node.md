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

| Prop        | Type                                                  | Default  | Notes                                                                                                                                                            |
| ----------- | ----------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`     | `string`                                              | —        | Kid-facing topic title.                                                                                                                                          |
| `state`     | `"locked" \| "suggested" \| "explored" \| "mastered"` | —        | Derive from map data with `toNodeState` (`lib/map`).                                                                                                             |
| `kind`      | `"deep" \| "diverse" \| null`                         | `"deep"` | Only matters while `suggested`; picks the header strip/accent (deep = aqua magnifier "Dive", diverse = violet compass "New"). Pass `node.kind` straight through. |
| `onSelect`  | `() => void`                                          | —        | Fired on tap; ignored while `locked` (the button is disabled).                                                                                                   |
| `onDismiss` | `() => void`                                          | —        | Permanently removes the node. Only rendered for `suggested`/`explored`.                                                                                          |

## Accessibility

- A real `<button>`, so `Enter`/`Space`, focus, and SR semantics are native; the global
  `:focus-visible` ring applies. `locked` renders as a disabled button.
- **Never color-only** — every state pairs a distinct **status word** (Locked, Tap to
  explore, Continue, Mastered) with its color. For `locked`/`mastered` the word is visible
  body text; for `suggested`/`explored` it moves to an `sr-only` span (accessible name
  unchanged, e.g. "Dinosaurs Continue") and is mirrored visually by a full-width **header
  strip** across the top of the tile — a tinted bar carrying a stroked line icon + short word
  (magnifier "Dive", compass "New", flag "Continue"). The strip is `aria-hidden` (the sr-only
  span already announces the word) and spans the tile so the title always sits _below_ it and
  can never be crowded by the marker. The strip's word + icon use the near-white
  `--surface-ink` token; the per-kind hue lives in the strip's tint fill + bottom rule + the
  tile border, so sighted users still get icon + word + color, never color alone. `explored`
  reads as in-progress (started, not yet mastered) and uses the sky-blue accent — distinct
  from the aqua/violet suggestions. Glow intensity is itself a progress ladder: suggested
  (flat) → exploring (soft sky glow) → mastered (bright gold glow).
- Comfortably clears the 56–64px kid target floor.
- The optional dismiss control is a separate 44px icon-only button (sibling of the main
  select button, never nested inside it) with `aria-label="Dismiss {title}"`; its click
  handler stops propagation so it never also triggers `onSelect`. On dismiss the tile plays
  a shrink-out (`animate-tile-out`) and only calls `onDismiss` on `animationend`, so removal
  is animated; reduced-motion users hit the zeroed floor and remove near-instantly.

## Surfaces

Built for `night` (the play surface); reads `--surface-*` + `--aqua`/`--sky`/`--violet`/`--sun`
tokens, so it never hardcodes color. Tiles cascade into place via
`motion-safe:animate-cascade-in` (staggered by [`WorldMap`](world-map.md)).
