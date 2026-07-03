import type { Page } from "@playwright/test";

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
