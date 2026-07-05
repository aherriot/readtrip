"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./Button";

/**
 * A submit `<button>` that reflects its enclosing `<form>`'s pending state.
 * While the form's action is in flight it shows `Button`'s loading spinner and
 * goes inert — so a tap gives immediate feedback (and can't be double-fired)
 * instead of the control looking frozen until the server responds or the page
 * navigates. Reach for it on any `<form action={…}>` whose submit either takes
 * a server round-trip or triggers a navigation.
 *
 * Must be rendered **inside** the `<form>` it tracks: `useFormStatus` reads the
 * nearest parent form. Outside a form it's just a normal submit button (pending
 * is always false).
 *
 * Takes every `Button` prop except `type` (always "submit"); an explicit
 * `loading` is OR-ed with the form's own pending state.
 *
 * Usage guidance: .claude/skills/design-system/references/submit-button.md
 */
export function SubmitButton({ loading, ...props }: Omit<ButtonProps, "type">) {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={loading || pending} {...props} />;
}
