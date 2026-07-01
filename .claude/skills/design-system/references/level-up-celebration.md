# LevelUpCelebration

The level-up celebration overlay (docs/10 "Reward") — the bigger reward beat. A
focus-trapped, dismissable overlay announcing the new level.
Source: [`components/game/LevelUpCelebration.tsx`](../../../../components/game/LevelUpCelebration.tsx).

```tsx
import { LevelUpCelebration } from "@/components/game/LevelUpCelebration";

const [celebrating, setCelebrating] = useState(false);
useEffect(() => {
  if (reward?.leveledUp) setCelebrating(true);
}, [reward?.leveledUp]);

<LevelUpCelebration
  open={celebrating}
  level={reward.level}
  onDismiss={() => setCelebrating(false)}
/>;
```

## When to use

- The moment a loop's reward comes back with `leveledUp` — the one blocking celebration.
  Open it once and let the child dismiss it.

## When **not** to use

- A plain XP gain (non-blocking) → [`RewardBurst`](reward-burst.md).
- A mastered topic → [`ExpeditionStamp`](expedition-stamp.md).
- A reading-level step (kept quiet, never celebrated) — no overlay.

## Props

| Prop        | Type         | Default | Notes                                            |
| ----------- | ------------ | ------- | ------------------------------------------------ |
| `open`      | `boolean`    | —       | Controlled by the parent.                        |
| `level`     | `number`     | —       | The level just reached (shown in the title).     |
| `onDismiss` | `() => void` | —       | Called on the button, `Escape`, or backdrop tap. |

## Accessibility

- Built on [`Modal`](modal.md), so it inherits the focus trap, `Escape`/backdrop dismissal,
  and focus restore to the trigger. The title ("Level N!") names the dialog; the "Keep
  exploring" button takes initial focus.

## Motion

- The celebration glyph bursts in (`motion-safe:animate-burst`), `motion-safe:` only; under
  reduced motion it's a still overlay with the same words. The Modal's own rise/fade is
  already neutralized by the global reduced-motion floor.

## Surfaces

Opens on `night` (celebrations live on the play surface, docs/10) — the Modal default.
