import { expect, test } from "@playwright/test";

// Route protection is enforced by middleware.ts (the `authorized` callback in
// lib/auth/config.ts). These specs hit a real Next server; the happy-path test
// also needs a database (the dev-credentials provider upserts a parent User),
// which CI provides via an ephemeral Neon branch.

test.describe("route protection", () => {
  test("unauthenticated /profiles redirects to sign-in", async ({ page }) => {
    await page.goto("/profiles");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("unauthenticated /play redirects to sign-in", async ({ page }) => {
    await page.goto("/play");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("sign-in page renders the magic-link form", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(
      page.getByRole("heading", { name: /welcome to readtrip/i })
    ).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /email me a sign-in link/i })
    ).toBeVisible();
  });
});

test("parent signs in, creates a child, and enters the child app", async ({
  page,
}) => {
  // Unique email so this parent starts with zero profiles, independent of reruns.
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto("/sign-in");

  // Dev-only credentials form (only rendered outside production). Target by
  // placeholder — the labels carry a "*" for required fields, and "Email" would
  // otherwise also match the magic-link "Email address" field.
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Test Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();

  // Landed in the parent profiles area.
  await expect(page).toHaveURL(/\/profiles/);
  await expect(
    page.getByRole("heading", { name: /who's exploring/i })
  ).toBeVisible();

  // Create a child profile via the modal.
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Name").fill("Ada");
  await dialog.getByRole("button", { name: /create explorer/i }).click();

  // The new profile appears.
  const adaTile = page.getByRole("button", { name: /Ada/ });
  await expect(adaTile).toBeVisible();

  // Select it → a brand-new child calibrates their reading level first.
  await adaTile.click();
  await expect(page).toHaveURL(/\/play\/calibrate/);
  await expect(
    page.getByRole("heading", { name: /find your reading superpower/i })
  ).toBeVisible();
});

test("parent deletes a child profile from the edit modal", async ({ page }) => {
  const email = `e2e-del-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Test Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();
  await expect(page).toHaveURL(/\/profiles/);

  // Create a child to delete.
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const createDialog = page.getByRole("dialog");
  await createDialog.getByLabel("Name").fill("Bram");
  await createDialog.getByRole("button", { name: /create explorer/i }).click();
  const bramTile = page.getByRole("button", { name: /Bram/ });
  await expect(bramTile).toBeVisible();

  // Open the edit modal and delete it (two-step confirm). This must not throw
  // "A React form was unexpectedly submitted" — the delete form is a sibling of
  // the edit form, not nested inside it.
  await page.getByRole("button", { name: /^edit$/i }).click();
  const editDialog = page.getByRole("dialog");
  await editDialog.getByRole("button", { name: /^delete$/i }).click();
  await editDialog.getByRole("button", { name: /delete bram\?/i }).click();

  // The profile is gone.
  await expect(bramTile).toHaveCount(0);
});
