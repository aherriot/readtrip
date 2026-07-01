import { describe, expect, it } from "vitest";
import { MODELS } from "./models";
import { pickEffort, pickModel, type Task } from "./router";

describe("pickModel", () => {
  it("routes low-stakes classification tasks to Haiku", () => {
    const haikuTasks: Task[] = [
      "safety_precheck",
      "safety_output",
      "calibrate_score",
      "normalize_topic",
      "quiz_grade_freeform",
    ];
    for (const task of haikuTasks) {
      expect(pickModel(task)).toBe(MODELS.haiku);
    }
  });

  it("routes content tasks to Haiku during the cost freeze", () => {
    const contentTasks: Task[] = ["lesson", "quiz_generate", "topic_map"];
    for (const task of contentTasks) {
      expect(pickModel(task)).toBe(MODELS.haiku);
      expect(pickModel(task, { hard: true })).toBe(MODELS.haiku);
    }
  });

  it("routes the eval judge to Haiku during the cost freeze", () => {
    expect(pickModel("eval_judge")).toBe(MODELS.haiku);
    expect(pickModel("eval_judge", { hard: true })).toBe(MODELS.haiku);
  });
});

describe("pickEffort", () => {
  it("uses low effort for kid-facing content by default", () => {
    expect(pickEffort("lesson")).toBe("low");
    expect(pickEffort("quiz_generate")).toBe("low");
    expect(pickEffort("topic_map")).toBe("low");
  });

  it("raises effort for hard escalations and the judge", () => {
    expect(pickEffort("lesson", { hard: true })).toBe("high");
    expect(pickEffort("eval_judge")).toBe("high");
  });
});
