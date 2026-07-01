import { expect, test, type Page } from "@playwright/test";

// The Steer step (docs/09 M4): after finishing the quiz, the child chooses where
// to go next — a "go deeper" follow-up that threads a new loop onto the one they
// just finished, or a fresh expedition. Difficulty adaptation runs server-side
// off the quiz score (unit-tested in lib/reading/adapt.test.ts). Like the quiz
// spec this drives the offline (canned) loop, so it never calls a live LLM but
// needs a real Next server + DB. Mirrors e2e/quiz.spec.ts.

// Sign in → add a child → calibrate → land on Explore → tap Dinosaurs → read →
// play the 2-question canned quiz to its result screen.
async function reachQuizDone(page: Page) {
  const email = `e2e-steer-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Steer Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();

  await expect(page).toHaveURL(/\/profiles/);
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Pip");
  await dialog.getByRole("button", { name: /create explorer/i }).click();

  await page.getByRole("button", { name: /Pip/ }).click();
  await expect(page).toHaveURL(/\/play\/calibrate/);
  await page.getByRole("button", { name: /let's go/i }).click();

  for (const passage of [/volcanoes/i, /busy bees/i, /the sun/i]) {
    await expect(page.getByRole("heading", { name: passage })).toBeVisible();
    await page.getByRole("button").first().click();
  }
  await page.getByRole("link", { name: /start exploring/i }).click();
  await expect(page).toHaveURL(/\/play$/);

  // Wait for the Explore island to hydrate before interacting.
  const input = page.getByLabel(/what do you want to explore/i);
  const exploreButton = page.getByRole("button", { name: /^explore$/i });
  await expect(async () => {
    await input.fill("ready?");
    await expect(exploreButton).toBeEnabled({ timeout: 1000 });
  }).toPass();
  await input.fill("");

  await page.getByRole("button", { name: /dinosaurs/i }).click();
  await expect(
    page.getByRole("button", { name: /start the quiz/i })
  ).toBeVisible();
  await page.getByRole("button", { name: /start the quiz/i }).click();

  // Answer both canned questions correctly and finish.
  await expect(
    page.getByRole("heading", { name: /quiz: dinosaurs/i })
  ).toBeVisible();
  await page.getByRole("button", { name: /^dinosaurs$/i }).click();
  await page.getByRole("button", { name: /next question/i }).click();
  await page
    .getByRole("button", { name: /reading and asking questions/i })
    .click();
  await page.getByRole("button", { name: /finish/i }).click();

  await expect(page.getByText(/2 of 2 on the first try/i)).toBeVisible();
}

test("a child can go deeper into the topic they just finished", async ({
  page,
}) => {
  await reachQuizDone(page);

  // Steer offers a "go deeper" choice named for the topic just explored.
  await page.getByRole("button", { name: /go deeper on dinosaurs/i }).click();

  // The follow-up form appears; asking a question spawns a fresh lesson.
  const followUp = page.getByLabel(/what else do you want to know/i);
  await expect(followUp).toBeVisible();
  await followUp.fill("What did baby dinosaurs eat?");
  await page.getByRole("button", { name: /^go deeper$/i }).click();

  // A new expedition streams — the reader is back on a lesson region.
  await expect(
    page.getByRole("region", { name: /lesson about/i })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /start the quiz/i })
  ).toBeVisible();
});

test("a child can steer to a brand-new expedition", async ({ page }) => {
  await reachQuizDone(page);

  await page.getByRole("button", { name: /explore something new/i }).click();
  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();
});

test("finishing a quiz awards XP (Progress)", async ({ page }) => {
  await reachQuizDone(page);

  // Both canned questions right on the first try → the read reward + 2 bonuses.
  // First visit to the topic, so no badge/level-up yet — just the XP payout.
  await expect(page.getByText(/earned 20 xp/i)).toBeVisible();
});
