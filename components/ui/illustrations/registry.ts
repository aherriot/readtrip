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
 *
 * Entries are kept alphabetical by key, matching `catalog.ts`.
 */
const LOADERS: Record<
  IllustrationName,
  () => Promise<{ default: ComponentType }>
> = {
  airplane: () =>
    import("./airplane").then((m) => ({ default: m.AirplaneIllustration })),
  astronaut: () =>
    import("./astronaut").then((m) => ({ default: m.AstronautIllustration })),
  aurora: () =>
    import("./aurora").then((m) => ({ default: m.AuroraIllustration })),
  bakery: () =>
    import("./bakery").then((m) => ({ default: m.BakeryIllustration })),
  "ballet-dancer": () =>
    import("./ballet-dancer").then((m) => ({
      default: m.BalletDancerIllustration,
    })),
  "basketball-hoop": () =>
    import("./basketball-hoop").then((m) => ({
      default: m.BasketballHoopIllustration,
    })),
  beehive: () =>
    import("./beehive").then((m) => ({ default: m.BeehiveIllustration })),
  bicycle: () =>
    import("./bicycle").then((m) => ({ default: m.BicycleIllustration })),
  "black-hole": () =>
    import("./black-hole").then((m) => ({
      default: m.BlackHoleIllustration,
    })),
  "board-game": () =>
    import("./board-game").then((m) => ({
      default: m.BoardGameIllustration,
    })),
  bridge: () =>
    import("./bridge").then((m) => ({ default: m.BridgeIllustration })),
  butterfly: () =>
    import("./butterfly").then((m) => ({ default: m.ButterflyIllustration })),
  canyon: () =>
    import("./canyon").then((m) => ({ default: m.CanyonIllustration })),
  car: () => import("./car").then((m) => ({ default: m.CarIllustration })),
  castle: () =>
    import("./castle").then((m) => ({ default: m.CastleIllustration })),
  cave: () => import("./cave").then((m) => ({ default: m.CaveIllustration })),
  "chemistry-lab": () =>
    import("./chemistry-lab").then((m) => ({
      default: m.ChemistryLabIllustration,
    })),
  colosseum: () =>
    import("./colosseum").then((m) => ({
      default: m.ColosseumIllustration,
    })),
  comet: () =>
    import("./comet").then((m) => ({ default: m.CometIllustration })),
  compass: () =>
    import("./compass").then((m) => ({ default: m.CompassIllustration })),
  "coral-reef": () =>
    import("./coral-reef").then((m) => ({ default: m.CoralReefIllustration })),
  crane: () =>
    import("./crane").then((m) => ({ default: m.CraneIllustration })),
  desert: () =>
    import("./desert").then((m) => ({ default: m.DesertIllustration })),
  dinosaur: () =>
    import("./dinosaur").then((m) => ({ default: m.DinosaurIllustration })),
  "dna-strand": () =>
    import("./dna-strand").then((m) => ({
      default: m.DnaStrandIllustration,
    })),
  dragon: () =>
    import("./dragon").then((m) => ({ default: m.DragonIllustration })),
  "farmers-market": () =>
    import("./farmers-market").then((m) => ({
      default: m.FarmersMarketIllustration,
    })),
  "field-journal": () =>
    import("./field-journal").then((m) => ({
      default: m.FieldJournalIllustration,
    })),
  "gears-machine": () =>
    import("./gears-machine").then((m) => ({
      default: m.GearsMachineIllustration,
    })),
  glacier: () =>
    import("./glacier").then((m) => ({ default: m.GlacierIllustration })),
  "greek-temple": () =>
    import("./greek-temple").then((m) => ({
      default: m.GreekTempleIllustration,
    })),
  griffin: () =>
    import("./griffin").then((m) => ({ default: m.GriffinIllustration })),
  "hot-air-balloon": () =>
    import("./hot-air-balloon").then((m) => ({
      default: m.HotAirBalloonIllustration,
    })),
  "human-body": () =>
    import("./human-body").then((m) => ({
      default: m.HumanBodyIllustration,
    })),
  knight: () =>
    import("./knight").then((m) => ({ default: m.KnightIllustration })),
  "magnifying-glass": () =>
    import("./magnifying-glass").then((m) => ({
      default: m.MagnifyingGlassIllustration,
    })),
  mermaid: () =>
    import("./mermaid").then((m) => ({ default: m.MermaidIllustration })),
  microscope: () =>
    import("./microscope").then((m) => ({
      default: m.MicroscopeIllustration,
    })),
  "mountain-range": () =>
    import("./mountain-range").then((m) => ({
      default: m.MountainRangeIllustration,
    })),
  octopus: () =>
    import("./octopus").then((m) => ({ default: m.OctopusIllustration })),
  "olympic-torch": () =>
    import("./olympic-torch").then((m) => ({
      default: m.OlympicTorchIllustration,
    })),
  orchard: () =>
    import("./orchard").then((m) => ({ default: m.OrchardIllustration })),
  "paint-palette": () =>
    import("./paint-palette").then((m) => ({
      default: m.PaintPaletteIllustration,
    })),
  phoenix: () =>
    import("./phoenix").then((m) => ({ default: m.PhoenixIllustration })),
  pyramid: () =>
    import("./pyramid").then((m) => ({ default: m.PyramidIllustration })),
  rainforest: () =>
    import("./rainforest").then((m) => ({
      default: m.RainforestIllustration,
    })),
  "robot-arm": () =>
    import("./robot-arm").then((m) => ({ default: m.RobotArmIllustration })),
  "rocket-launch": () =>
    import("./rocket-launch").then((m) => ({
      default: m.RocketLaunchIllustration,
    })),
  sailboat: () =>
    import("./sailboat").then((m) => ({ default: m.SailboatIllustration })),
  satellite: () =>
    import("./satellite").then((m) => ({ default: m.SatelliteIllustration })),
  shark: () =>
    import("./shark").then((m) => ({ default: m.SharkIllustration })),
  "soccer-match": () =>
    import("./soccer-match").then((m) => ({
      default: m.SoccerMatchIllustration,
    })),
  "solar-system": () =>
    import("./solar-system").then((m) => ({
      default: m.SolarSystemIllustration,
    })),
  "steam-train": () =>
    import("./steam-train").then((m) => ({
      default: m.SteamTrainIllustration,
    })),
  storm: () =>
    import("./storm").then((m) => ({ default: m.StormIllustration })),
  "story-book": () =>
    import("./story-book").then((m) => ({
      default: m.StoryBookIllustration,
    })),
  submarine: () =>
    import("./submarine").then((m) => ({
      default: m.SubmarineIllustration,
    })),
  swimming: () =>
    import("./swimming").then((m) => ({ default: m.SwimmingIllustration })),
  telescope: () =>
    import("./telescope").then((m) => ({ default: m.TelescopeIllustration })),
  "theater-masks": () =>
    import("./theater-masks").then((m) => ({
      default: m.TheaterMasksIllustration,
    })),
  tractor: () =>
    import("./tractor").then((m) => ({ default: m.TractorIllustration })),
  unicorn: () =>
    import("./unicorn").then((m) => ({ default: m.UnicornIllustration })),
  "vegetable-garden": () =>
    import("./vegetable-garden").then((m) => ({
      default: m.VegetableGardenIllustration,
    })),
  "viking-ship": () =>
    import("./viking-ship").then((m) => ({
      default: m.VikingShipIllustration,
    })),
  violin: () =>
    import("./violin").then((m) => ({ default: m.ViolinIllustration })),
  volcano: () =>
    import("./volcano").then((m) => ({ default: m.VolcanoIllustration })),
  waterfall: () =>
    import("./waterfall").then((m) => ({ default: m.WaterfallIllustration })),
  windmill: () =>
    import("./windmill").then((m) => ({ default: m.WindmillIllustration })),
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
