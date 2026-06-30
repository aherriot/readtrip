import { count } from "drizzle-orm";
import { db } from "@/lib/db";
import { ping } from "@/lib/db/schema";

// M0 end-to-end check: writes a row to Neon and reads the count back.
// Confirms pooled connection, Drizzle client, and the migration all work.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [inserted] = await db.insert(ping).values({}).returning();
    const [{ value: totalPings }] = await db
      .select({ value: count() })
      .from(ping);
    return Response.json({
      ok: true,
      db: "connected",
      lastPingId: inserted.id,
      totalPings,
    });
  } catch (error) {
    return Response.json(
      { ok: false, db: "error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
