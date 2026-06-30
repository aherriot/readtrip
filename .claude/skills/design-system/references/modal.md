# Modal

Accessible, focus-trapped dialog. Centered on larger screens, a bottom sheet on phones
(mobile-first). Source: [`components/ui/Modal.tsx`](../../../../components/ui/Modal.tsx).

```tsx
"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Ready to explore?" surface="paper">
  <Text>…</Text>
  <Button onClick={() => setOpen(false)}>Let's go</Button>
</Modal>
```

## When to use

- A focused decision or short task that should interrupt the page: a confirm, a celebration,
  a small form. **Controlled** — the parent owns `open`.

## When **not** to use

- **A whole page of content** → a route, not a dialog.
- **A non-blocking, transient message** → a toast/`aria-live` region.
- **A menu/tooltip** → their own primitives (a Modal traps focus and blocks the page).

## Props

| Prop              | Type                 | Default   | Notes                                                    |
| ----------------- | -------------------- | --------- | -------------------------------------------------------- |
| `open`            | `boolean`            | —         | Controlled visibility.                                   |
| `onClose`         | `() => void`         | —         | Called on Escape, backdrop tap, or the close button.     |
| `title`           | `string`             | —         | Rendered as the heading and wired to `aria-labelledby`.  |
| `surface`         | `"night" \| "paper"` | `"night"` | It portals to `<body>`; set `paper` for reading dialogs. |
| `hideCloseButton` | `boolean`            | `false`   | Hide the ✕ when the body supplies its own actions.       |
| `children`        | `ReactNode`          | —         | Dialog body + action buttons.                            |

## Accessibility

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` (the title).
- **Focus is trapped** while open (Tab/Shift+Tab wrap inside) and **returned to the trigger**
  on close. Focus moves into the dialog on open.
- **Escape** closes; the **backdrop** is tappable to dismiss (with a visible ✕ for SR/keyboard
  users). Background scroll is locked while open.
- Fully operable by **touch + keyboard, no mouse**. The entrance animation is `motion-safe`
  only and respects the reduced-motion floor.

## Do / Don't

```tsx
// ✅ controlled, titled, with real action buttons inside
<Modal open={open} onClose={close} title="Delete profile?">
  <Button variant="secondary" onClick={close}>Cancel</Button>
  <Button onClick={confirm}>Delete</Button>
</Modal>

// ❌ untitled dialog — no accessible name
<Modal open={open} onClose={close} title="">…</Modal>
```
