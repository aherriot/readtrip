# Highlight

A highlighter swipe over inline text — the journal alternative to a pill. Instead of boxing a
word in a bordered chip, run a translucent marker stroke across plain written text. Source:
[`components/ui/Highlight.tsx`](../../../../components/ui/Highlight.tsx).

```tsx
import { Highlight } from "@/components/ui/Highlight";

<span className="font-display font-semibold text-surface-ink">
  <Highlight tone="sun">Lvl 4</Highlight>
</span>

<Text>You&apos;ve read <Highlight tone="leaf">12 topics</Highlight> so far.</Text>
```

## When to use

- A **quiet status or emphasis** written into a line of text — a level label, a count, a
  one-word marker — where a bordered pill would feel too boxy for the hand-annotated journal
  (e.g. the XP bar's "Lvl N").

## When **not** to use

- **A loud, resolved verdict pressed over content** → `StampMark` (quiz feedback).
- **The sole carrier of meaning by color** → forbidden anyway; keep the meaning in the words.

## Props

| Prop       | Type            | Default | Notes                                                                               |
| ---------- | --------------- | ------- | ----------------------------------------------------------------------------------- |
| `children` | `ReactNode`     | —       | The words to highlight — keep it short.                                             |
| `tone`     | `HighlightTone` | `"sun"` | Accent that colors the swipe (`sun`/`aqua`/`sky`/`violet`/`leaf`/`coral`/`orchid`). |

## Accessibility

- The **text keeps its normal `--surface-ink` color** and reads _through_ the translucent
  swipe, so contrast is unchanged — the marker is a filtered `::before` **behind** the text
  (`.rt-marker`), never a fill that recolors it.
- It's a **text treatment, not a control** — no role, no focus. If a highlighted word ever
  carries state, make sure that state is also in the words (never color alone — a11y floor).
- The swipe uses the shared `#rt-sketch` turbulence filter for uneven, hand-run edges; it sits
  behind the text via `isolation: isolate` + `z-index: -1`, so it can't drop behind ancestor
  backgrounds.
