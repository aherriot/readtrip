# ProgressBar

Generic, animated progress track with a real `progressbar` role. Used by XP, reading-level
calibration, and quiz progress. Source:
[`components/ui/ProgressBar.tsx`](../../../../components/ui/ProgressBar.tsx).

```tsx
import { ProgressBar } from "@/components/ui/ProgressBar";

<ProgressBar label="Reading-level calibration" value={45} />
<ProgressBar label="XP to next level" value={7} max={12} tone="sun" showValue />
```

## When to use

- Any "how far along" indicator with a known maximum: XP to next level, calibration progress,
  questions answered. The fill animates as `value` changes.

## When **not** to use

- **Indeterminate / unknown-length loading** → a spinner, not this (it needs a real `max`).
- **A static ratio you don't want announced as progress** → plain text.

## Props

| Prop        | Type                          | Default    | Notes                                                       |
| ----------- | ----------------------------- | ---------- | ----------------------------------------------------------- |
| `value`     | `number`                      | —          | Clamped to `0…max` — out-of-range can't break it.           |
| `max`       | `number`                      | `100`      | Treat `value` as a percentage when omitted.                 |
| `label`     | `string`                      | —          | **Required** accessible name for the bar.                   |
| `tone`      | `"accent" \| "sun" \| "leaf"` | `"accent"` | `accent` follows the surface; `sun` XP; `leaf` success.     |
| `showValue` | `boolean`                     | `false`    | Adds a "7 / 12" readout (decorative; the bar announces it). |

Clamping math lives in `lib/ui/progress.ts` (`toPercent`) and is unit-tested in node.

## Accessibility

- Exposes `role="progressbar"` with `aria-valuenow/min/max` (0–100) and a human
  `aria-valuetext` (`"58%"`), so screen readers announce progress.
- The optional `showValue` readout is `aria-hidden` to avoid double-announcing.
- The fill animates via a CSS transition; the global reduced-motion floor turns it into an
  instant update for users who opt out.
- For live updates (XP gain), put the ProgressBar inside an `aria-live="polite"` region at the
  call site so the change is announced.

## Do / Don't

```tsx
// ✅ named, with a max
<ProgressBar label="Quiz progress" value={3} max={5} showValue />

// ❌ no label — a progressbar with no accessible name
<ProgressBar value={3} max={5} />
```
