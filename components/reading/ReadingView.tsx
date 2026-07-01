import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

export interface ReadingViewProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

/**
 * The field-journal reading surface (docs/10). Switches the region to the warm
 * `paper` surface, constrains the column to a comfortable reading measure, and
 * lets the child focus on the lesson. Everything inside reads the `--surface-*`
 * tokens, so `Text`/`Heading`/`Card` render in their paper variants automatically.
 *
 * Wrap lesson (and later quiz) content in this — don't set the paper surface or
 * reading widths ad hoc on a page.
 */
export function ReadingView({
  children,
  className,
  ...rest
}: ReadingViewProps) {
  return (
    <section
      data-surface="paper"
      className={cn(
        "mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-3xl bg-surface p-6 text-surface-ink shadow-[var(--surface-elevation)] sm:p-8",
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
