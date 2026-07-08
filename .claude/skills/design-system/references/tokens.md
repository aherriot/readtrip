# Tokens reference

Tokens are defined in [`styles/tokens.css`](../../../../styles/tokens.css) and exposed as
Tailwind utilities by the `@theme inline` block in
[`app/globals.css`](../../../../app/globals.css).

> **Tailwind v4 note.** This repo uses Tailwind v4 (CSS-first, no `tailwind.config.ts`).
> Tokens map to utilities via `@theme`, not a JS config — `docs/10` predates v4 and still
> says `tailwind.config.ts`; ignore that detail.

## Rule

**Pages never hardcode color or font sizes.** Reach for a utility first; drop to
`var(--token)` only when a utility can't express it (e.g. a custom `box-shadow`).

```tsx
// ✅ token-driven
<p className="text-surface-ink text-lg">…</p>
// ❌ ad hoc — forbidden in pages
<p style={{ color: "#22263F", fontSize: 22 }}>…</p>
```

## Two layers: primitives → semantic

Colors live in two layers in [`styles/tokens.css`](../../../../styles/tokens.css) (both shown
in `/dev/components`):

1. **Primitives** — every raw color value, named by hue/shade (`--sun`, `--coral`,
   `--coral-strong`, `--paper`, `--ink`, `--periwinkle`, …). No meaning attached.
2. **Semantic** — meaning mapped onto primitives (`--surface-*`, `--correct`, `--retry`,
   `--surface-success`, `--surface-danger`, `--journal-*`, `--focus-ring`).

**Reach for the semantic tokens.** Use a raw accent primitive (`bg-sun`, `text-orchid`) only
for a genuinely decorative accent that carries no state; never invent a hex.

## Surface color utilities (prefer these)

There's **one surface** (the field journal). Reach for these tokens, never raw palette
values — the indirection means a future theme could re-point `--surface-*` with no component
changes.

| Utility                 | Token                | Use                                   |
| ----------------------- | -------------------- | ------------------------------------- |
| `bg-surface`            | `--surface-bg`       | Page / region background (warm paper) |
| `bg-surface-panel`      | `--surface-panel`    | Cards, inputs, panels                 |
| `text-surface-ink`      | `--surface-ink`      | Body text (ink)                       |
| `text-surface-ink-soft` | `--surface-ink-soft` | Secondary text, hints, placeholders   |
| `border-surface-rule`   | `--surface-rule`     | Hairlines, dividers                   |
| `*-surface-accent`      | `--surface-accent`   | The surface accent (orchid)           |

