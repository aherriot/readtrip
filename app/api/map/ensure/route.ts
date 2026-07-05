// Ensure-suggestions endpoint (docs/05, docs/09 M4). Called from /play on first
// paint when the child's map has nothing "suggested" to tap — a brand-new
// explorer, or one who has dismissed/explored their way through everything
// offered so far. Runs the LLM-backed backfill OFF the render path so /play's
// first paint never waits on an Anthropic round-trip; the client refreshes once
// this resolves to pick up the freshly-seeded nodes.
//
// No body: the child is trusted from the session + selection cookie, same as
// the fire-and-forget refresh in ../route.ts. Idempotent — `ensureSuggestions`
// no-ops once any suggested node exists, so a duplicate call (a double-mount, a
// racing refresh) just re-reads the map.
import { auth } from "@/lib/auth";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { clampReadingLevel } from "@/lib/llm/prompts/readingLevel";
import { ensureSuggestions } from "@/lib/map/suggest";
import { checkLlmRateLimit } from "@/lib/rate-limit/llm";

export async function POST() {
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

  // Over budget → skip generation (the map just stays as-is; the child can
  // still type a free-form idea) rather than 429 the client. The backfill is
  // best-effort, so a slow or failing model must not error the response.
  if (!(await checkLlmRateLimit(childId))) {
    try {
      await ensureSuggestions(childId, clampReadingLevel(child.readingLevel));
    } catch (err) {
      console.error("[map] failed to ensure suggestions:", err);
    }
  }

  return Response.json({ ok: true });
}
