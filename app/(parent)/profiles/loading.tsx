import { Card } from "@/components/ui/Card";

// Instant skeleton for /profiles. Without a loading boundary the router keeps
// the *previous* page painted until this route's server render (auth session +
// listChildren) finishes — so navigation looks frozen. This paints immediately
// and is swapped for the real page the moment it's ready.
export default function Loading() {
  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 p-6"
      aria-busy="true"
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div
            aria-hidden="true"
            className="h-8 w-56 animate-pulse rounded-[3px] bg-surface-panel"
          />
          <div
            aria-hidden="true"
            className="h-4 w-72 animate-pulse rounded-[3px] bg-surface-panel"
          />
        </div>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
            <Card
              elevated
              className="flex h-full min-h-[140px] flex-col items-center justify-center gap-3"
            >
              <div
                aria-hidden="true"
                className="h-16 w-16 animate-pulse rounded-full bg-surface-rule"
              />
              <div
                aria-hidden="true"
                className="h-5 w-24 animate-pulse rounded-[3px] bg-surface-rule"
              />
              <div
                aria-hidden="true"
                className="h-4 w-32 animate-pulse rounded-[3px] bg-surface-rule"
              />
            </Card>
          </li>
        ))}
      </ul>

      <span className="sr-only" role="status">
        Loading explorers…
      </span>
    </main>
  );
}
