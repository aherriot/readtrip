// Lesson generation. `generateLesson` returns the full text (scripts, evals);
// `streamLesson` relays it token-by-token for M4's /api/lesson SSE route so the
// child sees a progressive reveal instead of a spinner. Both share the same
// prompt + routing. When no Anthropic key is configured (local dev / CI e2e),
// `streamLesson` serves a deterministic canned lesson so the core loop stays
// exercisable end-to-end without the API.
import { callModel, isLlmOffline, streamModel } from "./client";
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

/**
 * Generate a lesson, streaming each text fragment through `onDelta` as it
 * arrives. Returns the final assembled text + model. Falls back to a canned
 * lesson (emitted in a few chunks) when no Anthropic key is configured.
 */
export async function streamLesson(
  opts: LessonOptions,
  onDelta: (text: string) => void
): Promise<LessonResult> {
  if (isLlmOffline()) {
    return streamCannedLesson(opts, onDelta);
  }

  const route: RouteOpts = { hard: opts.hard };
  const model = pickModel("lesson", route);
  const { text } = await streamModel(
    {
      task: "lesson",
      model,
      system: LESSON_SYSTEM,
      user: lessonUserPrompt(opts),
      maxTokens: 1500,
      effort: pickEffort("lesson", route),
      childId: opts.childId ?? null,
    },
    onDelta
  );
  return { text: text.trim(), model };
}

// Offline fallback: a warm, level-agnostic placeholder built from the resolved
// topic. Emitted paragraph-by-paragraph so the streaming UI behaves identically
// to a real generation. Model is reported as "offline" so logs make the seam
// obvious.
async function streamCannedLesson(
  opts: LessonOptions,
  onDelta: (text: string) => void
): Promise<LessonResult> {
  const chunks = cannedLessonChunks(opts);
  chunks.forEach((chunk, i) => {
    onDelta(i === 0 ? chunk : `\n\n${chunk}`);
  });
  return { text: chunks.join("\n\n"), model: "offline" };
}

function cannedLessonChunks(opts: LessonOptions): string[] {
  const topic = opts.title.trim() || "something new";
  return [
    `Let's explore ${topic}! Every big idea starts with one curious question, and you just asked a great one.`,
    `There is so much to discover here. Scientists and explorers have wondered about ${topic} for a very long time, and there is always more to learn.`,
    `When your guide is ready, you'll read all about ${topic}, try a quick quiz, and earn rewards for what you learn. Keep that curiosity glowing!`,
  ];
}
