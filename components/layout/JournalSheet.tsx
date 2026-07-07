import type { CSSProperties, ReactNode } from "react";

/**
 * The "open field journal on a desk" page frame.
 *
 * A light greige desk (`.rt-desk`) fills the viewport; the ruled page
 * (`.rt-sheet`) rests on it — lifted by a soft shadow with page-stack edges — so
 * the wide desktop margins read as a book sitting on a table rather than empty
 * paper. The page is a fixed "book" width; the caller's content sits in a
 * narrower centered column within it, giving the page generous margins.
 *
 * Used by the full-bleed /play and /profiles surfaces (both the page and its
 * loading skeleton) so the frame is identical and the loading→ready swap never
 * flashes. The visual treatment lives entirely in `.rt-desk` / `.rt-sheet` (see
 * app/globals.css); this component only wires up the markup.
 *
 * `contentClassName` styles the inner content column (width, alignment, gap,
 * `mt-auto` footers all work — it's a `flex-1` flex column that fills the page).
 */
export function JournalSheet({
  children,
  contentClassName = "",
  busy = false,
  wide = false,
}: {
  children: ReactNode;
  /** Utility classes for the centered content column (e.g. `max-w-xl gap-6`). */
  contentClassName?: string;
  /** Marks the page as loading — sets `aria-busy` on the <main>. */
  busy?: boolean;
  /** Widen the page for content that needs more room (e.g. the landing page). */
  wide?: boolean;
}) {
  return (
    <div className="rt-desk">
      <main
        aria-busy={busy || undefined}
        style={wide ? ({ "--rt-page": "72rem" } as CSSProperties) : undefined}
        className="rt-sheet flex flex-col px-6 py-8 sm:px-12"
      >
        <div
          className={`mx-auto flex w-full flex-1 flex-col ${contentClassName}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
