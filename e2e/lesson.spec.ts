import { expect, test } from "@playwright/test";
import { reachExplore, revealTopic } from "./helpers";

// The lesson step (docs/09 M4): once a topic is resolved, /api/lesson streams a
// level-appropriate lesson onto the field-journal reading surface. Real
// generation needs the Anthropic API, which CI doesn't provide — so the server
// falls back to a deterministic canned lesson when ANTHROPIC_API_KEY is absent
// (lib/llm/lesson.ts). These specs drive the suggestion → lesson path, which
// resolves client-side and never calls /api/explore's live LLM, exercising the
// streaming wiring + reading UI end-to-end. Needs a real Next server + DB.

const CHILD = {
  emailPrefix: "lesson",
  parentName: "Lesson Parent",
  childName: "Ravi",
};

test("tapping a suggestion streams a lesson onto the reading surface", async ({
  page,
}) => {
  await reachExplore(page, CHILD);

  await revealTopic(page, /dinosaurs tap to explore/i);
  await page.getByRole("button", { name: /dinosaurs tap to explore/i }).click();

  // The reading view opens with the topic as its title...
  const lesson = page.getByRole("region", { name: /lesson about dinosaurs/i });
  await expect(lesson).toBeVisible();
  await expect(
    lesson.getByRole("heading", { name: /^dinosaurs$/i })
  ).toBeVisible();

  // ...and streams lesson text mentioning the topic (canned lesson in CI).
  await expect(lesson).toContainText(/dinosaurs/i);

  // When the stream finishes, the child can move on.
  await expect(
    page.getByRole("button", { name: /explore something else/i })
  ).toBeVisible();
});

test("free-form input resolves through /api/explore into a lesson", async ({
  page,
}) => {
  await reachExplore(page, CHILD);

  // Free-form (unlike a suggestion) goes to /api/explore first: safety_precheck
  // → normalize_topic. Offline (no API key, as on a keyless preview) both degrade
  // gracefully instead of 500ing, and the resolved topic opens the lesson.
  await page
    .getByLabel(/what do you want to explore/i)
    .fill("why is the sky blue?");
  await page.getByRole("button", { name: /^explore$/i }).click();

  await expect(
    page.getByRole("region", { name: /lesson about/i })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /explore something else/i })
  ).toBeVisible();
});

test("the child can leave a lesson and explore something new", async ({
  page,
}) => {
  await reachExplore(page, CHILD);

  // Tile order is randomized, so Outer Space may sit behind "Show more".
  await revealTopic(page, /outer space tap to explore/i);
  await page
    .getByRole("button", { name: /outer space tap to explore/i })
    .click();
  await expect(
    page.getByRole("region", { name: /lesson about outer space/i })
  ).toBeVisible();

  await page.getByRole("button", { name: /explore something else/i }).click();

  // Back to the Explore entry, ready for the next trip.
  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();
});
