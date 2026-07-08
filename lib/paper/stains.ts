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
 * The tile is a square that tiles *vertically* (`background-repeat: repeat-y`,
 * `background-size: 100% auto`) so stains keep a fixed physical size and simply
 * recur down a page of any length — they never stretch when the lesson grows.
 * Every shape that reaches past the top or bottom edge is redrawn wrapped to the
 * opposite edge, so the vertical seam is invisible.
 *
 * Determinism is the whole point: same seed → identical SVG string → identical
 * pixels. So a page's stains never change on re-render and are stable in visual
 * snapshots, while a new seed (a new story, quiz, or return to the map) yields a
 * fresh pattern. See lib/paper/prng.ts for the seeding.
 */
import { intRange, pick, range, seededRng, type Rng } from "./prng";

// The tile is authored in a square and tiled vertically. Shapes may bleed off
// the left/right edges (clipped by the sheet); anything crossing the top/bottom
// is wrapped to the far edge so repeat-y is seamless.
const VIEW = 100;
const TAU = Math.PI * 2;

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
 * A closed, smooth, *amorphous* blob outline centred at (cx,cy). Rather than a
 * jittered circle (which still reads as a circle), the radius is modulated by a
 * couple of low-frequency lobes plus fine noise, and the whole shape is squashed
 * on an arbitrary axis — so outlines come out lopsided and organic, like liquid
 * that crept unevenly across the page, not a coffee ring.
 *
 * The vertices are joined with a Catmull-Rom spline (converted to cubic béziers)
 * so the outline stays smooth and never kinks.
 */
