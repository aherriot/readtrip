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
 * "New visit" has to be judged across component MOUNTS, not just renders:
 * every route with a `loading.tsx` mounts this provider twice for one visit —
 * once for the instant skeleton, again for the real page once data resolves,
 * as two unrelated trees (Next.js unmounts the loading boundary and mounts the
 * page). A `useState` initializer alone can't tell those apart from a genuine
 * new visit, so the last-seeded pathname is cached in module scope, outside
 * React state, and survives that skeleton→ready swap.
 */
const pathSeedCache = new Map<string, string>();
let lastSeededPathname: string | null = null;

function seedForPathname(pathname: string): string {
  if (lastSeededPathname !== pathname || !pathSeedCache.has(pathname)) {
    pathSeedCache.set(pathname, `${pathname}:${randomSeedSuffix()}`);
    lastSeededPathname = pathname;
  }
  return pathSeedCache.get(pathname)!;
}
/**
 * A short random string for mixing into a seed so a fresh mount doesn't repeat
 * the last visit's pattern. Exported for views like ExploreEntry's world map,
 * whose explicit seed (`map:<expedition>`) otherwise starts from the same
 * `map:0` on every remount (a reload, or navigating back to /play).
 */
export function randomSeedSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
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

  // Fresh random suffix per visit to a pathname — not per mount. Regenerated
  // whenever the pathname actually changes (React's "adjust state during
  // render" pattern), via the module-level cache above so the loading.tsx →
  // page.tsx remount doesn't look like a new visit.
  const [pathSeed, setPathSeed] = useState(() => seedForPathname(pathname));
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setPathSeed(seedForPathname(pathname));
  }

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
    return best?.seed ?? pathSeed;
  }, [entries, pathSeed]);

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
