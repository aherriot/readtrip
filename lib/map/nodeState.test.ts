import { describe, expect, it } from "vitest";
import { orderNodes, toNodeState, type MapNodeView } from "./nodeState";

describe("toNodeState", () => {
  it("maps a suggested node straight through", () => {
    expect(toNodeState({ status: "suggested", mastered: false })).toBe(
      "suggested"
    );
  });

  it("maps an explored node straight through", () => {
    expect(toNodeState({ status: "explored", mastered: false })).toBe(
      "explored"
    );
  });

  it("lets mastery outrank the stored status", () => {
    expect(toNodeState({ status: "explored", mastered: true })).toBe(
      "mastered"
    );
  });
});

describe("orderNodes", () => {
  const node = (
    title: string,
    status: MapNodeView["status"],
    kind: MapNodeView["kind"] = null,
    mastered = false
  ): MapNodeView => ({
    topicSlug: title.toLowerCase(),
    title,
    status,
    mastered,
    kind,
  });

  it("does not mutate the input", () => {
    const input = [node("B", "explored"), node("A", "explored")];
    orderNodes(input);
    expect(input.map((n) => n.title)).toEqual(["B", "A"]);
  });

  it("returns every node exactly once", () => {
    const input = [
      node("Explored A", "explored"),
      node("Explored B", "explored"),
      node("Deep A", "suggested", "deep"),
      node("Deep B", "suggested", "deep"),
      node("Diverse A", "suggested", "diverse"),
      node("Diverse B", "suggested", "diverse"),
    ];
    const ordered = orderNodes(input);
    expect(ordered).toHaveLength(input.length);
    expect(new Set(ordered.map((n) => n.topicSlug))).toEqual(
      new Set(input.map((n) => n.topicSlug))
    );
  });

  it("always puts a diverse and a deep tile in the first four, across many shuffles", () => {
    const input = [
      node("Explored A", "explored"),
      node("Explored B", "explored"),
      node("Explored C", "explored"),
      node("Explored D", "explored"),
      node("Explored E", "explored"),
      node("Deep A", "suggested", "deep"),
      node("Diverse A", "suggested", "diverse"),
    ];
    for (let i = 0; i < 50; i++) {
      const front = orderNodes(input).slice(0, 4);
      expect(front.some((n) => n.kind === "deep")).toBe(true);
      expect(front.some((n) => n.kind === "diverse")).toBe(true);
    }
  });

  it("surfaces at least 3 diverse tiles within the first 12, across many shuffles", () => {
    const input = [
      ...Array.from({ length: 10 }, (_, i) =>
        node(`Explored ${i}`, "explored")
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        node(`Deep ${i}`, "suggested", "deep")
      ),
      ...Array.from({ length: 4 }, (_, i) =>
        node(`Diverse ${i}`, "suggested", "diverse")
      ),
    ];
    for (let i = 0; i < 50; i++) {
      const front = orderNodes(input).slice(0, 12);
      expect(
        front.filter((n) => n.kind === "diverse").length
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("doesn't fail when there are fewer diverse/deep tiles than the guarantee needs", () => {
    const input = [
      node("Explored A", "explored"),
      node("Diverse A", "suggested", "diverse"),
    ];
    const ordered = orderNodes(input);
    expect(ordered).toHaveLength(2);
  });

  it("handles an all-explored map with no suggested tiles", () => {
    const input = [node("A", "explored"), node("B", "explored")];
    const ordered = orderNodes(input);
    expect(new Set(ordered.map((n) => n.title))).toEqual(new Set(["A", "B"]));
  });
});
