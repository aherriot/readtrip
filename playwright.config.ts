import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

// E2E tests run against a real Next.js server. Playwright boots it via `webServer`
// below; in CI the DB connection comes from an ephemeral Neon branch (see
// .github/workflows/test.yml), locally from .env.local.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  // Generous default so a cold Next dev compile (first hit to a route) doesn't
  // flake when tests run alongside tsc/eslint/prettier under `npm run check`.
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    navigationTimeout: 60_000,
  },
  projects: [
    // Wakes the local Neon branch and compiles every route/API handler the
    // suite touches, once, before the real specs fan out across workers —
    // avoids the local-only cold-DB/cold-compile flake. See
    // e2e/setup/warmup.setup.ts.
    { name: "setup", testMatch: /.*\.setup\.ts$/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
      testIgnore: /.*\.setup\.ts$/,
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Force the LLM offline (canned lesson) so the loop's generative steps are
    // deterministic and fast in e2e — no live model calls, no API key needed.
    // Matches how CI already runs (no ANTHROPIC_API_KEY); the flag makes local
    // runs behave the same even when .env.local has a real key.
    env: { READTRIP_OFFLINE_LLM: "1" },
  },
});
