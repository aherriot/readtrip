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
      className={cn(
        // Solid light paper, ruled lines the text sits on (.rt-lined + .rt-journal
        // lock the type to the grid), inside a hand-drawn pen box (.rt-inkbox).
        "mx-auto w-full max-w-2xl rounded-[3px] bg-surface text-surface-ink rt-lined rt-journal rt-inkbox",
        className
      )}
      // Top/bottom padding are whole ruled rows so the first line lands on the
      // grid; the left gutter (for the margin rule) comes from .rt-lined.
      style={{
        paddingBlock: "var(--journal-period)",
        paddingRight: "1.25rem",
      }}
      {...rest}
    >
      {children}
    </section>
  );
}
