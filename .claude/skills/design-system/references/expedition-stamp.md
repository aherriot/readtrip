# ExpeditionStamp

A mastery badge "stamped into the journal" (docs/10) — the tangible reward for mastering a
topic (docs/05). A gold, rotated stamp with the medal glyph + the topic.
Source: [`components/game/ExpeditionStamp.tsx`](../../../../components/game/ExpeditionStamp.tsx).

```tsx
import { ExpeditionStamp } from "@/components/game/ExpeditionStamp";

<ExpeditionStamp title="Volcanoes" />;
{
  reward.badgeTitle && <ExpeditionStamp title={reward.badgeTitle} />;
}
```

## When to use

- Surfacing a **newly earned** or collected mastery badge — on the reward screen, a map
  node, or a future trophy room.

## When **not** to use

- A plain XP gain → [`RewardBurst`](reward-burst.md).
- A level-up → [`LevelUpCelebration`](level-up-celebration.md).

## Props

| Prop        | Type     | Default | Notes                                             |
| ----------- | -------- | ------- | ------------------------------------------------- |
| `title`     | `string` | —       | Mastered topic; rendered as "{title}" + "Master". |
| `className` | `string` | —       | Layout only.                                      |

## Accessibility

- Presentational with `role="img"` and one clean `aria-label` ("{title} Master badge"), so a
  screen reader hears the badge once rather than reading each glyph.
- **Never color-only** — the medal glyph + real "Master" text carry the meaning alongside the
  gold color/glow.

## Motion

- A stamp-press entrance (`motion-safe:animate-stamp`) that thuds to rest. `motion-safe:`
  only, and the keyframe's `both` fill keeps the settled frame — so under reduced motion it's
  a still stamp, not a missing one.

## Surface

Reads `--surface-*` + `--sun` tokens — driven entirely by the single field-journal surface,
so it never hardcodes color.
