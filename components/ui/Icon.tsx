import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type IconSize = "sm" | "md" | "lg";

interface BaseIconProps {
  /** The glyph — an inline `<svg>`. It's sized by the wrapper, so author it at any viewBox. */
  children: ReactNode;
  size?: IconSize;
  className?: string;
}

/**
 * An icon is EITHER meaningful (give it a `label` → exposed as `role="img"`) or
 * purely decorative (`decorative` → hidden from assistive tech). The union makes
 * "unlabelled and not marked decorative" a type error, so an icon can't silently
 * become an unnamed image to a screen reader.
 */
type LabelledIcon = BaseIconProps & { label: string; decorative?: never };
type DecorativeIcon = BaseIconProps & { decorative: true; label?: never };
export type IconProps = LabelledIcon | DecorativeIcon;

const sizeStyles: Record<IconSize, string> = {
  // Box + force the child svg to fill it, so any glyph lands on a consistent size.
  sm: "h-4 w-4 [&>svg]:h-full [&>svg]:w-full",
  md: "h-5 w-5 [&>svg]:h-full [&>svg]:w-full",
  lg: "h-7 w-7 [&>svg]:h-full [&>svg]:w-full",
};

/**
 * Single sized, accessibility-aware wrapper for the icon set. Use it instead of
 * dropping raw `<svg>`s into pages so every icon is consistently sized and
 * correctly labelled (or correctly hidden).
 *
 * Usage guidance: .claude/skills/design-system/references/icon.md
 */
export function Icon(props: IconProps) {
  const { children, size = "md", className } = props;
  const decorative = "decorative" in props && props.decorative;

  return (
    <span
      className={cn("inline-flex shrink-0", sizeStyles[size], className)}
      // Labelled → an image with an accessible name. Decorative → removed from
      // the a11y tree (the surrounding text/control carries the meaning).
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : props.label}
      aria-hidden={decorative ? true : undefined}
    >
      {children}
    </span>
  );
}
