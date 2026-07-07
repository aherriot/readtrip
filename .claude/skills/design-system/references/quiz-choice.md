# QuizChoice

One big, tappable quiz answer — a squared, hand-drawn `.rt-inkbox` pen box on the field
journal. Resolved feedback is a [`StampMark`](stamp-mark.md) pressed into the corner.
Source: [`components/reading/QuizChoice.tsx`](../../../../components/reading/QuizChoice.tsx).

```tsx
import { QuizChoice } from "@/components/reading/QuizChoice";

<QuizChoice onSelect={() => choose(i)}>It reflects the Sun's light</QuizChoice>
<QuizChoice state="correct" disabled>The correct answer</QuizChoice>
<QuizChoice state="retry" disabled>A try-again choice</QuizChoice>
```

## When to use

- The answer options in a quiz question. Rendered by [`QuizCard`](quiz-card.md); you
  rarely place one by hand.

## When **not** to use

- A general action/submit → [`Button`](button.md).
- A form single-choice among data → a radio group, not quiz choices.

## Props

| Prop       | Type                                              | Default     | Notes                                                           |
| ---------- | ------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| `children` | `string`                                          | —           | The answer text (always `surface-ink` for guaranteed contrast). |
| `state`    | `"default" \| "selected" \| "correct" \| "retry"` | `"default"` | Feedback state; `correct`/`retry` add a status icon + word.     |
| `onSelect` | `() => void`                                      | —           | Fired on tap.                                                   |
| `disabled` | `boolean`                                         | `false`     | Locks the choice (once resolved, or when it's a known-wrong).   |

## Accessibility

- A real `<button>`, so `Enter`/`Space`, focus, and SR semantics are native; the global
  `:focus-visible` ring applies (never removed).
- **Never color-only** — `correct`/`retry` pair the accent (as a soft _fill_ + re-inked pen
  box) with a `StampMark` carrying a status **icon + word** ("✓ Yes!" / "↻ Try again"). The
  stamp overlays the corner (absolute), so feedback never changes the box's height.
- Min height hits the 56–64px kid target floor.

## Surface

The single field-journal surface; reads `--surface-*` + `--leaf`/`--coral` tokens, so it never
hardcodes color.
