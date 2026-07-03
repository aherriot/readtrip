# Select

Surface-aware dropdown for choosing one of several fixed options.
Source: [`components/ui/Select.tsx`](../../../../components/ui/Select.tsx).

```tsx
import { Select } from "@/components/ui/Select";

<Select label="Reading level" name="readingLevel" defaultValue={4} required>
  <option value={1}>Level 1 · Ages 3–4 — Toddler</option>
  <option value={2}>Level 2 · Age 5 — Kindergarten</option>
</Select>;
```

## When to use

- Choosing exactly one value from a small, fixed, ordered/named set where showing every
  option (with a short description) helps the parent/adult decide — e.g. the reading-level
  picker on the Profiles edit form.

## When **not** to use

- **Free text or numbers** → `Input`.
- **A binary choice or a handful of visually distinct swatches** (e.g. avatar color) → a
  radio group, not a `Select`.
- **Child-facing choices during play** → build a game-surface picker with large tap targets
  instead; `Select`'s native platform picker is an adult-form control.

## Props

| Prop        | Type                     | Default | Notes                                                       |
| ----------- | ------------------------ | ------- | ----------------------------------------------------------- |
| `label`     | `string`                 | —       | **Required.** Programmatically associated via `htmlFor`.    |
| `hint`      | `string`                 | —       | Helper text under the field. Hidden while an `error` shows. |
| `error`     | `string`                 | —       | Renders the retry treatment + sets `aria-invalid`.          |
| `size`      | `"kid" \| "md"`          | `"kid"` | `kid` ≈ 60px (target floor); `md` for dense adult forms.    |
| `hideLabel` | `boolean`                | `false` | Visually hide the label but keep it for screen readers.     |
| `ref`       | `Ref<HTMLSelectElement>` | —       | Forwarded to the `<select>`.                                |
| `children`  | `ReactNode`              | —       | `<option>`/`<optgroup>` elements.                           |
| …rest       | native `select` props    | —       | `name`, `value`, `defaultValue`, `onChange`, …              |

## Surfaces

Renders correctly on both surfaces with no props: it reads `bg-surface-panel`,
`text-surface-ink`, `border-surface-rule`, and `--surface-accent` (focus). Place it inside a
`data-surface="paper"` region on reading pages; it inherits `night` by default elsewhere.

## Accessibility

- Label is always rendered and associated (use `hideLabel`, never _omit_ `label`).
- Built on a real native `<select>`, so it gets the platform's own accessible picker UI,
  keyboard support (type-ahead, arrow keys), and mobile scroll wheel for free.
- `hint`/`error` are wired through `aria-describedby`; `error` also sets `aria-invalid`.
- Errors are never color-only — paired with an alert icon and text, matching `Input`.
- Default `kid` size meets the 56–64px target floor; the global focus ring is honored.
- Put the meaningful, distinguishing information (e.g. an age band) directly in each
  `<option>`'s text — don't rely on a separate legend the option list can't carry.

## Do / Don't

```tsx
// ✅ each option's text carries the info a parent needs to choose confidently
<Select label="Reading level" required>
  <option value={4}>Level 4 · Ages 8–9 — 3rd–4th grade</option>
</Select>

// ❌ no label — fails the a11y floor
<Select><option>...</option></Select>

// ❌ re-styling the field ad hoc instead of using tokens/props
<Select label="Reading level" className="bg-[#fff] text-[#000] rounded-none">...</Select>
```
