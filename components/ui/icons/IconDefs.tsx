/**
 * The shared hand-drawn "doodle" filter, mounted ONCE near the app root
 * (`app/layout.tsx`). Every icon references it via `filter="url(#rt-doodle)"`,
 * so we author clean geometry and the whole set gets one consistent inked waver
 * for free — a turbulence field displaces each glyph like a felt-tip pen.
 *
 * It lives in a zero-size, `aria-hidden` SVG so it paints nothing itself.
 */
export const DOODLE_FILTER_ID = "rt-doodle";
/**
 * A second, gentler turbulence filter tuned for LARGE strokes — the hand-drawn
 * "pen box" border around cards/containers (see `.rt-inkbox` in globals.css).
 * Lower frequency + a bit more displacement gives a long, calm wobble that reads
 * as a rectangle drawn by hand, not the tight felt-tip waver icons want.
 */
export const SKETCH_FILTER_ID = "rt-sketch";

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
        <filter
          id={SKETCH_FILTER_ID}
          x="-12%"
          y="-12%"
          width="124%"
          height="124%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.017"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        {/* A second seed for a lightly "drawn-twice" pen line (see .rt-inkbox). */}
        <filter
          id={`${SKETCH_FILTER_ID}-b`}
          x="-12%"
          y="-12%"
          width="124%"
          height="124%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.021"
            numOctaves="2"
            seed="19"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
