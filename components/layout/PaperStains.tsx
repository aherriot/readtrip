"use client";

import { useMemo } from "react";
import { paperStainDataUri } from "@/lib/paper/stains";
import { useStainSeedValue } from "./StainSeed";

/**
 * Decorative coffee-stain / dirt overlay for the journal page. Renders a single
 * absolutely-positioned layer that fills `.rt-sheet`, painting a procedurally
 * generated (but deterministic) stain image behind the writing.
 *
 * - `z-index: -1` + the sheet's `isolation: isolate` keep it above the paper and
 *   ruled lines but below the ink, so the text stays crisp.
 * - `mix-blend-mode: multiply` lets the browns darken the paper naturally.
 * - The image is a cached data-URI SVG (see lib/paper/stains.ts) — no runtime
 *   filter, no per-frame cost — regenerated only when the seed changes.
 *
 * Purely decorative: `aria-hidden` and non-interactive.
 */
export function PaperStains({ seed: seedProp }: { seed?: string }) {
  const contextSeed = useStainSeedValue();
  const seed = seedProp ?? contextSeed;
  const backgroundImage = useMemo(() => paperStainDataUri(seed), [seed]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 [background-size:100%_100%] [mix-blend-mode:multiply]"
      style={{ backgroundImage }}
    />
  );
}
