# Avatar

The explorer token — a rough, hand-coloured round patch (as if a highlighter marker scribbled
inside a hand-drawn circle) with the explorer's initial inked on top. Source:
[`components/ui/Avatar.tsx`](../../../../components/ui/Avatar.tsx).

```tsx
import { Avatar } from "@/components/ui/Avatar";

<Avatar color="aqua" name="Ada" />
<Avatar color="coral" name="Ben" size="sm" />
```

## When to use

- Representing an explorer/profile: the profile picker/manager, "you are here" on the map,
  compact chrome (e.g. a future header).

## When **not** to use

- **A color swatch that isn't identity-bearing** (a decorative tile, a status chip) → use the
  token directly (`.rt-swatch` chip pattern in the color gallery) or `StickyNote`, not this.
- **An interactive control** — `Avatar` is presentational (`aria-hidden`) and carries no click
  behavior. Wrap it in the real `<button>`/`<form>` that does the navigating (see
  `ProfilesManager`'s `ProfileCard`).

## Props

| Prop        | Type                                             | Default | Notes                                                      |
| ----------- | ------------------------------------------------ | ------- | ---------------------------------------------------------- |
| `color`     | `AvatarColor` (`sun\|coral\|aqua\|leaf\|violet`) | —       | The explorer's chosen marker color.                        |
| `name`      | `string`                                         | —       | Only the first letter (uppercased) is shown.               |
| `size`      | `"sm" \| "lg"`                                   | `"lg"`  | `lg` (64px, profile cards) or `sm` (36px, compact chrome). |
| `className` | `string`                                         | —       | Extra classes on the root `span`.                          |

## How it works

The fill uses the same masking technique as a color-swatch chip, but its own round-patch shape:
a solid `background-color` set to the token, carved to a hand-run felt-tip edge (`.rt-torn`,
masked to `--rt-inked-blob` in `globals.css`) — a rough round patch instead of a perfect circle,
so it reads as coloured in by hand rather than a printed disc. (The swatch chip uses a
differently-shaped mask, `--rt-marker-stroke` — an elongated capsule, not a circle — since a
round shape stretched into a wide swatch box just reads as an oval.) A small, **stable** tilt
(hashed from `color + name`) keeps repeated avatars from looking stamped out identically. The
initial sits in a sibling `span` painted after the blob, so it's always on top.

## Accessibility

- **Never the only carrier of identity.** `Avatar` is `aria-hidden` — always pair it with the
  explorer's visible name (see `ProfileCard`), never rely on the letter/color alone.
- **Contrast**: the fill is opaque and paired with `--ink` text, matching the same
  color/contrast pairings already validated for the `AVATAR_COLORS` swatches elsewhere in the
  app (the `ColorPicker` swatches in `ProfilesManager`) — don't introduce a new color here.
