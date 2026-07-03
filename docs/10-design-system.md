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

## Direction: "The ReadTripsity Expedition"

ReadTrip's world is _exploration_ — a child charting an unknown world of knowledge. So the
identity isn't generic primary-color "kids app" clip-art; it's an **explorer's star-chart
/ field-journal**. The child is an explorer; topics are glowing nodes on a map that light
up as they're discovered; mastery earns **expedition stamps**.

The one deliberate, justifiable risk is a **dual-surface system** that mirrors the
child's actual cognitive mode:

- **Play / map surface — "Night sky."** Deep indigo canvas with vivid, glowing accents.
  Used for the world map, explore, rewards, celebrations. Feels like discovery and wonder.
- **Reading surface — "Field journal."** Calm, warm, high-legibility paper. Used for
  lessons and quizzes, where focus and readability matter most.

Switching surfaces by _task_ (explore vs. focus) is grounded in the product, not
decoration — and it keeps the reading experience calm without making the app feel flat.

## Color tokens

Defined as CSS variables in `styles/tokens.css`; surfaces toggle via a `data-surface`
attribute. All pairings below meet **WCAG AA** (≥4.5:1 for body text, ≥3:1 for large
text / UI).

### Night-sky (play) surface

| Token              | Hex       | Use                                                                    |
| ------------------ | --------- | ---------------------------------------------------------------------- |
| `--bg-night`       | `#1B1F3B` | Map / play canvas                                                      |
| `--bg-night-panel` | `#2A2F55` | Cards/panels on night                                                  |
| `--ink-on-night`   | `#F4F2FF` | Text on night (≈15:1 ✓)                                                |
| `--sun`            | `#FFC24B` | Primary action, XP (marigold)                                          |
| `--orchid`         | `#D65DB1` | Secondary / playful accent                                             |
| `--coral`          | `#FF6B5C` | Wrong answer / delete only — reads as a warning, not a plain secondary |
| `--aqua`           | `#36D6C3` | "Explored" / discovery                                                 |
| `--leaf`           | `#7BD66A` | Success / correct                                                      |
| `--violet`         | `#B388FF` | Tertiary accent / magic                                                |

> Bright accents are for **fills and large elements** on the dark canvas, not small text.
> Buttons use a bright fill with **dark ink on top** (e.g. ink `#22263F` on `--sun` ≈9:1 ✓).

### Field-journal (reading) surface

| Token        | Hex                                  | Use                                                          |
| ------------ | ------------------------------------ | ------------------------------------------------------------ |
| `--paper`    | `#FFFCF5`                            | Reading background (warm, but lighter than the cream cliché) |
| `--ink`      | `#22263F`                            | Body text (≈14:1 on paper ✓)                                 |
| `--ink-soft` | `#4A4F6B`                            | Secondary text (≈7:1 ✓)                                      |
| `--rule`     | `#E7E0D0`                            | Hairlines / dividers                                         |
| accents      | reuse `--orchid`, `--aqua`, `--leaf` | Highlights; always with a non-color cue too                  |

### Semantic (works on both surfaces)

| Token          | Maps to                            | Meaning                                                 |
| -------------- | ---------------------------------- | ------------------------------------------------------- |
| `--correct`    | `--leaf`                           | Right answer (always paired with ✓ icon + label)        |
| `--retry`      | `--coral`                          | Try-again (never "wrong"/red-scary; paired with ↻ icon) |
| `--focus-ring` | `--sun` outer + `--bg-night` inner | High-contrast focus indicator                           |

## Typography

Two families, chosen for this brief — not defaults:

- **Display — Fredoka.** Rounded, geometric, warm; friendly without being babyish. Used
  for headings, topic titles, big numbers, buttons.
- **Body / reading — Lexend.** Chosen deliberately: Lexend is engineered to improve
  **reading proficiency** and is highly legible for early and struggling readers. Used for
  all lesson text and UI body. This is the single most important type choice in a reading
  app for kids.

```css
--font-display: "Fredoka", system-ui, sans-serif;
--font-body: "Lexend", system-ui, sans-serif;
```

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
These are legibility settings, not stylistic — keep them on the reading surface always.

## Spacing, radius, elevation

- **Spacing scale** (4-based): `4, 8, 12, 16, 24, 32, 48, 64`.
- **Radius:** soft and friendly — `--radius-sm: 12px`, `--radius-md: 20px`,
  `--radius-lg: 28px`, `--radius-pill: 999px` (buttons are pills).
- **Elevation:** soft, low-contrast shadows on the reading surface; on night, use **glow**
  (colored, blurred) instead of drop shadows to sell the "lit-up star" feel.

## Component library

Extract these once and reuse everywhere — **consistency between pages comes from never
re-styling ad hoc.** Live in `components/ui` (primitives), `components/game`, and
`components/reading`.

### Primitives — `components/ui/`

- **`Button`** — variants: `primary` (sun fill), `secondary` (orchid outline), `ghost`;
  sizes `md` and `kid` (min 56–64px tall). Always renders a visible focus ring; never
  removes the outline. Icon-only buttons require an `aria-label`.
