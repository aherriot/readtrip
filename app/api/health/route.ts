import { count } from "drizzle-orm";
import { db } from "@/lib/db";
import { ping } from "@/lib/db/schema";

// End-to-end liveness check: reads through Next route handler → Drizzle → Neon.
// A `count()` over the Ping table proves the pooled connection, the Drizzle
// client, and the migration all work — a full round-trip against a real table,
// without writing anything. It's an unauthenticated endpoint, so it must be
// read-only (an insert-per-GET let anonymous callers grow the table) and must
// not leak internal error detail to the caller.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [{ value: totalPings }] = await db
      .select({ value: count() })
      .from(ping);
    return Response.json({ ok: true, db: "connected", totalPings });
  } catch (error) {
    // Log the detail server-side; return only a generic status to the caller.
    console.error("[health] db check failed:", error);
    return Response.json({ ok: false, db: "error" }, { status: 500 });
  }
}
