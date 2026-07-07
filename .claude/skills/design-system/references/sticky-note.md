# StickyNote

A sticky/taped **note** — a small piece of colored paper stuck onto the journal. ReadTrip's
**collection** language: where a [`Card`](card.md) is a box you _draw_ on the page (a
transparent pen outline), a StickyNote is a thing you _collect and stick on_ — opaque colored
paper, a soft drop shadow, a slight hand-placed tilt, optionally a strip of tape. Source:
[`components/ui/StickyNote.tsx`](../../../../components/ui/StickyNote.tsx).

```tsx
import { StickyNote } from "@/components/ui/StickyNote";

<StickyNote tone="aqua" tape tilt={-1.5}>
  <Heading level={3} size="lg">
    Tide pools
  </Heading>
  <Text size="sm">Dive in</Text>
</StickyNote>;
```

## When to use

- **Map topic tiles** (`TopicNode` composes this) and other "pinned discovery" surfaces — a
  collected topic, a badge you earned, a keepsake stuck into the journal.
- When you want a container to read as a **physical, collected object**, distinct from the
  drawn-on structure of a `Card`.

## When **not** to use

- **Structural grouping / forms / panels** → use [`Card`](card.md) (the pen box). Reserve
  sticky notes for collected/pinned things, or the two languages stop meaning anything.
- **A clickable tile** → StickyNote is presentational; don't put an `onClick` on it. Wrap it
  in a real `<button>` (see `TopicNode`) so keyboard + focus behavior is native.
- **Long body copy** → a note is a glanceable label, not a reading surface.

## Props

| Prop      | Type                                                      | Default | Notes                                                                      |
| --------- | --------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `tone`    | `sun \| aqua \| sky \| violet \| leaf \| coral \| orchid` | `"sun"` | Accent that colors the paper (mixed with the surface panel into a pastel). |
| `tape`    | `boolean`                                                 | `false` | A translucent tape strip across the top center.                            |
| `tilt`    | `number`                                                  | `0`     | Degrees of rotation. Keep small (±3°); pass a **stable** value.            |
| `padding` | `"none" \| "sm" \| "md" \| "lg"`                          | `"md"`  | `none` when the note owns its own layout (e.g. `TopicNode`).               |
| `as`      | `ElementType`                                             | `"div"` | `li`/`section` for semantics.                                              |
| …rest     | native element props                                      | —       | `id`, `aria-*`, `className`, …                                             |

## Surface

The paper is `color-mix(--<tone>, --surface-panel)` — a pale colored note on the
field-journal paper, with dark ink. It reads the surface tokens, so a future theme would
re-tint it with no per-component code. The paper is **opaque**, so it covers the page's ruled
lines (a note is stuck _on top of_ the paper), unlike the transparent `Card`.

## Motion

`tilt` uses the individual `rotate` property, so a hover `translate`/`scale` on an ancestor
(e.g. `TopicNode`'s lift) **composes** with it instead of overwriting the transform. Any
motion still respects the global `prefers-reduced-motion` floor.

## Accessibility

- Presentational — keep it non-interactive; nest a real control (or wrap in a `<button>`)
  rather than adding an `onClick`.
- The tape strip is decorative (`aria-hidden`); never put meaning only in it.
- Tone is decorative: pair any state a note represents with an icon + word (the a11y floor),
  the way `TopicNode` does with its status strip and label.
- **Text contrast:** the paper is a colored mid-tone, so use the **default** ink for labels
  on a note, not `Text tone="soft"` — soft ink can fall below AA on the more saturated tones.
