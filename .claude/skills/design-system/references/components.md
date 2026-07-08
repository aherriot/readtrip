# Planned components — when to use

These are specced in [`docs/10-design-system.md`](../../../../docs/10-design-system.md) but
**not built yet**. Use this to design pages against the full library today. When you build
one, move it into the right `components/` folder, give it its own reference file, and update
the index in [`SKILL.md`](../SKILL.md).

> Until a primitive exists, **don't fake it with ad-hoc CSS on a page.** Build the primitive
> in `components/ui/` (the parity check will then require a reference for it).

## Primitives — `components/ui/`

- **`Button`** — every action/submit. Squared (`rounded-[3px]`), never pills. Variants:
  `primary` (sun fill + hand-drawn pen box), `secondary` (pen box only), `ghost` (borderless).
  Sizes `md` and `kid` (56–64px). Always a visible focus ring; icon-only buttons require
  `aria-label`. Reach for this _instead of_ a styled `<a>`/`<div>`.
- **`Card` / `Panel`** — a container grouping related content: a transparent hand-drawn "pen
  box" on the paper (`elevated` = a heavier, drawn-twice outline). Use for lesson blocks,
  profile tiles, settings groups.
- **`Heading` / `Text`** — all page copy. Enforces the type scale + families so pages never
  hand-size fonts. Use `Heading` for titles, `Text` for body/secondary.
- **`Icon`** — a single sized, labelled wrapper around the icon set. Use everywhere an icon
  appears so sizing/labelling stays consistent.
- **`Modal` / `Overlay`** — focus-trapped dialog: `Escape` closes, focus returns to the
  trigger. Use for confirmations and blocking choices — not for inline content.
- **`ProgressBar`** — generic animated bar. Used by XP and the calibration mini-game;
  announces changes politely to screen readers.

## Game — `components/game/`

- **`TopicNode`** — the map node and the product's **signature element**. States `locked` /
  `suggested` / `explored` / `mastered`, each with a shape/icon difference (not color alone).
- **`WorldMap`** — the list of topic sticky-notes; a pen-boxed "Show N more" toggle expands
  the grid, mastered topics tuck into a pen-boxed `<details>`; a real list for screen readers.
- **`XPBar`** — animated XP/level bar with count-up; `aria-live="polite"`.
- **`ExpeditionStamp`** — a "stamped into the journal" badge with a press animation.
- **`RewardBurst` / `LevelUpCelebration`** — contained overlays for XP/level/badge moments;
  reduced-motion safe.
- **`Pip`** _(optional)_ — small guide mascot; gives the app a voice; keep it skippable and
  never blocking.

## Reading — `components/reading/`

- **`ReadingView`** — the lined-paper lesson container (`.rt-lined` + `.rt-journal` so text
  rests on the ruled lines, framed by a pen box, max width, reading type). Wrap
  lessons/quizzes in this.
- **`LessonChunk`** — one short, visual block of explanation.
- **`QuizChoice`** ✅ [ref](quiz-choice.md) — big tappable answer. States `default` /
  `selected` / `correct` (leaf + ✓ + "Yes!") / `retry` (coral + ↻ + "Try again") — **icon +
  text + color**, never color alone. Fully keyboard-operable.
- **`QuizCard`** ✅ [ref](quiz-card.md) — wraps the question + choices + feedback; unfailable
  (wrong taps say "try again"), reports the first tap for scoring.

## Shell

- **`AppShell` / `TopBar`** — consistent header on every child page (avatar, level, XP bar,
  current surface). The main driver of cross-page consistency — every child route uses it.
