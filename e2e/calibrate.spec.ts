import { expect, test, type Page } from "@playwright/test";
import { createChild, devSignIn } from "./helpers";

// The calibration mini-game (docs/04) runs the first time a child enters the
// app: a few short passages, one one-tap question each, landing on a starting
// reading level that persists. Needs a real Next server + DB (the dev-credentials
// provider upserts a parent); CI provides both via an ephemeral Neon branch.

// Sign in as a fresh parent and create + open one child, landing on calibration.
async function enterCalibration(page: Page) {
  const email = `e2e-calib-${Date.now()}@example.com`;
  await devSignIn(page, email, "Calib Parent");
  await createChild(page, "Bram");

  await page.getByRole("button", { name: /Bram/ }).click();
  await expect(page).toHaveURL(/\/play\/calibrate/);
}

test("a child calibrates, lands on a reading level, and isn't asked again", async ({
  page,
}) => {
  await enterCalibration(page);

  // Intro — framed as a superpower, never a test.
  await expect(
    page.getByRole("heading", { name: /find your reading superpower/i })
  ).toBeVisible();
  await page.getByRole("button", { name: /let's go/i }).click();

  // The adaptive path is deterministic when we tap the *first* option each time:
  // L4 (wrong) → L3 (wrong) → L2 (correct) → done, landing on reading level 2.
  await expect(page.getByRole("heading", { name: /volcanoes/i })).toBeVisible();
  await page.getByRole("button").first().click();

  await expect(page.getByRole("heading", { name: /busy bees/i })).toBeVisible();
  await page.getByRole("button").first().click();

  await expect(page.getByRole("heading", { name: /the sun/i })).toBeVisible();
  await page.getByRole("button").first().click();

  // Done → into the child app, with the calibrated level applied.
  await expect(
    page.getByRole("link", { name: /start exploring/i })
  ).toBeVisible();
  await page.getByRole("link", { name: /start exploring/i }).click();

  await expect(page).toHaveURL(/\/play$/);
  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();

  // The calibrated level persisted — the parent's profile card reflects it.
  await page.getByRole("button", { name: /switch explorer/i }).click();
  await expect(page).toHaveURL(/\/profiles/);
  await expect(page.getByRole("button", { name: /Bram/ })).toContainText(
    /reading 2/i
  );

  // Re-entering doesn't repeat calibration — it's a one-time first run.
  await page.getByRole("button", { name: /Bram/ }).click();
  await expect(page).toHaveURL(/\/play$/);
  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();
});
