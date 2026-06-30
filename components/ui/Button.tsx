"use client";

import { forwardRef } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/ui/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "kid";

interface CommonProps {
  /** Visual weight. `primary` = the one clear action; `secondary`/`ghost` are quieter. */
  variant?: ButtonVariant;
  /** `kid` (default) hits the 56–64px touch-target floor; `md` for dense adult forms. */
  size?: ButtonSize;
  /** Decorative icon before the label (kept `aria-hidden` — the label carries meaning). */
  leadingIcon?: ReactNode;
  /** Decorative icon after the label. */
  trailingIcon?: ReactNode;
  /** Stretch to fill the container — good for stacked, thumb-friendly mobile actions. */
  fullWidth?: boolean;
}

/**
 * A `Button` is either a real `<button>` or, when `href` is set, a real `<a>` —
 * never a clickable `<div>`, so keyboard + screen-reader behavior comes for free.
 */
type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type { ButtonProps, AnchorProps, ButtonVariant, ButtonSize };

const base = cn(
  "inline-flex items-center justify-center gap-2 rounded-pill font-display font-medium",
  "select-none whitespace-nowrap no-underline",
  // Press feedback; the global reduced-motion floor neutralizes the transition.
  "transition-[transform,background-color,border-color,box-shadow] duration-150",
  "active:scale-[0.97]",
  // Disabled covers both the native attribute and the link's aria-disabled.
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50"
);

const variantStyles: Record<ButtonVariant, string> = {
  // Bright fill + dark ink (≈9:1) — the documented accessible pairing.
  primary:
    "border-2 border-transparent bg-sun text-[var(--ink)] hover:brightness-95",
  // Outline that reads on either surface; fills softly on hover (never hover-only meaning).
  secondary:
    "border-2 border-coral text-surface-ink bg-transparent hover:bg-coral/15",
  // Quiet, for tertiary actions; still a real focusable button.
  ghost:
    "border-2 border-transparent bg-transparent text-surface-ink hover:bg-surface-ink/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  // 44px floor for dense adult UI.
  md: "min-h-11 px-5 text-base",
  // 56–64px kid target floor.
  kid: "min-h-[60px] px-7 text-lg",
};

function buttonClasses({
  variant = "primary",
  size = "kid",
  fullWidth = false,
  className,
}: Pick<CommonProps, "variant" | "size" | "fullWidth"> & {
  className?: string;
}) {
  return cn(
    base,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );
}

/**
 * The one way to render an action in ReadTrip. Variants/size are tokens, not
 * ad-hoc CSS, so every button across pages matches. Icon-only buttons MUST pass
 * an `aria-label` (there's no visible text to name them).
 *
 * Usage guidance: .claude/skills/design-system/references/button.md
 */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps | AnchorProps
>(function Button(props, ref) {
  const {
    variant,
    size,
    leadingIcon,
    trailingIcon,
    fullWidth,
    className,
    children,
    ...rest
  } = props;

  const classes = buttonClasses({ variant, size, fullWidth, className });
  const content = (
    <>
      {leadingIcon && <span aria-hidden="true">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } =
      rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { type, ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      // Default to "button" so a Button inside a form doesn't submit by surprise.
      type={type ?? "button"}
      className={classes}
      {...buttonRest}
    >
      {content}
    </button>
  );
});
