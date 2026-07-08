import type { CSSProperties } from "react";
import { cn } from "@/lib/ui/cn";
import type { AvatarColor } from "@/lib/children/validation";

// Same hand-run felt-tip edge the color swatches use (.rt-torn in globals.css,
// masked to the shared --rt-inked-blob shape) — a rough round patch, as if a
// highlighter marker coloured it in, rather than a printed circle.
const AVATAR_TOKEN: Record<AvatarColor, string> = {
  sun: "--sun",
  coral: "--coral",
  aqua: "--aqua",
  leaf: "--leaf",
  violet: "--violet",
};

/** Small, stable tilt from the name so a repeated avatar doesn't look stamped. */
function tiltFor(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ((h % 5) - 2) * 1.6; // -3.2° … +3.2°
}

export interface AvatarProps {
  /** Which marker color fills the shape. */
  color: AvatarColor;
  /** The explorer's name — only its first letter is shown. */
  name: string;
  /** `lg` (profile cards) or `sm` (compact chrome, e.g. a header). */
  size?: "sm" | "lg";
  className?: string;
}

/**
 * The explorer token — a rough, hand-coloured round patch (a highlighter
 * marker scribbled inside a hand-drawn circle) with the explorer's initial
 * inked on top. Usage guidance: .claude/skills/design-system/references/avatar.md
 */
export function Avatar({ color, name, size = "lg", className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center font-display font-semibold text-[var(--ink)]",
        size === "lg" ? "h-16 w-16 text-2xl" : "h-9 w-9 text-base",
        className
      )}
    >
      <span
        className="rt-torn absolute inset-0"
        style={
          {
            backgroundColor: `var(${AVATAR_TOKEN[color]})`,
            rotate: `${tiltFor(color + name)}deg`,
          } as CSSProperties
        }
      />
      <span className="relative">
        {name.trim().charAt(0).toUpperCase() || "?"}
      </span>
    </span>
  );
}
