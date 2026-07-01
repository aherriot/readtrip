// Lesson generation. Returns the full lesson text + usage. The service layer is
// non-streaming (max_tokens is modest, well under the SDK's streaming
// threshold); M4's /api/lesson route relays this over SSE to the child.
import { callModel } from "./client";
import {
  LESSON_SYSTEM,
  type LessonRequest,
  lessonUserPrompt,
} from "./prompts/lesson";
import { pickEffort, pickModel, type RouteOpts } from "./router";

export interface LessonOptions extends LessonRequest {
  childId?: string | null;
  /** Escalate to Opus for niche/technical topics or precise questions. */
  hard?: boolean;
}

export interface LessonResult {
  text: string;
  model: string;
}

export async function generateLesson(
  opts: LessonOptions
): Promise<LessonResult> {
  const route: RouteOpts = { hard: opts.hard };
  const model = pickModel("lesson", route);
  const { text } = await callModel({
    task: "lesson",
    model,
    system: LESSON_SYSTEM,
    user: lessonUserPrompt(opts),
    maxTokens: 1500,
    effort: pickEffort("lesson", route),
    childId: opts.childId ?? null,
  });
  return { text: text.trim(), model };
}
