import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { requireParent } from "@/lib/auth/session";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { SUGGESTED_TOPICS } from "@/lib/explore/topics";
import { getChildMap } from "@/lib/map/queries";
import type { MapNodeView } from "@/lib/map/nodeState";
import { switchProfileAction } from "@/app/(parent)/profiles/actions";
import { ExploreEntry } from "./ExploreEntry";

export const metadata: Metadata = {
  title: "Your expedition — ReadTrip",
};

export default async function PlayPage() {
  const parent = await requireParent();
  const childId = await getSelectedChildId();
  if (!childId) redirect("/profiles");

  // Scope to the parent so a stale/foreign cookie can't load someone else's
  // child. If it no longer resolves, send them back to pick a profile. (We can't
  // clear the cookie during render — only "Switch profile" / sign-out do that.)
  const child = await getChild(parent.id, childId);
  if (!child) redirect("/profiles");

  // First run: find the child's reading level before the expedition starts.
  if (!child.calibratedAt) redirect("/play/calibrate");

  // The child's personalized world map. A brand-new explorer has no nodes yet,
  // so seed the display with the curated starters as "suggested" — the same
  // concepts they resolve to, giving the map somewhere to begin.
  const stored = await getChildMap(child.id);
  const nodes: MapNodeView[] =
    stored.length > 0
      ? stored
      : SUGGESTED_TOPICS.map((t) => ({
          topicSlug: t.topicSlug,
          title: t.title,
          status: "suggested",
          mastered: false,
        }));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Heading level={1}>Hi, {child.displayName}! Where to today?</Heading>
        <Text tone="soft" measure>
          Type anything you&apos;re curious about, or tap a spot on your map.
        </Text>
      </div>

      <ExploreEntry initialNodes={nodes} />

      <form action={switchProfileAction}>
        <Button type="submit" variant="ghost" size="md">
          Not you? Switch explorer
        </Button>
      </form>
    </main>
  );
}
