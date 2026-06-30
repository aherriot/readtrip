# Button

The one way to render an action. A real `<button>`, or a real `<a>` when `href` is set.
Source: [`components/ui/Button.tsx`](../../../../components/ui/Button.tsx).

```tsx
import { Button } from "@/components/ui/Button";

<Button onClick={start}>Start exploring</Button>
<Button variant="secondary" trailingIcon={<ArrowGlyph />}>Next</Button>
<Button href="/sign-in">Sign in</Button>          // renders an <a>
<Button aria-label="Search" variant="ghost"><Icon decorative>…</Icon></Button>
```

## When to use

- Any action or navigation that looks like a button: submit, primary CTA, "next", dialog
  actions. Use `href` for navigation (renders an `<a>`), no `href` for in-page actions.

## When **not** to use

- **Plain inline navigation** in a sentence → a regular text link, not a Button.
- **Toggling a value** → a checkbox/switch primitive.
- **Picking one of several answers** → `QuizChoice`, not a row of Buttons.

## Props

| Prop                         | Type                                  | Default     | Notes                                                        |
| ---------------------------- | ------------------------------------- | ----------- | ------------------------------------------------------------ |
| `variant`                    | `"primary" \| "secondary" \| "ghost"` | `"primary"` | One `primary` per view — the single clear action.            |
| `size`                       | `"kid" \| "md"`                       | `"kid"`     | `kid` ≈ 60px (target floor); `md` (44px) for dense adult UI. |
| `href`                       | `string`                              | —           | When set, renders a styled `<a>` instead of a `<button>`.    |
| `leadingIcon`/`trailingIcon` | `ReactNode`                           | —           | Decorative (kept `aria-hidden`); the label carries meaning.  |
| `fullWidth`                  | `boolean`                             | `false`     | Stretches to fill — good for stacked mobile actions.         |
| `ref`                        | `Ref<button \| a>`                    | —           | Forwarded to the rendered element.                           |
| …rest                        | native `button`/`a` props             | —           | `onClick`, `type`, `disabled`, `target`, …                   |

`type` defaults to `"button"` so a Button inside a form never submits by accident — set
`type="submit"` explicitly on the submit action.

## Surfaces

`primary` is a bright `--sun` fill with dark ink (≈9:1) on both surfaces; `secondary`/`ghost`
read `--surface-*` tokens, so they adapt to night vs. paper automatically.

## Accessibility

- **Icon-only buttons require `aria-label`** — there's no visible text to name them.
- Always a real `<button>`/`<a>`, so `Enter`/`Space`, focus, and SR semantics come for free.
- The global focus ring is honored; never remove the outline.
- Nothing depends on hover — hover only softens the fill; meaning is always in the label.

## Do / Don't

```tsx
// ✅ one clear primary action; quieter secondary beside it
<Button>Let's go</Button>
<Button variant="secondary">Not yet</Button>

// ✅ navigation renders a real link
<Button href="/map">Back to the map</Button>

// ❌ icon-only with no name — unusable with a screen reader
<Button variant="ghost"><Icon decorative>…</Icon></Button>

// ❌ a clickable div re-implementing a button
<div onClick={go} className="rounded-pill bg-sun">Go</div>
```
