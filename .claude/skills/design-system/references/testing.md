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

Every component renders in all its variants on the **field-journal surface**. Use it to:

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

## Visual regression (CI gate)

A snapshot of the gallery, enforced by the **`visual`** job in
[`.github/workflows/test.yml`](../../../../.github/workflows/test.yml). It catches
purely-visual changes that axe and the contract tests can't see — colors, spacing, radius,
font shifts. The job runs on `ubuntu-latest` (no DB), so the committed baseline is the
**Linux** snapshot (`gallery-chromium-linux.png`).

How baselines work:

- **First run on a branch with no baseline:** the job generates one and commits it back
  (`[skip ci]`), then compares — so it goes green and seeds the baseline for everyone.
- **After that:** strict compare. A real regression fails the job and uploads the
  `expected` / `actual` / `diff` PNGs as a `visual-diff` artifact.
- **To intentionally accept a visual change:** delete the baseline PNG in your PR; CI
  regenerates it and the new image shows up in the PR diff for review. (Don't hand-edit
  baselines.)

A small `maxDiffPixelRatio` tolerance absorbs minor runner-image drift; if a runner update
ever pushes drift past it, regenerate the baseline the same way (delete → CI reseeds).

Run it locally (generates a snapshot for _your_ OS, which is git-ignored — only the Linux
one is tracked):

```bash
npm run test:visual:update   # generate/refresh your local baseline
npm run test:visual          # compare
```

Baselines live next to the spec (`e2e/design-system.visual.spec.ts-snapshots/`).

## Adding coverage for a new component

The parity check (`npm run check:design-system`) requires, per `components/ui/*` component:
a reference doc, a SKILL.md index row, a gallery `<Section>`, **and** a mention in the e2e
spec. To satisfy the last two:

1. Add a `<Section name="Foo">` with the component's meaningful variants (including error /
   disabled / size states) to `app/dev/components/page.tsx`.
2. Add a `test.describe("Foo — accessibility contract", …)` block to
   `e2e/design-system.spec.ts` asserting its specific contract (e.g. for a `Modal`: focus
   trap, `Escape` closes, focus returns to trigger).

## Reviewing & auditing a design-system change

Because the system is **token-driven** and **enforced**, a reviewer can audit a change from
a few high-signal places instead of reading every line:

1. **Read the token diff first.** `git diff -- styles/tokens.css` shows every color / type /
   radius / surface change in one place. A change here ripples to every component, so this is
   the highest-leverage thing to review. Ask: does it still meet the contrast ratios noted in
   the token comments?
2. **Diff the component + its docs together.** The parity check guarantees a component change
   ships with its reference doc, gallery entry, and test — so the docs in the diff tell you
   the _intended_ behavior to review the code against.
3. **Look at the visual diff.** The `visual` CI job fails on any unreviewed pixel change and
   uploads `expected` / `actual` / `diff` PNGs — open the `diff` to see exactly what moved.
   Locally: `npm run test:visual`.
4. **Trust the gates.** Green CI means: types/lint/format pass, the parity check passed
   (nothing undocumented/untested), axe found no WCAG A/AA violations on either surface, the
   Input contract holds, and the gallery is pixel-identical. A red gate names the gap.
5. **Spot-check by hand.** Open `/dev/components`, Tab through, run a screen reader — for the
   things automation can't see (focus order, copy tone, motion).

Audit trail: every token/component change lands via a PR (Conventional Commits), so
`git log -- styles/tokens.css` is a readable history of how the visual language evolved.

[axe DevTools]: https://www.deque.com/axe/devtools/
