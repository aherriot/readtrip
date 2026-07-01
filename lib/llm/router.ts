// Model routing per task. Routing is the single biggest cost lever
// (docs/03-llm-integration.md): each task has a default model and an escalation
// rule. Keep this pure so it's unit-tested and callers never hard-code IDs.
import { MODELS, type ModelId } from "./models";

export type Task =
  | "calibrate_score"
  | "normalize_topic"
  | "lesson"
  | "quiz_generate"
  | "quiz_grade_freeform"
  | "topic_map"
  | "safety_precheck"
  | "safety_output"
  | "eval_judge";

export interface RouteOpts {
  /** Escalate a Sonnet task to Opus: niche/technical topic, precise factual
   *  question, low grounding coverage, or a low-quality self-check retry. */
  hard?: boolean;
}

/**
 * Resolve the model for a task. The only place task → model is decided.
 *
 * COST FREEZE: every task currently routes to Haiku regardless of `opts.hard`,
 * pending a review of spend. To restore per-task routing (Sonnet content
 * engines, Opus escalation/judge), change the returns below back to
 * `MODELS.sonnet` / `MODELS.opus` as annotated.
 */
export function pickModel(task: Task, opts: RouteOpts = {}): ModelId {
  switch (task) {
    // Cheap, fast, individually low-stakes classification calls.
    case "safety_precheck":
    case "safety_output":
    case "calibrate_score":
    case "normalize_topic":
    case "quiz_grade_freeform":
      return MODELS.haiku;

    // The content engines: normally Sonnet by default, Opus on escalation.
    case "lesson":
    case "quiz_generate":
    case "topic_map":
      return MODELS.haiku; // was: opts.hard ? MODELS.opus : MODELS.sonnet;

    // The judge should normally be at least as capable as the model it judges.
    case "eval_judge":
      return MODELS.haiku; // was: MODELS.opus;
  }
}

/** Default effort per task (docs/03): latency matters for kids, so lesson/quiz
 *  run low/medium; the judge and hard escalations run high. Only applied on
 *  models that support `effort` — see modelSupportsEffort. */
export function pickEffort(
  task: Task,
  opts: RouteOpts = {}
): "low" | "medium" | "high" {
  switch (task) {
    case "eval_judge":
      return "high";
    case "lesson":
    case "quiz_generate":
    case "topic_map":
      return opts.hard ? "high" : "low";
    default:
      return "low";
  }
}
