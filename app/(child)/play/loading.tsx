import { PlayShellSkeleton } from "./PlaySkeleton";

// Instant skeleton for /play. This route's render calls `ensureSuggestions`,
// which for a brand-new or freshly-emptied map makes a synchronous LLM
// round-trip — several seconds during which, without a loading boundary, the
// router would keep the *previous* page painted (the "frozen" feeling). This
// paints the map shell immediately and is swapped for the real page when ready.
export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center gap-6 p-6">
      <span className="font-display text-lg font-semibold text-sun">
        ReadTrip
      </span>
      <PlayShellSkeleton />
    </main>
  );
}