- **`Card` / `Panel`** — surface-aware container (paper card vs. glowing night panel).
- **`Heading` / `Text`** — enforce the type scale and family; no raw font sizing in pages.
- **`Icon`** — single sized/labelled wrapper around the icon set.
- **`Modal` / `Overlay`** — focus-trapped, `Escape` to close, returns focus to trigger.
- **`ProgressBar`** — generic animated bar (used by XP and the calibration game).

### Game — `components/game/`

- **`TopicNode`** — the map node, the product's **signature element**. States:
  `locked` (dim, dotted outline), `suggested` (gentle pulse, aqua ring), `explored`
  (lit / aqua), `mastered` (gold glow + stamp). Each state has a shape/icon difference,
  not just color (accessibility).
- **`WorldMap`** — the constellation/star-chart layout connecting nodes; pannable.
- **`XPBar`** — animated XP/level bar with a count-up; announces changes politely to SRs.
- **`ExpeditionStamp`** (Badge) — a "stamped into the journal" badge with a press animation.
- **`Avatar`** — the explorer token ("you are here" on the map; cosmetic unlocks).
- **`RewardBurst` / `LevelUpCelebration`** — overlay for XP gains, level-ups, badges.
- **`Pip`** _(optional guide mascot)_ — a small companion that gives the app a voice
  ("Nice exploring! Want to try a tricky one?"). Personality drives kid engagement; keep
  it skippable and never blocking.

### Reading — `components/reading/`

- **`ReadingView`** — the field-journal lesson surface (sets surface, max width, type).
- **`LessonChunk`** — one short, visual block of explanation.
- **`QuizChoice`** — big tappable answer. States: `default`, `selected`, `correct`
  (leaf + ✓ + "Yes!"), `retry` (coral + ↻ + "Try again") — **icon + text + color**, never
  color alone. Fully keyboard-operable.
- **`QuizCard`** — wraps the question + choices + feedback.

### Shell

- **`AppShell` / `TopBar`** — consistent header on every child page: avatar, level, XP bar,
  current surface. This is the main driver of cross-page consistency.

## Motion

Motion sells "discovery," but restraint keeps it from feeling AI-generated or
overstimulating:

- **Map load:** a brief star-twinkle settle.
- **Discovery:** a node "pops + glows" when first explored.
- **Reward:** XP count-up; a contained `RewardBurst`; a badge "stamp" press.
- **Idle:** very subtle float on suggested nodes to invite a tap.

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
7. **Reading legibility:** Lexend, generous line-height, capped line length, rem-based
   sizing that honors browser zoom and text scaling.
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
- **Visual** (Playwright snapshots): the component gallery (`/dev/components`) on **both
  surfaces** (night + paper), capturing each component's states. Regenerate the baseline when
  the gallery legitimately changes; it's a strict gate otherwise.
- **e2e / contract** (Playwright, real browser): the DOM + a11y contract driven by **touch
  and keyboard with no mouse** — `axe` over the gallery, ARIA roles/labels, keyboard
  activation (`Enter`/`Space` to act, `Escape` to dismiss), visible focus rings, focus
  trap/restore for overlays, tap targets, and tab order following reading order.

**Coverage expectations:** every interactive component has a keyboard-operable path under
test and meets the target-size floor; reduced-motion and both surfaces are exercised; and the
gallery stays the single rendered surface all three layers point at. A component without its
unit (where it has pure logic), gallery, and e2e coverage fails the parity check and is not
mergeable.

## Implementation notes

- **Tokens → Tailwind:** put the tokens in `styles/tokens.css` as CSS variables and map
  them into the Tailwind theme so utilities stay token-driven. **The repo is on Tailwind
  v4** (CSS-first; there is no `tailwind.config.ts`) — the mapping lives in an
  `@theme inline { … }` block in `app/globals.css`, not a JS config. Surface switching is a
  `data-surface="night|paper"` attribute that re-points the `--surface-*` variables.
- **Behavior from Headless UI.** Interactive primitives wrap **Headless UI** (`@headlessui/react`)
  rather than re-implementing accessibility behavior: `Modal` is a `Dialog` (focus trap, scroll
  lock, portal, Escape/backdrop dismissal), `Input` is a `Field`/`Label`/`Input`/`Description`
  (label + hint/error association), and `Button` is its `Button`. ReadTrip owns the **styling and
  surface theming**; Headless UI owns the **behavior and ARIA wiring**, so there's less custom
  a11y code to maintain. Purely presentational primitives (`Card`, `Heading`, `Text`, `Icon`,
  `ProgressBar`) have no Headless UI equivalent and stay plain token-styled elements.
- **No ad-hoc styling in pages.** Pages compose components; components own the styling.
  This is what guarantees consistency. The **`design-system` skill**
  (`.claude/skills/design-system`) is the operational "how & when to use" guide, and it's
  parity-checked against `components/ui/` by `npm run check:design-system` (pre-commit + CI)
  so the docs can't silently drift from the code.
- **Storybook (recommended, optional):** a Storybook of the component library serves as a
  living style guide and showcases the design system as a deliberate, reusable system rather
  than one-off pages — useful for team collaboration and future development.
- **Fonts:** load Fredoka + Lexend via `next/font` (self-hosted, no layout shift).
