// Calibration mini-game endpoint (docs/04). Stateless: the client sends the
// running list of answers each round; the server grades them, returns the next
// passage or the final starting level, and — on completion — persists that level
// to the selected child. The reading level is always computed server-side from
// the answer key, never trusted from the client.
import { auth } from "@/lib/auth";
import { CALIBRATION_MAX_ROUNDS } from "@/lib/calibration/engine";
import {
  CalibrationError,
  stepCalibration,
  type SubmittedAnswer,
} from "@/lib/calibration/flow";
import { completeCalibration, getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";

interface RequestBody {
  answers: SubmittedAnswer[];
}

function parseBody(body: unknown): SubmittedAnswer[] | null {
  if (typeof body !== "object" || body === null) return null;
  const { answers } = body as Partial<RequestBody>;
  if (!Array.isArray(answers) || answers.length > CALIBRATION_MAX_ROUNDS) {
    return null;
  }
  const parsed: SubmittedAnswer[] = [];
  for (const answer of answers) {
    if (
      typeof answer !== "object" ||
      answer === null ||
      typeof (answer as SubmittedAnswer).passageId !== "string" ||
      !Number.isInteger((answer as SubmittedAnswer).selectedIndex) ||
      (answer as SubmittedAnswer).selectedIndex < 0
    ) {
      return null;
    }
    parsed.push({
      passageId: (answer as SubmittedAnswer).passageId,
      selectedIndex: (answer as SubmittedAnswer).selectedIndex,
    });
  }
  return parsed;
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
  // Verify the selected child belongs to this parent before touching it.
  const child = await getChild(session.user.id, childId);
  if (!child) {
    return Response.json({ error: "child-not-found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  const answers = parseBody(body);
  if (answers === null) {
    return Response.json({ error: "invalid-answers" }, { status: 400 });
  }

  let step;
  try {
    step = stepCalibration(answers);
  } catch (error) {
    if (error instanceof CalibrationError) {
      return Response.json({ error: "invalid-answers" }, { status: 400 });
    }
    throw error;
  }

  if (step.done) {
    await completeCalibration(session.user.id, childId, step.readingLevel);
  }

  return Response.json(step);
}
