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
 *
 * Each loader is also keyed in `LOADERS` below so a caller that already
 * knows which name(s) it's about to render can warm the chunk ahead of
 * time via `preloadIllustration` — see that function for why.
 */
const LOADERS: Record<
  IllustrationName,
  () => Promise<{ default: ComponentType }>
> = {
  pyramid: () =>
    import("./pyramid").then((m) => ({ default: m.PyramidIllustration })),
  castle: () =>
    import("./castle").then((m) => ({ default: m.CastleIllustration })),
  volcano: () =>
    import("./volcano").then((m) => ({ default: m.VolcanoIllustration })),
  microscope: () =>
    import("./microscope").then((m) => ({
      default: m.MicroscopeIllustration,
    })),
  dinosaur: () =>
    import("./dinosaur").then((m) => ({ default: m.DinosaurIllustration })),
  "human-body": () =>
    import("./human-body").then((m) => ({
      default: m.HumanBodyIllustration,
    })),
  "mountain-range": () =>
    import("./mountain-range").then((m) => ({
      default: m.MountainRangeIllustration,
    })),
  rainforest: () =>
    import("./rainforest").then((m) => ({
      default: m.RainforestIllustration,
    })),
  "rocket-launch": () =>
    import("./rocket-launch").then((m) => ({
      default: m.RocketLaunchIllustration,
    })),
  telescope: () =>
    import("./telescope").then((m) => ({ default: m.TelescopeIllustration })),
  shark: () =>
    import("./shark").then((m) => ({ default: m.SharkIllustration })),
  storm: () =>
    import("./storm").then((m) => ({ default: m.StormIllustration })),
  desert: () =>
    import("./desert").then((m) => ({ default: m.DesertIllustration })),
  knight: () =>
    import("./knight").then((m) => ({ default: m.KnightIllustration })),
  astronaut: () =>
    import("./astronaut").then((m) => ({ default: m.AstronautIllustration })),
  compass: () =>
    import("./compass").then((m) => ({ default: m.CompassIllustration })),
  "magnifying-glass": () =>
    import("./magnifying-glass").then((m) => ({
      default: m.MagnifyingGlassIllustration,
    })),
  "field-journal": () =>
    import("./field-journal").then((m) => ({
      default: m.FieldJournalIllustration,
    })),
};

export const ILLUSTRATIONS: Record<IllustrationName, ComponentType> =
  Object.fromEntries(
    (Object.keys(LOADERS) as IllustrationName[]).map((name) => [
      name,
      dynamic(LOADERS[name]),
    ])
  ) as Record<IllustrationName, ComponentType>;

/**
 * Warms an illustration's chunk ahead of when `<Illustration>` actually
 * renders it. `LessonReader` calls this as soon as it knows which two
 * illustrations a lesson will use — well before either one's paragraph
 * anchor streams in — so by the time `<Illustration>` mounts, the chunk
 * is (usually) already resolved and it paints immediately instead of
 * rendering blank while the import resolves.
 */
export function preloadIllustration(name: IllustrationName) {
  void LOADERS[name]();
}
