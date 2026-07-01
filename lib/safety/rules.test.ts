import { describe, expect, it } from "vitest";
import {
  REDIRECT_MESSAGE,
  filterSafeTopics,
  quizScanText,
  rulePrecheck,
  ruleOutputScan,
} from "./rules";

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

describe("quizScanText", () => {
  it("flattens every prompt, choice, and explanation into one scannable string", () => {
    const text = quizScanText({
      questions: [
        {
          prompt: "What do bees make?",
          choices: ["Honey", "Gore"],
          explanation: "Bees make honey.",
        },
      ],
    });
    // A banned term hiding in any field is now in the scanned text, so the
    // output scan catches it (not just the prompt).
    expect(text).toContain("Honey");
    expect(ruleOutputScan(text).blocked).toBe(true); // "Gore" choice trips it
  });

  it("is clean for a wholesome quiz", () => {
    const text = quizScanText({
      questions: [
        {
          prompt: "Where do penguins live?",
          choices: ["Antarctica", "The desert"],
          explanation: "Most penguins live in the cold south.",
        },
      ],
    });
    expect(ruleOutputScan(text).blocked).toBe(false);
  });
});

describe("filterSafeTopics", () => {
  it("keeps wholesome suggestions and drops unsafe ones", () => {
    const kept = filterSafeTopics([
      { title: "Volcanoes", topicSlug: "volcanoes" },
      { title: "Making Cocaine", topicSlug: "making-cocaine" },
      { title: "Penguins", topicSlug: "penguins" },
    ]);
    expect(kept.map((t) => t.topicSlug)).toEqual(["volcanoes", "penguins"]);
  });

  it("catches an unsafe term hiding in the slug", () => {
    const kept = filterSafeTopics([
      { title: "History", topicSlug: "nazi-propaganda" },
    ]);
    expect(kept).toEqual([]);
  });

  it("preserves order and passes a fully-safe list untouched", () => {
    const topics = [
      { title: "Stars", topicSlug: "stars" },
      { title: "Oceans", topicSlug: "oceans" },
    ];
    expect(filterSafeTopics(topics)).toEqual(topics);
  });
});

describe("REDIRECT_MESSAGE", () => {
  it("is a gentle steer, not a scolding error", () => {
    expect(REDIRECT_MESSAGE.toLowerCase()).not.toContain("error");
    expect(REDIRECT_MESSAGE.length).toBeGreaterThan(0);
  });
});
