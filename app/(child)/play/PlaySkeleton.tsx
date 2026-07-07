// A grid of placeholder map tiles, sized to match WorldMap's collapsed 6-tile,
// 2/3-column grid so the real tiles land where the skeletons were. Shared by the
// whole-route `loading.tsx` shell and the deferred-backfill "charting" state in
// ExploreEntry, so both read as the same map taking shape.
export function MapTilesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        // Square silhouettes — the faint shadow of a sticky note about to be
        // stuck onto the page (square corners + note drop shadow, no border).
        <div
          key={i}
          className="h-28 animate-pulse rounded-[1px] bg-surface-ink/(--tint-wash) shadow-[0_8px_18px_-9px_rgba(0,0,0,0.35)]"
        />
      ))}
    </div>
  );
}

// The play shell's loading placeholder: XP bar, a collapsed map grid, and the
// explore input, sized to match the real ExploreEntry so the swap doesn't jump.
// Used by this route's `loading.tsx` as the whole-route navigation fallback.
export function PlayShellSkeleton() {
  return (
    <div className="flex w-full flex-col gap-8" aria-busy="true">
      {/* XP bar — the level label is a marker swipe (squared); the track stays a
          round progress rail. */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="h-7 w-16 animate-pulse rounded-[2px] bg-surface-panel" />
        <div className="h-3 flex-1 animate-pulse rounded-pill bg-surface-panel" />
      </div>

      <MapTilesSkeleton />

      {/* Free-form explore input — squared to match the pen-box Input. */}
      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="h-4 w-32 animate-pulse rounded-[3px] bg-surface-panel" />
        <div className="h-14 w-full animate-pulse rounded-[3px] bg-surface-panel" />
        <div className="h-14 w-full animate-pulse rounded-[3px] bg-surface-panel" />
      </div>

      <span className="sr-only" role="status">
        Charting your map…
      </span>
    </div>
  );
}
