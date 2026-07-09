---
name: illustrations
description: How to draw a new ReadTrip field-journal illustration (the large, detailed ink-and-marker "hero doodle" set — distinct from the small Icon glyphs) and wire it into the catalog/registry so it stays code-split. Invoke BEFORE authoring a new illustration SVG, or when asked to expand the illustration set.
---

# ReadTrip illustrations

Illustrations are the **large, detailed** hand-drawn ink pieces that decorate story/quiz
pages — a couple per page, not a small inline glyph. They're the "hero doodle" sibling of
`Icon` (see the design-system skill): same field-journal pen-and-marker language, more
detail, bigger canvas, one or two accent colors instead of a single flat pop fill.

Live example: [`components/ui/illustrations/pyramid.tsx`](../../../components/ui/illustrations/pyramid.tsx).
Read it before drawing a new one — it's the reference for density and technique.

## The three files every illustration touches

1. **`components/ui/illustrations/<name>.tsx`** — the SVG itself. One named export,
   `export function XxxIllustration() { return <svg>…</svg>; }`.
2. **`components/ui/illustrations/catalog.ts`** — add one entry:
   `<name>: { label, tag, category }`. No import of the SVG file — this file is metadata
   only, read by things that shouldn't pull illustration chunks into their bundle (the
   gallery, a future topic resolver).
3. **`components/ui/illustrations/registry.ts`** — add one entry:
   `<name>: dynamic(() => import("./<name>").then((m) => m.XxxIllustration))`.

Then use it anywhere via `<Illustration name="<name>" size="xl" label="…" />`
(`components/ui/illustrations/Illustration.tsx`) — never import the SVG module directly
from a page.

## Why the split (read before "simplifying" it away)

- **Every illustration is its own file/chunk**, dynamically imported by name in
  `registry.ts`. A page that renders `pyramid` never downloads any other illustration's
  markup. This is the whole point as the set grows past 100+ — don't collapse illustrations
  into one shared object the way `icons/glyphs.tsx` does (fine at icon scale, wrong at
  illustration scale).
- **No runtime SVG filters** (`feTurbulence`, `feDisplacementMap`) on illustrations, ever.
  The hand-drawn wobble is baked directly into the path coordinates you author — endpoints
  nudged off-grid, curves that lean instead of perfect arcs, stone courses that aren't quite
  parallel. This is the same direction the rest of the design system has moved (see
  `InkFrame`, the marker-stroke masks) for performance: a per-instance filter recomputes
  every repaint; hand-authored geometry is free at render time and free to code-split.
- **`catalog.ts` and `registry.ts` are separate** so metadata (name, tag, category, label)
  can be read without importing SVG modules — keep it that way when you add entries.

## Drawing convention

Match `pyramid.tsx`'s technique:

- **`viewBox="0 0 200 200"`**, `fill="none"`, `overflow="visible"`. This is a bigger canvas
  than `Icon`'s 24×24 — use the room for real detail (texture lines, background elements,
  a couple of small characterful touches), not just a scaled-up glyph.
- **Ink outlines**: `stroke="var(--surface-ink)"`, `strokeLinecap="round"`,
  `strokeLinejoin="round"`, `fill="none"`. Vary `strokeWidth` ~1.2–2.4: heavier for the main
  subject's silhouette, lighter for texture/background/distant elements. Drop `opacity`
  toward 0.4–0.6 on background elements to push them back in depth.
- **Marker accents**: 2–4 flat color fills from the accent primitives
  (`var(--sun)`, `var(--coral)`, `var(--sky)`, `var(--leaf)`, `var(--violet)`, `var(--aqua)`,
  `var(--orchid)`) at `opacity` ~0.14–0.9 depending on whether it's a wash (sand, sky, grass
  — low opacity, big area) or a pop (a flag, a sun, a heart — high opacity, small area).
  These are genuinely decorative accents with no state to carry, so raw accent primitives
  are the correct token layer (not semantic tokens — see tokens.md).
