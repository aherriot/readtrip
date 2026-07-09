import { describe, expect, it } from "vitest";
import { resolveIllustration } from "./resolve";

describe("resolveIllustration", () => {
  it("resolves a known tag to its illustration", () => {
    expect(
      resolveIllustration({ tag: "pyramids", seed: "ancient-egypt" })
    ).toBe("pyramid");
  });

  it("falls back to category when the tag has no art", () => {
    expect(
      resolveIllustration({
        tag: "sharks",
        category: "biology",
        seed: "sharks",
      })
    ).not.toBeNull();
    // biology tag pool includes dinosaur + human-body
    const result = resolveIllustration({
      tag: "sharks",
      category: "biology",
      seed: "sharks",
    });
    expect(["dinosaur", "human-body"]).toContain(result);
  });

  it("falls back to the generic default when neither tag nor category resolve", () => {
    expect(
      resolveIllustration({ tag: "unknown-tag", category: null, seed: "x" })
    ).toBe("telescope");
    expect(resolveIllustration({ seed: "x" })).toBe("telescope");
  });

  it("is deterministic for the same seed", () => {
    const a = resolveIllustration({ category: "space", seed: "mars" });
    const b = resolveIllustration({ category: "space", seed: "mars" });
    expect(a).toBe(b);
  });

  it("can pick different illustrations for different seeds within a pool", () => {
    const picks = new Set(
      ["a", "b", "c", "d", "e", "f", "g", "h"].map((seed) =>
        resolveIllustration({ category: "space", seed })
      )
    );
    // space category has 2 illustrations (rocket-launch, telescope) — with 8
    // distinct seeds we should see both, not just one.
    expect(picks.size).toBeGreaterThan(1);
  });
});
