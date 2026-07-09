import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { Illustration } from "@/components/ui/illustrations/Illustration";
import { JournalSheet } from "@/components/layout/JournalSheet";
import { requireParent } from "@/lib/auth/session";
import { listChildren } from "@/lib/children/queries";
import { pickRandomIllustrations } from "@/lib/illustrations/pick";
import { signOutAction } from "./actions";
import { ProfilesManager } from "./ProfilesManager";

export const metadata: Metadata = {
  title: "Explorers — ReadTrip",
};

// A hand-drawn "link" affordance: a wavy pen underline in the surface accent, so
// a quiet ghost action still reads as obviously tappable without a heavy button.
const JOURNAL_LINK =
  "underline decoration-surface-accent decoration-wavy decoration-2 underline-offset-4";

export default async function ProfilesPage() {
  const parent = await requireParent();
  const profiles = await listChildren(parent.id);
  // A fresh pick every load — this route reads cookies() via requireParent(),
  // which already opts it out of static rendering.
  const [headerIllustration] = pickRandomIllustrations(1);

  return (
    <JournalSheet contentClassName="max-w-2xl gap-8">
      <header className="flex items-center gap-4">
        <Illustration name={headerIllustration} size="md" decorative />
        <div className="flex flex-col gap-1">
          <Heading level={1}>Who&apos;s exploring?</Heading>
          <Text tone="soft">
            {profiles.length === 0
              ? "Add your first young explorer to get started."
              : "Pick a profile to start exploring, or add another."}
          </Text>
        </div>
      </header>

      <ProfilesManager profiles={profiles} />

      {/* Secondary account actions live at the foot of the page — a wavy pen
          underline marks them as hand-written but plainly tappable links. */}
      <footer className="mt-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-surface-rule pt-6">
        <Button
          href="/dashboard"
          variant="ghost"
          size="md"
          className={JOURNAL_LINK}
          trailingIcon={<Icon name="arrow-right" decorative size="sm" />}
        >
          Usage &amp; cost
        </Button>
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="md"
            className={JOURNAL_LINK}
          >
            Sign out
            {parent.email && (
              <span className="hidden sm:inline"> ({parent.email})</span>
            )}
          </Button>
        </form>
      </footer>
    </JournalSheet>
  );
}
