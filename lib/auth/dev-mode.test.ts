import { afterEach, describe, expect, it, vi } from "vitest";
import { isDevSignInAllowed } from "./dev-mode";

// Deterministic env per case: stub the three vars the predicate reads and clear
// them afterward. `devAuthEnabled` is evaluated at import time (it gates static
// provider registration) so it isn't covered here — `isDevSignInAllowed` reads
// env at call time and is the actual security boundary.
afterEach(() => {
  vi.unstubAllEnvs();
});

function setEnv(env: { vercel?: string; node?: string; allow?: string }) {
  vi.stubEnv("VERCEL_ENV", env.vercel ?? "");
  vi.stubEnv("NODE_ENV", env.node ?? "test");
  vi.stubEnv("DEV_SIGNIN_ALLOWED_EMAILS", env.allow ?? "");
}

describe("isDevSignInAllowed", () => {
  it("denies everything in real production (Vercel)", () => {
    setEnv({ vercel: "production", allow: "me@example.com" });
    expect(isDevSignInAllowed("me@example.com")).toBe(false);
  });

  it("denies everything in real production (non-Vercel, NODE_ENV)", () => {
    setEnv({ node: "production", allow: "me@example.com" });
    expect(isDevSignInAllowed("me@example.com")).toBe(false);
  });

  it("allows any email locally/CI when no allowlist is set", () => {
    setEnv({ node: "test" });
    expect(isDevSignInAllowed("anyone@example.com")).toBe(true);
  });

  it("denies all on a preview when no allowlist is set", () => {
    setEnv({ vercel: "preview" });
    expect(isDevSignInAllowed("anyone@example.com")).toBe(false);
  });

  it("allows only listed emails on a preview when an allowlist is set", () => {
    setEnv({
      vercel: "preview",
      allow: "me@example.com, teammate@example.com",
    });
    expect(isDevSignInAllowed("me@example.com")).toBe(true);
    expect(isDevSignInAllowed("teammate@example.com")).toBe(true);
    expect(isDevSignInAllowed("stranger@example.com")).toBe(false);
  });

  it("normalizes case and whitespace on both sides", () => {
    setEnv({ vercel: "preview", allow: " Me@Example.com " });
    expect(isDevSignInAllowed("  ME@EXAMPLE.COM ")).toBe(true);
  });

  it("rejects an empty email", () => {
    setEnv({ node: "test" });
    expect(isDevSignInAllowed("")).toBe(false);
    expect(isDevSignInAllowed("   ")).toBe(false);
  });

  it("restricts to the allowlist even locally when one is set", () => {
    setEnv({ node: "test", allow: "me@example.com" });
    expect(isDevSignInAllowed("me@example.com")).toBe(true);
    expect(isDevSignInAllowed("stranger@example.com")).toBe(false);
  });
});
