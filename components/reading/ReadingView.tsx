import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

export interface ReadingViewProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

/**
 * The field-journal reading surface (docs/10). A transparent hand-drawn pen box
 * — the same treatment as the quiz `Card` — sitting on the JournalSheet page, so
 * the page's ruled lines show through and the lesson reads as writing on the
 * journal itself. Constrains the column to a comfortable reading measure and
 * keeps the type on the ruled grid (`.rt-journal`). Everything inside reads the
 * `--surface-*` tokens, so `Text`/`Heading` render in their paper variants.
 *
 * Wrap lesson content in this — don't set the paper surface or reading widths
 * ad hoc on a page.
 */
export function ReadingView({
  children,
  className,
  ...rest
}: ReadingViewProps) {
  return (
    <section
      className={cn(
        // Transparent "pen box" (.rt-inkbox, heavier --lift outline like the
        // quiz): the JournalSheet's ruled lines show through — no opaque fill,
        // no separate margin rule. .rt-journal keeps the type on the grid.
        // Top/bottom padding are whole ruled rows so the first line lands on
        // the grid; symmetric horizontal padding (no left margin gutter anymore).
        "mx-auto w-full max-w-2xl rounded-[3px] px-6 py-[var(--journal-period)] text-surface-ink rt-journal rt-inkbox rt-inkbox--lift",
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
