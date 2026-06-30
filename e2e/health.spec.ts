import { expect, test } from "@playwright/test";

// Exercises the full stack: Next route handler → Drizzle → Neon. In CI this runs
// against a fresh ephemeral Neon branch that's been migrated first. Locally it
// needs DATABASE_URL set in .env.local; skip it if there's no DB configured.
test("health endpoint round-trips to the database", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();

  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.db).toBe("connected");
  expect(typeof body.lastPingId).toBe("string");
  expect(body.totalPings).toBeGreaterThan(0);
});
