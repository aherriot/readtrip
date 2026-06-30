"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

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
 * Surface-aware text input. Reads `--surface-*` tokens, so the same component
 * renders correctly on both the night and paper surfaces. Never color-only:
 * errors carry an icon + text alongside the retry color.
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
    id,
    required,
    className,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const styles = sizeStyles[size];

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
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
      </label>

      <div className="relative">
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
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-md border-2 bg-surface-panel font-body text-surface-ink",
            "placeholder:text-surface-ink-soft",
            "transition-colors duration-150",
            // Focus affordance beyond the global focus-visible ring.
            "focus-visible:border-surface-accent",
            styles.field,
            styles.pad,
            leadingIcon && styles.icon,
            error ? "border-surface-danger" : "border-surface-rule",
            className
          )}
          {...rest}
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="font-body text-xs text-surface-ink-soft">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1.5 font-body text-xs text-surface-danger"
        >
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
        </p>
      )}
    </div>
  );
});
