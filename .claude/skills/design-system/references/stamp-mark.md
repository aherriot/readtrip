# StampMark

A rubber-stamp status mark — a tilted, double-ruled ink frame around a short uppercase word,
pressed _over_ content the way a teacher stamps a page. ReadTrip's **stamped-on** status
language (as opposed to `Highlight`, a quiet marker swipe over inline text). Source:
[`components/ui/StampMark.tsx`](../../../../components/ui/StampMark.tsx).

```tsx
import { StampMark } from "@/components/ui/StampMark";
import { Icon } from "@/components/ui/Icon";

// Pressed into a choice's corner (position it absolutely so it overlaps, not reflows):
<StampMark
  tone="leaf"
  tilt={-7}
  className="absolute bottom-1.5 right-3"
  icon={<Icon name="check" decorative size="sm" accent="currentColor" />}
>
  Yes!
</StampMark>;
```

## When to use

- **Resolved quiz feedback** ("Yes!" / "Try again") and similar "stamped verdict" moments,
  where the mark should land _over_ the answer rather than pushing a new line and resizing the
  box.

## When **not** to use

- **A quiet inline status word in a row of text or a header** → `Highlight` (a marker swipe
  over the words). The stamp is deliberately loud and overlapping.
- **A tappable thing** → it's presentational; place it over a control, don't make it one.

## Props

| Prop       | Type                | Default | Notes                                                        |
| ---------- | ------------------- | ------- | ------------------------------------------------------------ |
| `children` | `ReactNode`         | —       | The stamped word (the meaning). A word or two.               |
| `tone`     | `"leaf" \| "coral"` | —       | Semantic ink: `leaf` = correct, `coral` = try-again.         |
| `icon`     | `ReactNode`         | —       | Decorative leading glyph — the word carries the meaning.     |
| `tilt`     | `number`            | `-7`    | Hand-stamped angle in degrees (±10°), via the `rotate` prop. |

## Accessibility

- **Never color-only.** The mark pairs an icon **and** a word with the color (a11y floor).
- Inks in the **AA-safe small-text semantics** per tone (`--surface-success` → `--leaf-strong`,
  `--surface-danger` → `--coral-strong`) so the small stamp text/frame clears WCAG AA on paper —
  the bright `--leaf`/`--coral` don't.
- **The caller owns the a11y wiring.** In `QuizChoice` the stamp word is part of the button's
  accessible name (so a screen reader announces "…Yes!"); `aria-hidden` it only when the same
  word is already announced elsewhere.
- The frame lives on a filtered `::before`/`::after` (`.rt-stamp`) so the **label stays crisp**
  while the ink wobbles — no legibility cost from the turbulence filter.
