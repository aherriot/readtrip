# RewardBurst

A contained reward "pop" for an XP gain (docs/10 "Reward"). Sits inline on the result
screen and bursts in on mount.
Source: [`components/game/RewardBurst.tsx`](../../../../components/game/RewardBurst.tsx).

```tsx
import { RewardBurst } from "@/components/game/RewardBurst";

<RewardBurst xp={20} />          // "✨ +20 XP"
<RewardBurst xp={reward.xpAwarded} />
```

## When to use

- The immediate "+N XP" feedback the moment a loop's reward lands (paired with an
  [`XPBar`](xp-bar.md) showing the new standing).

## When **not** to use

- The ongoing level/XP standing → [`XPBar`](xp-bar.md).
- The bigger level-up moment → [`LevelUpCelebration`](level-up-celebration.md).
- A mastered topic → [`ExpeditionStamp`](expedition-stamp.md).

## Props

| Prop        | Type     | Default | Notes                           |
| ----------- | -------- | ------- | ------------------------------- |
| `xp`        | `number` | —       | XP earned; rendered as "+N XP". |
| `className` | `string` | —       | Layout only.                    |

## Accessibility

- The gain is announced politely (`aria-live="polite"`) so a screen reader hears "+20 XP"
  without stealing focus. The sparkle glyph is decorative (`aria-hidden`).

## Motion

- A "burst" pop on mount (`motion-safe:animate-burst`), `motion-safe:` only; the `both` fill
  keeps the final frame, so under reduced motion it's a still badge with the same text.

## Surfaces

Built for `night`; reads `--surface-*` + `--sun` tokens. Works on `paper` too.
