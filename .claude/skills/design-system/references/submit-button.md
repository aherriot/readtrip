# SubmitButton

A thin wrapper over [`Button`](button.md) that submits its enclosing `<form>`
and reflects that form's **pending** state. While the form's action is in
flight it shows the `Button` loading spinner and goes inert.

## When to use

- Any `<form action={…}>` whose submit takes a server round-trip or triggers a
  navigation (a server action, a redirect). The pending spinner gives the tap
  immediate feedback instead of the control looking frozen until the response or
  the next page arrives — and, because the button is inert while pending, it
  can't be double-fired.
- Reach for it in place of a plain `<Button type="submit">` inside a `<form>`.

## When _not_ to use

- Buttons that aren't form submits (use `Button` with `onClick`).
- A form submitted through `useActionState` where you already track `pending`
  yourself and pass it to `Button`'s `loading` — either works; `SubmitButton`
  just saves you wiring `useFormStatus` by hand.
- Outside a `<form>`: `useFormStatus` reads the nearest parent form, so with no
  form the pending state is always `false` and it behaves like a normal submit
  button.

## API

Takes every [`Button`](button.md) prop **except** `type` (always `"submit"`).
An explicit `loading` is OR-ed with the form's own pending state, so you can
still force a spinner. `variant`, `size`, `fullWidth`, `className`, and children
pass straight through to `Button`.

```tsx
<form action={selectChildAction}>
  <input type="hidden" name="childId" value={child.id} />
  <SubmitButton variant="ghost" fullWidth>
    {child.displayName}
  </SubmitButton>
</form>
```

## Accessibility

Inherits every guarantee from [`Button`](button.md): a real `<button>`, keyboard
operable, visible focus ring, kid-sized target by default. While pending it sets
`aria-busy` and stays disabled (label text is kept so a screen reader still reads
what the control is). It must live inside the `<form>` it submits — that's also
where `useFormStatus` gets its signal.
