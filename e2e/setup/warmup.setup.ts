import { expect, test } from "@playwright/test";
import { revealTopic } from "../helpers";

/*
 * Warm up the local dev environment before the real specs fan out.
 *
 * Locally (not in CI) two "cold start" costs stack up and don't show up as a
 * code bug — they show up as an unrelated spec timing out on whichever step
 * happens to run first against a cold system:
 *
 *  1. The Neon branch behind .env.local auto-suspends when idle, so the first
 *     DB query after a pause pays a multi-second compute resume.
 *  2. `next dev` compiles each route/API handler on its first hit. Locally
 *     Playwright fans out across several workers (~half the CPU count); if
 *     several of them hit an uncompiled route for the first time at once, the
 *     single dev-server process serializes the compiles and a test's
 *     assertion can time out waiting on a page that hasn't rendered yet.
 *
 * CI never sees this: it runs one worker against a Neon branch it just
 * created (already warm by the time tests start) — see .github/workflows/test.yml.
 * Retrying a flaky local run just re-pays the same cold-start tax on whatever
 * fails next, so instead this setup project — a dependency of the "chromium"
 * project, so it runs first, alone, on a single worker — pays both costs
 * once, up front: it wakes the DB, then drives one full sign-in → calibrate →
 * explore → quiz loop so every route and API handler the suite touches is
 * already compiled by the time real workers start hitting them in parallel.
 *
 * The DB-backed steps are skipped under VISUAL=1: the visual regression job
 * runs against a placeholder DATABASE_URL with no real Postgres behind it
 * (design-system.visual.spec.ts only screenshots the static component
 * gallery), so /api/health and the sign-in flow can never succeed there.
 */
test("warm up the Neon branch and every route the suite hits", async ({
  page,
  request,
}) => {
  test.setTimeout(120_000);

  if (!process.env.VISUAL) {
    // 1. Wake the DB first, in parallel with nothing else yet — /api/health
    // does one write + one read, and a cold Neon branch can take several
    // seconds to resume compute. Poll rather than trust the first response: a
    // branch that's still waking can error before it's ready to serve.
    await expect(async () => {
      const res = await request.get("/api/health");
      expect(res.ok()).toBeTruthy();
    }).toPass({ timeout: 30_000 });
  }

  // 2. Compile the dev-only component gallery (needed by both
  // design-system.spec.ts and the VISUAL=1 screenshot suite).
  await page.goto("/dev/components");
  await page
    .getByTestId("gallery")
    .waitFor({ state: "visible", timeout: 30_000 });

  if (process.env.VISUAL) return;

  // 3. Drive one full loop so /sign-in, /profiles, /play/calibrate, /play, and
  // every API route (auth, calibrate, explore, lesson, quiz, steer, progress,
  // map) are compiled before real specs start hitting them in parallel. The
  // throwaway account is unique per run and never asserted on elsewhere.
  const email = `e2e-warmup-${Date.now()}@example.com`;
  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Warmup Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();

  await expect(page).toHaveURL(/\/profiles/, { timeout: 30_000 });
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Warmup");
  await dialog.getByRole("button", { name: /create explorer/i }).click();

  await page.getByRole("button", { name: /Warmup/ }).click();
  await expect(page).toHaveURL(/\/play\/calibrate/, { timeout: 30_000 });
  await page.getByRole("button", { name: /let's go/i }).click();

  for (const passage of [/volcanoes/i, /busy bees/i, /the sun/i]) {
    await expect(page.getByRole("heading", { name: passage })).toBeVisible({
      timeout: 30_000,
    });
    await page.getByRole("button").first().click();
  }
  await page.getByRole("link", { name: /start exploring/i }).click();
  await expect(page).toHaveURL(/\/play$/, { timeout: 30_000 });

  // Free-form entry compiles /api/explore (safety + normalize) — the known-
  // topic tap below skips it entirely, so it needs its own hit.
  const input = page.getByLabel(/what do you want to explore/i);
  const exploreButton = page.getByRole("button", { name: /^explore$/i });
  await expect(async () => {
    await input.fill("why is the sky blue?");
    await expect(exploreButton).toBeEnabled({ timeout: 1_000 });
  }).toPass({ timeout: 30_000 });
  await exploreButton.click();
  await expect(page.getByRole("region", { name: /lesson about/i })).toBeVisible(
    { timeout: 30_000 }
  );
  await page.getByRole("button", { name: /explore something else/i }).click();

  // The known-topic shortcut resolves client-side (no /api/explore round
  // trip), so it needs its own hit too — and carries the loop through
  // /api/lesson, /api/quiz, and the finish-time /api/steer, /api/progress,
  // /api/map trio.
  await revealTopic(page, /dinosaurs tap to explore/i);
  await page.getByRole("button", { name: /dinosaurs tap to explore/i }).click();
  await expect(
    page.getByRole("button", { name: /start the quiz/i })
  ).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /start the quiz/i }).click();

  await expect(
    page.getByRole("progressbar", { name: /quiz progress/i })
  ).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /^dinosaurs$/i }).click();
  await page.getByRole("button", { name: /next question/i }).click();
  await page
    .getByRole("button", { name: /reading and asking questions/i })
    .click();
  await page.getByRole("button", { name: /finish/i }).click();

  await expect(page.getByText(/on the first try/i)).toBeVisible({
    timeout: 30_000,
  });
});
