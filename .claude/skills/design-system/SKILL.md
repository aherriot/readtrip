---
name: design-system
description: How and when to use ReadTrip's design-system components, tokens, and surfaces. Invoke BEFORE building or styling any kid-facing UI — picking a component, choosing colors/spacing, adding a form field, or deciding between the night vs. paper surface. Keeps pages consistent by reusing primitives instead of ad-hoc CSS.
---

# ReadTrip Design System

The design system is how every ReadTrip page stays consistent, accessible, and on-theme.
**Consistency comes from never re-styling ad hoc** — you compose existing components and
tokens; you do not hand-roll colors, spacing, or one-off inputs.

Full rationale lives in [`docs/10-design-system.md`](../../../docs/10-design-system.md).
This skill is the _operational_ guide: which component to reach for, on which surface, and
the rules you cannot break.

## Prime directives

1. **Compose components; don't re-style.** Need a control? Use the primitive from
   `components/ui/`. If one doesn't exist yet, build it _in_ `components/ui/` (and document
   it here) rather than styling inline on a page.
2. **Never hardcode hex, px colors, or raw font sizes in pages.** Use tokens — through
   Tailwind utilities (`bg-surface`, `text-surface-ink`, `font-display`, `rounded-pill`,
   `text-2xl`) or `var(--token)`. See [references/tokens.md](references/tokens.md).
3. **Respect the accessibility floor** (below). It is non-negotiable, not a nice-to-have.

## The two surfaces

ReadTrip switches surfaces by _task_, mirroring the child's cognitive mode. A surface is a
`data-surface` attribute that re-points every `--surface-*` token underneath it.

| Surface                     | `data-surface`                         | Use for                                   | Feel                                              |
| --------------------------- | -------------------------------------- | ----------------------------------------- | ------------------------------------------------- |
| **Night sky** (play)        | `"night"` _(default, set on `<body>`)_ | World map, explore, rewards, celebrations | Deep indigo, glowing accents — discovery & wonder |
| **Field journal** (reading) | `"paper"`                              | Lessons, quizzes — focus & legibility     | Warm paper, calm, high-legibility                 |

A component reads `--surface-*` tokens, so the _same_ component renders correctly on either
surface. To switch, wrap a region: `<div data-surface="paper">…</div>`. Don't pick colors
per-surface by hand — let the tokens do it.

## Component index

✅ built (has a reference file + lives in `components/`) · ⏳ planned (spec only — build it
into `components/` and replace its row with a reference when you do).

### Primitives — `components/ui/`

| Component        | Status                               | When to use                                                                          |
| ---------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| `Badge`          | ✅ [ref](references/badge.md)        | A compact status pill (icon + word + color) — quiz feedback, map-node status/kind.   |
| `Input`          | ✅ [ref](references/input.md)        | Single-line text/number entry in a form (sign-in, profile name, search).             |
| `Select`         | ✅ [ref](references/select.md)       | Choosing one of several fixed, described options in an adult form (reading level).   |
| `Button`         | ✅ [ref](references/button.md)       | Any action/submit. Variants primary/secondary/ghost; `kid` size for child controls.  |
| `Card` (`Panel`) | ✅ [ref](references/card.md)         | Group related content in a surface-aware container; `elevated` is the Panel look.    |
| `Heading`        | ✅ [ref](references/heading.md)      | Headings on the type scale with the right semantic level.                            |
| `Text`           | ✅ [ref](references/text.md)         | All body/label copy — Lexend, reading-legibility defaults. No raw font sizing.       |
| `Icon`           | ✅ [ref](references/icon.md)         | A sized wrapper that's either labelled (`role="img"`) or decorative.                 |
| `Modal`          | ✅ [ref](references/modal.md)        | Focus-trapped dialog; `Escape`/backdrop close; returns focus to trigger.             |
| `ProgressBar`    | ✅ [ref](references/progress-bar.md) | Generic animated bar (XP, calibration, quiz progress).                               |
| `Spinner`        | ✅ [ref](references/spinner.md)      | Indeterminate "working on it" loading indicator; pair with text. `Button` embeds it. |

