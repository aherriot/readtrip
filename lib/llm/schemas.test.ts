import { describe, expect, it } from "vitest";
import {
  NormalizeSchema,
  QuizSchema,
  TopicSuggestionsSchema,
  extractJson,
} from "./schemas";

describe("extractJson", () => {
  it("parses a bare JSON object", () => {
    expect(extractJson('{"a":1}')).toEqual({ a: 1 });
  });

  it("slices JSON out of prose or a code fence", () => {
    expect(extractJson('Here you go:\n```json\n{"a":1}\n```')).toEqual({
      a: 1,
    });
    expect(extractJson('sure! {"a":[1,2]} done')).toEqual({ a: [1, 2] });
  });

  it("returns null when there is no valid object", () => {
    expect(extractJson("no json here")).toBeNull();
    expect(extractJson("{not valid}")).toBeNull();
    expect(extractJson("")).toBeNull();
  });
});

describe("QuizSchema", () => {
  const valid = {
    questions: [
      {
        prompt: "Why is the sky blue?",
        choices: ["Sunlight scatters", "It is painted"],
        correctIndex: 0,
        explanation: "Blue light scatters most.",
      },
      {
        prompt: "When is the sky bluest?",
        choices: ["Midday", "Midnight", "Never"],
        correctIndex: 0,
        explanation: "The sun is high at midday.",
      },
    ],
  };

  it("accepts a well-formed quiz", () => {
    expect(QuizSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a correctIndex outside the choices range", () => {
    const bad = structuredClone(valid);
    bad.questions[0].correctIndex = 5;
    expect(QuizSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects fewer than 2 questions or too many choices", () => {
    expect(
      QuizSchema.safeParse({ questions: [valid.questions[0]] }).success
    ).toBe(false);

    const tooMany = structuredClone(valid);
    tooMany.questions[0].choices = ["a", "b", "c", "d", "e"];
    expect(QuizSchema.safeParse(tooMany).success).toBe(false);
  });
});

describe("NormalizeSchema", () => {
  it("accepts a valid kebab slug + known intent", () => {
    expect(
      NormalizeSchema.safeParse({
        title: "Why the sky is blue",
        topicSlug: "why-is-the-sky-blue",
        intent: "question",
      }).success
    ).toBe(true);
  });

  it("rejects a non-kebab slug or unknown intent", () => {
    expect(
      NormalizeSchema.safeParse({
        title: "Sky",
        topicSlug: "Why The Sky",
        intent: "question",
      }).success
    ).toBe(false);
    expect(
      NormalizeSchema.safeParse({
        title: "Sky",
        topicSlug: "sky",
        intent: "musing",
      }).success
    ).toBe(false);
  });
});

describe("TopicSuggestionsSchema", () => {
  it("accepts 1-8 well-formed suggestions", () => {
    expect(
      TopicSuggestionsSchema.safeParse({
        suggestions: [
          { title: "Volcanoes", topicSlug: "volcanoes", kind: "neighbor" },
        ],
      }).success
    ).toBe(true);
  });

  it("rejects a suggestion missing kind", () => {
    expect(
      TopicSuggestionsSchema.safeParse({
        suggestions: [{ title: "Volcanoes", topicSlug: "volcanoes" }],
      }).success
    ).toBe(false);
  });

  it("rejects an empty suggestion list", () => {
    expect(TopicSuggestionsSchema.safeParse({ suggestions: [] }).success).toBe(
      false
    );
  });
});
