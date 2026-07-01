// Steer endpoint (docs/09 M4). Closes a loop after the quiz: it re-grades the
// child's first-try answers against the stored quiz (so the difficulty signal
// can't be spoofed by the client), records the score on the `Loop`, and adapts
// the child's reading level from their rolling quiz history (docs/04). The
// "go deeper" and "explore new" choices are pure client navigation and don't
// touch this route. XP/levels/badges are the separate Progress step.
import { auth } from "@/lib/auth";
import { applyQuizAdaptation, getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { getLoopForChild, setLoopQuizPct } from "@/lib/loops/queries";
import { scoreQuiz } from "@/lib/reading/quiz";

// A quiz is 2–4 questions (QuizSchema); cap the array defensively so a bad body
// can't make us allocate unbounded work before we grade against the real quiz.
const MAX_CHOICES = 10;

interface SteerBody {
  loopId: string;
  /** The child's first tapped choice per question (`null` = never answered). */
  firstChoices: (number | null)[];
}

function parseBody(body: unknown): SteerBody | null {
  if (typeof body !== "object" || body === null) return null;
  const { loopId, firstChoices } = body as Record<string, unknown>;
  if (typeof loopId !== "string" || loopId.trim().length === 0) return null;
  if (!Array.isArray(firstChoices) || firstChoices.length > MAX_CHOICES) {
    return null;
  }
  const choices = firstChoices.map((c) =>
    typeof c === "number" && Number.isInteger(c) ? c : null
  );
  return { loopId: loopId.trim(), firstChoices: choices };
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

  // The loop must be this child's — the join in getLoopForChild enforces it, so
  // a guessed/foreign loopId can't move someone else's level.
  const loop = await getLoopForChild(body.loopId, childId);
  if (!loop) {
    return Response.json({ error: "loop-not-found" }, { status: 404 });
  }

  const { pct } = scoreQuiz(body.firstChoices, loop.quiz);

  // Persist the score, then adapt. A failure to record the score shouldn't block
  // adaptation (it's the useful part) — warn and carry on.
  try {
    await setLoopQuizPct(loop.id, pct);
  } catch (err) {
    console.error("[steer] failed to record quiz score:", err);
  }

  const adaptation = await applyQuizAdaptation(session.user.id, childId, {
    level: loop.readingLevel,
    pct,
  });

  return Response.json({
    pct,
    readingLevel: adaptation?.readingLevel ?? child.readingLevel,
    leveledUp: adaptation?.leveledUp ?? false,
  });
}
