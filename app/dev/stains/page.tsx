import { PaperStains } from "@/components/layout/PaperStains";

// Dev-only visual harness for the procedural paper stains. Each tile is a mini
// journal page rendered with a fixed seed, so you can eyeball the variety across
// seeds and confirm a given seed is stable (two tiles with the same seed are
// pixel-identical). Not linked from the app.
const SEEDS = [
  "map:0",
  "map:1",
  "story:crystal-caves",
  "story:volcanoes",
  "quiz:crystal-caves",
  "quiz:volcanoes",
  "/play",
  "/profiles",
  "map:0", // duplicate — should match the first tile exactly
];

export default function StainsPreviewPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-desk)] p-6">
      <h1 className="mb-4 font-display text-2xl text-surface-ink">
        Paper stains — seed preview
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SEEDS.map((seed, i) => (
          <div
            key={`${seed}-${i}`}
            className="rt-sheet relative h-80 overflow-hidden p-4"
          >
            <PaperStains seed={seed} />
            <p className="relative font-display text-sm text-surface-ink">
              {seed}
            </p>
            <p className="relative mt-4 max-w-[40ch] font-display text-surface-ink">
              The quick brown fox jumps over the lazy dog. Legibility check:
              this handwriting should stay crisp and readable right over the
              stains.
            </p>
          </div>
        ))}
      </div>

      {/* Tall page: the stains must keep their size and repeat down the page,
          not stretch, as a lesson grows. */}
      <h2 className="mt-10 mb-4 font-display text-xl text-surface-ink">
        Tall page — stains should tile, never stretch
      </h2>
      <div className="rt-sheet relative min-h-[1600px] overflow-hidden p-4">
        <PaperStains seed="story:crystal-caves" />
        <p className="relative font-display text-sm text-surface-ink">
          story:crystal-caves (tall)
        </p>
      </div>
    </div>
  );
}
