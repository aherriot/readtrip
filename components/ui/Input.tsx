"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import {
  Description,
  Field,
  Input as HeadlessInput,
  Label,
} from "@headlessui/react";
import { cn } from "@/lib/ui/cn";
import { Icon } from "@/components/ui/Icon";

type InputSize = "md" | "kid";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** Visible, programmatically-associated label. Required for accessibility. */
  label: string;
  /** Hint shown under the field (e.g. "Use the name your grown-up gave you"). */
  hint?: string;
  /**
   * Error message. When set, the field renders the retry treatment
   * (icon + text + color) and is flagged with aria-invalid for screen readers.
   */
  error?: string;
  /** `kid` (default) hits the 56–64px target floor; `md` for dense adult forms. */
  size?: InputSize;
  /** Optional decorative icon rendered inside the field, before the text. */
  leadingIcon?: ReactNode;
  /** Keep the label for screen readers but hide it visually. */
  hideLabel?: boolean;
}

const sizeStyles: Record<
  InputSize,
  { field: string; pad: string; icon: string }
> = {
  md: { field: "min-h-12 text-base", pad: "px-4", icon: "pl-12" },
  kid: { field: "min-h-[60px] text-lg", pad: "px-5", icon: "pl-14" },
};

/**
 * Text input for the field journal. Reads `--surface-*` tokens (the single
 * surface) and wears a hand-drawn `.rt-inkbox` pen box instead of a plain border.
 * Never color-only: errors carry an icon + text alongside the retry color.
 *
 * Built on Headless UI's `Field`, which wires the `Label`, hint/error
 * `Description`s, and the `Input` together (matching `id`/`htmlFor`,
 * `aria-describedby`, disabled propagation) so the association can't drift.
 *
 * See the design-system skill for usage guidance:
 * .claude/skills/design-system/references/input.md
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    size = "kid",
    leadingIcon,
    hideLabel = false,
    required,
    disabled,
    className,
    ...rest
  },
  ref
) {
  const styles = sizeStyles[size];

  return (
    <Field disabled={disabled} className="flex flex-col gap-1.5">
      <Label
        className={cn(
          "font-body text-sm font-medium text-surface-ink",
          hideLabel && "sr-only"
        )}
      >
        {label}
        {required && (
          <span className="text-surface-danger" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </Label>

      {/* The hand-drawn ink pen box lives on the wrapper (an <input> can't carry
          ::before/::after); it re-inks to the danger color on error. */}
      <div className={cn("relative rt-inkbox", error && "rt-inkbox--danger")}>
        {leadingIcon && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center text-surface-ink-soft",
              size === "kid" ? "pl-5" : "pl-4"
            )}
          >
            {leadingIcon}
          </span>
        )}
        <HeadlessInput
          ref={ref}
          required={required}
          invalid={Boolean(error)}
          // Explicit too, so the contract holds regardless of how `invalid`
          // surfaces in the DOM.
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full rounded-[3px] border-0 bg-surface-panel font-body text-surface-ink",
            "placeholder:text-surface-ink-soft",
            "disabled:cursor-not-allowed disabled:opacity-60",
            styles.field,
            styles.pad,
            leadingIcon && styles.icon,
            className
          )}
          {...rest}
        />
      </div>

      {hint && !error && (
        <Description className="font-body text-xs text-surface-ink-soft">
          {hint}
        </Description>
      )}

      {error && (
        <Description className="flex items-center gap-1.5 font-body text-xs text-surface-danger">
          <Icon name="alert" decorative size="sm" />
          {error}
        </Description>
      )}
    </Field>
  );
});
