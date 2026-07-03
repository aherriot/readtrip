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

// From the (already open) calibration intro: play through the deterministic
// L3 (wrong) → L2 (wrong) → L1 (correct) path and land on hydrated-ready /play.
export async function playThroughCalibration(page: Page): Promise<void> {
  await page.getByRole("button", { name: /let's go/i }).click();

  // Wait for each passage to render before answering, or the clicks race the
  // re-render. First option each round is the deterministic wrong→wrong→right path.
  for (const passage of [/volcanoes/i, /busy bees/i, /the sun/i]) {
    await expect(page.getByRole("heading", { name: passage })).toBeVisible();
    await page.getByRole("button").first().click();
  }
  await page.getByRole("link", { name: /start exploring/i }).click();
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
  await playThroughCalibration(page);
  await waitForExploreHydration(page);
}
