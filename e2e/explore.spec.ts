import { expect, test } from "@playwright/test";
import { reachExplore, revealTopic } from "./helpers";

// The Explore screen is the child's home once calibrated: free-form entry plus a
// few curated suggestions to jump straight in. Free-form input hits the live LLM
// (safety + normalize), so these specs drive the suggestion path — a known
// concept that resolves client-side without a model call — and the rendering /
// wiring around it. Needs a real Next server + DB (dev-credentials sign-in).

const CHILD = {
  emailPrefix: "explore",
  parentName: "Explore Parent",
  childName: "Nadia",
};

test("shows free-form entry plus suggested topics, with the Explore button gated on input", async ({
  page,
}) => {
  await reachExplore(page, CHILD);

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
  await reachExplore(page, CHILD);

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
