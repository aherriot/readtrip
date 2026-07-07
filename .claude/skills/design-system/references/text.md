# Text

Body text in Lexend on the type scale, with the reading-legibility defaults baked in.
Source: [`components/ui/Text.tsx`](../../../../components/ui/Text.tsx).

```tsx
import { Text } from "@/components/ui/Text";

<Text>Body copy for the UI.</Text>
<Text measure>Lesson paragraph with a capped reading measure (~62ch).</Text>
<Text size="sm" tone="soft">Secondary, supporting detail.</Text>
<Text as="span">Inline run.</Text>
```

## When to use

- All non-heading text: paragraphs, labels, captions, supporting copy. Turn on `measure` for
  lesson body copy so lines don't run too long for early readers.

## When **not** to use

- **Headings** → [`Heading`](heading.md).
- **An action** → [`Button`](button.md).

## Props

| Prop      | Type                             | Default     | Notes                                              |
| --------- | -------------------------------- | ----------- | -------------------------------------------------- |
| `as`      | `ElementType`                    | `"p"`       | `span` for inline runs; `p` for paragraphs.        |
| `size`    | `"xs" \| "sm" \| "base" \| "lg"` | `"base"`    | `base` is the legible reading default.             |
| `tone`    | `"default" \| "soft"`            | `"default"` | `soft` for secondary text (still AA on the paper). |
| `measure` | `boolean`                        | `false`     | Caps line length (~62ch) for reading copy.         |
| …rest     | native element props             | —           | `id`, `className`, …                               |

## Surface

`default` → `--surface-ink`, `soft` → `--surface-ink-soft` — both meet AA on the field-journal
paper. Line-height `1.6` is always on: it's a legibility setting, not style. The face is
Shantell Sans (the one handwritten voice), with Lexend only as the fallback.

## Accessibility

- `soft` tone is for de-emphasis, **never** for primary reading content.
- Don't encode meaning in size/tone alone; pair with words (e.g. don't make "soft" the only
  signal that text is disabled).

## Do / Don't

```tsx
// ✅ lesson copy with a reading measure
<Text measure>Lava is molten rock that reaches the surface…</Text>

// ❌ raw paragraph with hardcoded sizing/color
<p className="text-[17px] text-[#4a4f6b]">…</p>
```
