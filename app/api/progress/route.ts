// Progress endpoint (docs/09 M4). Called once the child finishes a quiz: it
// re-grades their first-try answers against the loop's stored quiz (so XP can't
// be spoofed from the client), then awards XP, recomputes the level, updates
// per-topic progress, and mints a mastery badge the first time a topic is
// mastered (docs/05). Difficulty adaptation is the separate /api/steer step.
import { auth } from "@/lib/auth";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { getLoopForChild } from "@/lib/loops/queries";
import { awardLoopProgress } from "@/lib/progress/queries";
import { scoreQuiz } from "@/lib/reading/quiz";

// A quiz is 2–4 questions (QuizSchema); cap defensively so a bad body can't make
// us allocate unbounded work before grading against the real quiz.
const MAX_CHOICES = 10;
const MAX_TITLE_LENGTH = 200;

interface ProgressBody {
  loopId: string;
  /** The child's first tapped choice per question (`null` = never answered). */
  firstChoices: (number | null)[];
  /** Kid-friendly display title for TopicProgress / the badge. */
  title: string;
}

function parseBody(body: unknown): ProgressBody | null {
  if (typeof body !== "object" || body === null) return null;
  const { loopId, firstChoices, title } = body as Record<string, unknown>;
  if (typeof loopId !== "string" || loopId.trim().length === 0) return null;
  if (typeof title !== "string" || title.trim().length === 0) return null;
  if (!Array.isArray(firstChoices) || firstChoices.length > MAX_CHOICES) {
    return null;
  }
  const choices = firstChoices.map((c) =>
    typeof c === "number" && Number.isInteger(c) ? c : null
  );
  return {
    loopId: loopId.trim(),
    firstChoices: choices,
    title: title.trim().slice(0, MAX_TITLE_LENGTH),
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

  // The loop must be this child's — the join enforces it, so a guessed/foreign
  // loopId can't award XP to someone else.
  const loop = await getLoopForChild(body.loopId, childId);
  if (!loop) {
    return Response.json({ error: "loop-not-found" }, { status: 404 });
  }

  const { correct, pct } = scoreQuiz(body.firstChoices, loop.quiz);

  const result = await awardLoopProgress({
    childId,
    childXp: child.xp,
    childLevel: child.level,
    loopId: loop.id,
    loopXpAwarded: loop.xpAwarded,
    topicSlug: loop.topicSlug,
    title: body.title,
    correct,
    pct,
  });

  return Response.json(result);
}
