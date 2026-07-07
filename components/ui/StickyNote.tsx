import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/ui/cn";

/** Paper color — an accent token, mixed with the surface panel into a pastel. */
export type StickyTone =
  "sun" | "aqua" | "sky" | "violet" | "leaf" | "coral" | "orchid";

type StickyPadding = "none" | "sm" | "md" | "lg";

export interface StickyNoteProps extends HTMLAttributes<HTMLElement> {
  /**
   * Element to render. Defaults to `div`. Use `li`/`section`/`article` for
   * semantics. A StickyNote is presentational — never make the whole note a
   * control; nest a `Button` (or wrap it in one) instead.
   */
  as?: ElementType;
  /** Which accent colors the paper. Defaults to `"sun"` (the classic yellow note). */
  tone?: StickyTone;
  /** Show a strip of "tape" across the top center, as if stuck to the page. */
  tape?: boolean;
  /**
   * Rotation in degrees so notes sit at a hand-placed angle. Applied via the
   * individual `rotate` property, so it composes with any `translate`/`scale`
   * (e.g. a hover lift on an ancestor) instead of fighting `transform`. Keep it
   * small (±3°). Pass a stable value (e.g. derived from a title) so it doesn't
   * jump between renders.
   */
  tilt?: number;
  /** Inner padding from the spacing scale. `none` when the note owns its own layout. */
  padding?: StickyPadding;
  children?: ReactNode;
}

const paddingStyles: Record<StickyPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

/**
 * A sticky/taped note — a small piece of colored paper stuck onto the journal.
 * ReadTrip's **collection** language: where a `Card` is a box you *draw* on the
 * page (a transparent pen outline), a StickyNote is a thing you *collect and
 * stick on* — opaque colored paper, a soft drop shadow, a slight hand-placed
 * tilt, optionally a strip of tape. Used for world-map topic tiles and other
 * "pinned discovery" surfaces.
 *
 * The paper is `color-mix(--<tone>, --surface-panel)`, so the same note reads as
 * a pale colored note on the light journal and a deeper one on the dark journal,
 * with dark/cream ink respectively — no per-surface code.
 *
 * Presentational only (like `Card`): it owns the *look*, not behavior. For a
 * tappable tile, wrap it in a real `<button>` (see `TopicNode`).
 *
 * Usage guidance: .claude/skills/design-system/references/sticky-note.md
 */
export function StickyNote({
  as: Tag = "div",
  tone = "sun",
  tape = false,
  tilt,
  padding = "md",
  className,
  style,
  children,
  ...rest
}: StickyNoteProps) {
  return (
    <Tag
      className={cn(
        // Opaque colored paper (fill + edge from --note, set inline), a soft drop
        // shadow so it lifts off the page, and true square corners — a real
        // sticky note is cut square, not rounded (a hairline 1px keeps the
        // render from aliasing to a hard pixel edge).
        "relative rounded-[1px] border text-surface-ink shadow-[0_8px_18px_-9px_rgba(0,0,0,0.5)]",
        paddingStyles[padding],
        className
      )}
      style={
        {
          "--note": `var(--${tone})`,
          background:
            "color-mix(in srgb, var(--note) 28%, var(--surface-panel))",
          borderColor: "color-mix(in srgb, var(--note) 42%, transparent)",
          rotate: tilt ? `${tilt}deg` : undefined,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {tape && (
        // A translucent strip of tape overlapping the top edge. Decorative.
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 -rotate-2 rounded-[2px] bg-surface-ink/(--tint-wash) shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
        />
      )}
      {children}
    </Tag>
  );
}
