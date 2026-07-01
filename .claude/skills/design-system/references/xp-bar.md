# XPBar

The XP / level bar (docs/10) on the night/play surface. A "Lvl N" chip beside a
`sun`-toned progress bar that fills toward the next level.
Source: [`components/game/XPBar.tsx`](../../../../components/game/XPBar.tsx).

```tsx
import { XPBar } from "@/components/game/XPBar";

// `xp` is the child's *cumulative* XP; the bar derives the level + fill from it.
<XPBar xp={70} />          // Level 2, half-way to Level 3
<XPBar xp={reward.xp} className="max-w-xs" />
```

## When to use

- Showing the child's standing after a loop (the Steer/reward screen) or in the app shell /
  top bar. Pass cumulative XP; the bar does the level math via `levelProgress` (`lib/gamification/xp`).

## When **not** to use

- A generic non-XP progress track (quiz progress, calibration) → [`ProgressBar`](progress-bar.md).
- A one-off "+N XP earned" flash → [`RewardBurst`](reward-burst.md).

## Props

| Prop        | Type     | Default | Notes                                              |
| ----------- | -------- | ------- | -------------------------------------------------- |
| `xp`        | `number` | —       | Cumulative XP. Level + fill are derived from it.   |
| `className` | `string` | —       | Layout only (the bar fills its container's width). |

## Accessibility

- Wraps [`ProgressBar`](progress-bar.md), so it exposes a real `progressbar` role with a
  human name ("Level 2: 30 of 60 XP to the next level") and `aria-valuenow`.
- The "Lvl N" chip is `aria-hidden` (the level is already in the bar's name), so a screen
  reader hears the standing once, not twice.

## Motion

- On mount the fill counts up from empty via the ProgressBar's CSS width transition. The
  global reduced-motion floor zeroes that duration, so it snaps to the final value — no JS
  opt-out needed.

## Surfaces

Built for `night`; reads `--surface-*` + `--sun` tokens. Works on `paper` too (used on the
paper reward screen), since `--sun` is surface-independent.
