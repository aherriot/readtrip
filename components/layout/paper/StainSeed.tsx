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
 * stable pattern that changes when you navigate between routes.
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
 * The pathname fallback is deliberately NOT just the pathname: a fixed-forever
 * seed made the pattern feel too static — reloading /play or navigating back to
 * it always drew identical stains. So a random suffix is mixed in and
 * regenerated on every pathname change (including a full reload, which resets
 * the module-level cache below). It's still stable across ordinary re-renders
 * and state changes within one visit — only a *new visit* to the route reseeds
 * it.
 *
 * "New visit" has to be judged across component MOUNTS, not just renders, and
 * not just at the provider: every route with a `loading.tsx` mounts this
 * provider twice for one visit — once for the instant skeleton, again for the
 * real page once data resolves, as two unrelated trees (Next.js unmounts the
 * loading boundary and mounts the page). Worse, an async Server Component page
 * can re-suspend and show `loading.tsx` again *after* the initial mount too —
 * e.g. /play's `router.refresh()` once a deferred map-suggestion backfill
 * lands — remounting everything below it, including views like ExploreEntry
 * that register their own explicit seed. A `useState` initializer, anywhere in
 * that subtree, can't tell a within-visit remount apart from a genuine new
 * visit. So the per-visit random suffix is cached in module scope, outside
 * React state entirely, keyed by pathname, and handed out to any component
 * that asks via `useVisitSeed()` — it survives every remount those
 * server-driven suspensions cause, and only changes when the pathname itself
 * changes (a real navigation) or the module is torn down (a hard reload).
 *
 * Guarded to the client: during SSR this module can be shared across
 * concurrent requests from different users on a warm server, so a fresh value
 * is computed per render there instead of cached — the cache only kicks in
 * once code is running in a single user's browser tab.
 *
 * The nonce cache alone isn't the whole fix, though: that same remount
 * unregisters ExploreEntry's claimed seed for a tick before it re-registers
 * (its `useStainSeed` cleanup fires, then the effect re-runs) — and because the
 * loading.tsx reappearance remounts the *provider itself*, not just its
 * children, the provider's own React state (a `useRef`, a `useState`) resets
 * right along with it and can't remember what was registered a moment ago.
 * Left alone, the `seed` memo falls through to the bare pathname for that gap,
 * so the paper visibly flashes to the untagged pattern and back even though
 * the eventual seed value doesn't actually change. So the last real
 * (non-fallback) seed is tracked in this same module scope, keyed by
 * pathname — surviving the provider's own remount the same way the nonce
 * does — and the provider sticks with it across an empty registry instead of
 * dropping straight to `pathSeed`. It's cleared only when a genuine new visit
 * regenerates the nonce below (no view has claimed anything yet on a fresh
 * visit).
 */
const visitSuffixCache = new Map<string, string>();
const lastRealSeedCache = new Map<string, string>();
let lastSeededPathname: string | null = null;

function visitSuffixForPathname(pathname: string): string {
  if (typeof window === "undefined") return randomSeedSuffix();
  if (lastSeededPathname !== pathname || !visitSuffixCache.has(pathname)) {
    visitSuffixCache.set(pathname, randomSeedSuffix());
    lastSeededPathname = pathname;
    lastRealSeedCache.delete(pathname);
  }
  return visitSuffixCache.get(pathname)!;
}

function rememberRealSeed(pathname: string, seed: string): void {
  if (typeof window !== "undefined") lastRealSeedCache.set(pathname, seed);
}

function lastRealSeedForPathname(pathname: string): string | undefined {
  return typeof window === "undefined"
    ? undefined
    : lastRealSeedCache.get(pathname);
}

/**
 * A short random string for mixing into a seed so a fresh mount doesn't repeat
 * the last visit's pattern.
 */
export function randomSeedSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * The nonce for "this visit to this route" — stable across every within-visit
 * remount (loading↔ready swaps, a `router.refresh()`-triggered re-suspension),
 * fresh on a genuine new visit (a real navigation, or a hard reload). Views
 * that mix a random component into their own explicit seed — e.g. ExploreEntry's
 * `map:<nonce>:<expedition>`, which otherwise restarts at the same value on
 * every such remount — should use this instead of minting their own.
 */
export function useVisitSeed(): string {
  const pathname = usePathname();
  return visitSuffixForPathname(pathname);
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

  // The bare pathname, with no random suffix, for every render up through
  // hydration: the suffix is a `Math.random()` call, and computing it during
  // render would run independently on the server and on the client's first
  // (hydrating) render — two different values React would then need to
  // reconcile, flashing from one to the other. Deferred to the effect below
  // instead, so the server-rendered markup and the client's initial hydration
  // match exactly, and the upgrade to a seeded pattern happens as one
  // controlled post-mount transition rather than a hydration mismatch.
  const [pathSeed, setPathSeed] = useState(pathname);
  useEffect(() => {
    // The canonical hydration-mismatch-avoidance idiom (as used by e.g.
    // next-themes for client-only randomized/system values): this can't be
    // computed during render, on the server or the client's first pass,
    // without the two diverging — it has to land after the render that
    // matched SSR has already committed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPathSeed(`${pathname}:${visitSuffixForPathname(pathname)}`);
  }, [pathname]);

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
    // bare-pathname pattern for that gap; it only falls through to pathSeed if
    // no view has ever claimed one this visit.
    return lastRealSeedForPathname(pathname) ?? pathSeed;
  }, [entries, pathSeed, pathname]);

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
