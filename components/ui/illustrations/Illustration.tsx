import { cn } from "@/lib/ui/cn";
import type { IllustrationName } from "./catalog";
import { ILLUSTRATIONS } from "./registry";

export type { IllustrationName };

type IllustrationSize = "md" | "lg" | "xl";

const sizeStyles: Record<IllustrationSize, string> = {
  md: "h-24 w-24 [&>svg]:h-full [&>svg]:w-full", // 96px
  lg: "h-36 w-36 [&>svg]:h-full [&>svg]:w-full", // 144px
  xl: "h-52 w-52 [&>svg]:h-full [&>svg]:w-full", // 208px
};

// An illustration is EITHER meaningful (`label`) or purely decorative
// (`decorative`) — same a11y contract as `Icon`.
type A11y =
  { label: string; decorative?: never } | { decorative: true; label?: never };

export type IllustrationProps = {
  name: IllustrationName;
  size?: IllustrationSize;
  className?: string;
} & A11y;

/**
 * A larger, more detailed field-journal illustration — the "hero doodle"
 * counterpart to `Icon`. Same ink-outline + marker-accent language, scaled up
 * with more linework, drawn from its own dynamically-imported module so a
 * page only downloads the illustrations it actually renders (see
 * `components/ui/illustrations/registry.ts`).
 *
 * Still early/iterating, so — unlike `Icon` — this isn't held to the full
 * design-system parity bar (no `/dev/components` gallery section or e2e
 * contract test yet); it lives under `illustrations/` rather than directly
 * in `components/ui/` for that reason, same as the `icons/` glyph internals.
 */
export function Illustration({
  name,
  size = "lg",
  className,
  ...a11y
}: IllustrationProps) {
  const decorative = "decorative" in a11y && a11y.decorative;
  const Art = ILLUSTRATIONS[name];

  return (
    <span
      className={cn("inline-flex shrink-0", sizeStyles[size], className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : a11y.label}
      aria-hidden={decorative ? true : undefined}
    >
      <Art />
    </span>
  );
}
