// Quiz endpoint (docs/09 M4). Generates a schema-valid multiple-choice quiz from
// the lesson the child just read, and — because this is the first step where both
// `lessonText` and `quizJson` exist — persists the completed `Loop`. The reading
// level is read from the child server-side (never trusted from the client); the
// quiz's `correctIndex`/`explanation` are returned so the client can give instant
// icon+text+color feedback (a low-stakes learning quiz, not a graded test).
import { auth } from "@/lib/auth";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { generateQuiz } from "@/lib/llm";
import { clampReadingLevel } from "@/lib/llm/prompts/readingLevel";
import { getLoopForChild, recordLoop } from "@/lib/loops/queries";
import { recordExploredTopic } from "@/lib/map/queries";
import { checkQuizOutput, REDIRECT_MESSAGE } from "@/lib/safety";

const MAX_QUERY_LENGTH = 200;
const MAX_LESSON_LENGTH = 8000;

interface QuizBody {
  title: string;
  topicSlug: string;
  intent: "topic" | "question";
  rawQuery: string | null;
  lessonText: string;
  /** Set when this loop is a "go deeper" follow-up of another loop. */
  parentLoopId: string | null;
}

function parseBody(body: unknown): QuizBody | null {
  if (typeof body !== "object" || body === null) return null;
  const { title, topicSlug, intent, rawQuery, lessonText, parentLoopId } =
    body as Record<string, unknown>;
  if (typeof title !== "string" || title.trim().length === 0) return null;
  if (typeof topicSlug !== "string" || topicSlug.trim().length === 0)
    return null;
  if (intent !== "topic" && intent !== "question") return null;
  if (typeof lessonText !== "string" || lessonText.trim().length === 0)
    return null;
  if (
    rawQuery !== undefined &&
    rawQuery !== null &&
    typeof rawQuery !== "string"
  ) {
    return null;
  }
  if (
    parentLoopId !== undefined &&
    parentLoopId !== null &&
    typeof parentLoopId !== "string"
  ) {
    return null;
  }
  const raw = typeof rawQuery === "string" ? rawQuery.trim() : null;
  if (raw !== null && raw.length > MAX_QUERY_LENGTH) return null;
  const parent =
    typeof parentLoopId === "string" && parentLoopId.trim().length > 0
      ? parentLoopId.trim()
      : null;
  return {
    title: title.trim().slice(0, MAX_QUERY_LENGTH),
    topicSlug: topicSlug.trim(),
    intent,
    rawQuery: raw && raw.length > 0 ? raw : null,
    lessonText: lessonText.trim().slice(0, MAX_LESSON_LENGTH),
    parentLoopId: parent,
  };
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const childId = await getSelectedChildId();
  if (!childId) {
    return Response.json({ error: "no-child-selected" }, { status: 400 });
  }
  const child = await getChild(session.user.id, childId);
  if (!child) {
    return Response.json({ error: "child-not-found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  const body = parseBody(json);
  if (body === null) {
    return Response.json({ error: "invalid-body" }, { status: 400 });
  }

  const readingLevel = clampReadingLevel(child.readingLevel);

  let quiz;
  try {
    ({ quiz } = await generateQuiz({
      lessonText: body.lessonText,
      readingLevel,
      childId,
      topicTitle: body.title,
    }));
  } catch (err) {
    console.error("[quiz] generation failed:", err);
    return Response.json({ error: "quiz-failed" }, { status: 502 });
  }

  // Output guardrail (defense in depth): scan the generated quiz — every prompt,
  // choice, and explanation — before it's shown or the loop persisted. If it
  // drifted unsafe, drop it entirely and steer the child on gently, and don't
  // record a Loop/map node for content we won't show (docs/07: redirect, don't
  // scold). The lesson it came from already passed its own checks, so this is
  // rare, but the quiz is separate model output and gets its own backstop.
  if (!checkQuizOutput(quiz).ok) {
    console.warn("[quiz] output scan blocked generated quiz");
    return Response.json({ blocked: true, redirect: REDIRECT_MESSAGE });
  }

  // For a "go deeper" follow-up, only thread the parent link if the loop really
  // belongs to this child — a spoofed id is dropped, not honored (or errored).
  let parentLoopId: string | null = null;
  if (body.parentLoopId) {
    const parent = await getLoopForChild(body.parentLoopId, childId);
    parentLoopId = parent?.id ?? null;
  }

  // Persist the completed loop. A DB failure shouldn't rob the child of the quiz
  // they can already play — warn and carry on (mirrors the LlmCallLog stance).
  let loopId: string | null = null;
  try {
    loopId = await recordLoop({
      childId,
      topicSlug: body.topicSlug,
      intent: body.intent,
      rawQuery: body.rawQuery,
      readingLevel,
      lessonText: body.lessonText,
      quizJson: quiz,
      parentLoopId,
    });
  } catch (err) {
    console.error("[quiz] failed to persist loop:", err);
  }

  // Light the topic up on the child's world map (docs/05). Reaching the quiz
  // means the lesson was read, so the node is "explored" now — writing it here
  // (not the fire-and-forget /api/map) makes it deterministic. Best-effort:
  // a map failure must not break the quiz. Neighbour suggestions are the
  // separate, eventual /api/map step.
  try {
    await recordExploredTopic(childId, {
      topicSlug: body.topicSlug,
      title: body.title,
    });
  } catch (err) {
    console.error("[quiz] failed to record map node:", err);
  }

  return Response.json({ quiz, loopId });
}
