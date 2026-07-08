# JournalSheet

The "open field journal on a desk" page frame — every product route's outermost wrapper. Three
stacked layers: a light desk (`.rt-desk`) fills the viewport, a leather cover (`.rt-cover`)
binds the page and lifts it off the desk, and a ruled page (`.rt-sheet`) fills the cover and
carries the horizontal rules + vertical margin rule. Source:
[`components/layout/JournalSheet.tsx`](../../../../components/layout/JournalSheet.tsx).

```tsx
import { JournalSheet } from "@/components/layout/JournalSheet";

<JournalSheet contentClassName="max-w-xl gap-6">
  <Heading level={1}>Today&apos;s expedition</Heading>…
</JournalSheet>;
```

## When to use

- **Every top-level route** (`/`, `/play`, `/sign-in`, `/dashboard`, `/profiles`, …) and its
  matching `loading.tsx` skeleton — same frame both times so the loading → ready swap never
  flashes.
- Pass `wide` for content that needs more room (the landing page uses it to widen the book).
- Pass `busy` on a loading state to set `aria-busy` on the `<main>`.

## When **not** to use

- **Inside a page, around a sub-section** — this is the whole-page frame, not a container.
  Reach for `Card`/`StickyNote` to group content _within_ a page.
- **A modal or overlay** — those float above the journal (`Modal`), they don't nest another
  journal frame inside it.

## Props

| Prop               | Type        | Default | Notes                                                                                                          |
| ------------------ | ----------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `children`         | `ReactNode` | —       | The page content.                                                                                              |
| `contentClassName` | `string`    | `""`    | Utility classes for the centered content column (width, gap, `mt-auto` footers — it's a `flex-1` flex column). |
| `busy`             | `boolean`   | `false` | Sets `aria-busy` on the `<main>` — use on a route's loading skeleton.                                          |
| `wide`             | `boolean`   | `false` | Widens the book (`--rt-page: 72rem`) for content that needs more room.                                         |

## Surface

All visual treatment lives in `.rt-desk` / `.rt-cover` / `.rt-sheet` (`app/globals.css`); this
component only wires up the markup. Every layer reads `--surface-*` tokens (desk, cover,
stitch, paper, rule), so a future theme is a re-point of those tokens with no component
change. On mobile the cover fills the whole viewport (no desk shows, square corners); from
`sm` up a desk inset frames the book and the corners round.

## Accessibility

- Renders the page's `<main>` landmark — don't nest another `<main>` inside `children`.
- `aria-busy` on `busy` announces the loading state without needing separate loading markup.