### Game — `components/game/`

Built: `TopicNode` ✅ [ref](references/topic-node.md) (signature map node),
`WorldMap` ✅ [ref](references/world-map.md),
`XPBar` ✅ [ref](references/xp-bar.md) (level + XP progress),
`RewardBurst` ✅ [ref](references/reward-burst.md) (an XP gain),
`ExpeditionStamp` ✅ [ref](references/expedition-stamp.md) (a mastery badge),
`LevelUpCelebration` ✅ [ref](references/level-up-celebration.md) (the level-up overlay).
Planned (⏳, see [docs/10](../../../docs/10-design-system.md)): `Avatar`, `Pip`
(optional mascot).

### Reading — `components/reading/` (⏳, see [docs/10](../../../docs/10-design-system.md))

`ReadingView`, `LessonChunk`, `QuizChoice`, `QuizCard`.

See [references/components.md](references/components.md) for _when to use_ guidance on every
planned component, so you can design pages against the full library today.

## Accessibility floor (non-negotiable)

Check these on every UI change:

1. **Contrast** meets WCAG AA — use the documented token pairings; don't invent colors.
2. **Never color-only.** Correct/retry, node states, statuses use **icon + text + color**.
3. **Target size** ≥ 44px; kid-facing controls 56–64px (use the `kid` size).
4. **Visible focus.** A high-contrast focus ring on every interactive element; never remove
   the outline. (A global `:focus-visible` ring is set in `app/globals.css`.)
5. **Keyboard operable.** Real buttons/links; `Enter`/`Space` activate; `Escape` closes
   overlays; tab order follows reading order.
6. **Screen readers.** Icon-only controls need `aria-label`; live changes (XP, level,
   celebrations) use `aria-live="polite"`.
7. **Reading legibility.** Lexend, line-height 1.6, ~62ch max line length, rem sizing.
8. **Reduced motion.** Honor `prefers-reduced-motion` — reduce to instant state changes.

## Testing & manual review

Full details in [references/testing.md](references/testing.md). The short version:

- **Manual check:** run `npm run dev` and open **`/dev/components`** — every component and
  variant rendered on both surfaces. Tab through to confirm focus rings; run axe DevTools or
  a screen reader against it; resize to check zoom/legibility. This is your hands-on a11y +
  visual surface.
- **Automated (in CI):** `e2e/design-system.spec.ts` runs **axe** (WCAG 2 A/AA) over that
  gallery plus per-component contract assertions (label association, `aria-invalid`,
  focus ring, target size). Part of `npm test`.
- **Visual regression (opt-in):** `npm run test:visual` (snapshot of the gallery). Kept out
  of default CI because baselines are OS/font-specific — see the testing reference.
- **Automated a11y catches ~40% of issues** — it does not replace the manual keyboard +
  screen-reader pass. Use the checklist in references/testing.md.

## Maintaining this skill (read before changing `components/`)

This skill is **parity-checked** against the code by
`scripts/check-design-system-skill.mjs` (run via `npm run check:design-system`, enforced in
the pre-commit hook and CI). The check fails if a `components/ui/` component lacks a
reference doc, a gallery entry, **or** an e2e test. So, whenever you:

- **Add a `components/ui/*` component:** (1) create `references/<name>.md` (kebab-case, e.g.
  `Button` → `references/button.md`) and document its API + _when to use / when not_ + a11y
  notes; (2) flip its row in the index above to ✅ with a link; (3) add a `<Section>` for it
  in `app/dev/components/page.tsx`; (4) add contract coverage in `e2e/design-system.spec.ts`.
  The parity check enforces all four.
- **Change a component's props/behavior:** update its reference file and its gallery
  variants so docs, manual review, and tests don't drift.
- **Build a game/reading component:** add it under the right `components/` folder, give it a
  reference + gallery entry + test, and move it out of the planned list.

If `npm run check:design-system` is red, a component is missing docs, a gallery entry, or a
test — fix that, don't bypass the check.
