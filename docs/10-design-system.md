# 10 — Design System

A consistent, accessible, genuinely fun visual identity for ReadTrip. This doc defines the
**direction**, the **tokens**, the **component library** (extracted and reused
everywhere), the **motion** language, and a hard **accessibility floor**.

## Two ground rules (apply to everything below)

1. **Mobile-first, no-mouse.** Kids use this on phones and tablets, often with **no mouse at
   all**. Design every screen and component at the **small viewport first**, then scale up.
   **Touch and keyboard are the primary inputs** — never depend on hover, right-click, or
   precise pointing to reveal or operate anything. Tap targets stay large (kid-facing
   controls 56–64px), and every interaction must work by tap and by keyboard alone.
   When a mouse **is** present, controls still behave like proper desktop controls:
   actionable elements show the pointer (hand) cursor and disabled ones `not-allowed`
   (restored in `globals.css`, since Tailwind v4 drops the default button cursor), and
   hover adds extra, never-essential feedback. The mouse is an enhancement, never a
   requirement.
2. **Everything is well tested.** No component is "done" until it ships with **unit, visual,
   and e2e tests** (see [Testing](#testing-every-component-is-well-tested)). This is the
   structural guarantee that the system stays consistent and accessible over time.

## Direction: "A young explorer's field journal"

ReadTrip's world is _exploration_ — a child charting an unknown world of knowledge. So the
identity isn't generic primary-color "kids app" clip-art; it's a **hand-written science
explorer's field journal** on warm lined paper. The child is the explorer keeping the journal;
topics are **sticky notes** stuck onto the page; mastery earns **expedition stamps**; the whole
app is inked in one handwritten voice.

There is **one surface: the field journal.** (An earlier version split the app into a deep-indigo
"night sky" play surface and a paper reading surface; that dual-surface system is **gone** — the
whole app is now the journal.) The look leans all the way into paper:

- **Warm lined paper.** A single warm-paper background with faint ruled lines. Reading text
  sits **on** the rules like real handwriting (`.rt-lined` + `.rt-journal`).
- **Hand-drawn ink.** Containers and controls are squared-off "pen boxes" drawn with a
  turbulence filter (`.rt-inkbox`), not rounded rects; the icon set is one hand-drawn doodle
  family; status is a **stamp** pressed over content or a **highlighter** swipe over text.
- **One voice.** Everything is Shantell Sans, a legibility-tuned handwriting face.

The `--surface-*` token indirection is kept even with a single surface, so a future theme (e.g.
a real dark mode) could be added by re-pointing the tokens under a selector — with no component
changes.

## Color tokens

Colors are defined in **two layers** in `styles/tokens.css`, and both are shown in
`/dev/components`:

1. **Primitives** — every raw color value, named by hue/shade, with no meaning attached.
2. **Semantic** — meaning mapped onto primitives (`--surface-*`, `--correct`, …).

**Components read the semantic tokens, never a primitive hex or var** — so the whole palette
retunes in one place and a future theme is a one-selector re-point. All pairings meet **WCAG
AA** (≥4.5:1 for body text, ≥3:1 for large text / UI).

### Layer 1 — Primitives

| Token            | Hex       | Notes                                                     |
| ---------------- | --------- | --------------------------------------------------------- |
| `--sun`          | `#FFC24B` | Primary action, XP (marigold)                             |
| `--coral`        | `#FF6B5C` | Alarm accent (wrong answer / delete) — fills only         |
| `--coral-strong` | `#B23A2E` | Darker coral — ≈5.8:1 on paper ✓; coral as **small text** |
| `--orchid`       | `#D65DB1` | Secondary / playful accent                                |
| `--aqua`         | `#36D6C3` | Discovery / "deep" suggestions                            |
| `--leaf`         | `#7BD66A` | Success / correct — fills only                            |
| `--leaf-strong`  | `#2E7D32` | Darker leaf — ≈5.1:1 on paper ✓; leaf as **small text**   |
| `--violet`       | `#B388FF` | "New" breadth / magic                                     |
| `--sky`          | `#5AB6FF` | In-progress / "exploring" tiles                           |
| `--paper`        | `#FFFCF5` | Warm lined paper                                          |
| `--paper-panel`  | `#FFFFFF` | Cards, inputs, sticky-note base                           |
| `--ink`          | `#22263F` | Body text / ink                                           |
| `--ink-soft`     | `#4A4F6B` | Secondary text                                            |
| `--rule`         | `#E7E0D0` | Hairlines / dividers                                      |
| `--periwinkle`   | `#D7DFF0` | Faint blue ruled lines                                    |
| `--blush`        | `#F0B3AA` | Soft coral margin rule                                    |

> A hue that's used both as a bright **fill** (avatars, tints) and as **small colored text**
> (the quiz stamp, error copy) carries two steps — the bright one fails AA at text sizes, so
> the `-strong` step is dark enough to read on paper. Bright accents stay for fills; buttons
> use a bright fill with **dark ink on top** (e.g. ink `#22263F` on `--sun` ≈9:1 ✓).

### Layer 2 — Semantic

| Token                | Maps to          | Meaning                                                        |
| -------------------- | ---------------- | -------------------------------------------------------------- |
| `--surface-bg`       | `--paper`        | Page background (`bg-surface`)                                 |
| `--surface-panel`    | `--paper-panel`  | Cards, inputs (`bg-surface-panel`)                             |
| `--surface-ink`      | `--ink`          | Body text (`text-surface-ink`, ≈14:1 ✓)                        |
| `--surface-ink-soft` | `--ink-soft`     | Secondary text (`text-surface-ink-soft`, ≈7:1 ✓)               |
| `--surface-rule`     | `--rule`         | Hairlines / dividers (`border-surface-rule`)                   |
| `--surface-accent`   | `--orchid`       | The surface accent                                             |
| `--correct`          | `--leaf`         | Right answer — **fills / large** (paired with ✓ + label)       |
| `--retry`            | `--coral`        | Try-again — **fills / large** (paired with ↻; never red-scary) |
| `--surface-success`  | `--leaf-strong`  | Correct as **small text / icons** (AA-safe)                    |
| `--surface-danger`   | `--coral-strong` | Try-again / error as **small text / icons** (AA-safe)          |
| `--journal-line`     | `--periwinkle`   | Ruled paper lines                                              |
| `--journal-margin`   | `--blush`        | Left margin rule                                               |
| `--focus-ring`       | `--sun`          | High-contrast focus indicator (set globally in globals.css)    |

**Tint scale.** Translucent fills use named steps, never bare opacities: `--tint-wash` (10%,
hover), `--tint-soft` (15%, secondary-emphasis fills), `--tint-fill` (20%, chip/marker fills).
`npm run check:tint-scale` enforces it.

## Typography

**One voice — Shantell Sans.** A legibility-tuned handwriting face (the "Lexend of
handwriting") drives **both** `font-display` and `font-body`, so the whole journal reads as one
hand. It has real 400/600/700 weights and is engineered to stay legible for early and
struggling readers — the single most important type choice in a reading app for kids, which is
what lets us use handwriting everywhere including lesson body. **Lexend** is kept only as the
fallback.

```css
/* app/globals.css @theme inline — both roles map to the one face */
--font-display: var(--font-shantell);
--font-body: var(
  --font-shantell
); /* Lexend is the next fallback in the stack */
```

**Lined-paper rule.** Reading text must **sit on the ruled line** (baseline rests on the rule,
descenders cross below), not float mid-row — via `.rt-lined` (ruled background) + `.rt-journal`
(margin-based rhythm that locks every vertical measure to a whole multiple of the rule period).

**Type scale** (rem; respects user zoom). Reading base is larger for younger readers:

| Token         | Size     | Use                                            |
| ------------- | -------- | ---------------------------------------------- |
| `--text-xs`   | 0.875rem | captions, meta                                 |
| `--text-sm`   | 1rem     | UI labels                                      |
| `--text-base` | 1.125rem | body (bump to 1.25rem at reading levels L1–L2) |
| `--text-lg`   | 1.375rem | lead text                                      |
| `--text-xl`   | 1.75rem  | section titles                                 |
| `--text-2xl`  | 2.25rem  | page titles                                    |
| `--text-3xl`  | 3rem     | hero / big numbers                             |

**Reading rules:** line-height `1.6`, max line length `~62ch`, generous paragraph spacing.
These are legibility settings, not stylistic — keep them on always.

## Spacing, radius, elevation

- **Spacing scale** (4-based): `4, 8, 12, 16, 24, 32, 48, 64`.
- **Radius:** controls are **squared off** (`rounded-[3px]`, framed by the hand-drawn
  `.rt-inkbox` pen box) — **not pills**. The soft radii `--radius-sm: 12px`, `--radius-md:
20px`, `--radius-lg: 28px` remain for larger paper panels; `--radius-pill: 999px` survives
  only for genuinely round bits (avatars, dots, progress tracks).
- **Elevation:** most containers use the hand-drawn `.rt-inkbox` pen box (an inked outline)
  rather than a shadow. Sticky notes get a soft paper drop shadow so they lift off the page;
  `--surface-elevation` is the low-contrast paper shadow for the few places that need one.

## Component library

Extract these once and reuse everywhere — **consistency between pages comes from never
re-styling ad hoc.** Live in `components/ui` (primitives), `components/game`, and
`components/reading`.

### Primitives — `components/ui/`

- **`Button`** — squared (`rounded-[3px]`), never pills. Variants: `primary` (sun fill + a
  hand-drawn pen box), `secondary` (pen box only), `ghost` (borderless); sizes `md` and `kid`
  (min 56–64px tall). Always a visible focus ring; icon-only buttons require an `aria-label`.
- **`Card` / `Panel`** — a transparent hand-drawn "pen box" on the paper (the ruled lines show
  through); `elevated` is a heavier, drawn-twice outline.
- **`StickyNote`** — the **collection** counterpart to `Card`: opaque colored paper, a soft
  drop shadow, a slight hand-placed tilt, optional tape. Used for map tiles and keepsakes.
- **`Wordmark`** — the ReadTrip brand mark: a hand-lettered inline-SVG logo (ink letters on a
  gold offset shadow + a coral pen underline). One per page (the header / homepage hero).
- **`Heading` / `Text`** — enforce the type scale and the one Shantell voice; no raw font
  sizing in pages.
- **`Icon`** — single sized/labelled wrapper around the one hand-drawn doodle set. No emoji or
  raw `<svg>` in pages.
- **`Modal`** — focus-trapped, `Escape` to close, returns focus to trigger.
- **`ProgressBar`** — generic animated bar (used by XP and the calibration game).
- **Status markers** — **`StampMark`** (a rubber-stamp verdict pressed _over_ content — quiz
  "Yes!" / "Try again") and **`Highlight`** (a highlighter swipe over inline written text — the
  journal alternative to a pill, e.g. the XP "Lvl N" label).
- **`Avatar`** — the explorer token ("you are here" on the map; profile picker). A rough round
  patch in the child's chosen color — the same hand-run felt-tip edge as a color swatch
  (`.rt-torn` masked to the shared inked-blob shape), as if a highlighter marker coloured in a
  hand-drawn circle — with the explorer's initial inked on top, at a small hand-placed tilt.

### Game — `components/game/`

- **`TopicNode`** — the map node, the product's **signature element**: a real `<button>`
  wrapping a `StickyNote`, tinted by state. States: `locked` (a dashed empty slot, no note),
  `suggested` (aqua/violet note + a header strip), `explored` (sky note + strip), `mastered`
  (sun note). Each state carries a **word + icon**, not just color (accessibility).
- **`WorldMap`** — the list of topic sticky-notes; a pen-boxed "Show N more" toggle expands
  the grid and mastered topics tuck into a pen-boxed `<details>` disclosure.
- **`XPBar`** — animated XP/level bar with a count-up; the "Lvl N" label is a `Highlight`
  marker swipe, not a pill. Announces changes politely to SRs.
- **`ExpeditionStamp`** — a mastery badge "stamped into the journal" with a press animation.
- **`RewardBurst` / `LevelUpCelebration`** — overlay for XP gains, level-ups, badges.
- **`Pip`** _(optional guide mascot)_ — a small companion that gives the app a voice
  ("Nice exploring! Want to try a tricky one?"). Personality drives kid engagement; keep
  it skippable and never blocking.

### Reading — `components/reading/`

- **`ReadingView`** — the lined-paper lesson container (`.rt-lined` + `.rt-journal` so text
  rests on the rules, framed by a pen box, capped reading width).
- **`LessonChunk`** — one short, visual block of explanation.
- **`QuizChoice`** — big tappable answer (a squared `.rt-inkbox` pen box). States: `default`,
  `selected`, `correct` (leaf fill + a `StampMark` "✓ Yes!"), `retry` (coral fill + a
  `StampMark` "↻ Try again") — **icon + text + color**, never color alone. The stamp overlays
  the corner, so feedback never resizes the box. Fully keyboard-operable.
- **`QuizCard`** — wraps the question + choices + feedback.

### Shell

- **`AppShell` / `TopBar`** — consistent header on every child page: `Wordmark`, avatar, level,
  XP bar. This is the main driver of cross-page consistency.

## Motion

Motion should feel like the journal is **being written**, but restraint keeps it from feeling
AI-generated or overstimulating:

- **Map load:** sticky-note tiles cascade/settle into place (`animate-cascade-in`, staggered).
- **Reward:** XP count-up; a contained `RewardBurst`; an expedition-stamp "press."
- **Ink beats:** one-time ink-draw on hero marks/underlines; a gentle rise-in — never on every
  element.

**Every animation must respect `prefers-reduced-motion`** — reduce to instant
state changes (no movement/parallax), keeping only essential feedback.

## Accessibility floor (non-negotiable)

1. **Contrast:** every text/UI pairing meets WCAG AA; token table above documents ratios.
2. **Never color-only:** correct/retry, node states, and all status use **icon + text +
   color** together.
3. **Target size & touch:** interactive targets ≥44px; kid-facing controls 56–64px. Layouts
   are **mobile-first** and fully usable by **touch with no mouse** — nothing is gated behind
   hover or right-click.
4. **Visible focus:** a high-contrast `--focus-ring` on _every_ interactive element; the
   outline is never removed. Tab order follows reading order.
5. **Keyboard navigation:** everything operable without a mouse — buttons/links are real
   elements; `Enter`/`Space` activate; map nodes are focusable and arrow-key traversable;
   `Escape` closes overlays; modals trap focus and restore it on close.
6. **Screen readers:** icon buttons have labels; XP/level/celebration changes use
   `aria-live="polite"`; the world map offers an equivalent **list view** so it's not
   purely spatial.
7. **Reading legibility:** Shantell Sans (legibility-tuned handwriting), generous line-height,
   capped line length, rem-based sizing that honors browser zoom and text scaling.
8. **Reduced motion:** honored everywhere (see Motion).

## Testing (every component is well tested)

Testing is **non-negotiable and part of the definition of done** for every primitive and
composite component — not a follow-up task. Each component ships with all three layers, and
they run in CI:

The three layers are **split by what the test needs** (see AGENTS.md) — Vitest never renders
components in jsdom, because it can't compute layout or styles; anything touching the DOM,
ARIA, focus, or layout is a Playwright test against a real browser:

- **Unit** (Vitest, node): **pure logic only** — value clamping (ProgressBar), variant/scale
  resolution, validation, parsing. Fast, no DOM, no browser. Co-located `*.test.ts`.
- **Visual** (Playwright snapshots): the component gallery (`/dev/components`) on the
  **field-journal surface**, capturing each component's states. Regenerate the baseline when
  the gallery legitimately changes; it's a strict gate otherwise.
- **e2e / contract** (Playwright, real browser): the DOM + a11y contract driven by **touch
  and keyboard with no mouse** — `axe` over the gallery, ARIA roles/labels, keyboard
  activation (`Enter`/`Space` to act, `Escape` to dismiss), visible focus rings, focus
  trap/restore for overlays, tap targets, and tab order following reading order.

**Coverage expectations:** every interactive component has a keyboard-operable path under
test and meets the target-size floor; reduced-motion is exercised; and the gallery stays the
single rendered surface all three layers point at. A component without its unit (where it has
pure logic), gallery, and e2e coverage fails the parity check and is not mergeable.

## Implementation notes

- **Tokens → Tailwind:** put the tokens in `styles/tokens.css` as CSS variables and map
  them into the Tailwind theme so utilities stay token-driven. **The repo is on Tailwind
  v4** (CSS-first; there is no `tailwind.config.ts`) — the mapping lives in an
  `@theme inline { … }` block in `app/globals.css`, not a JS config. There's **one surface**;
  the `--surface-*` indirection stays so a future theme can re-point the tokens under a
  selector with no component changes.
- **Behavior from Headless UI.** Interactive primitives wrap **Headless UI** (`@headlessui/react`)
  rather than re-implementing accessibility behavior: `Modal` is a `Dialog` (focus trap, scroll
  lock, portal, Escape/backdrop dismissal), `Input` is a `Field`/`Label`/`Input`/`Description`
  (label + hint/error association), and `Button` is its `Button`. ReadTrip owns the **styling and
  surface theming**; Headless UI owns the **behavior and ARIA wiring**, so there's less custom
  a11y code to maintain. Purely presentational primitives (`Card`, `StickyNote`, `Heading`,
  `Text`, `Icon`, `ProgressBar`, `StampMark`, `Highlight`, `Wordmark`) have no Headless UI
  equivalent and stay plain token-styled elements.
- **No ad-hoc styling in pages.** Pages compose components; components own the styling.
  This is what guarantees consistency. The **`design-system` skill**
  (`.claude/skills/design-system`) is the operational "how & when to use" guide, and it's
  parity-checked against `components/ui/` by `npm run check:design-system` (pre-commit + CI)
  so the docs can't silently drift from the code.
- **No inline styles for static values.** Anything that has the same value on every render
  belongs in a Tailwind class or a token — `className="rounded-[3px] pt-[var(--journal-period)]"`,
  never `style={{ borderRadius: "3px" }}`. Reach for a CSS class (`app/globals.css`) over a
  literal in `style={{}}` even when the value references a CSS custom property, so the same
  rule doesn't get retyped at every call site (see `.rt-marker`/`.rt-sticky`).
  `style={{}}` is reserved for values only known at render time — an animation-delay stagger
  computed from an index, a fill percentage, a per-instance CSS custom property like
  `StickyNote`'s `--note`. An ESLint rule (`no-restricted-syntax` in `eslint.config.mjs`)
  flags any `style={{}}` property whose value is a plain literal (string/number) — a static
  value in disguise — so this can't silently regress.
- **Storybook (recommended, optional):** a Storybook of the component library serves as a
  living style guide and showcases the design system as a deliberate, reusable system rather
  than one-off pages — useful for team collaboration and future development.
- **Fonts:** load Shantell Sans (+ Lexend as fallback) via `next/font` (self-hosted, no
  layout shift).
