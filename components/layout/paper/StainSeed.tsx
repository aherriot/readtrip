"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

/**
 * Supplies the seed that <PaperStains> uses to lay out the journal page's
 * coffee-stains. By default the seed is the URL path, so ordinary pages get a
 * stable pattern that changes when you navigate between routes — and only
 * then. Nothing here is randomized: a per-visit random suffix was tried (to
 * make reloading /play or returning to it draw a fresh pattern instead of the
 * identical one every time) and had to be pulled back out — a client-only
 * random value can't be embedded in the server-rendered HTML, so the browser
 * necessarily paints one value first and then swaps to another once
 * JavaScript runs, on *every* page, every load, even ones with no other stain
 * activity (the plain marketing/profile pages included). That's a real,
 * guaranteed change during load, which is exactly what this seed exists to
 * avoid — so the pattern is deterministic from the pathname alone instead.
 *
 * The catch: the whole /play expedition (world map → story → quiz → map) is a
 * single route whose view is swapped by client state, so the pathname never
 * changes there. `useStainSeed(seed)` lets the view machine push a per-view seed
 * (`story:<slug>`, `quiz:<slug>`, `map:<n>`) so the paper re-stains on each
 * in-app transition.
 *
 * Views nest (LessonReader renders inside ExploreEntry), and either may set the
 * seed, so the context is a small registry rather than one slot: the
 * MOST-RECENTLY-SET view wins. That makes the outcome independent of React's
 * child-before-parent effect ordering — when LessonReader takes over it wins;
 * when it unmounts, ExploreEntry's map seed is what's left.
 *
 * A view's seed is claimed via an effect (registration has to happen through
 * context, since a child like ExploreEntry can't otherwise reach the sibling
 * <PaperStains> that a shared parent renders), so there's one unavoidable gap
 * on first mount, before any view has registered anything: the initial paint
 * (both the server-rendered HTML and the client's first hydrating render) can
 * only show the pathname fallback, and the seed then updates once a view
 * claims it a moment later. That's an existing effect-timing constraint of
 * the registry design, not something to route around here.
 *
 * What *is* fixed here: an async Server Component page (e.g. /play) can
 * re-suspend and show `loading.tsx` again well after the initial mount — e.g.
 * /play's `router.refresh()` once a deferred map-suggestion backfill lands —
 * which remounts this whole provider, not just its children. That drops
 * ExploreEntry's claimed seed out of the registry for a tick (its
 * `useStainSeed` cleanup fires, then the effect re-registers), and since the
 * remount resets the provider's own React state too, there's nothing left
 * to remember what was registered a moment ago — the `seed` memo would fall
 * through to the bare pathname for that gap, flashing to the untagged pattern
 * and back even though the eventual value doesn't change. So the last real
 * (non-fallback) seed is tracked in module scope, outside React state
 * entirely, keyed by pathname so it survives the provider's own remount; the
 * provider sticks with it across an empty registry instead of dropping
 * straight to the pathname. It's cleared only on a genuine new visit (see
 * `visitedPathnames` below).
 */
const lastRealSeedCache = new Map<string, string>();
const visitedPathnames = new Set<string>();

function rememberRealSeed(pathname: string, seed: string): void {
  if (typeof window === "undefined") return;
  if (!visitedPathnames.has(pathname)) {
    visitedPathnames.add(pathname);
    lastRealSeedCache.delete(pathname);
  }
  lastRealSeedCache.set(pathname, seed);
}

function lastRealSeedForPathname(pathname: string): string | undefined {
  return typeof window === "undefined"
    ? undefined
    : lastRealSeedCache.get(pathname);
}

type Registry = {
  register: (id: string, seed: string | null) => void;
  seed: string;
};

const StainSeedContext = createContext<Registry | null>(null);

export function StainSeedProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [entries, setEntries] = useState<
    Map<string, { seed: string; order: number }>
  >(new Map());
  const orderRef = useRef(0);

  const register = useCallback((id: string, seed: string | null) => {
    setEntries((prev) => {
      const next = new Map(prev);
      if (seed == null) next.delete(id);
      else next.set(id, { seed, order: ++orderRef.current });
      return next;
    });
  }, []);

  // The winner is whichever view set its seed most recently; with none active
  // (ordinary pages) we fall back to the pathname.
  const seed = useMemo(() => {
    let best: { seed: string; order: number } | null = null;
    for (const entry of entries.values()) {
      if (!best || entry.order > best.order) best = entry;
    }
    if (best) {
      rememberRealSeed(pathname, best.seed);
      return best.seed;
    }
    // No view currently claims a seed. This isn't necessarily "no view is
    // active" — a view can be mid-remount for a tick (its cleanup unregisters,
    // then it re-registers) without the pathname changing, e.g. /play's
    // router.refresh() re-suspending the route once the deferred map-suggestion
    // backfill lands, which remounts this whole provider too. Sticking with the
    // last real seed (tracked in module scope so it survives that remount)
    // rather than the raw pathname avoids a visible flash back to the
    // bare-pathname pattern for that gap; it only falls through to the
    // pathname if no view has ever claimed one this visit.
    return lastRealSeedForPathname(pathname) ?? pathname;
  }, [entries, pathname]);

  const value = useMemo(() => ({ register, seed }), [register, seed]);
  return (
    <StainSeedContext.Provider value={value}>
      {children}
    </StainSeedContext.Provider>
  );
}

/** Read the current stain seed (falls back to the pathname). */
export function useStainSeedValue(): string {
  return useContext(StainSeedContext)?.seed ?? "";
}

/**
 * Declare the stain seed for the current in-app view. Pass the identity of what
 * the child is looking at (`story:<slug>`, `quiz:<slug>`, `map:<n>`), or `null`
 * to bow out (e.g. a parent view that has handed off to a child). The paper
 * re-stains when the value changes and the claim is released on unmount.
 */
export function useStainSeed(seed: string | null): void {
  const ctx = useContext(StainSeedContext);
  const register = ctx?.register;
  const id = useId();
  useEffect(() => {
    if (!register) return;
    register(id, seed);
    return () => register(id, null);
  }, [id, seed, register]);
}
