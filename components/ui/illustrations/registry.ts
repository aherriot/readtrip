import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { IllustrationName } from "./catalog";

/**
 * The illustration COMPONENT registry — one `next/dynamic` entry per name,
 * each its own file/chunk. This is the whole performance story: a page only
 * pays for the chunks of the names it actually renders (see `<Illustration>`).
 * As the set grows past 100+, this file stays a flat list of one-line
 * entries — never import the SVG modules eagerly into one shared object
 * (that's what re-bloats the bundle). Metadata (tag/category/label) lives
 * separately in `catalog.ts` so reading it doesn't pull these chunks in.
 *
 * `next/dynamic` code-splits in Server Components too — an illustration is
 * static markup, so it renders straight to HTML with no client JS shipped.
 */
export const ILLUSTRATIONS: Record<IllustrationName, ComponentType> = {
  pyramid: dynamic(() =>
    import("./pyramid").then((m) => m.PyramidIllustration)
  ),
  castle: dynamic(() => import("./castle").then((m) => m.CastleIllustration)),
  volcano: dynamic(() =>
    import("./volcano").then((m) => m.VolcanoIllustration)
  ),
  microscope: dynamic(() =>
    import("./microscope").then((m) => m.MicroscopeIllustration)
  ),
  dinosaur: dynamic(() =>
    import("./dinosaur").then((m) => m.DinosaurIllustration)
  ),
  "human-body": dynamic(() =>
    import("./human-body").then((m) => m.HumanBodyIllustration)
  ),
  "mountain-range": dynamic(() =>
    import("./mountain-range").then((m) => m.MountainRangeIllustration)
  ),
  rainforest: dynamic(() =>
    import("./rainforest").then((m) => m.RainforestIllustration)
  ),
  "rocket-launch": dynamic(() =>
    import("./rocket-launch").then((m) => m.RocketLaunchIllustration)
  ),
  telescope: dynamic(() =>
    import("./telescope").then((m) => m.TelescopeIllustration)
  ),
  shark: dynamic(() => import("./shark").then((m) => m.SharkIllustration)),
  storm: dynamic(() => import("./storm").then((m) => m.StormIllustration)),
  desert: dynamic(() => import("./desert").then((m) => m.DesertIllustration)),
  knight: dynamic(() => import("./knight").then((m) => m.KnightIllustration)),
  astronaut: dynamic(() =>
    import("./astronaut").then((m) => m.AstronautIllustration)
  ),
  compass: dynamic(() =>
    import("./compass").then((m) => m.CompassIllustration)
  ),
  "magnifying-glass": dynamic(() =>
    import("./magnifying-glass").then((m) => m.MagnifyingGlassIllustration)
  ),
  "field-journal": dynamic(() =>
    import("./field-journal").then((m) => m.FieldJournalIllustration)
  ),
};
