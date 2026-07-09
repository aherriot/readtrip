/**
 * Bakes the hand-run "felt-tip" mask shapes into STATIC SVG paths, so nothing
 * pays for a runtime `feTurbulence` filter.
 *
 * The app used to wave its pen-box borders, stamps, and highlighter swipes with
 * live `#rt-sketch` turbulence filters — a per-pixel Perlin field recomputed for
 * every element, on every repaint. The borders/stamps are now drawn by
 * <InkFrame> (which generates its wobble at real pixel size at runtime — see
 * components/ui/icons/InkFrame.tsx). This script bakes the two remaining
 * static shapes:
 *   - app/globals.css → --rt-inked-blob (Avatar's round patch, via .rt-torn)
 *   - app/globals.css → --rt-marker-stroke (the Highlight swipe / color-swatch
 *     chip — an elongated capsule, not a circle, since both are wide and short)
 *
 * A single circular shape used to serve both cases via `mask-size: 100% 100%`,
 * but forcing a circle to fill a wide, short box just stretches it into a
 * smooth ellipse/pill — the hand-run wobble gets squashed away and it reads as
 * a printed oval instead of a marker stroke. The two shapes are baked at the
 * aspect ratio their caller actually uses, so the mask fills the box (no
 * distorting stretch) and the wave stays visible.
 *
 * Deterministic (seeded), so re-running reproduces the exact same paths.
 * Run: `node scripts/bake-ink.mjs`
 */

// Small deterministic PRNG so every run bakes identical geometry.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A smooth 1-D wobble: a few sines with random phase → coherent, pen-like waver.
function makeWave(rng, amp) {
  const terms = [
    { f: 1, a: 1, p: rng() * Math.PI * 2 },
    { f: 2.3, a: 0.5, p: rng() * Math.PI * 2 },
    { f: 3.7, a: 0.28, p: rng() * Math.PI * 2 },
  ];
  const norm = terms.reduce((s, t) => s + t.a, 0);
  return (t) => {
    let v = 0;
    for (const term of terms)
      v += term.a * Math.sin(term.f * t * Math.PI * 2 + term.p);
    return (v / norm) * amp;
  };
}

const round = (n, p = 1) => Math.round(n * 10 ** p) / 10 ** p;

// Catmull-Rom through the points → a smooth, drawn (not polygonal) closed path.
function toPath(pts, precision = 1) {
  const r = (n) => round(n, precision);
  const n = pts.length;
  const P = (i) => pts[((i % n) + n) % n];
  let d = `M${r(P(0)[0])} ${r(P(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1),
      p1 = P(i),
      p2 = P(i + 1),
      p3 = P(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + "Z";
}

// A closed shape sampled by angle around (50,50), with the radius on each axis
// warped by `n` (a superellipse exponent: 2 = a true ellipse/circle, higher =
// straighter sides + rounder corners, i.e. a stadium/capsule) and perturbed by
// a hand-run wave for an uneven, felt-tip edge.
function ringShape(seed, { rx, ry, n = 2, amp, per }) {
  const rng = mulberry32(seed);
  const wave = makeWave(rng, amp);
  const pts = [];
  for (let i = 0; i < per; i++) {
    const t = i / per;
    const a = t * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const ex = Math.sign(c) * Math.abs(c) ** (2 / n);
    const ey = Math.sign(s) * Math.abs(s) ** (2 / n);
    const w = wave(t);
    pts.push([50 + ex * (rx + w), 50 + ey * (ry + w)]);
  }
  return toPath(pts);
}

// Avatar's round patch: a true circle (rx === ry, n=2) so it reads as a rough
// hand-coloured disc in Avatar's square box, not an egg.
function roundBlob(seed) {
  return ringShape(seed, { rx: 44, ry: 44, n: 2, amp: 4.5, per: 40 });
}

// The highlighter swipe / swatch chip: an elongated capsule (high superellipse
// exponent → flat long edges + blunt rounded ends, not tapered oval tips) baked
// wide to begin with, so it drops into a wide-short box without the extreme
// anisotropic stretch that flattens the wobble into a smooth pill. The wave
// runs mostly along the long top/bottom edges, where a real marker's uneven
// pass actually shows.
function markerStroke(seed) {
  return ringShape(seed, { rx: 48, ry: 32, n: 7, amp: 5, per: 56 });
}

console.log(
  "// globals.css — --rt-inked-blob (Avatar's round patch, via .rt-torn)"
);
console.log("ROUND_BLOB =", JSON.stringify(roundBlob(7)));
console.log();
console.log(
  "// globals.css — --rt-marker-stroke (Highlight swipe / .rt-swatch chip)"
);
console.log("MARKER_STROKE =", JSON.stringify(markerStroke(11)));
