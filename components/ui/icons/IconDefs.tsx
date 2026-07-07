/**
 * The shared hand-drawn "doodle" filter, mounted ONCE near the app root
 * (`app/layout.tsx`). Every icon references it via `filter="url(#rt-doodle)"`,
 * so we author clean geometry and the whole set gets one consistent inked waver
 * for free — a turbulence field displaces each glyph like a felt-tip pen.
 *
 * It lives in a zero-size, `aria-hidden` SVG so it paints nothing itself.
 */
export const DOODLE_FILTER_ID = "rt-doodle";

export function IconDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute" }}
    >
      <defs>
        <filter
          id={DOODLE_FILTER_ID}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          // Filter in userSpace so the same displacement reads consistently
          // regardless of the icon's rendered pixel size.
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028"
            numOctaves="1"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
