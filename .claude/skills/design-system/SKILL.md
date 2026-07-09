---
name: design-system
description: How and when to use ReadTrip's design-system components, tokens, and the field-journal surface. Invoke BEFORE building or styling any kid-facing UI — picking a component, choosing colors/spacing, adding a form field, or reaching for the lined-paper / hand-drawn pen-box treatments. Keeps pages consistent by reusing primitives instead of ad-hoc CSS.
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
   it here) rather than styling inline on a page. **Need a glyph?** Use `<Icon name="…" />`
   from the unified set — never an emoji or a raw `<svg>`; add new glyphs to
   `components/ui/icons/glyphs.tsx`. See [references/icon.md](references/icon.md).
2. **Never hardcode hex, px colors, or raw font sizes in pages.** Use tokens — through
   Tailwind utilities (`bg-surface`, `text-surface-ink`, `font-display`, `rounded-pill`,
   `text-2xl`) or `var(--token)`. See [references/tokens.md](references/tokens.md).
3. **Never use `style={{}}` for a static value.** If it's the same on every render, it's a
   Tailwind class or a token, not inline `style` — `className="rounded-[3px]"`, not
   `style={{ borderRadius: "3px" }}`; a repeated formula (e.g. a `color-mix()` off a custom
   property) is a CSS class in `globals.css` (see `.rt-sticky`, `.rt-marker`), not a string
   retyped at every call site. `style={{}}` is reserved for values only known at render time
   (a computed percentage, an index-based animation delay, a per-instance CSS custom
   property). An ESLint rule enforces this — see docs/10-design-system.md.
4. **Respect the accessibility floor** (below). It is non-negotiable, not a nice-to-have.

## The surface

ReadTrip has **one surface: the field journal** — warm lined paper, hand-drawn ink, one
handwritten voice (Shantell Sans). Deep indigo "night" play canvas and the dark-journal
variant are **gone**; the whole app is the journal.

Components never hardcode palette values — they read the `--surface-*` tokens
(`bg-surface`, `text-surface-ink`, `border-surface-rule`, `--surface-accent`, …). That
indirection is deliberately kept even with a single surface, so a future theme (e.g. a real
dark mode) could be added by re-pointing `--surface-*` under a selector, with **no component
changes**. Don't pick colors by hand — let the tokens do it.

## Component index

✅ built (has a reference file + lives in `components/`) · ⏳ planned (spec only — build it
into `components/` and replace its row with a reference when you do).

### Primitives — `components/ui/`

