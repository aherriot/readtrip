# Card

Surface-aware container for grouping related content. The `elevated` flag is the **Panel**
look. Source: [`components/ui/Card.tsx`](../../../../components/ui/Card.tsx).

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

| Prop       | Type                   | Default | Notes                                                     |
| ---------- | ---------------------- | ------- | --------------------------------------------------------- |
| `as`       | `ElementType`          | `"div"` | Use `section`/`article`/`li` for semantics.               |
| `padding`  | `"sm" \| "md" \| "lg"` | `"md"`  | Inner padding from the spacing scale.                     |
| `elevated` | `boolean`              | `false` | The **Panel** look — glow on night, soft shadow on paper. |
| …rest      | native element props   | —       | `id`, `aria-*`, `className`, …                            |

## Surfaces

Reads `--surface-panel`, `--surface-rule`, `--surface-ink`, so the same Card is a warm paper
card on the reading surface and a night panel on the play surface. `elevated` uses
`--surface-elevation`, which is a **colored glow on night** and a **soft shadow on paper** —
the documented "lit-up panel vs. paper card" difference, with no per-surface code.

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
