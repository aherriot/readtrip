import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requireParent } from "@/lib/auth/session";
import { getChild, type ChildProfile } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { clampReadingLevel } from "@/lib/llm/prompts/readingLevel";
import { ensureSuggestions } from "@/lib/map/suggest";
import { ExploreEntry } from "./ExploreEntry";
import { PlayShellSkeleton } from "./PlaySkeleton";

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center gap-6 p-6">
      <span className="font-display text-lg font-semibold text-sun">
        ReadTrip
      </span>

      {/* The map depends on `ensureSuggestions`, which can make an LLM round-trip
          when the child's map has nothing suggested to tap. Stream it behind a
          boundary so the wordmark + shell paint immediately instead of the whole
          page waiting on the model. */}
      <Suspense fallback={<PlayShellSkeleton />}>
        <ExploreSection child={child} />
      </Suspense>
    </main>
  );
}

// Async boundary child: does the potentially-slow suggestion backfill, then
// hands the resolved map to the client island. Kept separate from PlayPage so
// only this part suspends.
async function ExploreSection({ child }: { child: ChildProfile }) {
  // The child's personalized world map. Backfills before reading if it has
  // nothing "suggested" to tap — a brand-new explorer, or one who's dismissed
  // or explored their way through everything offered so far — so the map is
  // never rendered empty.
  const nodes = await ensureSuggestions(
    child.id,
    clampReadingLevel(child.readingLevel)
  );

  return (
    <ExploreEntry
      initialNodes={nodes}
      childName={child.displayName}
      xp={child.xp}
    />
  );
}
