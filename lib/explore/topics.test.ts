import { describe, expect, it } from "vitest";
import { SUGGESTED_TOPICS } from "./topics";

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