function blobPath(
  rng: Rng,
  cx: number,
  cy: number,
  r: number,
  opts: { irregularity?: number; points?: number } = {}
): string {
  const points = opts.points ?? intRange(rng, 11, 15);
  const irregularity = opts.irregularity ?? 0.32;
  // Directional squash so the blob isn't radially symmetric.
  const sx = range(rng, 0.72, 1.28);
  const sy = range(rng, 0.72, 1.28);
  // Two low-frequency lobes give the big, soft bulges; fine jitter roughens it.
  const k1 = pick(rng, [2, 3]);
  const a1 = range(rng, 0.18, 0.42) * irregularity * 3;
  const p1 = range(rng, 0, TAU);
  const k2 = pick(rng, [3, 4, 5]);
  const a2 = range(rng, 0.08, 0.22) * irregularity * 3;
  const p2 = range(rng, 0, TAU);
  const jitter = irregularity * 0.45;

  const pts: Array<[number, number]> = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * TAU;
    let rad =
      r *
      (1 +
        a1 * Math.sin(k1 * a + p1) +
        a2 * Math.sin(k2 * a + p2) +
        range(rng, -jitter, jitter));
    rad = Math.max(rad, r * 0.22);
    pts.push([cx + Math.cos(a) * rad * sx, cy + Math.sin(a) * rad * sy]);
  }

  const n = pts.length;
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1v = pts[i];
    const p2v = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1v[0] + (p2v[0] - p0[0]) / 6;
    const c1y = p1v[1] + (p2v[1] - p0[1]) / 6;
    const c2x = p2v[0] - (p3[0] - p1v[0]) / 6;
    const c2y = p2v[1] - (p3[1] - p1v[1]) / 6;
    d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2v[0].toFixed(2)},${p2v[1].toFixed(2)}`;
  }
  return d + "Z";
}

/**
 * The set of y-centres to draw a shape at so it tiles seamlessly under repeat-y.
 * If the shape (centre `cy`, vertical `reach`) pokes past an edge, it's also
 * drawn wrapped to the opposite edge, so what leaves the bottom re-enters the top.
 */
function wrapY(cy: number, reach: number): number[] {
  const ys = [cy];
  if (cy - reach < 0) ys.push(cy + VIEW);
  if (cy + reach > VIEW) ys.push(cy - VIEW);
  return ys;
}

type Built = { defs: string; body: string };

/** Emit one blob (with its wrapped copies) sharing a single gradient fill. */
function blobLayer(
  rng: Rng,
  id: string,
  cx: number,
  cy: number,
  r: number,
  reach: number,
  irregularity: number,
  points: number,
  defs: string
): Built {
  const body = wrapY(cy, reach)
    .map(
      (y) =>
        `<path d="${blobPath(rng, cx, y, r, { irregularity, points })}" fill="url(#${id})"/>`
    )
    .join("");
  return { defs, body };
}

/** A large, soft soaked area — the biggest, faintest stain on the tile. */
function wash(rng: Rng, id: string, cx: number, cy: number): Built {
  const r = range(rng, 20, 30);
  const hue = pick(rng, [HUE.tea, HUE.coffeeMid]);
  const a = range(rng, 0.07, 0.12);
  const defs = `<radialGradient id="${id}" cx="${range(rng, 35, 65).toFixed(0)}%" cy="${range(rng, 35, 65).toFixed(0)}%" r="66%">
      <stop offset="0%" stop-color="${rgba(hue, a)}"/>
      <stop offset="55%" stop-color="${rgba(hue, a * 0.7)}"/>
      <stop offset="100%" stop-color="${rgba(hue, 0)}"/>
    </radialGradient>`;
  return blobLayer(
    rng,
    id,
    cx,
    cy,
    r,
    r * 1.7,
    0.44,
    intRange(rng, 12, 16),
    defs
  );
}

/**
 * A soaked-in pool with a slightly darker, uneven rim — the ghost of a coffee
 * ring, but broken and lopsided rather than a clean annulus.
 */
function ring(rng: Rng, id: string, cx: number, cy: number): Built {
  const r = range(rng, 9, 15);
  const a = range(rng, 0.13, 0.2);
  const defs = `<radialGradient id="${id}" cx="${intRange(rng, 40, 60)}%" cy="${intRange(rng, 40, 60)}%" r="58%">
      <stop offset="0%" stop-color="${rgba(HUE.coffeeDeep, a * 0.12)}"/>
      <stop offset="58%" stop-color="${rgba(HUE.coffeeDeep, a * 0.3)}"/>
      <stop offset="84%" stop-color="${rgba(HUE.coffeeDeep, a)}"/>
      <stop offset="100%" stop-color="${rgba(HUE.coffeeDeep, 0)}"/>
    </radialGradient>`;
  return blobLayer(
    rng,
    id,
    cx,
    cy,
    r,
    r * 1.6,
    0.4,
    intRange(rng, 12, 16),
    defs
  );
}

/** A filled smudge — denser to one side, like a soak that pooled unevenly. */
function blotch(rng: Rng, id: string, cx: number, cy: number): Built {
  const r = range(rng, 7, 13);
  const hue = pick(rng, [HUE.coffeeMid, HUE.dirt]);
  const a = range(rng, 0.1, 0.16);
  const defs = `<radialGradient id="${id}" cx="${intRange(rng, 28, 72)}%" cy="${intRange(rng, 28, 72)}%" r="72%">
      <stop offset="0%" stop-color="${rgba(hue, a)}"/>
      <stop offset="70%" stop-color="${rgba(hue, a * 0.5)}"/>
      <stop offset="100%" stop-color="${rgba(hue, 0)}"/>
    </radialGradient>`;
  return blobLayer(
    rng,
    id,
    cx,
    cy,
    r,
    r * 1.7,
    0.5,
    intRange(rng, 11, 15),
    defs
  );
}

/** A small, darker splatter dot. */
function droplet(rng: Rng, cx: number, cy: number): Built {
  const r = range(rng, 0.8, 2.6);
  const a = range(rng, 0.14, 0.24);
  const body = wrapY(cy, r * 2.5)
    .map(
      (y) =>
        `<path d="${blobPath(rng, cx, y, r, { irregularity: 0.55, points: 8 })}" fill="${rgba(HUE.coffeeDeep, a)}"/>`
    )
    .join("");
  return { defs: "", body };
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
  add(wash(rng, `w${n++}`, edge(), range(rng, 0, VIEW)));

  // 0–1 broken rings (kept rare so the page doesn't read as "coffee cups").
  if (rng() < 0.55) add(ring(rng, `r${n++}`, edge(), range(rng, 0, VIEW)));

  // 1–2 uneven blotches.
  for (let i = 0, c = intRange(rng, 1, 2); i < c; i++) {
    add(blotch(rng, `b${n++}`, edge(), range(rng, 0, VIEW)));
  }

  // A scatter of small droplets, loosely clustered around one anchor so they
  // read as a splash rather than confetti.
  const ax = edge();
  const ay = range(rng, 0, VIEW);
  for (let i = 0, c = intRange(rng, 3, 6); i < c; i++) {
    add(droplet(rng, ax + range(rng, -14, 14), ay + range(rng, -18, 18)));
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}" preserveAspectRatio="xMidYMid meet"><defs>${defs.join("")}</defs>${body.join("")}</svg>`;
}

/** The stain SVG for a seed, ready to drop into `background-image`. */
export function paperStainDataUri(seed: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(paperStainSvg(seed))}")`;
}
