# Icon

Single sized, accessibility-aware wrapper for the icon set. An icon is **either** meaningful
(`label`) **or** decorative (`decorative`) — the prop union makes "unlabelled" a type error.
Source: [`components/ui/Icon.tsx`](../../../../components/ui/Icon.tsx).

```tsx
import { Icon } from "@/components/ui/Icon";

<Icon label="Favorite"><StarGlyph /></Icon>     // meaningful → role="img", named
<Icon decorative><SearchGlyph /></Icon>          // decorative → hidden from SRs
```

## When to use

- Any glyph in the UI. Wrap it so it's consistently sized and either correctly named or
  correctly hidden — never drop a raw `<svg>` into a page.

## When **not** to use

- **A tappable icon action** → put the Icon (usually `decorative`) inside a `Button` with an
  `aria-label`; the button is the control, not the icon.

## Props

| Prop         | Type                   | Default | Notes                                                             |
| ------------ | ---------------------- | ------- | ----------------------------------------------------------------- |
| `label`      | `string`               | —       | Meaningful icon → exposed as `role="img"` with this name.         |
| `decorative` | `true`                 | —       | Purely decorative → `aria-hidden`. Mutually exclusive w/ `label`. |
| `size`       | `"sm" \| "md" \| "lg"` | `"md"`  | Box the glyph fills; author the svg at any viewBox.               |
| `children`   | `ReactNode`            | —       | The inline `<svg>` glyph.                                         |

You must pass exactly one of `label` or `decorative` — the types won't let you omit both.

## Accessibility

- **Meaningful icon** (conveys info on its own, e.g. a status mark) → `label`.
- **Decorative icon** (next to text that already says it, or inside a labelled button) →
  `decorative`, so it isn't announced twice.
- Color is never the only signal — icons accompany text/labels, per the a11y floor.

## Do / Don't

```tsx
// ✅ icon + visible text: icon is decorative, text names it
<span><Icon decorative><SearchGlyph /></Icon> Search</span>

// ✅ standalone meaningful icon gets a name
<Icon label="Mastered"><StampGlyph /></Icon>

// ❌ raw svg with no sizing or a11y handling
<svg viewBox="0 0 20 20">…</svg>
```
