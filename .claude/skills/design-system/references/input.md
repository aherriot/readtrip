# Input

An accessible single-line text field, squared off and framed by a hand-drawn ink **pen box**
(the field-journal look). Source: [`components/ui/Input.tsx`](../../../../components/ui/Input.tsx).

```tsx
import { Input } from "@/components/ui/Input";

<Input
  label="What should we call you?"
  hint="Use the name your grown-up gave you."
  name="displayName"
  required
/>;
```

## When to use

- Any single-line text or number entry inside a form: sign-in email, child profile name,
  search box, a code/PIN field.

## When **not** to use

- **Multi-line text** → a `Textarea` primitive (build one in `components/ui/` when needed;
  don't stretch `Input`).
- **Choosing from fixed options** → radios / `QuizChoice` / a `Select`, not free text.
- **A button or link** → use `Button` (⏳). An input is for input, not actions.
- **Toggles / checkboxes** → their own primitives.

## Props

| Prop          | Type                    | Default | Notes                                                       |
| ------------- | ----------------------- | ------- | ----------------------------------------------------------- |
| `label`       | `string`                | —       | **Required.** Programmatically associated via `htmlFor`.    |
| `hint`        | `string`                | —       | Helper text under the field. Hidden while an `error` shows. |
| `error`       | `string`                | —       | Renders the retry treatment + sets `aria-invalid`.          |
| `size`        | `"kid" \| "md"`         | `"kid"` | `kid` ≈ 60px (target floor); `md` for dense adult forms.    |
| `leadingIcon` | `ReactNode`             | —       | Decorative icon inside the field (kept `aria-hidden`).      |
| `hideLabel`   | `boolean`               | `false` | Visually hide the label but keep it for screen readers.     |
| `ref`         | `Ref<HTMLInputElement>` | —       | Forwarded to the `<input>`.                                 |
| …rest         | native `input` props    | —       | `name`, `type`, `value`, `onChange`, `placeholder`, …       |

`size` shadows the native HTML `size` attribute by design — pass width via styling, not
the native attribute.

## Field & look

The field is a squared (`rounded-[3px]`) `bg-surface-panel` box with **no border of its
own** — the visible frame is a hand-drawn ink pen box (`.rt-inkbox`) on the wrapper, since an
`<input>` can't carry `::before`/`::after`. It reads the `--surface-*` tokens, so it renders
correctly on the field-journal surface with no props. On `error` the wrapper adds
`.rt-inkbox--danger`, re-inking the pen box in `--surface-danger`.

## Accessibility

- Label is always rendered and associated (use `hideLabel`, never _omit_ `label`).
- `hint`/`error` are wired through `aria-describedby`; `error` also sets `aria-invalid`.
- Errors are **never color-only** — they pair the `--surface-danger` pen box (a
  contrast-safe, surface-tuned danger tone — coral itself is too light for small text on
  paper) with an alert icon **and** text. Keep `error` messages specific and kind ("We need
  an email to send the magic link").
- Default `kid` size meets the 56–64px target floor; the global focus ring is honored.

## Do / Don't

```tsx
// ✅ labelled, with a helpful, specific error
<Input label="Email" type="email" error="That doesn't look like an email yet." />

// ✅ search field with a hidden label + leading icon
<Input label="Search topics" hideLabel leadingIcon={<SearchGlyph />} type="search" />

// ❌ no label — fails the a11y floor
<Input placeholder="Email" />

// ❌ re-styling the field ad hoc instead of using tokens/props
<Input label="Email" className="bg-[#fff] text-[#000] rounded-none" />
```
