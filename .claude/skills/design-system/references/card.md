# Card

Surface-aware container for grouping related content — a transparent **"pen box"** drawn on
the lined paper: the ruled lines show through and a hand-drawn ink outline (the `#rt-sketch`
turbulence filter, via `.rt-inkbox`) frames the content. The `elevated` flag is the **Panel**
look (a heavier, drawn-twice outline). Source:
[`components/ui/Card.tsx`](../../../../components/ui/Card.tsx).

```tsx
import { Card } from "@/components/ui/Card";

<Card>
  <Heading level={3}>Volcanoes</Heading>
  <Text tone="soft">A topic waiting to be explored.</Text>
</Card>

<Card elevated as="section" padding="lg">…</Card>   // the "Panel" treatment
```

## When to use

- Group related content into a contained block: a topic summary, a settings group, a stat
  panel. `elevated` when it should lift off the surface (a highlighted panel).

## When **not** to use

- **A clickable thing** → don't make the whole Card a button. Put a `Button`/link _inside_ it;
  a Card is a presentational container, not a control.
- **Page text with no grouping** → just use `Heading`/`Text` directly.

## Props

| Prop       | Type                   | Default | Notes                                                    |
| ---------- | ---------------------- | ------- | -------------------------------------------------------- |
| `as`       | `ElementType`          | `"div"` | Use `section`/`article`/`li` for semantics.              |
| `padding`  | `"sm" \| "md" \| "lg"` | `"md"`  | Inner padding from the spacing scale.                    |
| `elevated` | `boolean`              | `false` | The **Panel** look — a heavier, drawn-twice ink outline. |
| …rest      | native element props   | —       | `id`, `aria-*`, `className`, …                           |

## Surface

The fill is transparent (the paper's ruled lines read through it); the hand-drawn outline is
`var(--surface-ink)`, so the Card draws a dark ink box on the field-journal paper. It reads
the surface tokens, so a future theme would re-ink it with no per-component code. `elevated`
just thickens the outline.

## Accessibility

- Keep it non-interactive; nest real controls inside rather than adding an `onClick` to the
  container (which would have no role, focus, or keyboard support).
- Choose `as` for the right document semantics (a list of cards → `as="li"` in a `<ul>`).

## Do / Don't

```tsx
// ✅ container groups content; the action is a real button inside
<Card>
  <Heading level={3}>Today's expedition</Heading>
  <Button>Continue</Button>
</Card>

// ❌ the whole card is a fake button
<Card onClick={go}>…</Card>
```
