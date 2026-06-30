import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * Element to render. Defaults to `div`. Use `section`/`article`/`li` for
   * semantics — a Card is a container, never an interactive control (wrap a
   * `Button`/link inside instead of making the whole card clickable).
   */
  as?: ElementType;
  /** Inner padding from the spacing scale. */
  padding?: CardPadding;
  /**
   * Lift the card off the surface. On paper this is a soft shadow; on night it's
   * a colored glow ("lit-up panel"). Both come from `--surface-elevation`, so a
   * card looks right on whichever surface contains it. This is the **Panel** look.
   */
  elevated?: boolean;
  children?: ReactNode;
}

const paddingStyles: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Surface-aware container. Reads `--surface-*` tokens, so the same Card renders
 * as a warm paper card on the reading surface and a glowing night panel on the
 * play surface. `elevated` is the "Panel" treatment.
 *
 * Usage guidance: .claude/skills/design-system/references/card.md
 */
export function Card({
  as: Tag = "div",
  padding = "md",
  elevated = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-surface-rule bg-surface-panel text-surface-ink",
        paddingStyles[padding],
        // --surface-elevation is a soft shadow on paper, a colored glow on night.
        elevated && "shadow-[var(--surface-elevation)]",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
