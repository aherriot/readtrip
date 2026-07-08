/**
 * Bakes the highlighter/swatch "felt-tip blob" mask shape into a STATIC SVG path,
 * so the marker never pays for a runtime `feTurbulence` filter.
 *
 * The app used to wave its pen-box borders, stamps, and highlighter swipes with
 * live `#rt-sketch` turbulence filters — a per-pixel Perlin field recomputed for
 * every element, on every repaint. The borders/stamps are now drawn by
 * <InkFrame> (which generates its wobble at real pixel size at runtime — see
 * components/ui/icons/InkFrame.tsx). This script bakes only the one remaining
 * static shape:
 *   - app/globals.css → --rt-inked-blob (the marker / .rt-torn CSS mask)
 *
 * It is deterministic (seeded), so re-running reproduces the exact same path.
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

// The highlighter/swatch blob: a filled rounded shape with an uneven, hand-run
// edge. Used as a CSS mask (stretch is fine on a blob — no even stroke to
// distort), so the swipe color stays a themeable token.
function blob(seed, { rx = 44, ry = 34, amp = 4.5, per = 40 } = {}) {
  const rng = mulberry32(seed);
  const wave = makeWave(rng, amp);
  const pts = [];
  for (let i = 0; i < per; i++) {
    const t = i / per;
    const a = t * Math.PI * 2;
    const w = wave(t);
    pts.push([50 + Math.cos(a) * (rx + w), 50 + Math.sin(a) * (ry + w)]);
  }
  return toPath(pts);
}

console.log("// globals.css — --rt-inked-blob (marker / .rt-torn)");
console.log("BLOB =", JSON.stringify(blob(7)));
