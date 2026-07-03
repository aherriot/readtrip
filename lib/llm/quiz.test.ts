import { describe, expect, it } from "vitest";
import { cannedQuiz } from "./cannedQuiz";
import { QuizSchema } from "./schemas";
import { shuffleQuiz } from "./shuffleQuiz";

describe("cannedQuiz (offline fallback)", () => {
  it("produces a schema-valid quiz", () => {
    const result = QuizSchema.safeParse(cannedQuiz("dinosaurs"));
    expect(result.success).toBe(true);
  });

  it("weaves the topic title into the questions", () => {
    const quiz = cannedQuiz("volcanoes");
    expect(quiz.questions[0].choices).toContain("volcanoes");
    expect(quiz.questions[0].explanation).toMatch(/volcanoes/);
  });

  it("stays valid with a missing or blank title", () => {
    for (const title of [undefined, null, "   "]) {
      const quiz = cannedQuiz(title);
      expect(QuizSchema.safeParse(quiz).success).toBe(true);
      // Every question still has exactly one in-range correct choice.
      for (const q of quiz.questions) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.choices.length);
      }
    }
  });
});

describe("shuffleQuiz", () => {
  it("keeps correctIndex pointing at the same correct choice text", () => {
    const original = cannedQuiz("volcanoes");
    const shuffled = shuffleQuiz(original);
    shuffled.questions.forEach((q, i) => {
      const originalCorrectText =
        original.questions[i].choices[original.questions[i].correctIndex];
      expect(q.choices[q.correctIndex]).toBe(originalCorrectText);
      expect(q.choices.slice().sort()).toEqual(
        original.questions[i].choices.slice().sort()
      );
    });
  });

  it("does not always place the correct answer first", () => {
    const quiz = cannedQuiz("volcanoes");
    const positions = new Set<number>();
    for (let i = 0; i < 50; i++) {
      positions.add(shuffleQuiz(quiz).questions[0].correctIndex);
    }
    expect(positions.size).toBeGreaterThan(1);
  });
});
