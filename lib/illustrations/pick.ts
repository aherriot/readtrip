import {
  ILLUSTRATION_NAMES,
  type IllustrationName,
} from "@/components/ui/illustrations/catalog";

/**
 * Pick `count` distinct illustration names at random. Reads only the
 * SVG-import-free `catalog.ts` names list, so calling this doesn't pull any
 * illustration chunk into the caller's bundle — the actual chunk only loads
 * once a `<Illustration name>` for the picked name is rendered.
 *
 * Callers on a per-request-dynamic route (anything behind auth, which reads
 * cookies() and so already opts out of static rendering) get a fresh pick
 * every load for free. Callers in a client component should memoize the
 * result (e.g. `useMemo(() => pickRandomIllustrations(2), [])`) so the pick
 * doesn't reshuffle on every re-render.
 */
export function pickRandomIllustrations(count: number): IllustrationName[] {
  const pool = [...ILLUSTRATION_NAMES];
  const picked: IllustrationName[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}
