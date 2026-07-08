/**
 * Tiny deterministic PRNG used to turn a page's "identity" (a seed string like
 * `story:42`) into a stable-but-varied paper-stain layout. Same seed in → exact
 * same sequence out, so a page's stains are identical on every re-render and in
 * visual snapshots, yet a different seed gives a completely different pattern.
 *
 * `xmur3` hashes the seed string to a 32-bit integer; `mulberry32` turns that
 * into a fast, well-distributed stream of floats in [0, 1). Both are standard,
 * dependency-free, and deterministic across environments (server + browser).
 */

/** Hash a string to a 32-bit seed integer (xmur3). */
function xmur3(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** A seeded random-number generator: `rng()` → next float in [0, 1). */
export type Rng = () => number;

/** Build a deterministic RNG from a seed string. */
export function seededRng(seed: string): Rng {
  let a = xmur3(seed);
  return function mulberry32(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform float in [min, max). */
export function range(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

/** Integer in [min, max] inclusive. */
export function intRange(rng: Rng, min: number, max: number): number {
  return Math.floor(range(rng, min, max + 1));
}

/** Pick a random element from a non-empty array. */
export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}
