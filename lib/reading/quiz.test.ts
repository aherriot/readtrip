import { describe, expect, it } from "vitest";
import type { Quiz } from "@/lib/llm";
import { scoreQuiz } from "./quiz";

const quiz: Quiz = {
  questions: [
    {
      prompt: "Q1",
      choices: ["a", "b"],
      correctIndex: 0,
      explanation: "e1",
    },
    {
      prompt: "Q2",
      choices: ["a", "b", "c"],
      correctIndex: 2,
      explanation: "e2",
    },
  ],
};

describe("scoreQuiz", () => {
  it("counts every first-try-correct question", () => {
    expect(scoreQuiz([0, 2], quiz)).toEqual({ correct: 2, total: 2, pct: 100 });
  });

  it("counts a wrong first choice as incorrect", () => {
    expect(scoreQuiz([1, 2], quiz)).toEqual({ correct: 1, total: 2, pct: 50 });
  });

  it("treats unreached questions (null/undefined) as wrong", () => {
    expect(scoreQuiz([0], quiz)).toEqual({ correct: 1, total: 2, pct: 50 });
    expect(scoreQuiz([0, null], quiz)).toEqual({
      correct: 1,
      total: 2,
      pct: 50,
    });
  });

  it("treats an out-of-range index as wrong", () => {
    expect(scoreQuiz([9, 9], quiz)).toEqual({ correct: 0, total: 2, pct: 0 });
  });

  it("rounds the percentage", () => {
    const three: Quiz = {
      questions: [quiz.questions[0], quiz.questions[0], quiz.questions[0]],
    };
    // 1 of 3 = 33.33 → 33
    expect(scoreQuiz([0, 1, 1], three).pct).toBe(33);
  });

  it("is safe on an empty quiz", () => {
    expect(scoreQuiz([], { questions: [] })).toEqual({
      correct: 0,
      total: 0,
      pct: 0,
    });
  });
});
