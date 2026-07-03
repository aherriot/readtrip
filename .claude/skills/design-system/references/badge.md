# Badge

A compact status pill — a token border + soft fill wrapping an optional icon and a short
word. It's the shared shape behind ReadTrip's **icon + word + color** state markers, so quiz
feedback and map-node status read as one visual language.
Source: [`components/ui/Badge.tsx`](../../../../components/ui/Badge.tsx).

```tsx
import { Badge } from "@/components/ui/Badge";

// Quiz feedback — the word conveys the result (sentence-case, sm)
<Badge tone="leaf" icon="✓">Yes!</Badge>
<Badge tone="coral" icon="↻">Try again</Badge>

// Map-node marker — a tiny uppercase eyebrow that mirrors a label announced
// elsewhere (the node's sr-only status text), so the caller marks it aria-hidden
<Badge tone="sky" size="xs" variant="tag" icon="🚩" aria-hidden>Exploring</Badge>
```

## When to use

- A short **status/feedback marker**: quiz correct/retry, a map node's `Exploring` / `Dive` /
  `New` kind, and similar "one word of state" indicators.
- Anywhere the a11y floor calls for **icon + word + color** instead of color alone — Badge is
  the reusable pill so those markers stay consistent instead of being re-styled per page.

## When **not** to use

- **An interactive control** (something tappable) → `Button`. Badge is a non-interactive
  `<span>`; don't put a click handler on it.
- **A full-width status row or a longer sentence** → `Text` (with an `Icon` if needed). Badge
  is for a word or two.
- **Measurable progress** (quiz position, XP) → `ProgressBar`.
- **Owning layout.** Badge doesn't position itself; wrap or place it with the caller's own
  `className` (an absolute corner, a reserved column).

## Props

| Prop        | Type                                                     | Default  | Notes                                                                                                                                                                    |
| ----------- | -------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`  | `ReactNode`                                              | —        | The status word — the meaning. Keep it a word or two.                                                                                                                    |
| `tone`      | `leaf \| coral \| berry \| aqua \| violet \| sky \| sun` | —        | Semantic accent → token border + soft fill. Pick by meaning, not by look. `coral` is wrong-answer/delete only; reach for `berry` for a secondary/playful accent instead. |
| `size`      | `"sm" \| "xs"`                                           | `"sm"`   | `sm` in reading flow; `xs` for a compact corner marker.                                                                                                                  |
| `variant`   | `"text" \| "tag"`                                        | `"text"` | `text` = sentence-case pill; `tag` = uppercase display eyebrow.                                                                                                          |
| `icon`      | `ReactNode`                                              | —        | Optional leading glyph — **always decorative** (rendered `aria-hidden`).                                                                                                 |
| `className` | `string`                                                 | —        | Layout / positioning. Also where the caller sets `aria-hidden` on the pill.                                                                                              |

Any other `<span>` attribute (`aria-hidden`, `id`, …) is forwarded.

## Surfaces

Tones are `--surface-*`-adjacent tokens (leaf, coral, berry, aqua, violet, sky, sun) and the text is
`currentColor`, so a badge inherits `--surface-ink` and reads on both night and paper with no
per-surface styling.

## Accessibility

- **The word is the meaning; the icon is decorative.** Badge renders the `icon` `aria-hidden`
  — never encode state in the glyph alone. This is the "never color-only" floor: every badge
  carries an actual word.
- **The caller owns the a11y contract.** Leave the badge as-is when its word conveys the
  state (quiz feedback). Pass `aria-hidden` when the badge only _mirrors_ a label already
  announced elsewhere — e.g. `TopicNode` keeps an `sr-only` status word and hides the visible
  badge so a screen reader hears it once, not twice.
- **Not a control.** It's a `<span>` — no role, not focusable. Tappable things are `Button`s.

## Do / Don't

```tsx
// ✅ icon + word + color; the word stands on its own
<Badge tone="leaf" icon="✓">Yes!</Badge>

// ✅ decorative duplicate of a status announced elsewhere
<span className="sr-only">Exploring</span>
<Badge tone="sky" size="xs" variant="tag" icon="🚩" aria-hidden>Exploring</Badge>

// ❌ color / icon only — no word for the screen reader (or the color-blind)
<Badge tone="coral" icon="↻" aria-label="wrong" />

// ❌ making a badge the tap target — use a Button
<Badge tone="aqua" onClick={explore}>Explore</Badge>
```
