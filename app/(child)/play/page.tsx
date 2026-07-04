import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireParent } from "@/lib/auth/session";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { clampReadingLevel } from "@/lib/llm/prompts/readingLevel";
import { ensureSuggestions } from "@/lib/map/suggest";
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

  // The child's personalized world map. Backfills before reading if it has
  // nothing "suggested" to tap — a brand-new explorer, or one who's dismissed
  // or explored their way through everything offered so far — so the map is
  // never rendered empty.
  const nodes = await ensureSuggestions(
    child.id,
    clampReadingLevel(child.readingLevel)
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center gap-6 p-6">
      <span className="font-display text-lg font-semibold text-sun">
        ReadTrip
      </span>

      <ExploreEntry initialNodes={nodes} childName={child.displayName} />
    </main>
  );
}
