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
    mastered = false
  ): MapNodeView => ({
    topicSlug: title.toLowerCase(),
    title,
    status,
    mastered,
  });

  it("puts explored topics before suggested ones", () => {
    const ordered = orderNodes([
      node("Zebras", "suggested"),
      node("Apples", "explored"),
    ]);
    expect(ordered.map((n) => n.title)).toEqual(["Apples", "Zebras"]);
  });

  it("sorts alphabetically within a group", () => {
    const ordered = orderNodes([
      node("Volcanoes", "suggested"),
      node("Bugs", "suggested"),
    ]);
    expect(ordered.map((n) => n.title)).toEqual(["Bugs", "Volcanoes"]);
  });

  it("does not mutate the input", () => {
    const input = [node("B", "explored"), node("A", "explored")];
    orderNodes(input);
    expect(input.map((n) => n.title)).toEqual(["B", "A"]);
  });
});
