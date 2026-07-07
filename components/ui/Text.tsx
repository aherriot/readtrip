import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type TextSize = "xs" | "sm" | "base" | "lg";
type TextTone = "default" | "soft";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Element to render — `p` (default) for paragraphs, `span` for inline runs. */
  as?: ElementType;
  /** Type-scale size. `base` is the legible reading default. */
  size?: TextSize;
  /** `soft` = secondary/supporting text (still AA on the paper). */
  tone?: TextTone;
  /**
   * Apply reading-measure constraints (≈62ch max line length). Turn on for body
   * copy in lessons so lines don't run too long to track; off for UI labels.
   */
  measure?: boolean;
  children: ReactNode;
}

const sizeStyles: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

const toneStyles: Record<TextTone, string> = {
  default: "text-surface-ink",
  soft: "text-surface-ink-soft",
};

/**
 * Body text in Lexend on the type scale. The reading-legibility defaults
 * (Lexend, line-height 1.6, capped measure) live here so lesson copy stays
 * readable for early readers. Never set raw font sizes in a page.
 *
 * Usage guidance: .claude/skills/design-system/references/text.md
 */
export function Text({
  as: Tag = "p",
  size = "base",
  tone = "default",
  measure = false,
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn(
        "font-body leading-relaxed",
        sizeStyles[size],
        toneStyles[tone],
        measure && "max-w-[62ch]",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
