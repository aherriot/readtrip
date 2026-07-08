"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// Measure before paint on the client (no border flash); fall back to useEffect
// on the server, where useLayoutEffect would warn and do nothing anyway.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A hand-drawn "pen box" border — the field-journal frame around Cards, Buttons,
 * inputs, etc. It replaces the old runtime `#rt-sketch` turbulence filter (a
 * per-pixel Perlin field recomputed per element, per repaint) with a single wavy
 * path generated ONCE per size.
 *
 * Why it's drawn at real pixel size (measured) rather than a stretched viewBox:
 * a fixed path scaled with `preserveAspectRatio="none"` stretches its wobble with
 * the box — the long edge flattens to nearly straight while the short edge
 * squiggles, and the inset becomes a % of size (so on a big card the border pulls
 * far inward, across the content). Instead we measure the box and lay a wobble
 * point down every ~STEP px with a CONSTANT amplitude, so every edge — long or
 * short — has the same hand-drawn density, and the border hugs the true edge at
 * any size. Each instance is uniquely seeded (via `useId`), so any component that
 * repeats in a UI (a grid of cards, a row of buttons) never shows the same wobble
 * twice — no per-caller wiring needed.
 *
 * It's a client component, but the work is trivial and runs only on mount and on
 * resize (a `ResizeObserver`) — never per frame.
 *
 * Drop it in as the FIRST child of a `position: relative` element; it paints the
 * border behind the content and is inert to pointers + assistive tech.
 */

