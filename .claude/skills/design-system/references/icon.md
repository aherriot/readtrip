# Icon

Single sized, accessibility-aware wrapper for the **unified icon set**. Prefer
`<Icon name="…" />` — it pulls a glyph from `components/ui/icons`, applies the shared
hand-drawn "doodle" waver, and colors the accent from a design token. An icon is **either**
meaningful (`label`) **or** decorative (`decorative`) — the prop union makes "unlabelled" a
type error.
Source: [`components/ui/Icon.tsx`](../../../../components/ui/Icon.tsx),
glyphs in [`components/ui/icons/glyphs.tsx`](../../../../components/ui/icons/glyphs.tsx).

```tsx
import { Icon } from "@/components/ui/Icon";

<Icon name="star" label="Favorite" />          // meaningful → role="img", named
<Icon name="search" decorative />               // decorative → hidden from SRs
<Icon name="star" accent="var(--sky)" label="Sky star" /> // override the default accent
<Icon decorative><MyCustomSvg /></Icon>         // escape hatch: a bespoke inline <svg>
```

## The set

One consistent field-journal doodle language for the whole product — **no emoji, no ad-hoc
`<svg>`** in pages. Author new glyphs in `components/ui/icons/glyphs.tsx` (clean 24×24
geometry; the shared filter adds the waver) and they're instantly available by `name`.
Current names: `check`, `retry`, `close`, `search`, `chevron-down`, `alert`, `arrow-right`,
`flag`, `compass`, `rocket`, `book`, `books`, `star`, `medal`, `sparkles`, `party`, `puzzle`,
`rainbow`, `sun`, `mountain`, `volcano`, `cat`, `bee`, `octopus`, `cave`, `hero`. See them all
in the gallery's Icon section.

The shared `#rt-doodle` filter lives in `IconDefs`, mounted once in `app/layout.tsx` — every
named icon references it, so the whole set shares one inked character.

## When to use

- Any glyph in the UI. Reach for a `name` from the set; it's consistently sized and either
  correctly named or correctly hidden. Never drop a raw `<svg>` or an emoji into a page.

## When **not** to use

- **A tappable icon action** → put the Icon (usually `decorative`) inside a `Button` with an
  `aria-label`; the button is the control, not the icon.
- **A one-off glyph not worth adding to the set** → pass a bespoke `<svg>` as `children`
  (the escape hatch). If it recurs, promote it into `glyphs.tsx` instead.

## Props

| Prop         | Type                           | Default           | Notes                                                                          |
| ------------ | ------------------------------ | ----------------- | ------------------------------------------------------------------------------ |
| `name`       | `IconName`                     | —                 | A glyph from the set. Omit only when passing a bespoke `children` svg.         |
| `accent`     | `string` (token/CSS color)     | per-glyph default | Overrides the glyph's accent. Use `"currentColor"` to force a monochrome icon. |
| `label`      | `string`                       | —                 | Meaningful icon → exposed as `role="img"` with this name.                      |
| `decorative` | `true`                         | —                 | Purely decorative → `aria-hidden`. Mutually exclusive w/ `label`.              |
| `size`       | `"sm" \| "md" \| "lg" \| "xl"` | `"md"`            | Box the glyph fills (16 / 20 / 28 / 48 px).                                    |
| `children`   | `ReactNode`                    | —                 | Escape hatch: a bespoke inline `<svg>` instead of a named glyph.               |

You must pass exactly one of `label` or `decorative`, and either a `name` or `children`.

## Accessibility

- **Meaningful icon** (conveys info on its own) → `label`.
- **Decorative icon** (next to text that already says it, or inside a labelled button) →
  `decorative`, so it isn't announced twice.
- Color is never the only signal — icons accompany text/labels, per the a11y floor. The
  doodle filter is purely visual; the glyph shape carries the meaning.

## Do / Don't

```tsx
// ✅ icon + visible text: icon is decorative, text names it
<span><Icon name="search" decorative /> Search</span>

// ✅ standalone meaningful icon gets a name
<Icon name="medal" label="Mastered" />

// ❌ an emoji or a raw svg dropped into a page
<span>🏅</span>
<svg viewBox="0 0 20 20">…</svg>
```
