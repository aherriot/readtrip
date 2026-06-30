"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/ui/cn";
import { useCallbackRef } from "./useCallbackRef";

export interface ModalProps {
  /** Whether the dialog is shown. Controlled — the parent owns the state. */
  open: boolean;
  /** Called when the user dismisses (Escape, backdrop click, or close button). */
  onClose: () => void;
  /** Accessible title; rendered as the heading and wired to `aria-labelledby`. */
  title: string;
  children: ReactNode;
  /**
   * Set the dialog's surface. Defaults to `night` (it portals to `<body>`, which
   * is the night surface). Pass `paper` for reading-context dialogs.
   */
  surface?: "night" | "paper";
  /** Hide the default close (✕) button when the body provides its own actions. */
  hideCloseButton?: boolean;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

// `false` on the server / during hydration, `true` once mounted on the client —
// portals need a real `document`. useSyncExternalStore keeps this hydration-safe
// without a setState-in-effect (which the cascading-render lint rule forbids).
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Accessible, focus-trapped dialog. Opens centered on larger screens and as a
 * bottom sheet on phones (mobile-first). Escape and backdrop tap close it; focus
 * is trapped while open and returned to the trigger on close — all operable with
 * touch + keyboard, no mouse required.
 *
 * Usage guidance: .claude/skills/design-system/references/modal.md
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  surface = "night",
  hideCloseButton = false,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  // Stable handler so the focus/key effect doesn't re-run on every parent render.
  const handleClose = useCallbackRef(onClose);

  // Portals require a real document; render nothing until mounted (SSR-safe).
  const mounted = useIsClient();

  useEffect(() => {
    if (!open) return;

    // Remember what was focused so we can restore it on close (the trigger).
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    // Move focus into the dialog: first focusable element, else the dialog itself.
    const focusables = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE);
    (focusables && focusables.length > 0 ? focusables[0] : dialog)?.focus();

    // Lock background scroll while the dialog owns the viewport.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      // Trap Tab within the dialog: wrap from last→first and first→last.
      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === dialog);
      if (items.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      // Restore focus to whatever opened the dialog.
      previouslyFocused?.focus?.();
    };
  }, [open, handleClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      data-surface={surface}
      // Bottom sheet on phones, centered on larger screens.
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      {/* Backdrop — tap to dismiss. aria-hidden so SR users use Escape/buttons. */}
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={() => handleClose()}
        className="absolute inset-0 cursor-default bg-[#0c0e1f]/70"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-lg bg-surface text-surface-ink",
          // Full-width sheet (rounded top) on phones; floating card above.
          "max-h-[90vh] overflow-y-auto rounded-t-lg p-6 sm:rounded-lg sm:p-8",
          "shadow-[var(--surface-elevation)]",
          "motion-safe:animate-[modal-in_160ms_ease-out]"
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className="font-display text-2xl font-semibold text-surface-ink"
          >
            {title}
          </h2>
          {!hideCloseButton && (
            <button
              type="button"
              onClick={() => handleClose()}
              aria-label="Close"
              className="-mr-1 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-surface-ink-soft hover:bg-surface-ink/10"
            >
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m5 5 10 10M15 5 5 15" />
              </svg>
            </button>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
