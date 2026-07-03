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

## Surface-aware color utilities (prefer these)

These re-resolve automatically under `data-surface="night|paper"`.

| Utility                 | Token                | Use                                                  |
| ----------------------- | -------------------- | ---------------------------------------------------- |
| `bg-surface`            | `--surface-bg`       | Page / region background                             |
| `bg-surface-panel`      | `--surface-panel`    | Cards, inputs, panels                                |
| `text-surface-ink`      | `--surface-ink`      | Body text                                            |
| `text-surface-ink-soft` | `--surface-ink-soft` | Secondary text, hints, placeholders                  |
| `border-surface-rule`   | `--surface-rule`     | Hairlines, dividers, input borders                   |
| `*-surface-accent`      | `--surface-accent`   | The surface's accent (aqua on night, berry on paper) |

`--surface-elevation` is a CSS var (glow on night, soft shadow on paper) — use as
`boxShadow: "var(--surface-elevation)"` or an arbitrary utility.

## Accent palette (surface-independent)

`sun` (primary/XP), `berry` (secondary / playful), `coral` (wrong answer, delete — **not** a
plain secondary color; it reads as an alarm/negative), `aqua` (discovery / "deep"
suggestions), `leaf` (success), `violet` (magic / "new" breadth), `sky` (in-progress /
"exploring" tiles) → utilities `bg-sun`, `text-berry`, `border-aqua`, `border-sky`, …

> `coral` is reserved for danger-adjacent meaning: a wrong quiz answer, a delete action. For
> any other secondary/emphasis use (a secondary button, an underline, a playful accent that
> isn't warning of anything), reach for `berry` instead — it's the same visual weight without
> the negative connotation.

> Bright accents are for **fills and large elements**, not small text. Buttons use a bright
> fill with **dark ink on top** (e.g. ink on `sun`).

## Tint scale (translucent fills)

Never hand-write a one-off opacity fraction on a color utility (`bg-sun/[37%]`, `bg-coral/8`,
…). Tint any token color by name, via Tailwind v4's CSS-variable opacity-modifier shorthand —
`bg-<color>/(--tint-<step>)` — referencing one of these three named steps in
[`styles/tokens.css`](../../../../styles/tokens.css):

| Step          | Value | Use                                                                    |
| ------------- | ----- | ---------------------------------------------------------------------- |
| `--tint-wash` | 10%   | Hover backgrounds, faint overlays (ghost button hover, list-row hover) |
| `--tint-soft` | 15%   | Secondary-emphasis fills (secondary button hover, quiz choice fill)    |
| `--tint-fill` | 20%   | Badge/chip/pill fills                                                  |

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

| Utility                       | Token              | Meaning                                                                                         |
| ----------------------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `text-correct` / `bg-correct` | `--correct` (leaf) | Right answer — always with ✓ icon + label                                                       |
| `text-retry` / `bg-retry`     | `--retry` (coral)  | Try-again **fills / large elements** (e.g. QuizChoice); never "wrong"/red-scary; with ↻ icon    |
| `text-surface-danger`         | `--surface-danger` | Try-again / error as **small text or icons** — contrast-safe per surface (coral fails AA small) |
| `*-focus-ring`                | `--focus-ring`     | High-contrast focus indicator (global ring already set)                                         |

## Type

- Families: `font-display` (Fredoka — headings, topic titles, big numbers, buttons),
  `font-body` (Lexend — all reading + UI body). Loaded via `next/font` in `app/layout.tsx`.
- Scale: `text-xs` `text-sm` `text-base` `text-lg` `text-xl` `text-2xl` `text-3xl`
  (0.875 → 3rem). Reading base bumps to 1.25rem at reading levels L1–L2.
- Reading rules (always on the paper surface): line-height 1.6, max ~62ch, generous
  paragraph spacing.

## Radius

`rounded-sm` (12px) · `rounded-md` (20px) · `rounded-lg` (28px) · `rounded-pill` (999px,
buttons). Spacing uses Tailwind's default 4-based scale (`p-1`=4px … `p-16`=64px), which
already matches the design system.
