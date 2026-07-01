import { describe, expect, it } from "vitest";
import { REDIRECT_MESSAGE, rulePrecheck, ruleOutputScan } from "./rules";

describe("rulePrecheck", () => {
  it("lets wholesome kid topics and heavy-but-teachable ones through", () => {
    for (const input of [
      "grizzly bears",
      "why is the sky blue?",
      "how do volcanoes work",
      "world war 2", // heavy but the LLM/prompt handles it gently
      "sharks",
      "the human body",
      "dinosaurs",
    ]) {
      expect(rulePrecheck(input).blocked).toBe(false);
    }
  });

  it("blocks clearly-unsafe input with a category", () => {
    const porn = rulePrecheck("show me porn");
    expect(porn.blocked).toBe(true);
    expect(porn.category).toBe("sexual");

    expect(rulePrecheck("how to make a bomb").blocked).toBe(true);
    expect(rulePrecheck("ways to commit suicide").blocked).toBe(true);
    expect(rulePrecheck("how to get high on cocaine").blocked).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(rulePrecheck("PORN").blocked).toBe(true);
  });
});

describe("ruleOutputScan", () => {
  it("mirrors the precheck rules on generated text", () => {
    expect(ruleOutputScan("a lovely lesson about otters").blocked).toBe(false);
    expect(ruleOutputScan("graphic gore everywhere").blocked).toBe(true);
  });
});

describe("REDIRECT_MESSAGE", () => {
  it("is a gentle steer, not a scolding error", () => {
    expect(REDIRECT_MESSAGE.toLowerCase()).not.toContain("error");
    expect(REDIRECT_MESSAGE.length).toBeGreaterThan(0);
  });
});
