# Spinner

A small "working on it" indicator for loading states. A hand-drawn loop in `currentColor`,
waved by the shared `#rt-doodle` turbulence filter (the same one every icon uses), so it reads
as a quickly-sketched circle rather than a mechanical ring — and reads on either surface with
no per-surface styling.
Source: [`components/ui/Spinner.tsx`](../../../../components/ui/Spinner.tsx).

```tsx
import { Spinner } from "@/components/ui/Spinner";

// Standing alone → name what's loading (role="status" + sr-only text)
<Spinner label="Loading your lesson" size="lg" />

// Inside an already-labelled control → decorative (no label, aria-hidden)
<Button loading>Save changes</Button>          // Button embeds a Spinner for you
<span className="text-surface-accent"><Spinner /></span>
```

## When to use

- A short async wait with no measurable progress: submitting a form, resolving a topic,
  generating a lesson/quiz. Pair it with text that says what's happening.
- Inside a `Button` while an action is in flight — prefer `<Button loading>` over placing a
  Spinner by hand; the button wires up `aria-busy` + disables itself.

## When **not** to use

- **Known, measurable progress** (quiz position, XP, calibration) → `ProgressBar`, which
  announces a real value.
- **A one-off reward beat** → the reward motion components (`RewardBurst`, etc.), not a
  spinner.
- **A whole page's first load** handled by the framework → a route-level loading UI.

## Props

| Prop        | Type                   | Default | Notes                                                                 |
| ----------- | ---------------------- | ------- | --------------------------------------------------------------------- |
| `size`      | `"sm" \| "md" \| "lg"` | `"md"`  | `sm` inside a control, `lg` anchors a loading screen.                 |
| `label`     | `string`               | —       | Sets `role="status"` + sr-only text. Omit when decorative.            |
| `className` | `string`               | —       | Layout, or override the inherited color (e.g. `text-surface-accent`). |

## Surface

Colored with `currentColor`, so it inherits the surrounding text color automatically. Override
with a token utility (`text-surface-accent`, `text-sun`) when you want it to pop.

## Accessibility

- **Name it once.** Standing alone, pass `label` so screen readers hear what's loading. Inside
  a labelled control (a loading Button, or a screen whose heading already says it), leave
  `label` off so it isn't announced twice — then it's `aria-hidden`.
- **Reduced motion.** Spins via `motion-safe:animate-spin`; the global floor turns it into a
  still (but still visibly hand-drawn) loop when the user opts out of motion.

## Do / Don't

```tsx
// ✅ named when it stands alone
<Spinner label="Building your quiz" size="lg" />

// ✅ decorative next to a heading that already names the wait
<Heading level={2}>Building your quiz…</Heading>
<Spinner size="lg" />

// ❌ a bare, unnamed spinner as the only thing on screen (SR hears nothing)
<Spinner />

// ❌ a spinner for something with real progress — use ProgressBar
<Spinner label="Question 2 of 5" />
```
