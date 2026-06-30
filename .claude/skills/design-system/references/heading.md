# Heading

Display-font heading on the type scale, with the right semantic level for the document
outline. Source: [`components/ui/Heading.tsx`](../../../../components/ui/Heading.tsx).

```tsx
import { Heading } from "@/components/ui/Heading";

<Heading level={1}>Volcanoes</Heading>
<Heading level={2} size="xl">A smaller section title</Heading>
```

## When to use

- Every heading on a page. Pick `level` by **structure** (the outline), not by how big you
  want it — use `size` to tune the visual scale independently.

## When **not** to use

- **Body copy / labels** → [`Text`](text.md).
- **A big number that isn't a heading** (XP total, score) → `Text size="lg"` or a game
  component, so you don't pollute the heading outline.

## Props

| Prop    | Type                             | Default            | Notes                                     |
| ------- | -------------------------------- | ------------------ | ----------------------------------------- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6`     | `2`                | Renders `h1`–`h6`; drives the outline.    |
| `size`  | `"lg" \| "xl" \| "2xl" \| "3xl"` | derived from level | Decouple visual size from semantic level. |
| …rest   | native heading props             | —                  | `id`, `className`, …                      |

## Surfaces

Uses `font-display` (Fredoka) + `text-surface-ink`, so it's legible on both surfaces with no
props.

## Accessibility

- **Keep heading order sensible** — don't skip levels going down (h2 → h4). Use `size` when
  you need a smaller-looking heading without breaking the outline.
- One `h1` per page (the page title).

## Do / Don't

```tsx
// ✅ correct outline; visual size tuned with `size`
<Heading level={2} size="lg">Quiz</Heading>

// ❌ raw heading with ad-hoc font sizing in a page
<h2 className="font-display text-[28px]">Quiz</h2>
```
