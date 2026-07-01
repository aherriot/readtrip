import { expect, test } from "@playwright/test";

// The calibration mini-game (docs/04) runs the first time a child enters the
// app: a few short passages, one one-tap question each, landing on a starting
// reading level that persists. Needs a real Next server + DB (the dev-credentials
// provider upserts a parent); CI provides both via an ephemeral Neon branch.

// Sign in as a fresh parent and create + open one child, landing on calibration.
async function enterCalibration(page: import("@playwright/test").Page) {
  const email = `e2e-calib-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Calib Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();

  await expect(page).toHaveURL(/\/profiles/);
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Bram");
  await dialog.getByRole("button", { name: /create explorer/i }).click();

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
  // L3 (wrong) → L2 (wrong) → L1 (correct) → done, landing on reading level 1.
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
  await expect(page.getByRole("heading", { name: /hi, bram/i })).toBeVisible();
  await expect(page.getByText(/reading level 1/i)).toBeVisible();

  // Re-entering doesn't repeat calibration — it's a one-time first run.
  await page.getByRole("button", { name: /switch explorer/i }).click();
  await expect(page).toHaveURL(/\/profiles/);
  await page.getByRole("button", { name: /Bram/ }).click();
  await expect(page).toHaveURL(/\/play$/);
  await expect(page.getByRole("heading", { name: /hi, bram/i })).toBeVisible();
});
