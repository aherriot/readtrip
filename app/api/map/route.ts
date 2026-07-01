// World-map endpoint (docs/09 M4). Called when the child finishes exploring a
// topic: it lights that topic up on their map and grows the map with fresh,
// interest-driven neighbour suggestions (docs/05). Fire-and-forget from the
// client — the updated map is read server-side on the next /play load, so the
// response only reports success. The topic key is trusted from the loop the
// child just did; the title is display-only.
import { auth } from "@/lib/auth";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { recordExploredTopic } from "@/lib/map/queries";
import { refreshSuggestions } from "@/lib/map/suggest";
import { slugify } from "@/lib/llm";

const MAX_TITLE_LENGTH = 200;

interface MapBody {
  topicSlug: string;
  title: string;
}

function parseBody(body: unknown): MapBody | null {
  if (typeof body !== "object" || body === null) return null;
  const { topicSlug, title } = body as Record<string, unknown>;
  if (typeof title !== "string" || title.trim().length === 0) return null;
  if (typeof topicSlug !== "string") return null;
  // Re-slugify defensively so a client can't write a malformed key onto the map.
  const slug = slugify(topicSlug);
  if (slug.length === 0) return null;
  return { topicSlug: slug, title: title.trim().slice(0, MAX_TITLE_LENGTH) };
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

  await recordExploredTopic(childId, body);

  // Suggestion generation is best-effort — a failure (or a slow model) must not
  // fail the explore. The explored node is already saved above.
  try {
    await refreshSuggestions({
      childId,
      topicSlug: body.topicSlug,
      title: body.title,
    });
  } catch (err) {
    console.error("[map] failed to refresh suggestions:", err);
  }

  return Response.json({ ok: true });
}
