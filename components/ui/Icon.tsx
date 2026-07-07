import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { DOODLE_FILTER_ID } from "@/components/ui/icons/IconDefs";
import {
  GLYPHS,
  GLYPH_ACCENT,
  type IconName,
} from "@/components/ui/icons/glyphs";

type IconSize = "sm" | "md" | "lg" | "xl";

interface CommonProps {
  size?: IconSize;
  className?: string;
}

// EITHER pick a named glyph from the unified set (the common case) OR pass a
// custom inline `<svg>` as children (one-offs). Named glyphs get the shared
// hand-drawn filter + a token accent for free.
type Content =
  | { name: IconName; accent?: string; children?: never }
  | { name?: never; accent?: never; children: ReactNode };

// An icon is EITHER meaningful (`label` → exposed as `role="img"`) or purely
// decorative (`decorative` → hidden from assistive tech). The union makes
// "unlabelled and not marked decorative" a type error.
type A11y =
  { label: string; decorative?: never } | { decorative: true; label?: never };

export type IconProps = CommonProps & Content & A11y;

const sizeStyles: Record<IconSize, string> = {
  // Box + force the child svg to fill it, so any glyph lands on a consistent size.
  sm: "h-4 w-4 [&>svg]:h-full [&>svg]:w-full",
  md: "h-5 w-5 [&>svg]:h-full [&>svg]:w-full",
  lg: "h-7 w-7 [&>svg]:h-full [&>svg]:w-full",
  xl: "h-12 w-12 [&>svg]:h-full [&>svg]:w-full",
};

/**
 * Single sized, accessibility-aware wrapper for the unified icon set. Prefer
 * `<Icon name="rocket" />` — it pulls the glyph from `components/ui/icons`,
 * applies the shared "doodle" waver, and colors the accent from a design token.
 * Pass `accent` to override the default tone, or `children` for a bespoke `<svg>`.
 *
 * Usage guidance: .claude/skills/design-system/references/icon.md
 */
export function Icon(props: IconProps) {
  const { size = "md", className } = props;
  const decorative = "decorative" in props && props.decorative;
  const named = "name" in props && props.name != null;

  const accent = named ? (props.accent ?? GLYPH_ACCENT[props.name]) : undefined;
  const style = accent
    ? ({ "--icon-accent": accent } as CSSProperties)
    : undefined;

  return (
    <span
      className={cn("inline-flex shrink-0", sizeStyles[size], className)}
      style={style}
      // Labelled → an image with an accessible name. Decorative → removed from
      // the a11y tree (the surrounding text/control carries the meaning).
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : props.label}
      aria-hidden={decorative ? true : undefined}
    >
      {named ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          overflow="visible"
          aria-hidden="true"
        >
          {/* One shared filter gives every glyph the same inked, hand-drawn
              waver — see IconDefs, mounted once in the root layout. The inner
              scale-about-center makes glyphs fill their box for consistent
              optical weight (they're authored with a little breathing room). */}
          <g filter={`url(#${DOODLE_FILTER_ID})`}>
            <g transform="translate(12 12) scale(1.12) translate(-12 -12)">
              {GLYPHS[props.name]}
            </g>
          </g>
        </svg>
      ) : (
        props.children
      )}
    </span>
  );
}
