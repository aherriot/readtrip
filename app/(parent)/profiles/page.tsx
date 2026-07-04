import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { requireParent } from "@/lib/auth/session";
import { listChildren } from "@/lib/children/queries";
import { signOutAction } from "./actions";
import { ProfilesManager } from "./ProfilesManager";

export const metadata: Metadata = {
  title: "Explorers — ReadTrip",
};

export default async function ProfilesPage() {
  const parent = await requireParent();
  const profiles = await listChildren(parent.id);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Heading level={1}>Who&apos;s exploring?</Heading>
          <Text tone="soft">
            {profiles.length === 0
              ? "Add your first young explorer to get started."
              : "Pick a profile to start exploring, or add another."}
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button href="/dashboard" variant="ghost" size="md">
            Usage &amp; cost
          </Button>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="md">
              Sign out
              {parent.email && (
                <span className="hidden sm:inline"> ({parent.email})</span>
              )}
            </Button>
          </form>
        </div>
      </header>

      <ProfilesManager profiles={profiles} />
    </main>
  );
}