- **Hand-drawn wobble is geometry, not a filter.** Don't draw a perfect circle/rectangle and
  rely on a filter to rough it up — author the imperfection: uneven stone courses, an
  off-true sun, a wavy horizon line built from a few `Q` curves instead of one straight `L`.
  Look at how `pyramid.tsx`'s ground line and stone courses do this.
- **Ground the scene**: most illustrations read better with a baseline (a ground/horizon
  line, water line, or similar) than floating in empty space — see the pyramid's sand band.
- **A character touch or two**: a bird, a spark, a small plant — cheap detail that makes the
  piece feel inhabited rather than a diagram. Don't overdo it; 1–2 per illustration.
- Keep total path count in the same order of magnitude as `pyramid.tsx` (~20 elements).
  More than that starts to cost real render time across a page with several illustrations.

## Avoiding the "obviously SVG" look

The single biggest tell that a piece was drawn by code, not a pen, is **geometric
primitives and perfect symmetry**. A real journal doodle never has a mathematically
straight 80px wall or an exact circle. Concretely, when authoring or reviewing a piece:

- **No `<circle>`, `<ellipse>`, or `<rect>` elements. Ever.** Every round or boxy shape —
  a head, a window, a knob, a tower body — is a hand-authored closed `<path>` with 5-8
  uneven points, none of them equidistant from a center and none of the "sides" quite
  parallel. A perfect circle reads as CAD, not pen.
- **No straight edge longer than ~15-20 units.** A real hand can't rule a long straight
  line freehand. Any wall, limb, tube, or silhouette edge longer than that should be a `C`/
  `Q` curve that bows a couple of px off the straight path — asymmetrically, not a clean
  uniform arc (uniform bowing reads just as mechanical as dead straight).
- **Break mirror symmetry on every paired element.** Two towers, two fins, two legs, two
  eyes — never write one shape and mirror its exact coordinates for the other. Hand-vary
  each side by a few units so they're clearly two independent pen strokes, not one
  reflected. This is one of the fastest tells to fix and one of the easiest to miss.
- **Fake a pen retrace with a sketchy double-stroke.** On at least the primary subject's
  outline, layer a second pass: the same contour redrawn with a slightly different (jittered)
  `d`, thinner `strokeWidth`, `opacity` ~0.4-0.6, offset a px or two from the main line. Real
  ink sketches get gone-over more than once; a single crisp continuous outline is the most
  "vector" thing about a vector drawing.
- **Let corners overshoot slightly** where two strokes meet (a roofline, a limb joint) —
  extend one stroke a touch past the vertex rather than terminating exactly on it. Small, but
  it's a real hand-drawn tic that a clean path join never produces.
- Small dots (an eye, a distant star) are the one exception — at that size a small round
  mark is fine, `circle` primitives are still off-limits for it (use a tiny filled blob path).

## Tag & category

Every catalog entry needs:

- **`tag`** — the specific subject a topic slug should match (`"pyramids"`, `"volcanoes"`).
  Lowercase, hyphenated, matches the vocabulary a topic-matching layer would use.
- **`category`** — one of the fixed `IllustrationCategory` buckets in `catalog.ts`
  (`history`, `science`, `biology`, `geography`, `space`). This is the fallback when no
  illustration exists yet for a topic's specific tag — keep it to this small closed set
  rather than inventing a new bucket per illustration.

## Sizing & accessibility

Don't touch this in the illustration file itself — it's handled by the `<Illustration>`
wrapper (`md`/`lg`/`xl` = 96/144/208px) and its `label`/`decorative` a11y contract, same
shape as `Icon`. Pass `label` when the illustration is the only carrier of meaning on the
page; `decorative` when adjacent text already says it.

## Checking your work

Open `/dev/illustrations` in dev (`npm run dev`) — every illustration renders at `xl` with
its name/tag/category, and the search box filters by any of the three. That's the fastest
way to eyeball a new piece against the existing set for density/color balance before wiring
it into an actual page.
