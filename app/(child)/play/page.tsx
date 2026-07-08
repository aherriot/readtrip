import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireParent } from "@/lib/auth/session";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { getChildMap } from "@/lib/map/queries";
import { Wordmark } from "@/components/ui/Wordmark";
import { JournalSheet } from "@/components/layout/JournalSheet";
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

  // Read the map directly — a fast DB read, never a model call. When it has
  // nothing "suggested" to tap (a brand-new explorer, or one who's dismissed or
  // explored everything offered so far), the client kicks off the LLM-backed
  // backfill *after* paint via /api/map/ensure and refreshes when it lands — so
  // /play's first paint never waits on an Anthropic round-trip. (The backfill
  // used to run inline here, blocking render behind the model.)
  const nodes = await getChildMap(child.id);
  const needsSuggestions = !nodes.some((n) => n.status === "suggested");

  return (
    <JournalSheet contentClassName="max-w-xl items-center gap-6">
      <Wordmark className="h-9" />

      <ExploreEntry
        initialNodes={nodes}
        needsSuggestions={needsSuggestions}
        childName={child.displayName}
        xp={child.xp}
      />
    </JournalSheet>
  );
}
