# InkFrame

The hand-drawn "pen box" border — the field-journal frame around `Card`, `Button`, `Input`,
`Select`, `Modal`, `ProgressBar`, `StampMark`, `QuizChoice`, `ReadingView`, and `WorldMap`
tiles. It's the low-level primitive those components render as their FIRST child; you rarely
reach for it directly — build a new component on top of it instead of re-styling a border by
hand. Source: [`components/ui/InkFrame.tsx`](../../../../components/ui/InkFrame.tsx).

```tsx
import { InkFrame } from "@/components/ui/InkFrame";

<div className="relative rounded-[3px] p-4">
  <InkFrame />
  {children}
</div>;
```

## When to use

- You're building a **new** primitive that needs the same hand-drawn pen-box outline as
  everything else (a transparent container, a control's border). Drop `<InkFrame />` as the
  first child of a `position: relative` element — it paints the border behind the content and
  is inert to pointers + assistive tech (`aria-hidden`).
- Tune `weight` to match context: ~1.1 for a small track (`ProgressBar`), ~1.8 the default pen
  box (`Card`, `Modal`), ~2.6 the heavier "Panel"/drawn-twice look (`Card elevated`,
  `ReadingView`).

## When **not** to use

- **Inside an existing component that already renders one** — `Card`, `Button`, `Input`, etc.
  already wire this up; don't add a second frame.
- **As a generic drop shadow / elevation** — that's the `--surface-elevation*` tokens (see
  [tokens.md](tokens.md)), not this. InkFrame is a stroke, not a shadow.

## Props

| Prop        | Type     | Default                | Notes                                                                                     |
| ----------- | -------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| `weight`    | `number` | `1.8`                  | Stroke weight in px.                                                                      |
| `tone`      | `string` | `"var(--surface-ink)"` | Ink color — any CSS color or `var(--token)` (e.g. `--surface-danger` for an error state). |
| `className` | `string` | —                      | Extra classes on the underlying `<svg>`.                                                  |

## How it works

Each instance measures its parent box on mount (`ResizeObserver`) and lays a wobble point
down every ~17px with a constant amplitude — so the hand-drawn density is the same on a small
button and a large card, and the border hugs the true edge at any size (no stretched-viewBox
distortion). Each instance is uniquely seeded via `useId`, so a repeated UI (a grid of cards,
a row of buttons) never shows the exact same wobble twice. It replaced a runtime SVG
turbulence filter (`#rt-sketch`) that was recomputed per pixel, per repaint — this version
computes a static path once per size, then only on resize.

## Accessibility

- `aria-hidden="true"` and `focusable="false"` — it's decorative, never the thing a screen
  reader or keyboard user interacts with.
- Purely visual; carries no state on its own. A component using `tone` to signal an error
  (e.g. `Input`) must still pair that with text/icon — color alone is never the only signal
  (see the accessibility floor in `SKILL.md`).
