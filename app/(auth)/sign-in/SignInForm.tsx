"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import {
  devSignInAction,
  sendMagicLinkAction,
  type SignInState,
} from "./actions";

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text role="alert" size="sm" className="text-surface-danger">
      {message}
    </Text>
  );
}

export function SignInForm({ devEnabled }: { devEnabled: boolean }) {
  const [magicState, magicAction, magicPending] = useActionState<
    SignInState,
    FormData
  >(sendMagicLinkAction, null);
  const [devState, devAction, devPending] = useActionState<
    SignInState,
    FormData
  >(devSignInAction, null);

  return (
    <div className="flex flex-col gap-6">
      <form action={magicAction} className="flex flex-col gap-4">
        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          hint="We'll email you a link to sign in — no password needed."
        />
        <FormError message={magicState?.error} />
        <Button type="submit" fullWidth disabled={magicPending}>
          {magicPending ? "Sending…" : "Email me a sign-in link"}
        </Button>
      </form>

      {devEnabled && (
        <div className="flex flex-col gap-4 border-t border-surface-rule pt-6">
          <Text size="sm" tone="soft">
            Dev sign-in (local only) — skip the email round-trip.
          </Text>
          <form action={devAction} className="flex flex-col gap-4">
            <Input
              label="Email"
              name="email"
              type="email"
              size="md"
              autoComplete="email"
              required
              placeholder="parent@example.com"
            />
            <Input
              label="Name (optional)"
              name="name"
              type="text"
              size="md"
              autoComplete="name"
              placeholder="Alex"
            />
            <FormError message={devState?.error} />
            <Button
              type="submit"
              variant="secondary"
              size="md"
              fullWidth
              disabled={devPending}
            >
              {devPending ? "Signing in…" : "Dev sign-in"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
