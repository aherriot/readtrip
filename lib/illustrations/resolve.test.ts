import { describe, expect, it } from "vitest";
import { resolveIllustration } from "./resolve";

describe("resolveIllustration", () => {
  it("resolves a known tag to its illustration", () => {
    expect(
      resolveIllustration({ tag: "pyramids", seed: "ancient-egypt" })
    ).toBe("pyramid");
  });

  it("falls back to category when the tag has no art", () => {
    // "bugs" is a deliberate gap tag (see lib/llm/cannedTopics.ts) with no
    // matching illustration, to exercise this fallback path.
    expect(
      resolveIllustration({
        tag: "bugs",
        category: "biology",
        seed: "bugs",
      })
    ).not.toBeNull();
    // biology tag pool includes dinosaur + human-body + shark
    const result = resolveIllustration({
      tag: "bugs",
      category: "biology",
      seed: "bugs",
    });
    expect(["dinosaur", "human-body", "shark"]).toContain(result);
  });

  it("falls back to the generic pool when neither tag nor category resolve", () => {
    const genericPool = ["compass", "magnifying-glass", "field-journal"];
    expect(genericPool).toContain(
      resolveIllustration({ tag: "unknown-tag", category: null, seed: "x" })
    );
    expect(genericPool).toContain(resolveIllustration({ seed: "x" }));
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
    // space category has 3 illustrations (rocket-launch, telescope, astronaut)
    // — with 8 distinct seeds we should see more than just one.
    expect(picks.size).toBeGreaterThan(1);
  });
});