See [Shadows / elevation](#shadows--elevation) below for `--surface-elevation` and its
siblings.

## Shadows / elevation

A small named scale, not raw `rgba(0,0,0,…)` — every shadow is mixed from `--ink` so it stays
correct if the ink token is ever retuned (e.g. a future theme), and no two components drift
onto slightly different hand-typed blur/opacity values. **Never hand-write a `box-shadow` —
reach for one of these three, or add a new named step if none fits** (don't retype a one-off
`rgba()` at the call site).

| Token                        | Use                                                                                                                                                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--surface-elevation`        | A soft paper lift for panels that float above the page — `Modal`. Most containers use the hand-drawn `.rt-inkbox` pen box (`InkFrame`) instead of a shadow; reach for this only when a real shadow (not an outline) is what's floating. |
| `--surface-elevation-lifted` | A stronger lift for **opaque** paper that's popped off the page — `StickyNote`, the map-tile loading skeletons.                                                                                                                         |
| `--surface-elevation-tape`   | The small shadow under a taped-on strip (`StickyNote`'s `tape` prop).                                                                                                                                                                   |

```tsx
// ✅ named token
<div className="shadow-[var(--surface-elevation-lifted)]" />
// ❌ a hand-typed shadow — no longer tied to --ink, drifts from every other shadow in the app
<div className="shadow-[0_8px_18px_-9px_rgba(0,0,0,0.5)]" />
```

Two shadow-shaped effects deliberately live **outside** this scale as bespoke CSS:
`.rt-cover`'s multi-layer leather-lift shadow (`app/globals.css`) is a one-off composed effect
specific to that surface, not reused elsewhere; `ExpeditionStamp`'s `--sun`-colored glow
(`shadow-[0_0_26px_-6px_var(--sun)]`) is a colored glow, not a neutral elevation cue, so it
doesn't belong in an ink-mixed scale.

## Accent primitives

`sun` (primary/XP), `orchid` (secondary / playful), `coral` (wrong answer, delete — **not** a
plain secondary color; it reads as an alarm/negative), `aqua` (discovery / "deep"
suggestions), `leaf` (success), `violet` (magic / "new" breadth), `sky` (in-progress /
"exploring" tiles) → utilities `bg-sun`, `text-orchid`, `border-aqua`, `border-sky`, …

> `coral` is reserved for danger-adjacent meaning: a wrong quiz answer, a delete action. For
> any other secondary/emphasis use (a secondary button, an underline, a playful accent that
> isn't warning of anything), reach for `orchid` instead — it's the same visual weight without
> the negative connotation.

> **Bright accents are for fills and large elements, not small text.** Buttons use a bright
> fill with **dark ink on top** (e.g. ink on `sun`). Two hues carry a darker `-strong` step —
> `coral-strong`, `leaf-strong` — because the bright shade fails AA at text sizes; reach for
> them (via the semantic `--surface-danger` / `--surface-success`) whenever the hue is **small
> colored text or an icon**, not a fill.

## Tint scale (translucent fills)

Never hand-write a one-off opacity fraction on a color utility (`bg-sun/[37%]`, `bg-coral/8`,
…). Tint any token color by name, via Tailwind v4's CSS-variable opacity-modifier shorthand —
`bg-<color>/(--tint-<step>)` — referencing one of these three named steps in
[`styles/tokens.css`](../../../../styles/tokens.css):

| Step          | Value | Use                                                                    |
| ------------- | ----- | ---------------------------------------------------------------------- |
| `--tint-wash` | 10%   | Hover backgrounds, faint overlays (ghost button hover, list-row hover) |
| `--tint-soft` | 15%   | Secondary-emphasis fills (secondary button hover, quiz choice fill)    |
| `--tint-fill` | 20%   | Chip / marker / small-fill accents                                     |

```tsx
// ✅ named step — self-documenting, one place to retune the whole family
<span className="bg-sun/(--tint-fill)" />
// ❌ a bare number — no longer means anything, can't be told apart from a typo
<span className="bg-sun/20" />
```

These apply to any color utility — accents (`bg-sun/(--tint-fill)`), surface accents
(`bg-surface-accent/(--tint-wash)`), and ink (`bg-surface-ink/(--tint-wash)`) alike.
`npm run check:tint-scale` fails CI if a numeric opacity modifier sneaks back in on a token
color utility.

## Semantic

| Utility                       | Token → primitive                   | Meaning                                                                               |
| ----------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------- |
| `text-correct` / `bg-correct` | `--correct` → `leaf`                | Right answer — **fills / large**, always with ✓ icon + label                          |
| `text-retry` / `bg-retry`     | `--retry` → `coral`                 | Try-again — **fills / large** (e.g. QuizChoice); never "wrong"/red-scary; with ↻ icon |
| `text-surface-success`        | `--surface-success` → `leaf-strong` | Correct as **small text or icons** — AA-safe (bright leaf fails AA small)             |
| `text-surface-danger`         | `--surface-danger` → `coral-strong` | Try-again / error as **small text or icons** — AA-safe (bright coral fails AA small)  |
| `*-focus-ring`                | `--focus-ring` → `sun`              | High-contrast focus indicator (global ring already set)                               |

## Type

- Families: **one voice — Shantell Sans** (a legibility-tuned handwritten face) drives BOTH
  `font-display` and `font-body`. Lexend is only the fallback. Loaded via `next/font` in
  `app/layout.tsx`.
- Scale: `text-xs` `text-sm` `text-base` `text-lg` `text-xl` `text-2xl` `text-3xl`
  (0.875 → 3rem). Reading base bumps to 1.25rem at reading levels L1–L2.
- Reading rules (always on the paper surface): line-height 1.6, max ~62ch, generous
  paragraph spacing.

## Radius

Controls are **squared off** in the journal language (`rounded-[3px]`, framed by the
hand-drawn `.rt-inkbox` pen box). The soft radii — `rounded-sm` (12px) · `rounded-md` (20px)
· `rounded-lg` (28px) — remain for larger paper panels; `rounded-pill` (999px) survives only
for genuinely round bits (avatars, dots, progress tracks). Spacing uses Tailwind's default
4-based scale (`p-1`=4px … `p-16`=64px).
