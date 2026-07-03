// Dev-only calibration bypass. Almost every e2e spec needs a calibrated child
// to reach the feature it's actually testing, but only e2e/calibrate.spec.ts
// tests the calibration mini-game itself — everywhere else, driving the real
// 3-round UI is pure setup cost paid on every test. This lets that setup skip
// straight to a calibrated child via the same completeCalibration() write the
// real flow uses, so it's still a real DB round trip through real app code,
// just without the passages. Same backdoor gate as dev sign-in (lib/auth/
// dev-mode.ts): OFF in real production, ON in local/CI/preview.
import { auth } from "@/lib/auth";
import { devAuthEnabled } from "@/lib/auth/dev-mode";
import { completeCalibration, getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { isReadingLevel } from "@/lib/llm/prompts/readingLevel";

interface RequestBody {
  readingLevel?: number;
}

export async function POST(request: Request) {
  if (!devAuthEnabled) {
    return Response.json({ error: "not-found" }, { status: 404 });
  }

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
    body = {};
  }
  const { readingLevel = 1 } = (body as RequestBody) ?? {};
  if (!isReadingLevel(readingLevel)) {
    return Response.json({ error: "invalid-reading-level" }, { status: 400 });
  }

  await completeCalibration(session.user.id, childId, readingLevel);

  return Response.json({ readingLevel });
}
