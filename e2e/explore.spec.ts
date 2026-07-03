import { expect, test, type Page } from "@playwright/test";
import { revealTopic } from "./helpers";

// The Explore screen is the child's home once calibrated: free-form entry plus a
// few curated suggestions to jump straight in. Free-form input hits the live LLM
// (safety + normalize), so these specs drive the suggestion path — a known
// concept that resolves client-side without a model call — and the rendering /
// wiring around it. Needs a real Next server + DB (dev-credentials sign-in).

// Sign in as a fresh parent, create a child, play through calibration, and land
// on the Explore home. Tapping the first option each round is deterministic:
// L3 wrong → L2 wrong → L1 correct → done.
async function reachExplore(page: Page) {
  const email = `e2e-explore-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Explore Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();

  await expect(page).toHaveURL(/\/profiles/);
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Nadia");
  await dialog.getByRole("button", { name: /create explorer/i }).click();

  await page.getByRole("button", { name: /Nadia/ }).click();
  await expect(page).toHaveURL(/\/play\/calibrate/);
  await page.getByRole("button", { name: /let's go/i }).click();

  // Wait for each passage to render before answering, or the clicks race the
  // re-render. First option each round is the deterministic wrong→wrong→right path.
  for (const passage of [/volcanoes/i, /busy bees/i, /the sun/i]) {
    await expect(page.getByRole("heading", { name: passage })).toBeVisible();
    await page.getByRole("button").first().click();
  }
  await page.getByRole("link", { name: /start exploring/i }).click();
  await expect(page).toHaveURL(/\/play$/);

  // The Explore island loads via a full navigation; wait for it to hydrate before
  // the test interacts, or the first click/keystroke races the handler attaching.
  // Typing enables the (server-rendered-disabled) Explore button only once React
  // is live — use that as the hydration signal, then reset to idle.
  const input = page.getByLabel(/what do you want to explore/i);
  const exploreButton = page.getByRole("button", { name: /^explore$/i });
  await expect(async () => {
    await input.fill("ready?");
    await expect(exploreButton).toBeEnabled({ timeout: 1000 });
  }).toPass();
  await input.fill("");
}

test("shows free-form entry plus suggested topics to jump into", async ({
  page,
}) => {
  await reachExplore(page);

  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();

  // A few curated suggestions are offered as one-tap chips. Order is
  // randomized (lib/map/nodeState.ts orderNodes), so a fixed pair isn't
  // guaranteed to land pre-fold together — reveal each before asserting.
  await revealTopic(page, /dinosaurs tap to explore/i);
  await expect(
    page.getByRole("button", { name: /dinosaurs tap to explore/i })
  ).toBeVisible();
  await revealTopic(page, /outer space tap to explore/i);
  await expect(
    page.getByRole("button", { name: /outer space tap to explore/i })
  ).toBeVisible();
});

test("the Explore button stays disabled until something is typed", async ({
  page,
}) => {
  await reachExplore(page);

  const exploreButton = page.getByRole("button", { name: /^explore$/i });
  await expect(exploreButton).toBeDisabled();

  await page
    .getByLabel(/what do you want to explore/i)
    .fill("why is the sky blue?");
  await expect(exploreButton).toBeEnabled();
});

test("tapping a suggestion resolves straight into a lesson", async ({
  page,
}) => {
  await reachExplore(page);

  await revealTopic(page, /dinosaurs tap to explore/i);
  await page.getByRole("button", { name: /dinosaurs tap to explore/i }).click();

  // Known concept → resolves client-side (no /api/explore model round-trip) and
  // opens the reading surface for that topic. (Lesson content itself comes from
  // /api/lesson — covered in lesson.spec.ts.)
  await expect(
    page.getByRole("region", { name: /lesson about dinosaurs/i })
  ).toBeVisible();

  // And we can back out to explore something else.
  await page.getByRole("button", { name: /explore something else/i }).click();
  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();
});
