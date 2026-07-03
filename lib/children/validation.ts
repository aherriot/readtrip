// Pure validation for child-profile input. No DB or framework deps, so it's unit
// tested in validation.test.ts and reused by the server actions.
import {
  MAX_READING_LEVEL,
  MIN_READING_LEVEL,
} from "../llm/prompts/readingLevel";

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
  /**
   * Manually chosen reading level (1..7). Omitted on the create form — a new
   * child's starting level comes from the calibration mini-game — and present
   * only when the parent edits the level directly.
   */
  readingLevel?: number;
}

export type ValidationResult =
  { ok: true; value: ChildInput } | { ok: false; error: string };

function isAvatarColor(value: unknown): value is AvatarColor {
  return (
    typeof value === "string" &&
    (AVATAR_COLORS as readonly string[]).includes(value)
  );
}

/** Avatar color used when a Child's stored avatarConfig is missing or malformed. */
export const DEFAULT_AVATAR_COLOR: AvatarColor = "aqua";

/**
 * Coerce a Child's stored `avatarConfig` (jsonb, typed `unknown`) into a known
 * avatar color, falling back to the default for missing, legacy, or malformed
 * data so a hand-edited or pre-palette row can never crash a render.
 */
export function avatarColorFromConfig(config: unknown): AvatarColor {
  const color =
    typeof config === "object" && config !== null
      ? (config as { color?: unknown }).color
      : undefined;
  return isAvatarColor(color) ? color : DEFAULT_AVATAR_COLOR;
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
  readingLevel?: unknown;
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

  const value: ChildInput = { displayName, avatarColor: raw.avatarColor };

  // Reading level is optional — only validated (and included) when the form
  // sends it, i.e. the edit form. An empty string / missing means "leave it".
  if (raw.readingLevel !== undefined && raw.readingLevel !== "") {
    const level = Number(raw.readingLevel);
    if (
      !Number.isInteger(level) ||
      level < MIN_READING_LEVEL ||
      level > MAX_READING_LEVEL
    ) {
      return {
        ok: false,
        error: `Pick a reading level between ${MIN_READING_LEVEL} and ${MAX_READING_LEVEL}.`,
      };
    }
    value.readingLevel = level;
  }

  return { ok: true, value };
}
