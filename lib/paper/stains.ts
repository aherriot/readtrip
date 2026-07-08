/**
 * Procedural coffee-stain / dirt-smudge generator for the journal page.
 *
 * Given a seed string (the page's identity — e.g. `map:2`, `story:42`), it
 * deterministically composes a layout of organic stains and returns a complete
 * SVG document as a string. `paperStainDataUri()` wraps that as a `data:` URI so
 * it can be dropped straight into `background-image`.
 *
 * Why a rasterized SVG *image* rather than inline SVG or a CSS filter: the
 * browser decodes a `background-image` once and caches it, so soft gradient
 * stains cost nothing per frame — the same reasoning behind the fiber-grain
 * tile. There is deliberately NO `filter: url(#…)` here; softness comes from
 * gradient stops, not a live blur.
 *
 * Determinism is the whole point: same seed → identical SVG string → identical
 * pixels. So a page's stains never change on re-render and are stable in visual
 * snapshots, while a new seed (a new story, quiz, or return to the map) yields a
 * fresh pattern. See lib/paper/prng.ts for the seeding.
 */
import { intRange, pick, range, seededRng, type Rng } from "./prng";

// The stain SVG is authored in a 0..100 square and stretched to the page box
// (preserveAspectRatio="none"), so shapes take on the page's portrait tallness —
// which reads as naturally as a real ring soaked into a tilted page.
const VIEW = 100;

/**
 * Baked stain hues (mirrors the warm palette primitives — coffee ≈ --cover).
 * They can't read CSS custom properties from inside a background-image, so the
 * values live here. Everything is painted with `mix-blend-mode: multiply`, so
 * these browns darken whatever paper tone sits beneath rather than needing to
 * match it exactly. Alpha is applied per stain.
 */
const HUE = {
  coffeeDeep: "111,74,43", // ring edges, droplets
  coffeeMid: "138,95,58", // blotch bodies
  tea: "156,122,68", // large soaked washes
  dirt: "92,81,69", // grey-brown smudges
} as const;

function rgba(rgb: string, alpha: number): string {
  return `rgba(${rgb},${alpha.toFixed(3)})`;
}

/**
 * A closed, smooth, irregular blob path centred at (cx,cy). `points` vertices
 * sit on a circle of radius `r`, each nudged in/out by up to `irregularity`, then
 * joined with a Catmull-Rom spline (converted to cubic béziers) so the outline is
 * organic but never kinked.
 */
function blobPath(
  rng: Rng,
  cx: number,
  cy: number,
  r: number,
  irregularity: number,
  points: number
): string {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2 + range(rng, -0.15, 0.15);
    const rad = r * (1 + range(rng, -irregularity, irregularity));
    pts.push([
      cx + Math.cos(a) * rad,
      cy + Math.sin(a) * rad * range(rng, 0.8, 1.15),
    ]);
  }
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d + "Z";
}

type Built = { defs: string; body: string };

/** A large, soft soaked area — the biggest, faintest stain on the page. */
function wash(rng: Rng, id: string, cx: number, cy: number): Built {
  const r = range(rng, 22, 34);
  const hue = pick(rng, [HUE.tea, HUE.coffeeMid]);
  const a = range(rng, 0.07, 0.12);
  const d = blobPath(rng, cx, cy, r, 0.34, 9);
  const defs = `<radialGradient id="${id}" cx="${range(rng, 35, 65).toFixed(0)}%" cy="${range(rng, 35, 65).toFixed(0)}%" r="65%">
      <stop offset="0%" stop-color="${rgba(hue, a)}"/>
      <stop offset="55%" stop-color="${rgba(hue, a * 0.7)}"/>
      <stop offset="100%" stop-color="${rgba(hue, 0)}"/>
    </radialGradient>`;
  return { defs, body: `<path d="${d}" fill="url(#${id})"/>` };
}

