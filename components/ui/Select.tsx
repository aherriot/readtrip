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
 * Surface-aware dropdown for choosing one of several fixed options — a native
 * `<select>` under the hood, so it gets the platform's own picker UI (best
 * mobile keyboard/scroll behavior) for free. Reads `--surface-*` tokens, so the
 * same component renders correctly on both the night and paper surfaces.
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

        <div className="relative">
          <HeadlessSelect
            ref={ref}
            required={required}
            invalid={Boolean(error)}
            aria-invalid={error ? true : undefined}
            className={cn(
              "w-full appearance-none rounded-md border-2 bg-surface-panel font-body text-surface-ink",
              "transition-colors duration-150",
              "focus-visible:border-surface-accent",
              "disabled:cursor-not-allowed disabled:opacity-60",
              styles.field,
              styles.pad,
              error ? "border-surface-danger" : "border-surface-rule",
              className
            )}
            {...rest}
          >
            {children}
          </HeadlessSelect>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute inset-y-0 right-4 my-auto h-5 w-5 text-surface-ink-soft"
          >
            <path
              d="M5 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {hint && !error && (
          <Description className="font-body text-xs text-surface-ink-soft">
            {hint}
          </Description>
        )}

        {error && (
          <Description className="flex items-center gap-1.5 font-body text-xs text-surface-danger">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6Zm1 9.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </Description>
        )}
      </Field>
    );
  }
);
