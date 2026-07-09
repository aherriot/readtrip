# Illustration

The large, detailed "hero doodle" — a couple per story/quiz page — as opposed to `Icon`'s
small inline glyph. Same ink-and-marker field-journal language, more detail, code-split per
name so a page only ever downloads the illustrations it actually renders.

Source: [`components/ui/illustrations/Illustration.tsx`](../../../../components/ui/illustrations/Illustration.tsx),
alongside `catalog.ts` (metadata) + `registry.ts` (dynamic imports) + one file per
illustration. Deliberately not a direct child of `components/ui/` (like `Icon` is) — it's
still early/iterating, so it isn't held to the full design-system parity bar (no
`/dev/components` gallery section or e2e contract test yet).

```tsx
import { Illustration } from "@/components/ui/illustrations/Illustration";

<Illustration name="pyramid" size="xl" label="Ancient pyramid" /> // meaningful
<Illustration name="pyramid" size="lg" decorative />               // decorative, text nearby names it
```

## The set

Grown one at a time, drawn by hand (no illustration-generation pipeline) — see the
[illustrations skill](../../illustrations/SKILL.md) for how to draw a new one and wire it
into `catalog.ts`/`registry.ts`. Current names: `pyramid`, `castle`, `volcano`,
`microscope`, `dinosaur`, `human-body`, `mountain-range`, `rainforest`, `rocket-launch`,
`telescope`, `shark`, `storm`, `desert`, `knight`, `astronaut`, plus a generic fallback pool
(`compass`, `magnifying-glass`, `field-journal`) that `lib/illustrations/resolve.ts` picks
from when a topic's tag and category both fail to resolve to art. Browse them all, with
their `tag`/`category` metadata, and search-filter by any of the three, at
`/dev/illustrations`.

## When to use

- A page-level decorative/illustrative moment — a story intro, a quiz result — that calls
  for something bigger and more detailed than an `Icon`. Not for inline UI glyphs; that's
  `Icon`.

## When **not** to use

- Anywhere an `Icon` would do (a button glyph, an inline status marker) — `Illustration` is
  sized and detailed for a standalone moment, not UI chrome.
- Don't import an illustration module directly (`components/ui/illustrations/pyramid.tsx`)
  from a page — always go through `<Illustration name="…">` so the dynamic-import
  code-splitting actually applies.

## Props

| Prop         | Type                   | Default | Notes                                                             |
| ------------ | ---------------------- | ------- | ----------------------------------------------------------------- |
| `name`       | `IllustrationName`     | —       | A name from `catalog.ts`.                                         |
| `size`       | `"md" \| "lg" \| "xl"` | `"lg"`  | Box the art fills (96 / 144 / 208px) — bigger scale than `Icon`.  |
| `label`      | `string`               | —       | Meaningful illustration → exposed as `role="img"` with this name. |
| `decorative` | `true`                 | —       | Purely decorative → `aria-hidden`. Mutually exclusive w/ `label`. |

You must pass exactly one of `label` or `decorative`, same union as `Icon`.

## Performance

- **One illustration = one file = one chunk.** `registry.ts` maps each name to its own
  `next/dynamic` import. A page rendering `pyramid` never pulls in any other illustration's
  markup — this is what lets the set grow past 100+ without bloating any single page.
- **No runtime SVG filters.** The hand-drawn wobble is baked into each illustration's path
  data at authoring time, not applied via `feTurbulence`/`feDisplacementMap` at render time.
  See the illustrations skill for the drawing convention.
- `catalog.ts` (metadata: label/tag/category) is intentionally import-free of the SVG
  modules, so reading "what illustrations exist" never pulls their chunks in.

## Accessibility

Same contract as `Icon`: `label` for a standalone meaningful illustration, `decorative` when
adjacent text already carries the meaning. Color is never the only signal on its own — an
illustration is decorative flavor, not a status indicator.
