import { expect, type Page } from "@playwright/test";

/**
 * Reveal a WorldMap tile that may be sitting behind the "Show more" toggle.
 * Tile order is randomized (lib/map/nodeState.ts orderNodes), so a topic used
 * as a fixed test fixture (e.g. "Dinosaurs") isn't guaranteed to land in the
 * initial four-tile screenful — expand once if it isn't there yet.
 */
export async function revealTopic(page: Page, name: RegExp): Promise<void> {
  if (await page.getByRole("button", { name }).isVisible()) return;
  const toggle = page.getByRole("button", { name: /show \d+ more topics?/i });
  if (await toggle.isVisible()) await toggle.click();
}

// Dev-only credentials sign-in (only rendered outside production). Target by
// placeholder — the labels carry a "*" for required fields, and "Email" would
// otherwise also match the magic-link "Email address" field.
export async function devSignIn(
  page: Page,
  email: string,
  parentName: string
): Promise<void> {
  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill(parentName);
  await page.getByRole("button", { name: /dev sign-in/i }).click();
  await expect(page).toHaveURL(/\/profiles/);
}

export async function createChild(page: Page, name: string): Promise<void> {
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill(name);
  await dialog.getByRole("button", { name: /create explorer/i }).click();
}

// From the (already open) /play/calibrate page: skip the 3-round mini-game via
// the dev-only bypass route (app/api/dev/calibrate) and land on /play. Only
// e2e/calibrate.spec.ts actually tests the mini-game itself — every other spec
// just needs a calibrated child to reach the feature under test, so replaying
// the real passages there is pure setup cost. The bypass still writes through
// completeCalibration() (same as the real flow), just without the UI rounds.
export async function skipCalibration(
  page: Page,
  readingLevel = 1
): Promise<void> {
  const res = await page.request.post("/api/dev/calibrate", {
    data: { readingLevel },
  });
  if (!res.ok()) {
    throw new Error(
      `dev calibration bypass failed: ${res.status()} ${await res.text()}`
    );
  }
  await page.goto("/play");
  await expect(page).toHaveURL(/\/play$/);
}

// The Explore island loads via a full navigation; wait for it to hydrate before
// the test interacts, or the first click/keystroke races the handler attaching.
// Typing enables the (server-rendered-disabled) Explore button only once React
// is live — use that as the hydration signal, then reset to idle.
export async function waitForExploreHydration(page: Page): Promise<void> {
  const input = page.getByLabel(/what do you want to explore/i);
  const exploreButton = page.getByRole("button", { name: /^explore$/i });
  await expect(async () => {
    await input.fill("ready?");
    await expect(exploreButton).toBeEnabled({ timeout: 1000 });
  }).toPass();
  await input.fill("");
}

// Sign in as a fresh parent, create a child, play through calibration, and land
// on the Explore home, hydrated. Shared by every spec that needs a child past
// the one-time calibration gate.
export async function reachExplore(
  page: Page,
  opts: { emailPrefix: string; parentName: string; childName: string }
): Promise<void> {
  const email = `e2e-${opts.emailPrefix}-${Date.now()}@example.com`;
  await devSignIn(page, email, opts.parentName);
  await createChild(page, opts.childName);

  await page.getByRole("button", { name: new RegExp(opts.childName) }).click();
  await expect(page).toHaveURL(/\/play\/calibrate/);
  await skipCalibration(page);
  await waitForExploreHydration(page);
}
