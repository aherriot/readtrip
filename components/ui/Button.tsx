"use client";

import { forwardRef } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { Button as HeadlessButton } from "@headlessui/react";
import { Spinner } from "./Spinner";
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
  /**
   * Show a spinner in place of the leading icon and mark the control busy while
   * an action is in flight (a form submit, an async fetch). The button stays
   * disabled for the duration, so it can't be double-fired; keep the label text
   * so the user still reads what's happening. `aria-busy` is set for SRs.
   */
  loading?: boolean;
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
  // Squared-off, like a control drawn into the journal (no pills).
  "inline-flex items-center justify-center gap-2 rounded-[3px] font-display font-medium",
  "select-none whitespace-nowrap no-underline",
  // Press feedback; the global reduced-motion floor neutralizes the transition.
  // Gated on :not(:disabled) so a disabled control never reacts to press/hover.
  "transition-[transform,background-color,box-shadow] duration-150",
  "not-disabled:active:scale-[0.97]",
  // Native disabled stays inert via the `disabled` attribute (blocks click +
  // focus) — no pointer-events-none, so the desktop `not-allowed` cursor from
  // globals.css can show. Links can't be `:disabled`, so a disabled link uses
  // aria-disabled + pointer-events-none to actually block navigation.
  "disabled:opacity-50",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50"
);

const variantStyles: Record<ButtonVariant, string> = {
  // Bright fill + dark ink (≈9:1), framed by a hand-drawn ink pen box — a colored
  // button drawn into the journal. (`.rt-inkbox` adds the ink outline.)
  primary:
    "rt-inkbox bg-sun text-[var(--ink)] not-disabled:hover:brightness-95",
  // Just the hand-drawn pen box (no fill); a soft wash on hover (never hover-only
  // meaning). The quieter sibling of the filled primary.
  secondary:
    "rt-inkbox text-surface-ink not-disabled:hover:bg-surface-ink/(--tint-wash)",
  // Quiet, for tertiary actions; no box, still a real focusable button.
  ghost:
    "bg-transparent text-surface-ink not-disabled:hover:bg-surface-ink/(--tint-wash)",
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
 * The button case renders Headless UI's `Button` (a real `<button type="button">`
 * with focus/hover/active state hooks); when `href` is set it's a real `<a>`
 * instead, so links stay links. Either way keyboard + screen-reader behavior is
 * native, never a clickable `<div>`.
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
    loading,
    className,
    children,
    ...rest
  } = props;

  const classes = buttonClasses({ variant, size, fullWidth, className });
  const content = (
    <>
      {loading ? (
        // A spinner takes the leading slot; the label stays so the action is
        // still named. Kept aria-hidden (Spinner with no label) — aria-busy on
        // the control already tells assistive tech it's working.
        <span aria-hidden="true">
          <Spinner size={size === "md" ? "sm" : "md"} />
        </span>
      ) : (
        leadingIcon && <span aria-hidden="true">{leadingIcon}</span>
      )}
      {children}
      {!loading && trailingIcon && (
        <span aria-hidden="true">{trailingIcon}</span>
      )}
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
        // Links can't be `:disabled`; while loading, block navigation the same
        // way a disabled link does (aria-disabled + the pointer-events rule).
        aria-disabled={loading || undefined}
        aria-busy={loading || undefined}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { type, disabled, ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <HeadlessButton
      ref={ref as React.Ref<HTMLButtonElement>}
      // Headless UI defaults to type="button", so a Button inside a form doesn't
      // submit by surprise; pass an explicit type to override (e.g. submit).
      type={type}
      // A loading button is inert so the action can't be double-fired.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...buttonRest}
    >
      {content}
    </HeadlessButton>
  );
});
