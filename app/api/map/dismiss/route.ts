// Dismiss endpoint (docs/05, docs/09 M4). Called when the child taps a tile's
// dismiss control: permanently removes a suggested/explored topic from their
// map. Awaited from the client (unlike /api/map's fire-and-forget suggestion
// refresh) since the child is watching this specific tile disappear.
import { auth } from "@/lib/auth";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { dismissTopic } from "@/lib/map/queries";
import { slugify } from "@/lib/llm";

const MAX_TITLE_LENGTH = 200;

interface DismissBody {
  topicSlug: string;
  title: string;
}

function parseBody(body: unknown): DismissBody | null {
  if (typeof body !== "object" || body === null) return null;
  const { topicSlug, title } = body as Record<string, unknown>;
  if (typeof title !== "string" || title.trim().length === 0) return null;
  if (typeof topicSlug !== "string") return null;
  // Re-slugify defensively so a client can't write a malformed key.
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

  await dismissTopic(childId, body);

  return Response.json({ ok: true });
}