/** A coffee ring — dark irregular annulus, clear centre where the liquid dried. */
function ring(rng: Rng, id: string, cx: number, cy: number): Built {
  const r = range(rng, 9, 16);
  const a = range(rng, 0.16, 0.24);
  const d = blobPath(rng, cx, cy, r, 0.22, 10);
  const defs = `<radialGradient id="${id}" cx="50%" cy="50%" r="52%">
      <stop offset="0%" stop-color="${rgba(HUE.coffeeDeep, 0)}"/>
      <stop offset="62%" stop-color="${rgba(HUE.coffeeDeep, a * 0.35)}"/>
      <stop offset="82%" stop-color="${rgba(HUE.coffeeDeep, a)}"/>
      <stop offset="100%" stop-color="${rgba(HUE.coffeeDeep, 0)}"/>
    </radialGradient>`;
  return { defs, body: `<path d="${d}" fill="url(#${id})"/>` };
}

/** A filled smudge — denser to one side, like a soak that pooled unevenly. */
function blotch(rng: Rng, id: string, cx: number, cy: number): Built {
  const r = range(rng, 7, 13);
  const hue = pick(rng, [HUE.coffeeMid, HUE.dirt]);
  const a = range(rng, 0.1, 0.16);
  const d = blobPath(rng, cx, cy, r, 0.3, 8);
  const defs = `<radialGradient id="${id}" cx="${intRange(rng, 30, 70)}%" cy="${intRange(rng, 30, 70)}%" r="70%">
      <stop offset="0%" stop-color="${rgba(hue, a)}"/>
      <stop offset="70%" stop-color="${rgba(hue, a * 0.55)}"/>
      <stop offset="100%" stop-color="${rgba(hue, 0)}"/>
    </radialGradient>`;
  return { defs, body: `<path d="${d}" fill="url(#${id})"/>` };
}

/** A small, darker splatter dot. */
function droplet(rng: Rng, cx: number, cy: number): Built {
  const r = range(rng, 0.8, 2.6);
  const a = range(rng, 0.14, 0.24);
  const d = blobPath(rng, cx, cy, r, 0.4, 6);
  return {
    defs: "",
    body: `<path d="${d}" fill="${rgba(HUE.coffeeDeep, a)}"/>`,
  };
}

/** Build the full stain SVG for a seed. */
export function paperStainSvg(seed: string): string {
  const rng = seededRng(seed);
  const defs: string[] = [];
  const body: string[] = [];
  let n = 0;
  const add = (b: Built) => {
    if (b.defs) defs.push(b.defs);
    body.push(b.body);
  };

  // Big stains hug the left/right outer thirds so the central writing column
  // stays legible — and it mirrors how the reference notebook is stained down
  // its margins.
  const edge = () => (rng() < 0.5 ? range(rng, 4, 30) : range(rng, 70, 96));

  // One large soaked wash anchored to a margin.
  add(wash(rng, `w${n++}`, edge(), range(rng, 12, 88)));

  // 0–2 coffee rings.
  for (let i = 0, c = intRange(rng, 0, 2); i < c; i++) {
    add(ring(rng, `r${n++}`, edge(), range(rng, 10, 90)));
  }

  // 1–2 uneven blotches.
  for (let i = 0, c = intRange(rng, 1, 2); i < c; i++) {
    add(blotch(rng, `b${n++}`, edge(), range(rng, 8, 92)));
  }

  // A scatter of small droplets, loosely clustered around one anchor so they
  // read as a splash rather than confetti.
  const ax = edge();
  const ay = range(rng, 10, 90);
  for (let i = 0, c = intRange(rng, 3, 6); i < c; i++) {
    add(droplet(rng, ax + range(rng, -14, 14), ay + range(rng, -18, 18)));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}" preserveAspectRatio="none"><defs>${defs.join("")}</defs>${body.join("")}</svg>`;
}

/** The stain SVG for a seed, ready to drop into `background-image`. */
export function paperStainDataUri(seed: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(paperStainSvg(seed))}")`;
}
