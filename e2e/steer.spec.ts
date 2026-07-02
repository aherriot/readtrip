import { expect, test, type Page } from "@playwright/test";

// The Steer step (docs/09 M4): after finishing the quiz, the child chooses where
// to go next — a "go deeper" follow-up that threads a new loop onto the one they
// just finished, or a fresh expedition. Difficulty adaptation runs server-side
// off the quiz score (unit-tested in lib/reading/adapt.test.ts). Like the quiz
// spec this drives the offline (canned) loop, so it never calls a live LLM but
// needs a real Next server + DB. Mirrors e2e/quiz.spec.ts.

// From the (hydrated) Explore screen: tap Dinosaurs, read the lesson, and answer
// the 2-question canned quiz correctly through to its result screen. Reusable so
// a test can replay the *same* topic to build up per-topic progress.
async function playDinosaursToDone(page: Page) {
  await page.getByRole("button", { name: /dinosaurs tap to explore/i }).click();
  await expect(
    page.getByRole("button", { name: /start the quiz/i })
  ).toBeVisible();
  await page.getByRole("button", { name: /start the quiz/i }).click();

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

  await playDinosaursToDone(page);
}

test("a child can go deeper into the topic they just finished", async ({
  page,
}) => {
  await reachQuizDone(page);

  // Steer offers a "go deeper" choice.
  await page.getByRole("button", { name: /^go deeper$/i }).click();

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
  // The RewardBurst pops the "+20 XP" gain. First visit to the topic, so no
  // mastery stamp and no level-up overlay yet — just the XP payout.
  await expect(page.getByText("+20 XP")).toBeVisible();
  await expect(page.getByRole("img", { name: /master badge/i })).toBeHidden();
  await expect(page.getByRole("dialog", { name: /level/i })).toBeHidden();
});

test("replaying a topic masters it and levels up (Progress)", async ({
  page,
}) => {
  // Visit 1 earns 20 XP; the topic isn't mastered yet (needs a revisit).
  await reachQuizDone(page);
  await expect(page.getByRole("img", { name: /master badge/i })).toBeHidden();

  // Dismiss any celebration overlay, then steer back to Explore and replay the
  // *same* topic. (Visit 1 doesn't level up, but the dismiss is harmless.)
  await page.getByRole("button", { name: /explore something new/i }).click();
  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();
  await playDinosaursToDone(page);

  // Visit 2: the cumulative 40 XP crosses the Level 2 threshold, so the
  // LevelUpCelebration overlay opens (it aria-hides the page behind it, so assert
  // + dismiss it first).
  await expect(page.getByText("+20 XP")).toBeVisible();
  const levelUp = page.getByRole("dialog", { name: "Level 2!" });
  await expect(levelUp).toBeVisible();
  await levelUp.getByRole("button", { name: /keep exploring/i }).click();
  await expect(levelUp).toBeHidden();

  // A second strong score also masters Dinosaurs — the ExpeditionStamp is now on
  // the (no-longer-hidden) Steer screen.
  await expect(
    page.getByRole("img", { name: "Dinosaurs Master badge" })
  ).toBeVisible();
});
