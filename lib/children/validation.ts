// Pure validation for child-profile input. No DB or framework deps, so it's unit
// tested in validation.test.ts and reused by the server actions.

// Avatar color comes from the accent palette (styles/tokens.css). Stored on
// Child.avatarConfig as { color }. The full cosmetic system lands later; for now
// a child picks one accent color for their avatar.
export const AVATAR_COLORS = [
  "sun",
  "coral",
  "aqua",
  "leaf",
  "violet",
] as const;

export type AvatarColor = (typeof AVATAR_COLORS)[number];

export const MAX_NAME_LENGTH = 40;

export interface ChildInput {
  displayName: string;
  avatarColor: AvatarColor;
}

export type ValidationResult =
  { ok: true; value: ChildInput } | { ok: false; error: string };

function isAvatarColor(value: unknown): value is AvatarColor {
  return (
    typeof value === "string" &&
    (AVATAR_COLORS as readonly string[]).includes(value)
  );
}

/**
 * Validate + normalize raw form input into a `ChildInput`. Trims the name,
 * enforces a non-empty length cap, and checks the avatar color against the
 * allowed palette. Returns a tagged result rather than throwing so callers can
 * surface the message in the form.
 */
export function validateChildInput(raw: {
  displayName?: unknown;
  avatarColor?: unknown;
}): ValidationResult {
  const displayName =
    typeof raw.displayName === "string" ? raw.displayName.trim() : "";

  if (!displayName) {
    return { ok: false, error: "Enter a name for this explorer." };
  }
  if (displayName.length > MAX_NAME_LENGTH) {
    return {
      ok: false,
      error: `Keep the name under ${MAX_NAME_LENGTH} characters.`,
    };
  }
  if (!isAvatarColor(raw.avatarColor)) {
    return { ok: false, error: "Pick an avatar color." };
  }

  return { ok: true, value: { displayName, avatarColor: raw.avatarColor } };
}
