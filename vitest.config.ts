import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit layer: pure, non-DOM logic only (validation, math, parsing, schemas).
// Anything that needs the DOM, computed styles, or layout belongs in Playwright
// (`e2e/`), which runs against a real browser — see AGENTS.md.
export default defineConfig({
  resolve: {
    // Mirror tsconfig's "@/*" -> "./*" so unit tests can import the same
    // `@/...` paths the app uses, instead of every test file falling back to
    // fragile relative imports across directories.
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    // Co-located with source as `*.test.ts`. `e2e/` is Playwright's (`*.spec.ts`)
    // and must never be picked up here, or the two runners collide.
    include: ["**/*.test.ts"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    environment: "node",
  },
});
