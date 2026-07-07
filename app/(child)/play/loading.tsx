import { Wordmark } from "@/components/ui/Wordmark";
import { PlayShellSkeleton } from "./PlaySkeleton";

// Instant skeleton for /play. The route's render is a couple of fast DB reads
// (no model call — the suggestion backfill is deferred to the client), but
// without a loading boundary the router would still keep the *previous* page
// painted until that render resolves (the "frozen" feeling). This paints the
// map shell immediately and is swapped for the real page when ready.
export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center gap-6 p-6">
      <Wordmark className="h-9" />
      <PlayShellSkeleton />
    </main>
  );
}