const STEP = 17; // px between wobble points — the hand-drawn "wavelength"
const AMP = 1.4; // px of wobble perpendicular to the edge
const INSET = 2; // px the stroke sits inside the box edge
const CORNER = 4; // px corner radius

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// A stable per-point offset in [-1, 1): a hash of (seed, key). Because it depends
// only on the point's *position key* — not its index in a freshly-walked list —
// the same spot on the border always wobbles the same way. That's what keeps the
// frame from re-scribbling as a streaming box grows (see `outline`).
function hash01(seed: number, key: number) {
  let h = (seed ^ Math.imul(key, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x21f0aaad);
  h = Math.imul(h ^ (h >>> 15), 0x735a2d97);
  h ^= h >>> 15;
  return (h >>> 0) / 2147483648 - 1;
}

type Pt = { x: number; y: number; nx: number; ny: number; key: number };

// Walk a rounded-rect perimeter, dropping a wobble point every STEP px. Points
// are placed from STABLE anchors and carry a position `key` that doesn't shift as
// the box grows in height (width is fixed): top edge anchored at its left, both
// side edges anchored at the TOP, bottom edge anchored at its right, corners keyed
// by arc index. So when a streamed story makes the box taller: the top edge +
// corners stay put, the side edges simply extend downward (new keys appended at
// the bottom), and the bottom edge/corners slide down keeping their shape — the
// border grows with the text instead of reshuffling.
const KEY_STRIDE = 100000;
function outline(w: number, h: number): Pt[] {
  const lo = INSET;
  const rt = w - INSET;
  const bt = h - INSET;
  const r = Math.max(0, Math.min(CORNER, (rt - lo) / 2, (bt - lo) / 2));
  const straightX = Math.max(0, rt - lo - 2 * r);
  const straightY = Math.max(0, bt - lo - 2 * r);
  const pts: Pt[] = [];
  // Fixed-interval points from (ax,ay) along (ux,uy) — anchored, so a point at a
  // given distance keeps its position (and key) as `len` changes.
  const edge = (
    ax: number,
    ay: number,
    ux: number,
    uy: number,
    len: number,
    nx: number,
    ny: number,
    id: number,
    into: Pt[]
  ) => {
    for (let d = 0; d < len - 0.5 * STEP; d += STEP) {
      into.push({
        x: ax + ux * d,
        y: ay + uy * d,
        nx,
        ny,
        key: id * KEY_STRIDE + Math.round(d / STEP),
      });
    }
  };
  const arc = (cx: number, cy: number, a0: number, a1: number, id: number) => {
    const n = Math.max(1, Math.round((Math.abs(a1 - a0) * r) / STEP));
    for (let i = 0; i < n; i++) {
      const a = a0 + (a1 - a0) * (i / n);
      const nx = Math.cos(a);
      const ny = Math.sin(a);
      pts.push({
        x: cx + nx * r,
        y: cy + ny * r,
        nx,
        ny,
        key: id * KEY_STRIDE + i,
      });
    }
  };
  // top L→R (anchor left) → TR corner → right T→B (anchor top) → BR corner →
  // bottom R→L (anchor right) → BL corner → left B→T (anchored at TOP, reversed
  // for traversal) → TL corner.
  edge(lo + r, lo, 1, 0, straightX, 0, -1, 0, pts);
  arc(rt - r, lo + r, -Math.PI / 2, 0, 1);
  edge(rt, lo + r, 0, 1, straightY, 1, 0, 2, pts);
  arc(rt - r, bt - r, 0, Math.PI / 2, 3);
  edge(rt - r, bt, -1, 0, straightX, 0, 1, 4, pts);
  arc(lo + r, bt - r, Math.PI / 2, Math.PI, 5);
  const leftPts: Pt[] = [];
  edge(lo, lo + r, 0, 1, straightY, -1, 0, 6, leftPts);
  leftPts.reverse();
  for (const p of leftPts) pts.push(p);
  arc(lo + r, lo + r, Math.PI, Math.PI * 1.5, 7);
  return pts;
}

// Offset each outline point along its normal by a stable, position-keyed amount,
// then draw a smooth closed curve (Catmull-Rom → cubic Bézier) through them.
function wobblePath(pts: Pt[], seed: number, amp: number): string {
  const P = pts.map((p) => {
    const d = hash01(seed, p.key) * amp;
    return [p.x + p.nx * d, p.y + p.ny * d] as const;
  });
  const n = P.length;
  if (n < 3) return "";
  const at = (i: number) => P[((i % n) + n) % n];
  const r = (v: number) => Math.round(v * 100) / 100;
  let d = `M${r(at(0)[0])} ${r(at(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1),
      p1 = at(i),
      p2 = at(i + 1),
      p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6,
      c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6,
      c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + "Z";
}

export interface InkFrameProps {
  /** Stroke weight in px. ~1.8 default pen box, ~2.6 heavier Panel, ~1.1 small. */
  weight?: number;
  /** Ink color (any CSS color / token var). Defaults to the surface ink. */
  tone?: string;
  className?: string;
}

export function InkFrame({
  weight = 1.8,
  tone = "var(--surface-ink)",
  className,
}: InkFrameProps) {
  const id = useId();
  const seed = hashSeed(id);
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      // Quantize to integer px: the wobble geometry is derived from this size, so
      // using the raw fractional rect would let sub-pixel layout jitter shift a
      // wobble point between renders — making the path non-reproducible (and
      // flaking visual-regression snapshots). Integers are stable per layout.
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    // Coalesce bursts of resize callbacks (e.g. a story streaming in) into one
    // measure per frame — the position-keyed wobble already keeps the shape
    // stable, this just avoids redundant recomputes.
    let raf = 0;
    const ro = new ResizeObserver(() => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          measure();
        });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const { w, h } = size;
  const ready = w > 1 && h > 1;
  const pts = ready ? outline(w, h) : [];
  // Two overlaid passes (different seeds, the second fainter) reproduce the
  // "drawn-twice" retrace of the old double pen stroke.
  const dA = ready ? wobblePath(pts, seed, AMP) : "";
  const dB = ready ? wobblePath(pts, seed ^ 0x9e3779b9, AMP) : "";

  const style = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "visible",
    color: tone,
  } as CSSProperties;

  return (
    <svg
      ref={ref}
      className={className}
      style={style}
      viewBox={ready ? `0 0 ${w} ${h}` : undefined}
      // The integer viewBox stretches to the element's exact (possibly
      // fractional) box — a sub-pixel scale, imperceptible, keeps the frame flush.
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {ready && (
        <>
          <path
            d={dA}
            stroke="currentColor"
            strokeWidth={weight}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={dB}
            stroke="currentColor"
            strokeWidth={weight}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          />
        </>
      )}
    </svg>
  );
}
