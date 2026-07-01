import { describe, expect, it } from "vitest";
import { freshStarters, SUGGESTED_TOPICS } from "./topics";

describe("SUGGESTED_TOPICS", () => {
  it("offers a few topics to jump into", () => {
    expect(SUGGESTED_TOPICS.length).toBeGreaterThanOrEqual(4);
  });

  it("gives every topic a title, emoji, and non-empty slug", () => {
    for (const topic of SUGGESTED_TOPICS) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.emoji.length).toBeGreaterThan(0);
      expect(topic.topicSlug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("keeps slugs unique so topics don't collide", () => {
    const slugs = SUGGESTED_TOPICS.map((t) => t.topicSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("freshStarters", () => {
  it("returns curated starters not already on the map", () => {
    const slugs = freshStarters(["dinosaurs", "outer-space"]).map(
      (t) => t.topicSlug
    );
    expect(slugs).not.toContain("dinosaurs");
    expect(slugs).not.toContain("outer-space");
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("caps the result at the requested limit", () => {
    expect(freshStarters([], 3)).toHaveLength(3);
  });

  it("returns fewer than the limit when little is left", () => {
    const allButFirst = SUGGESTED_TOPICS.slice(1).map((t) => t.topicSlug);
    const fresh = freshStarters(allButFirst, 4);
    expect(fresh).toHaveLength(1);
    expect(fresh[0].topicSlug).toBe(SUGGESTED_TOPICS[0].topicSlug);
  });

  it("returns nothing once every starter is on the map", () => {
    const all = SUGGESTED_TOPICS.map((t) => t.topicSlug);
    expect(freshStarters(all)).toEqual([]);
  });
});
