import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireParent } from "@/lib/auth/session";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { SUGGESTED_TOPICS } from "@/lib/explore/topics";
import { getChildMap, getDismissedTopicSlugs } from "@/lib/map/queries";
import type { MapNodeView } from "@/lib/map/nodeState";
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
  // A dismissed curated starter must stay gone everywhere, not just off the
  // map — otherwise it'd simply resurface in the "something new" chips, or
  // (see below) get reseeded as if the child were brand-new.
  const dismissedSlugs = await getDismissedTopicSlugs(child.id);
  // "Brand new" means no map rows at all — not just none *displayed*. A child
  // who dismissed every seeded starter still has rows (they're just hidden),
  // so this must not fall back to reseeding the very topics they removed.
  const isNewExplorer = stored.length === 0 && dismissedSlugs.length === 0;
  const nodes: MapNodeView[] = isNewExplorer
    ? SUGGESTED_TOPICS.map((t) => ({
        topicSlug: t.topicSlug,
        title: t.title,
        status: "suggested",
        mastered: false,
        kind: "diverse",
      }))
    : stored;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center gap-6 p-6">
      <span className="font-display text-lg font-semibold text-sun">
        ReadTrip
      </span>

      <ExploreEntry
        initialNodes={nodes}
        dismissedSlugs={dismissedSlugs}
        childName={child.displayName}
      />
    </main>
  );
}
