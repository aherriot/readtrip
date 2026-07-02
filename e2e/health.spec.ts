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
  // Read-only check: a count round-trip, no write. A freshly migrated branch
  // may legitimately have zero rows, so assert it's a number, not that it's > 0.
  expect(typeof body.totalPings).toBe("number");
  expect(body.totalPings).toBeGreaterThanOrEqual(0);
});
