// Explore endpoint (docs/09 M4). Turns the child's free-form input — a topic
// noun or a question — into a stable concept the rest of the loop can build on:
//   safety_precheck → normalize_topic → { title, topicSlug, intent }
// A blocked topic returns a gentle redirect rather than an error (docs/07:
// "redirect, don't scold"). Persisting the resolved topic onto a Loop happens at
// the lesson step, which owns the (NOT NULL) lessonText — see the M4 plan.
import { auth } from "@/lib/auth";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { normalizeTopic } from "@/lib/llm/normalize";
import { safetyPrecheck } from "@/lib/safety";

/** Guard against empty / pathologically long input before spending a model call. */
const MAX_QUERY_LENGTH = 200;

function parseRawQuery(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;
  const { rawQuery } = body as { rawQuery?: unknown };
  if (typeof rawQuery !== "string") return null;
  const trimmed = rawQuery.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_QUERY_LENGTH) return null;
  return trimmed;
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
  // Verify the selected child belongs to this parent before attributing calls.
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

  const rawQuery = parseRawQuery(body);
  if (rawQuery === null) {
    return Response.json({ error: "invalid-query" }, { status: 400 });
  }

  // Safety first: block clearly inappropriate input with a kind steer.
  const safety = await safetyPrecheck(rawQuery, { childId });
  if (!safety.ok) {
    return Response.json({ ok: false, redirect: safety.redirect });
  }

  const topic = await normalizeTopic({ rawQuery, childId });
  return Response.json({ ok: true, topic: { ...topic, rawQuery } });
}
