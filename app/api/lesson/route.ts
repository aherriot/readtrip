// Lesson endpoint (docs/09 M4). Streams a level-appropriate lesson for the
// resolved topic over Server-Sent Events so the child sees a progressive reveal.
// The reading level is read from the child server-side — never trusted from the
// client. Safety runs here too (defense in depth): the topic may have come from a
// curated suggestion that skipped /api/explore, and the client body is untrusted.
//
// Protocol (text/event-stream, one JSON object per `data:` line):
//   { "type": "chunk",   "text": "..." }   repeated as the lesson streams
//   { "type": "blocked", "redirect": "..." }   safety steered the topic away
//   { "type": "done" }                          lesson complete
//   { "type": "error" }                         generation failed mid-stream
// Auth / validation failures return plain JSON with the matching status instead.
import { auth } from "@/lib/auth";
import { getChild } from "@/lib/children/queries";
import { getSelectedChildId } from "@/lib/children/selection";
import { streamLesson } from "@/lib/llm";
import { clampReadingLevel } from "@/lib/llm/prompts/readingLevel";
import { safetyPrecheck } from "@/lib/safety";

const MAX_QUERY_LENGTH = 200;

interface LessonBody {
  title: string;
  topicSlug: string;
  intent: "topic" | "question";
  rawQuery?: string | null;
}

function parseBody(body: unknown): LessonBody | null {
  if (typeof body !== "object" || body === null) return null;
  const { title, topicSlug, intent, rawQuery } = body as Record<
    string,
    unknown
  >;
  if (typeof title !== "string" || title.trim().length === 0) return null;
  if (typeof topicSlug !== "string" || topicSlug.trim().length === 0)
    return null;
  if (intent !== "topic" && intent !== "question") return null;
  if (
    rawQuery !== undefined &&
    rawQuery !== null &&
    typeof rawQuery !== "string"
  ) {
    return null;
  }
  const raw = typeof rawQuery === "string" ? rawQuery.trim() : null;
  if (raw !== null && raw.length > MAX_QUERY_LENGTH) return null;
  return {
    title: title.trim().slice(0, MAX_QUERY_LENGTH),
    topicSlug: topicSlug.trim(),
    intent,
    rawQuery: raw && raw.length > 0 ? raw : null,
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
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      try {
        // Defense in depth: re-check the topic even though /api/explore may have
        // already cleared it — curated suggestions skip that path, and the body
        // is client-supplied.
        const safety = await safetyPrecheck(body.rawQuery ?? body.title, {
          childId,
        });
        if (!safety.ok) {
          send({ type: "blocked", redirect: safety.redirect });
          controller.close();
          return;
        }

        await streamLesson(
          {
            title: body.title,
            rawQuery: body.rawQuery,
            intent: body.intent,
            readingLevel,
            childId,
          },
          (text) => send({ type: "chunk", text })
        );

        send({ type: "done" });
      } catch (err) {
        console.error("[lesson] stream failed:", err);
        send({ type: "error" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
