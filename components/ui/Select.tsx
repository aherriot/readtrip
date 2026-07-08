"use client";

import { forwardRef } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import {
  Description,
  Field,
  Label,
  Select as HeadlessSelect,
} from "@headlessui/react";
import { cn } from "@/lib/ui/cn";
import { Icon } from "@/components/ui/Icon";
import { InkFrame } from "@/components/ui/InkFrame";

type SelectSize = "md" | "kid";

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  /** Visible, programmatically-associated label. Required for accessibility. */
  label: string;
  /** Hint shown under the field (e.g. what the chosen option means). */
  hint?: string;
  /**
   * Error message. When set, the field renders the retry treatment
   * (icon + text + color) and is flagged with aria-invalid for screen readers.
   */
  error?: string;
  /** `kid` (default) hits the 56–64px target floor; `md` for dense adult forms. */
  size?: SelectSize;
  /** Keep the label for screen readers but hide it visually. */
  hideLabel?: boolean;
  /** `<option>` / `<optgroup>` elements. */
  children: ReactNode;
}

const sizeStyles: Record<SelectSize, { field: string; pad: string }> = {
  md: { field: "min-h-12 text-base", pad: "py-2 pl-4 pr-10" },
  kid: { field: "min-h-[60px] text-lg", pad: "py-3 pl-5 pr-12" },
};

/**
 * Dropdown for choosing one of several fixed options — a native `<select>` under
 * the hood, so it gets the platform's own picker UI (best mobile keyboard/scroll
 * behavior) for free. Reads `--surface-*` tokens (the single field-journal
 * surface) and wears a hand-drawn `.rt-inkbox` pen box, matching `Input`.
 *
 * Built on Headless UI's `Field` (matching `Input`), which wires the `Label`
 * and hint/error `Description`s to the `Select` so the association can't
 * drift.
 *
 * See the design-system skill for usage guidance:
 * .claude/skills/design-system/references/select.md
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      error,
      size = "kid",
      hideLabel = false,
      required,
      disabled,
      className,
      children,
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

        {/* Hand-drawn ink pen box on the wrapper (a <select> can't carry
            ::before/::after); re-inks to the danger color on error. */}
        <div className="relative rt-inkbox">
          <InkFrame tone={error ? "var(--surface-danger)" : undefined} />
          <HeadlessSelect
            ref={ref}
            required={required}
            invalid={Boolean(error)}
            aria-invalid={error ? true : undefined}
            className={cn(
              "w-full appearance-none rounded-[3px] border-0 bg-surface-panel font-body text-surface-ink",
              "disabled:cursor-not-allowed disabled:opacity-60",
              styles.field,
              styles.pad,
              className
            )}
            {...rest}
          >
            {children}
          </HeadlessSelect>
          <Icon
            name="chevron-down"
            decorative
            className="pointer-events-none absolute inset-y-0 right-4 my-auto text-surface-ink-soft"
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
  }
);
