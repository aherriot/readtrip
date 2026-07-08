import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { InkFrame } from "@/components/ui/icons/InkFrame";

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
   * Emphasize the card as a **Panel**. In the field-journal language that's a
   * heavier, "drawn-twice" ink outline rather than a drop shadow/glow — it reads
   * on either surface (the ink follows `--surface-ink`).
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
 * Surface-aware container — a transparent "pen box" drawn on the lined paper: the
 * ruled lines show through and a hand-drawn ink outline (the #rt-sketch filter)
 * frames the content. Reads `--surface-*` tokens, so the ink is dark on the light
 * journal and cream on the dark one. `elevated` is the heavier "Panel" outline.
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
        // A transparent "pen box" drawn on the lined paper — the ruled lines show
        // through, and the ink outline is hand-drawn by the #rt-sketch filter
        // (see .rt-inkbox in globals.css). No opaque panel fill.
        "rounded-[3px] text-surface-ink rt-inkbox",
        paddingStyles[padding],
        className
      )}
      {...rest}
    >
      <InkFrame weight={elevated ? 2.6 : 1.8} />
      {children}
    </Tag>
  );
}
