import { expect, test, type Page } from "@playwright/test";

// The quiz step (docs/09 M4): after the lesson, the child taps "Start the quiz",
// /api/quiz generates a schema-valid quiz (and persists the Loop), and QuizCard
// gives icon+text+color feedback. Real generation needs the Anthropic API, which
// CI doesn't provide — so the server falls back to a deterministic canned quiz
// (lib/llm/quiz.ts). These specs drive the suggestion → lesson → quiz path, which
// resolves client-side and never calls a live LLM. Needs a real Next server + DB.

// Sign in, add a child, play calibration, land on Explore hydrated, then tap the
// Dinosaurs suggestion and read through to the lesson's done state. Mirrors
// e2e/lesson.spec.ts. First option each calibration round is deterministic.
async function reachLessonDone(page: Page) {
  const email = `e2e-quiz-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Quiz Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();

  await expect(page).toHaveURL(/\/profiles/);
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Nova");
  await dialog.getByRole("button", { name: /create explorer/i }).click();

  await page.getByRole("button", { name: /Nova/ }).click();
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

  // Suggestion → lesson streams → done state offers the quiz.
  await page.getByRole("button", { name: /dinosaurs tap to explore/i }).click();
  await expect(
    page.getByRole("region", { name: /lesson about dinosaurs/i })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /start the quiz/i })
  ).toBeVisible();
}

test("a child plays the quiz through to a result", async ({ page }) => {
  await reachLessonDone(page);

  await page.getByRole("button", { name: /start the quiz/i }).click();

  // The canned (offline) quiz has 2 questions. Q1's correct choice is the topic
  // title itself.
  await expect(
    page.getByRole("progressbar", { name: /quiz progress/i })
  ).toBeVisible();
  await page.getByRole("button", { name: /^dinosaurs$/i }).click();

  // Correct tap reveals the advance button.
  await expect(
    page.getByRole("button", { name: /next question/i })
  ).toBeVisible();
  await page.getByRole("button", { name: /next question/i }).click();

  // Q2: pick the correct choice, then finish.
  await page
    .getByRole("button", { name: /reading and asking questions/i })
    .click();
  await page.getByRole("button", { name: /finish/i }).click();

  // Result: both right on the first try, and a way back to Explore (Steer).
  await expect(page.getByText(/2 of 2 on the first try/i)).toBeVisible();
  await page.getByRole("button", { name: /explore something new/i }).click();
  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();
});

test("a wrong tap is a gentle 'try again', not a failure", async ({ page }) => {
  await reachLessonDone(page);
  await page.getByRole("button", { name: /start the quiz/i }).click();
  await expect(
    page.getByRole("progressbar", { name: /quiz progress/i })
  ).toBeVisible();

  // Tap the wrong answer on Q1: it becomes "Try again" and the quiz stays put.
  const wrong = page.getByRole("button", { name: /nothing at all/i });
  await wrong.click();
  // Assert via the choice's accessible name (what a screen reader announces).
  // getByText(/try again/i) would also match the invisible width-reserving
  // placeholder badges each choice renders, tripping strict mode.
  await expect(wrong).toHaveAccessibleName(/try again/i);
  await expect(
    page.getByRole("button", { name: /next question/i })
  ).toBeHidden();

  // The child can still get it right and move on.
  await page.getByRole("button", { name: /^dinosaurs$/i }).click();
  await expect(
    page.getByRole("button", { name: /next question/i })
  ).toBeVisible();
});
