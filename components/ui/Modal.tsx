"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { cn } from "@/lib/ui/cn";
import { Icon } from "@/components/ui/Icon";
import { InkFrame } from "@/components/ui/InkFrame";

export interface ModalProps {
  /** Whether the dialog is shown. Controlled — the parent owns the state. */
  open: boolean;
  /** Called when the user dismisses (Escape, backdrop click, or close button). */
  onClose: () => void;
  /** Accessible title; rendered as the heading and wired to `aria-labelledby`. */
  title: string;
  children: ReactNode;
  /** Hide the default close button when the body provides its own actions. */
  hideCloseButton?: boolean;
}

/**
 * Accessible, focus-trapped dialog. Opens centered on larger screens and as a
 * bottom sheet on phones (mobile-first). Escape and backdrop tap close it; focus
 * is trapped while open and returned to the trigger on close — all operable with
 * touch + keyboard, no mouse required.
 *
 * Built on Headless UI's `Dialog`, which owns the focus trap, scroll lock,
 * portal, Escape/backdrop dismissal, and ARIA wiring; this component supplies
 * ReadTrip's field-journal styling (a paper panel in a hand-drawn pen box) and
 * the bottom-sheet → centered layout.
 *
 * Usage guidance: .claude/skills/design-system/references/modal.md
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  hideCloseButton = false,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      // Bottom sheet on phones, centered on larger screens.
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      {/* Backdrop — tap to dismiss (Headless UI calls onClose). The entrance
          fade is `transition`-driven; the global reduced-motion floor zeroes its
          duration, so it's instant when the user opts out of motion. */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#0c0e1f]/70 transition-opacity duration-150 data-[closed]:opacity-0"
      />
      <DialogPanel
        transition
        // Stable hook for the visual suite to snapshot the opaque panel itself,
        // not the full-viewport Dialog root (whose translucent backdrop would
        // otherwise bleed the page behind it into the baseline).
        data-testid="modal-panel"
        className={cn(
          // `min-w-0` overrides the flex item's default `min-width: auto`,
          // which otherwise floors the panel at its content's min-content
          // width (e.g. a nowrap button label) and pushes it past the
          // viewport on narrow phones instead of letting it shrink/wrap.
          "relative z-10 w-full min-w-0 max-w-lg bg-surface text-surface-ink",
          // Squared field-journal panel in a hand-drawn pen box; full-width sheet
          // on phones, floating card above.
          "max-h-[90vh] overflow-y-auto rounded-[3px] p-6 sm:p-8",
          "rt-inkbox shadow-[var(--surface-elevation)]",
          // Rise + fade in; neutralized under prefers-reduced-motion.
          "transition duration-200 ease-out data-[closed]:translate-y-2 data-[closed]:opacity-0"
        )}
      >
        <InkFrame />
        <div className="mb-4 flex items-start justify-between gap-4">
          <DialogTitle className="min-w-0 break-words font-display text-2xl font-semibold text-surface-ink">
            {title}
          </DialogTitle>
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] text-surface-ink-soft hover:bg-surface-ink/(--tint-wash)"
            >
              <Icon name="close" decorative />
            </button>
          )}
        </div>
        {children}
      </DialogPanel>
    </Dialog>
  );
}