| Component        | Status                                | When to use                                                                                                                                                                                            |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `StampMark`      | ✅ [ref](references/stamp-mark.md)    | A rubber-stamp verdict pressed _over_ content (tilted ink frame) — quiz "Yes!" / "Try again". Overlaps rather than reflowing the box.                                                                  |
| `Highlight`      | ✅ [ref](references/highlight.md)     | A highlighter swipe over inline written text — the journal alt to a pill for a quiet status/label (e.g. the XP bar's "Lvl N").                                                                         |
| `Input`          | ✅ [ref](references/input.md)         | Single-line text/number entry in a form (sign-in, profile name, search).                                                                                                                               |
| `Select`         | ✅ [ref](references/select.md)        | Choosing one of several fixed, described options in an adult form (reading level).                                                                                                                     |
| `Button`         | ✅ [ref](references/button.md)        | Any action/submit. Variants primary/secondary/ghost; `kid` size for child controls.                                                                                                                    |
| `Card` (`Panel`) | ✅ [ref](references/card.md)          | Group related content in a transparent "pen box" (hand-drawn ink outline, lines showing through); `elevated` is the Panel look.                                                                        |
| `StickyNote`     | ✅ [ref](references/sticky-note.md)   | A collected/pinned thing — opaque colored paper, tilt, tape, shadow. Map tiles + keepsakes. The _collection_ counterpart to `Card`.                                                                    |
| `Heading`        | ✅ [ref](references/heading.md)       | Headings on the type scale with the right semantic level.                                                                                                                                              |
| `Text`           | ✅ [ref](references/text.md)          | All body/label copy — Shantell Sans, reading-legibility defaults. No raw font sizing.                                                                                                                  |
| `Icon`           | ✅ [ref](references/icon.md)          | The unified icon set: `<Icon name="…" />`, hand-drawn doodle glyphs from `components/ui/icons`. **No emoji / raw `<svg>` in pages.**                                                                   |
| `Illustration`   | ✅ [ref](references/illustration.md)  | A large, detailed "hero doodle" — a couple per story/quiz page. Bigger, more detailed sibling of `Icon`; code-split per name. See also the [illustrations skill](../illustrations/SKILL.md).           |
| `Modal`          | ✅ [ref](references/modal.md)         | Focus-trapped dialog; `Escape`/backdrop close; returns focus to trigger.                                                                                                                               |
| `ProgressBar`    | ✅ [ref](references/progress-bar.md)  | Generic animated bar (XP, calibration, quiz progress).                                                                                                                                                 |
| `Spinner`        | ✅ [ref](references/spinner.md)       | Indeterminate "working on it" loading indicator; pair with text. `Button` embeds it.                                                                                                                   |
| `SubmitButton`   | ✅ [ref](references/submit-button.md) | A `<form>` submit that goes busy on its own pending state — server actions, nav.                                                                                                                       |
| `Wordmark`       | ✅ [ref](references/wordmark.md)      | The ReadTrip brand mark — a hand-lettered inline-SVG logo. One per page (`/play` header, homepage hero); it's the logo, not a heading.                                                                 |
| `InkFrame`       | ✅ [ref](references/ink-frame.md)     | The hand-drawn pen-box border itself — the low-level primitive `Card`/`Button`/`Input`/etc. render internally. Reach for it directly only when building a _new_ primitive that needs the same outline. |
| `Avatar`         | ✅ [ref](references/avatar.md)        | The explorer token — a rough hand-coloured round patch (highlighter-in-a-hand-drawn-circle) with the initial inked on top. Profile picker, "you are here."                                             |

### Layout — `components/layout/`

| Component      | Status                                | When to use                                                                                                  |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `JournalSheet` | ✅ [ref](references/journal-sheet.md) | The whole-page "open journal on a desk" frame — every top-level route and its loading skeleton wrap in this. |

### Game — `components/game/`

Built: `TopicNode` ✅ [ref](references/topic-node.md) (signature map node),
`WorldMap` ✅ [ref](references/world-map.md),
`XPBar` ✅ [ref](references/xp-bar.md) (level + XP progress),
`RewardBurst` ✅ [ref](references/reward-burst.md) (an XP gain),
`ExpeditionStamp` ✅ [ref](references/expedition-stamp.md) (a mastery badge),
`LevelUpCelebration` ✅ [ref](references/level-up-celebration.md) (the level-up overlay).
Planned (⏳, see [docs/10](../../../docs/10-design-system.md)): `Pip` (optional mascot).

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
7. **Reading legibility.** Shantell Sans, line-height 1.6, ~62ch max line length, rem sizing.
8. **Reduced motion.** Honor `prefers-reduced-motion` — reduce to instant state changes.

## Testing & manual review

Full details in [references/testing.md](references/testing.md). The short version:

- **Manual check:** run `npm run dev` and open **`/dev/components`** — every component and
  variant rendered on the field-journal surface. Tab through to confirm focus rings; run axe
  DevTools or a screen reader against it; resize to check zoom/legibility. This is your
  hands-on a11y + visual surface.
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
the pre-commit hook and CI). It walks the **direct** children of `components/ui/` and
`components/layout/` (not subfolders — `components/ui/icons/` is glyph internals, not
caller-facing components) and fails if any lacks a reference doc, a gallery entry, **or** an
e2e test. So, whenever you:

- **Add a `components/ui/*` or `components/layout/*` component:** (1) create
  `references/<name>.md` (kebab-case, e.g. `Button` → `references/button.md`) and document its
  API + _when to use / when not_ + a11y notes; (2) flip its row in the index above to ✅ with a
  link; (3) add a `<Section>` for it in `app/dev/components/page.tsx`; (4) add contract
  coverage in `e2e/design-system.spec.ts`. The parity check enforces all four.
- **Change a component's props/behavior:** update its reference file and its gallery
  variants so docs, manual review, and tests don't drift.
- **Build a game/reading component:** add it under the right `components/` folder, give it a
  reference + gallery entry + test, and move it out of the planned list.

If `npm run check:design-system` is red, a component is missing docs, a gallery entry, or a
test — fix that, don't bypass the check.
