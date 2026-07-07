# Wordmark

The ReadTrip brand mark — solid ink letters riding a warm gold offset shadow, each glyph set
at a small hand-placed tilt, under a single drawn pen-underline swash. Rendered as inline SVG
so it reads as a real logo (colored sticker letters, wobble, underline) rather than a bigger
line of body text. Source: [`components/ui/Wordmark.tsx`](../../../../components/ui/Wordmark.tsx).

```tsx
import { Wordmark } from "@/components/ui/Wordmark";

// Page title (carries the accessible name "ReadTrip"):
<Wordmark className="h-16" />

// Inside a real heading that already names the region, or purely decorative:
<Heading level={1}><Wordmark className="h-16" /></Heading>
<Wordmark className="h-9" decorative />
```

## When to use

- The **app's identity** at the top of a page: the `/play` header, the homepage hero, a
  sign-in screen. One per page — it's the logo, not a heading style.

## When **not** to use

- **A section or content heading** → `Heading`. The wordmark is only ever the product name.
- **Body copy that happens to mention ReadTrip** → plain `Text`.

## Props

| Prop         | Type      | Default | Notes                                                                     |
| ------------ | --------- | ------- | ------------------------------------------------------------------------- |
| `className`  | `string`  | —       | **Set the size here** via a height class (`h-9`, `h-16`); the SVG scales. |
| `decorative` | `boolean` | `false` | Hide from assistive tech when a real heading already names the region.    |

## Accessibility

- Non-decorative: `role="img"` + `aria-label="ReadTrip"`, so the mark contributes the brand
  name (e.g. as the `/play` page's on-screen title) even though the letters are drawn.
- `decorative` sets `aria-hidden` and drops the label — use it when the mark sits inside a
  `Heading` (or beside text) that already says "ReadTrip", to avoid a doubled announcement.
- Scales cleanly (it's vector) — legible from a header chip up to a hero, honoring zoom.

## How it's built

- Live **Shantell Sans** (via `--font-shantell`) in an SVG `<text>`; `textLength` +
  `lengthAdjust` pin the width so the `viewBox` is deterministic across font metrics.
- Two stacked `<text>` copies: a `--sun` gold under-copy offset down-right, then the same
  word in solid `--surface-ink` on top — so the letters stay high-contrast (legible even at
  header size) while the gold reads as a playful colored shadow. A `--coral` underline swash
  sits beneath. (An earlier gold _fill_ was too low-contrast at small sizes.)
- Per-letter tilt via the SVG `rotate` glyph list; the whole group is waved by the shared
  `#rt-doodle` turbulence filter (the same one the icon set uses) for an inked-by-hand wobble.
