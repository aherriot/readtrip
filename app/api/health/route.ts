import { prisma } from "@/lib/db";

// M0 end-to-end check: writes a row to Neon and reads the count back.
// Confirms pooled connection, Prisma client, and the migration all work.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ping = await prisma.ping.create({ data: {} });
    const totalPings = await prisma.ping.count();
    return Response.json({
      ok: true,
      db: "connected",
      lastPingId: ping.id,
      totalPings,
    });
  } catch (error) {
    return Response.json(
      { ok: false, db: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
}
