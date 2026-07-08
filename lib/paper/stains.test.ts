import { describe, expect, it } from "vitest";
import { paperStainDataUri, paperStainSvg } from "./stains";

describe("paperStainSvg", () => {
  it("is deterministic: the same seed always yields identical output", () => {
    // The whole feature relies on this — stable across re-renders and in visual
    // snapshots. A regression here (e.g. calling Math.random) would flake tests.
    expect(paperStainSvg("story:crystal-caves")).toBe(
      paperStainSvg("story:crystal-caves")
    );
    expect(paperStainDataUri("map:2")).toBe(paperStainDataUri("map:2"));
  });

  it("varies by seed: different seeds yield different patterns", () => {
    const seeds = ["map:0", "map:1", "story:a", "quiz:a", "/play"];
    const svgs = new Set(seeds.map(paperStainSvg));
    expect(svgs.size).toBe(seeds.length);
  });

  it("produces a well-formed, self-contained SVG", () => {
    const svg = paperStainSvg("map:0");
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
    // No live filter — softness comes from gradients only (the perf contract).
    expect(svg).not.toContain("filter");
    expect(svg).toContain("radialGradient");
  });

  it("wraps the SVG as a usable data-URI background value", () => {
    const uri = paperStainDataUri("map:0");
    expect(uri.startsWith('url("data:image/svg+xml,')).toBe(true);
    expect(uri.endsWith('")')).toBe(true);
  });
});
