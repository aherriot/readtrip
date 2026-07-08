import type { ReactNode } from "react";
import { cn } from "@/lib/ui/cn";
import { PaperStains } from "./PaperStains";
import { StainSeedProvider } from "./StainSeed";

/**
 * The "open field journal on a desk" page frame — three stacked layers:
 * a light desk (`.rt-desk`) fills the viewport; a leather cover (`.rt-cover`)
 * binds the page and lifts it off the desk; the ruled page (`.rt-sheet`) fills
 * the cover. So the wide desktop margins read as a leather-bound journal on a
 * table, and even on mobile a sliver of desk + the leather binding stay visible.
 * The page carries the horizontal rules + the vertical margin rule; the caller's
 * content sits in a narrower centered column within it.
 *
 * Used by every product surface (and its loading skeleton) so the frame is
 * identical and the loading→ready swap never flashes. The visual treatment lives
 * entirely in `.rt-desk` / `.rt-cover` / `.rt-sheet` (see app/globals.css); this
 * component only wires up the markup.
 *
 * `contentClassName` styles the inner content column (width, alignment, gap,
 * `mt-auto` footers all work — it's a `flex-1` flex column that fills the page).
 * The page's left padding clears the vertical margin rule.
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
  /** Widen the book for content that needs more room (e.g. the landing page). */
  wide?: boolean;
}) {
  return (
    <StainSeedProvider>
      <div className="rt-desk">
        <div className={cn("rt-cover", wide && "[--rt-page:72rem]")}>
          <main
            aria-busy={busy || undefined}
            className="rt-sheet flex flex-col py-8 pr-6 pl-9 sm:pr-12 sm:pl-16"
          >
            <PaperStains />
            <div
              className={`mx-auto flex w-full flex-1 flex-col ${contentClassName}`}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </StainSeedProvider>
  );
}
