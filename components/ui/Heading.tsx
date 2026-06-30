import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = "lg" | "xl" | "2xl" | "3xl";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level → `h1`–`h6`. Drives document outline; pick by structure, not size. */
  level?: HeadingLevel;
  /**
   * Visual size token, decoupled from `level` so you can keep a correct heading
   * order while tuning scale. Defaults from the level.
   */
  size?: HeadingSize;
  children: ReactNode;
}

// Default visual size per level; override with `size` when structure and scale
// need to differ (e.g. an h2 that should read smaller).
const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  1: "3xl",
  2: "2xl",
  3: "xl",
  4: "lg",
  5: "lg",
  6: "lg",
};

const sizeStyles: Record<HeadingSize, string> = {
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

/**
 * Display-font heading on the type scale. Renders the right `h1`–`h6` for the
 * document outline; never style a raw `<h_>` in a page — go through this so the
 * scale and family stay consistent.
 *
 * Usage guidance: .claude/skills/design-system/references/heading.md
 */
export function Heading({
  level = 2,
  size,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(
        "font-display font-semibold text-balance text-surface-ink",
        sizeStyles[size ?? defaultSizeForLevel[level]],
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
