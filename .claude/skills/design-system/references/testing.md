# Testing & manual review

How design-system components are checked — automated and by hand. The strategy is one
Playwright toolchain pointed at a single artifact: the **component gallery**
(`app/dev/components/page.tsx`), which is both the manual-review surface and the automated
test target.

## Manual review (do this for every component change)

Run the app and open the gallery:

```bash
npm run dev
# → http://localhost:3000/dev/components
```

Every component renders in all its variants on **both surfaces** (night + paper). Use it to:

- **Keyboard:** Tab through everything — every control shows a visible focus ring; tab order
  follows reading order; `Enter`/`Space` activate; `Escape` closes overlays.
- **Screen reader:** run VoiceOver (⌘F5) / NVDA over a component — labels are announced,
  error/state changes are spoken, icon-only controls have names.
- **a11y scan:** run the [axe DevTools] browser extension on the page for issues the CI scan
  also catches.
- **Visual / zoom:** eyeball spacing, contrast, and surface treatment; zoom to 200% and bump
  browser font size to confirm rem-based scaling holds.
- **Reduced motion:** toggle OS "reduce motion" and confirm animations degrade to instant.

Automated tooling catches **~40%** of real a11y problems — this manual pass is not optional.

## Automated tests (`e2e/design-system.spec.ts`, in CI)

Runs as part of `npm test` (and the pre-commit `npm run check`):

- **axe** (`@axe-core/playwright`) over the whole gallery with `wcag2a`/`wcag2aa` tags —
  fails on any violation, on either surface.
- **Per-component contract** assertions, scoped to one surface so accessible names are
  unambiguous: label↔input association, `aria-invalid` + `aria-describedby` on error,
  target-size floor (≥56px for `kid`), visible focus ring.

Run just these locally:

```bash
npx playwright test design-system        # headless
npm run test:e2e:ui                       # interactive runner
```

## Visual regression (opt-in)

Snapshot of the gallery, **off by default** — screenshot baselines are OS/font-specific, so
generate and compare them in one environment (your machine, or CI's Linux/Chromium) to avoid
flake.

```bash
npm run test:visual:update   # generate/refresh baselines (run first)
npm run test:visual          # compare
```

Baselines live next to the spec (`e2e/design-system.visual.spec.ts-snapshots/`). Commit the
ones for the environment you intend to compare in. If you adopt this in CI, generate Linux
baselines there (e.g. `--update-snapshots` on a throwaway run) rather than committing macOS
shots.

## Adding coverage for a new component

The parity check (`npm run check:design-system`) requires, per `components/ui/*` component:
a reference doc, a SKILL.md index row, a gallery `<Section>`, **and** a mention in the e2e
spec. To satisfy the last two:

1. Add a `<Section name="Foo">` with the component's meaningful variants (including error /
   disabled / size states) to `app/dev/components/page.tsx`.
2. Add a `test.describe("Foo — accessibility contract", …)` block to
   `e2e/design-system.spec.ts` asserting its specific contract (e.g. for a `Modal`: focus
   trap, `Escape` closes, focus returns to trigger).

[axe DevTools]: https://www.deque.com/axe/devtools/
